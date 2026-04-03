# Save this at: backend/app/seeds/websec_seed.py
from guided_workflow import models

def seed_websec(db):
    print("Injecting Guided Web Security Curriculum...")

    # 1. The Web Security Path
    ws_path = models.GuidedPath(
        id="path_ws_02",
        title="Guided Web Security",
        description="Analyze web application architectures and extract sensitive data. Learn how to identify, exploit, and remediate critical SQL Injection and XSS vulnerabilities.",
        difficulty="Intermediate",
        estimated_time="3 Hours"
    )
    db.add(ws_path)

    # 2. The 5 Modules
    modules = [
        models.GuidedModule(id="mod_ws_recon_01", path_id="path_ws_02", order=1, title="Reconnaissance", prerequisite_id=None),
        models.GuidedModule(id="mod_ws_scan_02", path_id="path_ws_02", order=2, title="Input Testing", prerequisite_id="mod_ws_recon_01"),
        models.GuidedModule(id="mod_ws_enum_03", path_id="path_ws_02", order=3, title="Exploitation", prerequisite_id="mod_ws_scan_02"),
        models.GuidedModule(id="mod_ws_vuln_04", path_id="path_ws_02", order=4, title="Vulnerability Analysis", prerequisite_id="mod_ws_enum_03"),
        models.GuidedModule(id="mod_ws_report_05", path_id="path_ws_02", order=5, title="Reporting", prerequisite_id="mod_ws_vuln_04")
    ]
    for m in modules:
        db.add(m)

    # --- MODULE 1: RECONNAISSANCE ---
    db.add(models.GuidedTask(
        id="task_ws_recon_1", module_id="mod_ws_recon_01", step_number=1, action_title="API Endpoint Discovery",
        expected_flag="/api/v1/users",
        question="Review the FFUF directory fuzzing results. What is the hidden API endpoint path discovered on the server?",
        instruction_text=(
            "Welcome to the Guided Web Security module. Your target is the CyberCare Clinic Patient Portal (`portal.cybercare-health.local`).\n\n"
            "---\n\n"
            "### 🛠️ The Tool: `ffuf`\n"
            "**Fuzz Faster U Fool (ffuf)** is a high-speed web fuzzer. It automates directory and API discovery by rapidly substituting a `FUZZ` keyword in a target URL with entries from a specified wordlist.\n\n"
            "### 🧠 The Concept: API Fuzzing\n"
            "Modern web applications rely heavily on APIs to fetch background data. Developers often inadvertently expose deprecated or undocumented endpoints in production. Fuzzing allows us to map this hidden attack surface.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Construct the correct command in the Attack Terminal to discover hidden API routes.\n\n"
            "* Type `help` to see what your terminal can do.\n"
            "* Use the `ls` command to list the files on your attack box. Locate the text file containing common API directories.\n"
            "* Run the `ffuf` tool using that wordlist against our target: `http://portal.cybercare-health.local/FUZZ`\n\n"
            "> **💡 Hint:** A standard fuzzing command looks like this: `ffuf -w [WORDLIST_FILE] -u [TARGET_URL]`"
        )
    ))
    db.add(models.GuidedTask(
        id="task_ws_recon_2", module_id="mod_ws_recon_01", step_number=2, action_title="Source Code Review",
        expected_flag="ak_99x81m",
        question="Inspect the HTML source code of the login page. What is the plaintext Developer API Key left in the HTML comments?",
        instruction_text=(
            "We found the API endpoint, but we need an authentication token to interact with it.\n\n"
            "---\n\n"
            "### 🛠️ The Tool: Browser Developer Tools\n"
            "Browsers include built-in inspection tools that allow security analysts to examine the raw HTML, CSS, and DOM structure of a rendered webpage.\n\n"
            "### 🧠 The Concept: Information Disclosure\n"
            "Developers sometimes leave sensitive data, such as API keys or internal architecture notes, inside HTML comments. While ignored by the browser's rendering engine, this data is fully visible in the raw source code.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Hunt for leaked credentials in the source code.\n\n"
            "1. Switch to the **Target Browser** tab on the right.\n"
            "2. Click 'Login to Portal' to reach the login screen.\n"
            "3. Click the **[< > Inspect]** button in the top browser toolbar to reveal the raw HTML source code.\n\n"
            "> **💡 Hint:** Look near the bottom of the HTML file for a green comment left by developers. It contains an API Key starting with `ak_...`"
        )
    ))

    # --- MODULE 2: INPUT TESTING ---
    db.add(models.GuidedTask(
        id="task_ws_scan_1", module_id="mod_ws_scan_02", step_number=1, action_title="Cross-Site Scripting (Cookie Theft)",
        expected_flag="xss_flag_8492k",
        question="What is the exact value of the session cookie revealed in the alert popup?",
        instruction_text=(
            "We need to test how the web application handles user-supplied data.\n\n"
            "---\n\n"
            "### 🛠️ The Tool: JavaScript Payloads\n"
            "Instead of benign text, attackers inject executable JavaScript into input fields to test if the application sanitizes the data before processing it.\n\n"
            "### 🧠 The Concept: Reflected XSS\n"
            "If an application reflects unsanitized input directly into the HTTP response, it creates a **Cross-Site Scripting (XSS)** vulnerability. This allows an attacker to execute arbitrary code in a victim's browser, often to hijack session cookies.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Construct a malicious payload to steal the active session cookie.\n\n"
            "1. Open the **Target Browser** tab and locate the **Global Search** bar at the bottom.\n"
            "2. Write an HTML script block containing a JavaScript function that triggers a popup `alert()`.\n"
            "3. The content of that alert must be the browser's current cookie object.\n\n"
            "> **💡 Hint:** Assemble your payload using these three concepts:\n"
            "> - HTML Script Tags: `<script> ... </script>`\n"
            "> - JS Alert Function: `alert(something)`\n"
            "> - JS Cookie Object: `document.cookie`"
        )
    ))
    db.add(models.GuidedTask(
        id="task_ws_scan_2", module_id="mod_ws_scan_02", step_number=2, action_title="Insecure Direct Object Reference (IDOR)",
        expected_flag="4921",
        question="You successfully bypassed the authorization check! Look at the leaked medical file. What are the last 4 digits of the patient's payment method?",
        instruction_text=(
            "We've proven we can execute scripts, but can we manipulate access controls?\n\n"
            "---\n\n"
            "### 🛠️ The Tool: URL Parameter Tampering\n"
            "By manipulating query parameters or RESTful route identifiers (e.g., `?patient_id=101`), an attacker can attempt to request backend resources belonging to other users.\n\n"
            "### 🧠 The Concept: IDOR\n"
            "If a backend server retrieves database records based on user-supplied input without verifying authorization for that specific object, it creates an **Insecure Direct Object Reference (IDOR)** vulnerability, leading to unauthorized data access.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Hijack a VIP patient's medical file.\n\n"
            "1. Navigate to your Patient Dashboard (Login via the homepage).\n"
            "2. Analyze how the browser dictates which medical file to load via the URL structure.\n"
            "3. You are currently viewing your own profile (`#101`). We have intel that a VIP patient's file was created immediately after yours in the database.\n"
            "4. Manipulate the URL parameter to bypass the authorization flaw and access the VIP's classified file.\n\n"
            "> **💡 Hint:** If your session identifier is `101`, try incrementing the parameter."
        )
    ))

    # --- MODULE 3: EXPLOITATION ---
    db.add(models.GuidedTask(
        id="task_ws_enum_1", module_id="mod_ws_enum_03", step_number=1, action_title="SQL Injection Auth Bypass",
        expected_flag="' OR 1=1 --",
        question="What is the exact SQL payload you constructed and used to successfully log in as Admin?",
        instruction_text=(
            "We have mapped the application's flaws; now it's time to compromise the primary authentication gateway.\n\n"
            "---\n\n"
            "### 🛠️ The Tool: SQL Injection (SQLi)\n"
            "SQLi involves injecting malicious SQL syntax into user input fields to manipulate backend database queries, allowing attackers to bypass authentication or extract arbitrary data.\n\n"
            "### 🧠 The Concept: Logic Bypasses\n"
            "The backend database evaluates an authentication query similar to:\n"
            "`SELECT * FROM users WHERE username='[YOUR_INPUT]' AND password='[YOUR_PASSWORD]'`\n\n"
            "Injecting `' OR 1=1` alters the query logic. Because `1=1` evaluates to TRUE, the database ignores the subsequent password check and grants unauthorized access.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Use the **SQLi Payload Constructor** below to build the exact string needed to bypass the login portal.\n\n"
            "Find the correct combination of characters to break the syntax, force a TRUE condition, and comment out the rest of the query. Once built, submit it to log in as Admin.\n\n"
            "> **💡 Hint:** You need a single quote to break the string, an OR statement to force truth, and two dashes (`--`) to comment out the password requirement."
        )
    ))
    db.add(models.GuidedTask(
        id="task_ws_enum_2", module_id="mod_ws_enum_03", step_number=2, action_title="Data Exfiltration",
        expected_flag="master_users.csv",
        question="You bypassed the login and accessed the Admin Dashboard! What is the exact filename of the database export you downloaded?",
        instruction_text=(
            "The SQL Injection payload successfully subverted the authentication layer, granting administrative privileges.\n\n"
            "---\n\n"
            "### 🛠️ The Tool: Administrative Dashboards\n"
            "Once an attacker compromises an administrative session, they frequently abuse legitimate application features (like backup or data export functions) to compromise the system.\n\n"
            "### 🧠 The Concept: Data Exfiltration\n"
            "Demonstrating impact is a critical phase of penetration testing. Exfiltrating the underlying database proves the severe consequences of the authentication bypass to the client.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Exfiltrate the client's sensitive data.\n\n"
            "1. Navigate through the Administrator Dashboard and locate the 'Database Management' tab.\n"
            "2. Find and click the button to export the entire user database.\n"
            "3. Record the exact name of the file that is downloaded to your machine.\n\n"
            "> **💡 Hint:** The exported file will have a `.csv` extension."
        )
    ))

    # --- MODULE 4: VULNERABILITY ANALYSIS ---
    db.add(models.GuidedTask(
        id="task_ws_vuln_1", module_id="mod_ws_vuln_04", step_number=1, action_title="Threat Intelligence Mapping",
        expected_flag="CWE-89",
        question="Search the Threat Intelligence database for 'SQL Injection'. What is the official Common Weakness Enumeration (CWE) identifier for this vulnerability?",
        instruction_text=(
            "Technical findings must be classified using industry-standard terminology for the executive report.\n\n"
            "---\n\n"
            "### 🛠️ The Tool: Threat Intelligence\n"
            "Security professionals rely on standardized global databases to accurately classify, track, and report vulnerabilities.\n\n"
            "### 🧠 The Concept: CWEs\n"
            "While specific software patches are tracked via CVEs, broader architectural weaknesses—such as improper input neutralization leading to SQL Injection or XSS—are categorized under the **CWE (Common Weakness Enumeration)** system.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Open the **Red Threat Intelligence widget** in the bottom right corner.\n\n"
            "Search for 'SQL Injection' and find its official CWE tracking code.\n\n"
            "> **💡 Hint:** The format is exactly **CWE-XX**."
        )
    ))
    db.add(models.GuidedTask(
        id="task_ws_vuln_2", module_id="mod_ws_vuln_04", step_number=2, action_title="Credential Extraction",
        expected_flag="AdminP@ssw0rd!",
        question="Open the exported CSV file from your Loot Board. What is the plaintext password for the 'Administrator' account?",
        instruction_text=(
            "We exported the user database during the exploitation phase to substantiate our findings.\n\n"
            "---\n\n"
            "### 🛠️ The Tool: Evidence Locker\n"
            "Pentesters must meticulously organize extracted loot (like database dumps) to provide concrete proof during the reporting phase.\n\n"
            "### 🧠 The Concept: Plaintext Storage\n"
            "Storing passwords in plaintext, rather than utilizing strong cryptographic hashing, is a critical security failure. If the database is breached, the attacker immediately gains actionable credentials for all users.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Click the green **Evidence Locker** icon in the bottom right corner of your screen.\n\n"
            "Open the `master_users.csv` file you exported earlier, locate the 'Administrator' row, and extract their actual password.\n\n"
            "> **💡 Hint:** Look for the column labeled 'password'."
        )
    ))

    # --- MODULE 5: REPORTING ---
    db.add(models.GuidedTask(
        id="task_ws_report_1", module_id="mod_ws_report_05", step_number=1, action_title="Executive Report Compilation",
        expected_flag="SIG-SQLI-99X",
        question="Use the Report Builder interface to compile your findings. What is the cryptographic signature generated on the verified report?",
        instruction_text=(
            "It is time to transition from the technical execution phase to the consultation phase.\n\n"
            "---\n\n"
            "### 🛠️ The Tool: Report Builder\n"
            "Technical findings must be translated into actionable business risk. The Report Builder structures your attack vectors, evidence, and remediation strategies for executive review.\n\n"
            "### 🧠 The Concept: CVSS Scoring\n"
            "The **Common Vulnerability Scoring System (CVSS)** quantifies the severity of a vulnerability. A flaw allowing remote, unauthenticated data exfiltration typically warrants a Critical (9.0+) score.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Look at the **Report Builder** interface on the right side of your screen.\n\n"
            "1. Select the primary attack vector that led to the breach.\n"
            "2. Assign the correct CVSS 3.1 Severity score.\n"
            "3. Attach the critical database export you extracted to prove impact.\n"
            "4. Select the correct secure coding practice to remediate the flaw.\n\n"
            "Click **Compile Report**. If your assessment is accurate, the system will verify the document and issue a cryptographic signature."
        )
    ))
    db.add(models.GuidedTask(
        id="task_ws_report_2", module_id="mod_ws_report_05", step_number=2, action_title="Remediation Handover",
        expected_flag="Parameterized Queries",
        question="What is the primary remediation strategy you appended to the final report?",
        instruction_text=(
            "Identifying a vulnerability is only half the job; providing actionable mitigation strategies is equally important.\n\n"
            "---\n\n"
            "### 🧠 The Concept: Secure Coding Practices\n"
            "To effectively prevent SQL Injection, developers must implement techniques that strictly separate executable SQL code from user-supplied data.\n\n"
            "---\n\n"
            "### 🎯 Your Mission\n"
            "Review your verified report. Type the exact name of the remediation strategy you recommended to the client to permanently neutralize this threat.\n\n"
            "> **💡 Hint:** Two words. It is the standard defense against SQLi that uses placeholders instead of concatenating strings. (P___________ Q______)"
        )
    ))