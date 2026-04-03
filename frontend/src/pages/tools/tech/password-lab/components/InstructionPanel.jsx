// InstructionPanel.jsx
// ─────────────────────────────────────────────────────────────
// ✅ Steps update LIVE based on terminal output:
//    - currentStep prop comes from backend terminal.py response
//    - Parent (LabPage) updates currentStep after every execTerminal() call
//    - Panel re-renders showing the correct next instruction automatically
//
// ✅ THEME: Now fully respects dark/light theme via useTheme().
//    Previously all colors were hardcoded dark hex values.
// ─────────────────────────────────────────────────────────────

import { useTheme } from "../../../../../context/ThemeContext";

// Individual step entry
function StepRow({ stepNum, currentStep, label, colors }) {
  const done   = currentStep > stepNum;
  const active = currentStep === stepNum;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "6px 10px", borderRadius: "6px",
      background: active ? colors.activeRowBg : done ? colors.doneRowBg : "transparent",
      border: `1px solid ${active ? colors.accent : done ? colors.success : "transparent"}`,
      marginBottom: "4px", fontSize: "13px",
      color: active ? colors.text : done ? colors.success : colors.muted,
      transition: "background 0.25s, border-color 0.25s",
    }}>
      <span>{done ? "✅" : active ? "▶" : "○"}</span>
      <span>Step {stepNum}: {label}</span>
    </div>
  );
}

export default function InstructionPanel({
  difficulty,
  currentStep = 1,
  hintsUsed = 0,
  hintsRemaining = 5,
  currentScore = null,
  maxHints = 5,
  onRequestHint,
}) {
  const { isDark } = useTheme();

  // Theme palette
  const c = isDark ? {
    panelBg:      "#020617",
    panelBorder:  "#00bfff",
    text:         "#e5e7eb",
    muted:        "#475569",
    sub:          "#94a3b8",
    accent:       "#00bfff",
    success:      "#00ff88",
    warning:      "#facc15",
    danger:       "#f87171",
    activeRowBg:  "#0d2137",
    doneRowBg:    "#052e16",
    activePanelBg:"#0d2137",
    activePanelBorder: "#00bfff",
    hintRowBg:    "#1e293b",
    cmdBg:        "#000",
    cmdBorder:    "#0d3b2e",
    cmdText:      "#00ffcc",
    scoreBg:      "#0d2137",
    scoreBorder:  "#facc15",
    advancedBg:   "#2a0a0a",
    advancedBorder:"#f87171",
    divider:      "#1e293b",
    hintDisabledBg:"#1e293b",
    hintDisabledColor:"#475569",
    hintDisabledBorder:"#334155",
  } : {
    panelBg:      "#f0f7ff",
    panelBorder:  "#0284c7",
    text:         "#0c1a2e",
    muted:        "#64748b",
    sub:          "#4b5563",
    accent:       "#0284c7",
    success:      "#059669",
    warning:      "#b45309",
    danger:       "#dc2626",
    activeRowBg:  "#dbeafe",
    doneRowBg:    "#d1fae5",
    activePanelBg:"#dbeafe",
    activePanelBorder:"#0284c7",
    hintRowBg:    "#e2eaf4",
    cmdBg:        "#1e293b",
    cmdBorder:    "#334155",
    cmdText:      "#67e8f9",
    scoreBg:      "#fef9c3",
    scoreBorder:  "#b45309",
    advancedBg:   "#fff1f2",
    advancedBorder:"#dc2626",
    divider:      "#cbd5e1",
    hintDisabledBg:"#e2e8f0",
    hintDisabledColor:"#94a3b8",
    hintDisabledBorder:"#cbd5e1",
  };

  const commandStyle = {
    background: c.cmdBg, padding: "8px 12px", borderRadius: "6px",
    fontFamily: "monospace", color: c.cmdText, fontSize: "13px",
    marginTop: "6px", marginBottom: "6px", overflowX: "auto",
    whiteSpace: "pre", border: `1px solid ${c.cmdBorder}`,
  };

  const isBeginner     = difficulty === "beginner";
  const isIntermediate = difficulty === "intermediate";
  const isAdvanced     = difficulty === "advanced";

  return (
    <div style={{
      padding: "18px", background: c.panelBg, color: c.text,
      borderRadius: "10px", border: `1px solid ${c.panelBorder}`,
      maxWidth: "440px", width: "100%",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <h3 style={{ color: c.accent, marginBottom: "14px", fontSize: "16px" }}>
        📋 Instructions
      </h3>

      {/* ══ BEGINNER — GUIDED MODE ══ */}
      {isBeginner && (
        <>
          <div style={{ marginBottom: "14px" }}>
            <StepRow stepNum={1} currentStep={currentStep} label="List files (ls)"           colors={c} />
            <StepRow stepNum={2} currentStep={currentStep} label="View hash file (cat)"       colors={c} />
            <StepRow stepNum={3} currentStep={currentStep} label="Crack with John the Ripper" colors={c} />
            <StepRow stepNum={4} currentStep={currentStep} label="Reveal cracked password"    colors={c} />
          </div>

          <div style={{
            background: c.activePanelBg, border: `1px solid ${c.activePanelBorder}`,
            borderRadius: "8px", padding: "12px",
            transition: "background 0.3s",
          }}>
            <p style={{ fontWeight: "bold", marginBottom: "8px", color: c.accent }}>
              ▶ Step {Math.min(currentStep, 4)} of 4
            </p>

            {currentStep === 1 && (
              <>
                <p style={{ marginBottom: "6px" }}>List the files in the directory to see what's available.</p>
                <div style={commandStyle}>ls</div>
                <p style={{ fontSize: "12px", color: c.sub }}>
                  You should see <code style={{ color: c.cmdText }}>hash.txt</code> in the output.
                </p>
              </>
            )}

            {currentStep === 2 && (
              <>
                <p style={{ marginBottom: "6px" }}>View the hash file to see the target hash.</p>
                <div style={commandStyle}>cat hash.txt</div>
                <p style={{ fontSize: "12px", color: c.sub, marginTop: "6px" }}>
                  The hash is <b>32 hexadecimal characters</b> — this is an{" "}
                  <b style={{ color: c.cmdText }}>MD5</b> hash.
                </p>
              </>
            )}

            {currentStep === 3 && (
              <>
                <p style={{ marginBottom: "6px" }}>
                  Use <b>John the Ripper</b> with a dictionary attack against the MD5 hash.
                </p>
                <div style={commandStyle}>
                  {`john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hash.txt`}
                </div>
                <p style={{ fontSize: "12px", color: c.sub, marginTop: "6px" }}>
                  The cracked password will appear in the output. Look for it between the hash lines.
                </p>
              </>
            )}

            {currentStep >= 4 && (
              <>
                <p style={{ marginBottom: "6px" }}>Reveal the cracked password from John's cache.</p>
                <div style={commandStyle}>john --show --format=raw-md5 hash.txt</div>
                <p style={{ fontSize: "12px", color: c.sub, marginTop: "6px" }}>
                  If it shows 0 cracked, check the output from step 3 — the password appeared there.
                  Enter it in the Submit box below.
                </p>
                <p style={{ fontSize: "12px", color: c.success, marginTop: "4px" }}>
                  🎉 Copy the password and submit it below!
                </p>
              </>
            )}
          </div>

          <p style={{ marginTop: "10px", fontSize: "12px", color: c.muted }}>
            💡 Each step unlocks automatically after you run the correct command.
          </p>
        </>
      )}

      {/* ══ INTERMEDIATE — HINTS MODE ══ */}
      {isIntermediate && (
        <>
          {currentScore !== null && (
            <div style={{
              background: c.scoreBg, border: `1px solid ${c.scoreBorder}`,
              borderRadius: "8px", padding: "10px 14px", marginBottom: "12px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "background 0.3s",
            }}>
              <span style={{ color: c.sub, fontSize: "13px" }}>Current Score</span>
              <span style={{ color: c.warning, fontWeight: "bold", fontSize: "18px" }}>
                {currentScore} pts
              </span>
            </div>
          )}

          <p style={{ marginBottom: "8px", fontSize: "14px" }}>
            Crack the <b style={{ color: c.warning }}>SHA-256</b> hash using <b>Hashcat</b> in hybrid mode.
            <br />
            <span style={{ color: c.sub, fontSize: "12px" }}>
              The password is a common word followed by 2 digits — e.g.{" "}
              <code style={{ color: c.warning }}>sunshine47</code>
            </span>
          </p>

          <div style={{ marginBottom: "12px" }}>
            <button
              onClick={onRequestHint}
              disabled={hintsUsed >= maxHints}
              style={{
                padding: "9px 16px",
                background: hintsUsed >= maxHints ? c.hintDisabledBg : c.warning,
                color:      hintsUsed >= maxHints ? c.hintDisabledColor : "#000",
                border:     `1px solid ${hintsUsed >= maxHints ? c.hintDisabledBorder : c.warning}`,
                borderRadius: "6px",
                cursor:     hintsUsed >= maxHints ? "not-allowed" : "pointer",
                fontWeight: "bold", fontSize: "13px", width: "100%",
                transition: "background 0.2s",
              }}
            >
              {hintsUsed >= maxHints
                ? "No hints remaining"
                : `💡 Get Hint (${maxHints - hintsUsed} remaining${hintsUsed >= 3 ? " — costs -5 pts" : ""})`}
            </button>

            {hintsUsed >= 3 && hintsUsed < maxHints && (
              <p style={{ fontSize: "11px", color: c.danger, marginTop: "4px", textAlign: "center" }}>
                ⚠ Each hint from this point deducts 5 points
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {hintsUsed >= 1 && (
              <div style={{ background: c.hintRowBg, borderRadius: "6px", padding: "8px 12px", fontSize: "13px" }}>
                <span style={{ color: c.warning }}>💡 Hint 1:</span>
                <span style={{ color: c.text }}> Start by viewing the hash file and note its length.</span>
              </div>
            )}
            {hintsUsed >= 2 && (
              <div style={{ background: c.hintRowBg, borderRadius: "6px", padding: "8px 12px", fontSize: "13px" }}>
                <span style={{ color: c.warning }}>💡 Hint 2:</span>
                <span style={{ color: c.text }}> 64 hexadecimal characters = <b>SHA-256</b> hash.</span>
              </div>
            )}
            {hintsUsed >= 3 && (
              <div style={{ background: c.hintRowBg, borderRadius: "6px", padding: "8px 12px", fontSize: "13px" }}>
                <span style={{ color: c.warning }}>💡 Hint 3:</span>
                <span style={{ color: c.text }}> The password is a common dictionary word with digits appended.</span>
              </div>
            )}
            {hintsUsed >= 4 && (
              <div style={{ background: c.hintRowBg, borderRadius: "6px", padding: "8px 12px", fontSize: "13px" }}>
                <span style={{ color: c.danger, fontSize: "11px" }}>(-5 pts)</span>
                <span style={{ color: c.warning }}> 💡 Hint 4:</span>
                <span style={{ color: c.text }}> Use Hashcat hybrid attack mode (-a 6): wordlist + mask.</span>
              </div>
            )}
            {hintsUsed >= 5 && (
              <div style={{ background: c.hintRowBg, borderRadius: "6px", padding: "8px 12px", fontSize: "13px" }}>
                <span style={{ color: c.danger, fontSize: "11px" }}>(-5 pts)</span>
                <span style={{ color: c.warning }}> 💡 Hint 5:</span>
                <span style={{ color: c.text }}> Use this exact command:</span>
                <div style={commandStyle}>
                  {`hashcat -m 1400 hash.txt /usr/share/wordlists/rockyou.txt -a 6 ?d?d`}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══ ADVANCED — FREE MODE ══ */}
      {isAdvanced && (
        <>
          <div style={{
            background: c.advancedBg, border: `1px solid ${c.advancedBorder}`,
            borderRadius: "8px", padding: "12px", marginBottom: "12px",
            transition: "background 0.3s",
          }}>
            <p style={{ color: c.danger, fontWeight: "bold", marginBottom: "8px" }}>
              🔴 Advanced Mode — No Guidance
            </p>
            <ul style={{ fontSize: "13px", lineHeight: "1.8", color: c.text, paddingLeft: "16px" }}>
              <li>Identify the hash type yourself</li>
              <li>No hints available</li>
              <li>Choose your own tool (Hashcat or John)</li>
              <li>Consider <b>mask</b> or <b>brute-force</b> attack strategy</li>
              <li>Password is 5 lowercase letters</li>
            </ul>
          </div>
          <p style={{ fontSize: "12px", color: c.muted }}>
            ⏱ Speed and attempts affect your final score.
          </p>
        </>
      )}

      {/* Universal blocked commands reminder */}
      <p style={{
        marginTop: "14px", fontSize: "12px", color: c.muted,
        borderTop: `1px solid ${c.divider}`, paddingTop: "10px",
      }}>
        🚫 Blocked: <code style={{ color: c.danger }}>rm, wget, curl, sudo, bash, nc, python</code>
      </p>
    </div>
  );
}
