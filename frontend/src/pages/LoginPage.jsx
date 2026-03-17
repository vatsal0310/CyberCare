import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; 

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate(); 

  // Dynamic mouse spotlight effect
  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // ==========================================
  // THE BACKEND CONNECTION LOGIC
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = { email, password };
    if (!isLogin) {
      payload.name = formData.get("fullName");
    }

    const endpoint = isLogin ? "http://127.0.0.1:8000/login" : "http://127.0.0.1:8000/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // ==========================================
        // NEW UX FLOW: No more annoying popups!
        // ==========================================
        if (isLogin) {
          // 1. If they successfully logged in, teleport them instantly.
          navigate("/technical-user"); 
        } else {
          // 2. If they successfully registered, switch the form to the Login state.
          // (Optionally clear the form targets here if you want them to re-type, 
          // but React will handle the state switch cleanly).
          setIsLogin(true);
          e.target.reset(); // Clears the form fields so it's fresh for login
        }
      } else {
        // We still keep the alert for ERRORS so they know if they typed the wrong password!
        alert("❌ ERROR: " + data.detail);
      }
      
    } catch (error) {
      console.error("Connection failed:", error);
      alert("⚠️ Could not connect to the server. Is FastAPI running?");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] overflow-hidden relative flex flex-col justify-center items-center p-6"
      style={{ background: "linear-gradient(180deg,#020b18 0%,#040d1f 50%,#020b18 100%)" }}>

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(59,130,246,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.04) 1px,transparent 1px)`,
        backgroundSize: "56px 56px"
      }} />

      {/* Glow orbs */}
      <div className="fixed pointer-events-none" style={{ top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle,rgba(29,78,216,.1) 0%,transparent 70%)", borderRadius: "50%" }} />

      {/* Mouse spotlight */}
      <div className="fixed pointer-events-none" style={{ left: mousePos.x - 200, top: mousePos.y - 200, width: 400, height: 400, background: "radial-gradient(circle,rgba(59,130,246,.04) 0%,transparent 70%)", borderRadius: "50%", transition: "left .1s,top .1s", zIndex: 0 }} />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Title Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(29,78,216,.12)", border: "1px solid rgba(59,130,246,.25)" }}>
            <Shield size={12} style={{ color: "#93c5fd" }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".7rem", color: "#93c5fd", letterSpacing: ".1em" }}>
              {isLogin ? "SECURE LOGIN" : "ACCOUNT REGISTRATION"}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-sm" style={{ color: "rgba(148,163,184,.6)" }}>
            {isLogin ? "Enter your credentials to access the command center." : "Join the platform and start protecting yourself."}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
          style={{ background: "rgba(7,14,34,.7)", border: "1px solid rgba(59,130,246,.1)", backdropFilter: "blur(10px)" }}>
          
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg,transparent,rgba(59,130,246,.3),transparent)" }} />

          {/* Toggle Switch */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "rgba(2,11,24,.8)", border: "1px solid rgba(59,130,246,.15)" }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="flex-1 py-2.5 text-sm font-bold rounded-lg transition-all"
              style={{
                background: isLogin ? "rgba(29,78,216,.15)" : "transparent",
                color: isLogin ? "#60a5fa" : "rgba(148,163,184,.5)",
                border: isLogin ? "1px solid rgba(59,130,246,.3)" : "1px solid transparent"
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="flex-1 py-2.5 text-sm font-bold rounded-lg transition-all"
              style={{
                background: !isLogin ? "rgba(29,78,216,.15)" : "transparent",
                color: !isLogin ? "#60a5fa" : "rgba(148,163,184,.5)",
                border: !isLogin ? "1px solid rgba(59,130,246,.3)" : "1px solid transparent"
              }}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: "rgba(148,163,184,.8)" }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-sm text-white"
                  style={{ background: "rgba(2,11,24,.6)", border: "1px solid rgba(255,255,255,.1)", outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(96,165,250,.5)"; e.target.style.boxShadow = "0 0 10px rgba(59,130,246,.2)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.boxShadow = "none"; }}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-2" style={{ color: "rgba(148,163,184,.8)" }}>
                Email Address
              </label>
              <input 
                type="email" 
                name="email"
                placeholder="name@example.com"
                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-sm text-white"
                style={{ background: "rgba(2,11,24,.6)", border: "1px solid rgba(255,255,255,.1)", outline: "none" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(96,165,250,.5)"; e.target.style.boxShadow = "0 0 10px rgba(59,130,246,.2)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold" style={{ color: "rgba(148,163,184,.8)" }}>
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-xs transition-colors" style={{ color: "#60a5fa" }} onMouseEnter={e => e.target.style.color = "#93c5fd"} onMouseLeave={e => e.target.style.color = "#60a5fa"}>
                    Forgot password?
                  </a>
                )}
              </div>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-sm text-white"
                style={{ background: "rgba(2,11,24,.6)", border: "1px solid rgba(255,255,255,.1)", outline: "none" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(96,165,250,.5)"; e.target.style.boxShadow = "0 0 10px rgba(59,130,246,.2)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,.1)"; e.target.style.boxShadow = "none"; }}
                required
              />
            </div>

            <button 
              type="submit"
              className="group w-full flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 mt-6"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#0369a1)", border: "1px solid rgba(96,165,250,.3)", color: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 28px rgba(59,130,246,.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {isLogin ? "Access Dashboard" : "Initialize Profile"} 
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}