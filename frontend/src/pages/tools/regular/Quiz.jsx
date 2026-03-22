import { useEffect, useState } from "react";
import ToolLayout from "../../../layouts/ToolLayout";
import { Brain, CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Zap } from "lucide-react";

export default function Quiz() {
  const [questions,        setQuestions]        = useState([]);
  const [current,          setCurrent]          = useState(0);
  const [selected,         setSelected]         = useState(null);
  const [score,            setScore]            = useState(0);
  const [loading,          setLoading]          = useState(true);
  const [finished,         setFinished]         = useState(false);
  const [showExplanation,  setShowExplanation]  = useState(false);

  useEffect(() => { fetchQuiz(); }, []);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/quiz/generate");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === questions[current]?.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null); setShowExplanation(false);
    if (current + 1 < questions.length) setCurrent((c) => c + 1);
    else setFinished(true);
  };

  const restart = () => {
    setCurrent(0); setScore(0); setSelected(null);
    setShowExplanation(false); setFinished(false);
    fetchQuiz();
  };

  const progress = questions.length ? ((current + 1) / questions.length) * 100 : 0;
  const pct      = questions.length ? Math.round((score / questions.length) * 100) : 0;

  if (loading) {
    return (
      <ToolLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center theme-card" style={{ border: "1px solid var(--border)" }}>
            <Brain size={28} style={{ color: "#60a5fa" }} className="animate-pulse" />
          </div>
          <div className="text-sm theme-muted" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Generating AI quiz questions...</div>
        </div>
      </ToolLayout>
    );
  }

  if (!questions.length) {
    return (
      <ToolLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-sm theme-muted">No quiz questions available.</p>
        </div>
      </ToolLayout>
    );
  }

  if (finished) {
    const grade =
      pct >= 80 ? { label: "Excellent!",    color: "#22c55e", icon: Trophy      } :
      pct >= 60 ? { label: "Good Job!",     color: "#3b82f6", icon: CheckCircle } :
                  { label: "Keep Learning", color: "#f59e0b", icon: Brain       };
    return (
      <ToolLayout>
        <div className="max-w-xl mx-auto py-10">
          <div
            className="rounded-2xl p-10 text-center theme-card"
            style={{ border: `1px solid ${grade.color}33`, boxShadow: `0 0 40px ${grade.color}10` }}
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: `${grade.color}15`, color: grade.color }}>
              <grade.icon size={36} />
            </div>
            <div className="text-6xl font-extrabold mb-2" style={{ color: grade.color, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</div>
            <div className="text-2xl font-bold mb-1 theme-text">{grade.label}</div>
            <div className="text-sm mb-6 theme-muted">You scored {score} out of {questions.length} questions</div>
            <div className="score-track mb-8 mx-auto max-w-xs">
              <div className="score-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${grade.color}88, ${grade.color})` }} />
            </div>
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold tracking-widest transition-all"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #0369a1)", color: "#fff", border: "1px solid rgba(96,165,250,0.3)" }}
            >
              <RotateCcw size={15} /> TRY AGAIN
            </button>
          </div>
        </div>
      </ToolLayout>
    );
  }

  const question = questions[current];

  return (
    <ToolLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <span className="cyber-tag mb-3 inline-block">CYBER SAFETY QUIZ</span>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-extrabold tracking-tight theme-heading">Test Your Knowledge</h1>
            <div className="text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <div className="text-2xl font-extrabold" style={{ color: "#60a5fa" }}>{score}</div>
              <div className="text-xs theme-muted">SCORE</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2 theme-muted" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span>QUESTION {current + 1} / {questions.length}</span>
            <span>{Math.round(progress)}% COMPLETE</span>
          </div>
          <div className="score-track">
            <div className="score-fill" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #1d4ed8, #06b6d4)" }} />
          </div>
        </div>

        {/* Question card */}
        <div
          className="rounded-2xl p-7 mb-5 theme-card"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="flex items-start gap-4 mb-7">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {String(current + 1).padStart(2, "0")}
            </div>
            <h2 className="text-lg font-semibold leading-relaxed mt-1 theme-text">{question?.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question?.options?.map((option, index) => {
              const isCorrect  = index === question.correct;
              const isSelected = index === selected;
              const revealed   = selected !== null;

              let style = {};
              if (!revealed) {
                style = { background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-sub)" };
              } else if (isCorrect) {
                style = { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" };
              } else if (isSelected && !isCorrect) {
                style = { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" };
              } else {
                style = { background: "var(--bg-card-faint)", border: "1px solid var(--border-row)", color: "var(--text-muted)" };
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={revealed}
                  className="w-full text-left rounded-xl px-5 py-4 text-sm transition-all duration-200 flex items-center gap-3"
                  style={style}
                  onMouseEnter={(e) => { if (!revealed) { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--sidebar-hover-bg)"; } }}
                  onMouseLeave={(e) => { if (!revealed) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-input)"; } }}
                >
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: revealed && isCorrect ? "rgba(34,197,94,0.2)" : revealed && isSelected ? "rgba(239,68,68,0.2)" : "var(--bg-row)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {revealed && isCorrect ? <CheckCircle size={14} /> : revealed && isSelected ? <XCircle size={14} /> : String.fromCharCode(65 + index)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div
            className="rounded-2xl p-5 mb-5 slide-up"
            style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} style={{ color: "#60a5fa" }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: "#60a5fa", fontFamily: "'JetBrains Mono', monospace" }}>EXPLANATION</span>
            </div>
            <p className="text-sm leading-relaxed theme-sub">{question?.explanation}</p>
          </div>
        )}

        {/* Next button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!showExplanation}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold tracking-widest transition-all disabled:opacity-30"
            style={{ background: showExplanation ? "linear-gradient(135deg, #1d4ed8, #0369a1)" : "var(--bg-card-faint)", border: "1px solid var(--border)", color: showExplanation ? "#fff" : "var(--text-muted)" }}
          >
            {current + 1 === questions.length ? "FINISH QUIZ" : "NEXT QUESTION"}
            <ChevronRight size={15} />
          </button>
        </div>

      </div>
    </ToolLayout>
  );
}
