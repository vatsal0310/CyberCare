import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TechLayout from "../../../../layouts/TechLayout";
import Timer from "./components/Timer";
import Terminal from "./components/Terminal";
import InstructionPanel from "./components/InstructionPanel";
import { startLab, getLabHint, resetLab, submitPassword as apiSubmitPassword } from "../../../../api/pcl";

export default function LabPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const difficulty    = location.state?.difficulty || "beginner";
  const hasStartedRef = useRef(false);

  const getCompleted = () => {
    try { return JSON.parse(localStorage.getItem("lab_progress") || "{}"); } catch { return {}; }
  };
  const [completed, setCompleted] = useState(getCompleted);

  const [session,      setSession]      = useState(null);
  const [labActive,    setLabActive]    = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [startError,   setStartError]   = useState(null);
  const [resetting,    setResetting]    = useState(false);

  const [currentStep,  setCurrentStep]  = useState(1);
  const [hintsUsed,    setHintsUsed]    = useState(0);
  const [currentScore, setCurrentScore] = useState(null);

  const [password,   setPassword]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result,     setResult]     = useState(null);
  const [submitErr,  setSubmitErr]  = useState(null);

  // ── Start lab on mount ──
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const init = async () => {
      try {
        const data = await startLab(difficulty);
        setSession(data);
        setLabActive(true);
        setCurrentScore(data.points || null);
      } catch (err) {
        setStartError(err.message || "Failed to start lab. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleStepUpdate = useCallback((step, hints, score) => {
    if (step  != null) setCurrentStep(step);
    if (hints != null) setHintsUsed(hints);
    if (score != null) setCurrentScore(score);
  }, []);

  const requestHint = async () => {
    if (!session) return;
    try {
      const res = await getLabHint(session.session_id);
      setHintsUsed(res.hints_used ?? hintsUsed + 1);
      if (res.current_score !== undefined) setCurrentScore(res.current_score);
    } catch (err) {
      alert(err.message || "No hints available");
    }
  };

  const handleSubmitPassword = async () => {
    if (!password.trim()) {
      setSubmitErr("Please enter a password first");
      return;
    }
    setSubmitting(true);
    setSubmitErr(null);

    try {
      const res = await apiSubmitPassword(session.session_id, password);

      if (res.success) {
        // ✅ Correct password — container is deleted on backend, navigate to result
        const prev = (() => {
          try { return JSON.parse(localStorage.getItem("lab_progress") || "{}"); } catch { return {}; }
        })();
        localStorage.setItem("lab_progress", JSON.stringify({ ...prev, lab: true }));

        navigate("/technical-user/password-lab/result", {
          state: {
            success:            res.success,
            score:              res.score,
            attempts:           res.attempts,
            time_taken_seconds: res.time_taken_seconds,
            difficulty:         res.difficulty || difficulty,
            mode:               res.mode,
            algorithm:          res.algorithm,
            hints_used:         res.hints_used,
            base_score:         res.base_score,
            time_penalty:       res.time_penalty,
            attempt_penalty:    res.attempt_penalty,
            hint_penalty:       res.hint_penalty,
          },
        });
      } else {
        // ❌ Wrong password — show error, allow retry
        setSubmitErr("Incorrect password. Try again.");
        setResult(res);
      }
    } catch (err) {
      const msg = err.message || "Submission failed. Please try again.";
      if (msg.includes("expired")) {
        setLabActive(false);
        setSubmitErr("Session has expired. Check your results below.");
      } else {
        setSubmitErr(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeExpire = () => setLabActive(false);

  // ── Loading state ──
  if (loading) {
    return (
      <TechLayout breadcrumb="Password Cracking Lab / Lab">
        <p style={{ color: "var(--text-muted)" }}>⏳ Starting lab environment...</p>
      </TechLayout>
    );
  }

  // ── Error state ──
  if (startError) {
    const isDuplicate = startError.toLowerCase().includes("running lab session");

    const handleReset = async () => {
      setResetting(true);
      try {
        await resetLab();
        window.location.reload();
      } catch {
        setResetting(false);
      }
    };

    return (
      <TechLayout breadcrumb="Password Cracking Lab / Lab">
        <div style={{ maxWidth: 560 }}>
          <div style={{
            background: "#1a0a0a",
            border: "1px solid #f8717144",
            borderRadius: 12,
            padding: "20px 24px",
            marginBottom: 24,
          }}>
            <p style={{ color: "#f87171", margin: 0, fontWeight: 600, fontSize: 15 }}>
              ❌ {startError}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {isDuplicate && (
              <button
                onClick={handleReset}
                disabled={resetting}
                style={{
                  padding: "12px 24px",
                  background: resetting ? "var(--bg-card)" : "linear-gradient(135deg,#00bfff,#00e5ff)",
                  color: resetting ? "var(--text-muted)" : "#000",
                  border: "none", borderRadius: 8,
                  fontWeight: 700, fontSize: 14,
                  cursor: resetting ? "not-allowed" : "pointer",
                }}
              >
                {resetting ? "⏳ Resetting..." : "🔄 Clear Old Session & Start Fresh"}
              </button>
            )}
            <button
              onClick={() => navigate("/technical-user/password-lab")}
              style={{
                padding: "11px 24px",
                background: "transparent",
                color: "#00bfff",
                border: "1px solid #00bfff",
                borderRadius: 8, fontWeight: 600, fontSize: 14,
                cursor: "pointer",
              }}
            >
              ← Back to Lab Dashboard
            </button>
          </div>

          {isDuplicate && (
            <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
              This happens when a previous lab session didn't close properly.
              Click "Clear Old Session" to safely expire it and start fresh.
            </p>
          )}
        </div>
      </TechLayout>
    );
  }

  return (
    <TechLayout breadcrumb="Password Cracking Lab / Lab">

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: "#00bfff", margin: 0 }}>🔐 Password Cracking Lab</h2>
          <span style={{ fontSize: 13, color: "var(--text-muted)", textTransform: "capitalize" }}>
            {difficulty} mode
          </span>
        </div>

        {labActive && session?.expires_at && (
          <Timer expires_at={session.expires_at} onExpire={handleTimeExpire} />
        )}
      </div>

      {/* Expired banner */}
      {!labActive && !result && (
        <div style={{ background: "#2a0a0a", border: "1px solid #f87171", borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
          <p style={{ color: "#f87171", margin: 0 }}>⏰ Lab session has ended. Submit your answer below or view analytics.</p>
        </div>
      )}

      {/* Main workspace */}
      {session && (
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* LEFT — Terminal + submit */}
          <div style={{ flex: "2 1 500px", minWidth: 0 }}>

            {/* Target hash */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                TARGET HASH ({session.algorithm?.toUpperCase()})
              </div>
              <code style={{ color: "#00ffcc", wordBreak: "break-all", fontSize: 13 }}>
                {session.target_hash}
              </code>
            </div>

            <Terminal
              sessionId={session.session_id}
              difficulty={difficulty}
              onStepUpdate={handleStepUpdate}
            />

            {/* Password submission */}
            <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="text"
                placeholder="Enter the cracked password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmitPassword()}
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubmitPassword}
                disabled={submitting || !password.trim()}
                style={{
                  padding: "11px 22px",
                  background: submitting || !password.trim() ? "var(--bg-card)" : "#00bfff",
                  color: submitting || !password.trim() ? "var(--text-muted)" : "#000",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: "bold",
                  cursor: submitting || !password.trim() ? "not-allowed" : "pointer",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                {submitting ? "Submitting..." : "Submit Password"}
              </button>
            </div>

            {submitErr && (
              <p style={{ color: "#f87171", fontSize: 13, marginTop: 8 }}>{submitErr}</p>
            )}
          </div>

          {/* RIGHT — Instructions */}
          <div style={{ flex: "1 1 320px" }}>
            <InstructionPanel
              difficulty={difficulty}
              currentStep={currentStep}
              hintsUsed={hintsUsed}
              hintsRemaining={Math.max(5 - hintsUsed, 0)}
              currentScore={currentScore}
              maxHints={5}
              onRequestHint={difficulty === "intermediate" ? requestHint : undefined}
            />
          </div>
        </div>
      )}

      {/* Wrong attempt feedback */}
      {result && !result.success && (
        <div style={{ marginTop: 20, background: "#1a0a0a", border: "1px solid #f87171", borderRadius: 8, padding: "14px 18px" }}>
          <p style={{ color: "#f87171", margin: 0 }}>
            ❌ Incorrect password — attempt {result.attempts}. Keep trying!
          </p>
        </div>
      )}
    </TechLayout>
  );
}