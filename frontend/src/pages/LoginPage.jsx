import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const payload = { email, password };
    if (!isLogin) payload.name = formData.get("fullName");

    const endpoint = isLogin ? "http://127.0.0.1:8000/login" : "http://127.0.0.1:8000/register";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) { navigate("/technical-user"); }
        else { setIsLogin(true); e.target.reset(); }
      } else {
        alert("❌ ERROR: " + data.detail);
      }
    } catch (error) {
      console.error("Connection failed:", error);
      alert("⚠️ Could not connect to the server. Is FastAPI running?");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] overflow-hidden relative flex flex-col justify-center items-center p-6 theme-page-bg">

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none theme-grid-bg" />

      {/* Glow orb */}
      <div className="fixed pointer-events-none" style={{ top:"10%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(circle,var(--glow-a) 0%,transparent 70%)", borderRadius:"50%" }} />

      {/* Mouse spotlight */}
      <div className="fixed pointer-events-none" style={{ left:mousePos.x-200, top:mousePos.y-200, width:400, height:400, background:"radial-gradient(circle,rgba(var(--accent-rgb),0.04) 0%,transparent 70%)", borderRadius:"50%", transition:"left .1s,top .1s", zIndex:0 }} />

      <div className="relative z-10 w-full max-w-md">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background:"rgba(var(--accent-rgb),0.08)", border:"1px solid rgba(var(--accent-rgb),0.2)" }}>
            <Shield size={12} style={{ color:"var(--accent)" }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".7rem", color:"var(--accent)", letterSpacing:".1em" }}>
              {isLogin ? "SECURE LOGIN" : "ACCOUNT REGISTRATION"}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color:"var(--text)" }}>
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-sm" style={{ color:"var(--text-sub)" }}>
            {isLogin ? "Enter your credentials to access the command center." : "Join the platform and start protecting yourself."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
          style={{ background:"var(--bg-card)", border:"1px solid var(--border)", backdropFilter:"blur(10px)" }}>

          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background:"linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.3),transparent)" }} />

          {/* Toggle */}
          <div className="flex rounded-xl p-1 mb-8"
            style={{ background:"var(--bg-deep)", border:"1px solid var(--border)" }}>
            {[{label:"Sign In",active:isLogin,fn:()=>setIsLogin(true)},{label:"Register",active:!isLogin,fn:()=>setIsLogin(false)}].map(({label,active,fn})=>(
              <button key={label} type="button" onClick={fn}
                className="flex-1 py-2.5 text-sm font-bold rounded-lg transition-all"
                style={{
                  background: active ? "rgba(29,78,216,.15)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  border: active ? "1px solid rgba(var(--accent-rgb),.3)" : "1px solid transparent",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color:"var(--text-sub)" }}>Full Name</label>
                <input type="text" name="fullName" placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl px-4 py-3 transition-all text-sm theme-input"
                  style={{ background:"var(--input-bg)", border:"1px solid var(--input-border)", color:"var(--text)", outline:"none" }}
                  onFocus={e=>{e.target.style.borderColor="rgba(var(--accent-rgb),.5)";e.target.style.boxShadow="0 0 10px rgba(var(--accent-rgb),.15)"}}
                  onBlur={e=>{e.target.style.borderColor="var(--input-border)";e.target.style.boxShadow="none"}}
                  required />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-2" style={{ color:"var(--text-sub)" }}>Email Address</label>
              <input type="email" name="email" placeholder="name@example.com"
                className="w-full rounded-xl px-4 py-3 transition-all text-sm"
                style={{ background:"var(--input-bg)", border:"1px solid var(--input-border)", color:"var(--text)", outline:"none" }}
                onFocus={e=>{e.target.style.borderColor="rgba(var(--accent-rgb),.5)";e.target.style.boxShadow="0 0 10px rgba(var(--accent-rgb),.15)"}}
                onBlur={e=>{e.target.style.borderColor="var(--input-border)";e.target.style.boxShadow="none"}}
                required />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold" style={{ color:"var(--text-sub)" }}>Password</label>
                {isLogin && (
                  <a href="#" className="text-xs transition-colors" style={{ color:"var(--accent)" }}>Forgot password?</a>
                )}
              </div>
              <input type="password" name="password" placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 transition-all text-sm"
                style={{ background:"var(--input-bg)", border:"1px solid var(--input-border)", color:"var(--text)", outline:"none" }}
                onFocus={e=>{e.target.style.borderColor="rgba(var(--accent-rgb),.5)";e.target.style.boxShadow="0 0 10px rgba(var(--accent-rgb),.15)"}}
                onBlur={e=>{e.target.style.borderColor="var(--input-border)";e.target.style.boxShadow="none"}}
                required />
            </div>

            <button type="submit"
              className="group w-full flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 mt-6"
              style={{ background:"linear-gradient(135deg,#1d4ed8,#0369a1)", border:"1px solid rgba(96,165,250,.3)", color:"#fff" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 28px rgba(59,130,246,.5)";e.currentTarget.style.transform="translateY(-2px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)"}}>
              {isLogin ? "Access Dashboard" : "Initialize Profile"}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
