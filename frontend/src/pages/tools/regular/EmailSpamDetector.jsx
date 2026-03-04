import { useState } from "react";
import axios from "axios";

export default function EmailSpamDetection() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSpam = async () => {
    if (!emailText) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/spam/check", {
        email: emailText,
      });

      setResult(res.data.prediction);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020c1b] text-white">

      {/* Title Section */}
      <div className="text-center mt-10">
        <h1 className="text-5xl font-bold">Email Spam Detector</h1>

        <p className="text-gray-400 mt-4">
          Detect phishing or spam emails using machine learning.
        </p>
      </div>

      {/* Info Card */}
      <div className="max-w-2xl mx-auto mt-10 bg-[#0b1b35] p-6 rounded-xl border border-slate-700">
        <h3 className="text-teal-400 font-semibold mb-2">Educational Tool</h3>

        <p className="text-gray-300">
          This tool analyzes email content to detect spam and phishing
          messages. Spam emails often contain malicious links, fake offers,
          or attempts to steal personal information.
        </p>
      </div>

      {/* Detector Box */}
      <div className="max-w-xl mx-auto mt-10 bg-[#0b1b35] p-8 rounded-xl border border-slate-700">

        <label className="text-gray-300">Email Content</label>

        <textarea
          className="w-full mt-3 p-3 h-40 rounded-lg bg-[#020c1b] border border-slate-700 focus:outline-none focus:border-teal-400"
          placeholder="Paste suspicious email content here..."
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
        />

        <button
          onClick={checkSpam}
          className="w-full mt-6 bg-teal-500 hover:bg-teal-400 text-black font-semibold py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Detect Spam"}
        </button>

        {result && (
          <div className="mt-6 text-center text-xl font-semibold">
            {result === "Spam" ? (
              <span className="text-red-400">⚠ Spam Email Detected</span>
            ) : (
              <span className="text-green-400">✔ Legitimate Email</span>
            )}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="max-w-3xl mx-auto mt-16 p-6 bg-[#0b1b35] rounded-xl border border-slate-700">

        <h2 className="text-2xl font-semibold mb-4">
          What Are Spam Emails?
        </h2>

        <p className="text-gray-300">
          Spam emails are unsolicited messages sent in bulk, often used
          for phishing scams, malware distribution, or advertising.
        </p>

        <div className="mt-6 p-4 border border-teal-400 rounded-lg">
          <h3 className="text-teal-400 font-semibold">
            How to Identify Spam
          </h3>

          <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
            <li>Suspicious links or attachments</li>
            <li>Urgent requests for passwords or payment</li>
            <li>Unknown senders</li>
            <li>Offers that seem too good to be true</li>
          </ul>
        </div>
      </div>

    </div>
  );
}