import os
import json
import random
import requests
from dotenv import load_dotenv
import re
load_dotenv()

from fastapi import APIRouter, HTTPException

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ── Topic pool ──────────────────────────────────────────────────────────────
# Each request randomly picks 5 topics so every quiz feels different
TOPIC_POOL = [
    "protecting your email account from hackers",
    "creating and remembering strong passwords",
    "spotting fake websites when shopping online",
    "recognising phishing emails pretending to be banks or companies",
    "OTP and two-factor authentication safety",
    "staying safe on social media and not oversharing personal info",
    "what to do when you think your account has been hacked",
    "keeping your phone and apps safe",
    "recognising text message scams (smishing)",
    "avoiding fake deals and online shopping fraud",
    "safe use of public Wi-Fi in cafes and airports",
    "spotting fake friend requests and social media scammers",
    "protecting your personal information online",
    "safe online banking habits",
    "how to tell if a link or attachment is dangerous",
    "privacy settings on apps and websites",
    "recognising fake customer support calls and voice scams",
    "staying safe when using online games or gaming platforms",
    "protecting children online and safe internet use for families",
    "how to safely use email attachments and downloads",
]


@router.get("/generate")
def generate_quiz():

    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    num_questions = 10

    # Pick 5 random topics — different combination every request
    selected_topics = random.sample(TOPIC_POOL, k=5)
    topic_lines = "\n".join(f"  - {t}" for t in selected_topics)

    # Add randomness so questions change every request
    seed = random.randint(1, 100000)

    prompt = f"""
You are a friendly cybersecurity teacher writing a quiz for everyday internet users — NOT IT professionals.

Generate exactly {num_questions} multiple-choice questions about online safety.
Cover ONLY these topics this time:
{topic_lines}

Use variation seed {seed} so questions differ each time.

Rules:
- Each question must have exactly 4 options.
- Only ONE option should be correct.
- The "correct" field must contain the index of the correct option (0–3).
- The explanation must clearly explain why the correct option is correct.
- The explanation must match the correct option — do not explain a different answer.
- Avoid technical words like firewall, trojan, malware, encryption, etc.
- Keep language simple and beginner-friendly.
- Make questions feel real — describe everyday situations people actually face.

Return ONLY valid JSON in this format. No markdown, no extra text:

[
{{
  "question": "You receive a message asking for your bank OTP. What should you do?",
  "options": [
    "Share the OTP immediately",
    "Ignore the message and report it",
    "Send the OTP to verify your account",
    "Forward the message to friends"
  ],
  "correct": 1,
  "explanation": "Banks never ask for OTPs through messages. Sharing your OTP can allow scammers to access your account."
}}
]

Return only JSON. Do not include markdown or additional text.
"""

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.9
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)

        if response.status_code != 200:
            return {
                "error": "Groq API error",
                "status": response.status_code,
                "response": response.text
            }

        result = response.json()

        ai_text = result["choices"][0]["message"]["content"]

        # Remove markdown formatting
        ai_text = re.sub(r"```(?:json)?", "", ai_text)
        ai_text = ai_text.replace("```", "").strip()

        # Trim any stray text before the JSON array starts
        start = ai_text.find("[")
        end = ai_text.rfind("]")
        if start != -1 and end != -1:
            ai_text = ai_text[start:end + 1]

        # Fix trailing commas before ] or }
        ai_text = re.sub(r",\s*([\]}])", r"\1", ai_text)

        quiz = json.loads(ai_text)

        # Validate each question — drop any that are malformed
        validated = []
        for q in quiz:
            if not all(k in q for k in ("question", "options", "correct", "explanation")):
                continue
            if not isinstance(q["options"], list) or len(q["options"]) != 4:
                continue
            if not isinstance(q["correct"], int) or q["correct"] not in (0, 1, 2, 3):
                continue
            if not q["question"].strip() or not q["explanation"].strip():
                continue
            validated.append({
                "question":    q["question"].strip(),
                "options":     [o.strip() for o in q["options"]],
                "correct":     q["correct"],
                "explanation": q["explanation"].strip(),
            })

        if not validated:
            raise HTTPException(status_code=500, detail="No valid questions returned by AI")

        return {"questions": validated}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response as JSON: {str(e)}")

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
