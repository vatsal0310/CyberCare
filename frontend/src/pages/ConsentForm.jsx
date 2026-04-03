import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, FileSignature, CheckSquare, Square,
  ArrowRight, AlertTriangle, Loader2,
} from 'lucide-react';

export default function ConsentForm() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const navigate = useNavigate();

  const handleAccept = async () => {
    if (!hasAgreed || loading) return;
    setLoading(true);
    setError('');

    const token = localStorage.getItem('cybercare_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/auth/consent', {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to record consent');
      }

      const data = await res.json();

      // Persist updated user (now has has_consented: true) to localStorage
      const stored = JSON.parse(localStorage.getItem('cybercare_user') || '{}');
      localStorage.setItem(
        'cybercare_user',
        JSON.stringify({ ...stored, ...data.user }),
      );

      navigate('/technical-user');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 font-sans text-slate-300">

      {/* Background warning glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full bg-[#111827] border border-slate-800 rounded-xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">

        {/* ── Header ── */}
        <div className="bg-slate-900/80 border-b border-slate-800 p-6 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-red-400 mb-0.5">
              <AlertTriangle className="w-3 h-3" /> Mandatory Authorization
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Rules of Engagement &amp; Consent
            </h1>
          </div>
        </div>

        {/* ── Scrollable legal content ── */}
        <div className="p-6 overflow-y-auto bg-[#0f1523] flex-1">
          <div className="prose prose-invert prose-slate max-w-none text-[13px] leading-relaxed">

            <p className="text-slate-400 mb-5 font-medium">
              Welcome to the CyberCare Training Environment. Before accessing the security
              labs or guided workflows, you must read and agree to the following terms
              governing authorized use.
            </p>

            {[
              {
                num: '1',
                title: 'Authorized Targets Only',
                body: 'You are granted explicit permission to perform security assessments, vulnerability scanning, and exploitation strictly against the provided virtual machine instances and designated IP addresses within the CyberCare isolated subnets. Any attempt to target infrastructure outside of these designated lab environments is strictly prohibited and illegal.',
              },
              {
                num: '2',
                title: 'Consent to Security Monitoring',
                body: 'To ensure the integrity of the platform, maintain stability, and provide automated feedback, all network traffic, terminal commands, and system interactions within the lab environments are actively logged and monitored. By proceeding, you explicitly consent to this monitoring.',
              },
              {
                num: '3',
                title: 'Prohibition of Malicious Use',
                body: 'The tools and techniques taught on this platform are for educational and defensive purposes only. You agree not to use the knowledge gained or the provided toolsets to conduct unauthorized attacks against third-party networks, exfiltrate actual sensitive data, or engage in any form of cybercrime.',
              },
              {
                num: '4',
                title: 'Academic Integrity',
                body: 'Sharing capture-the-flag (CTF) answers, distributing automated exploit scripts for lab completion, or attempting to compromise the backend infrastructure of the CyberCare platform itself is a violation of the terms of service and will result in immediate account termination.',
              },
            ].map(({ num, title, body }) => (
              <div key={num}>
                <h3 className="text-white text-base font-bold mb-2 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-cyan-500">{num}.</span> {title}
                </h3>
                <p className="mb-5">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer action area ── */}
        <div className="p-6 bg-slate-900/80 border-t border-slate-800 shrink-0">

          {error && (
            <p className="text-xs text-red-400 text-center mb-3 font-mono">{error}</p>
          )}

          {/* Checkbox */}
          <div
            className="flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer mb-4 hover:bg-slate-800/50"
            onClick={() => setHasAgreed(prev => !prev)}
            style={{
              borderColor:     hasAgreed ? 'rgba(16,185,129,0.4)' : 'rgba(51,65,85,0.8)',
              backgroundColor: hasAgreed ? 'rgba(16,185,129,0.05)' : 'transparent',
            }}
          >
            <div className={`mt-0.5 shrink-0 transition-colors ${hasAgreed ? 'text-emerald-500' : 'text-slate-500'}`}>
              {hasAgreed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
            </div>
            <div>
              <p className={`text-[13px] font-bold transition-colors ${hasAgreed ? 'text-emerald-400' : 'text-slate-300'}`}>
                I have read, understood, and agree to the Rules of Engagement.
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                By checking this box, I acknowledge my legal and ethical responsibilities
                while operating within the CyberCare platform.
              </p>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleAccept}
            disabled={!hasAgreed || loading}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all text-xs uppercase tracking-widest ${
              hasAgreed && !loading
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Recording Consent…
              </>
            ) : hasAgreed ? (
              <>
                <FileSignature className="w-4 h-4" />
                Sign &amp; Authorize Access
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            ) : (
              <>
                <FileSignature className="w-4 h-4" />
                Awaiting Signature
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}