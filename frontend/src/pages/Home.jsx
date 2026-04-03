import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Shield, Lock, Book, Bug, FlaskConical, FileText,
  ArrowRight, ChevronRight, Globe, ShieldAlert,
  Brain, AlertTriangle, Zap, Users, Activity
} from "lucide-react"

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{count.toLocaleString()}{suffix}</>
}

function Particle({ style }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
      style={{ width: 2, height: 2, background: "rgba(var(--accent-rgb),0.5)", animation: "floatUp 8s linear infinite", ...style }} />
  )
}

const features = [
  { icon: Globe,        title: "URL Safety Checker",   desc: "Scan any link instantly"      },
  { icon: Lock,         title: "Password Analyzer",    desc: "Measure password strength"    },
  { icon: Book,         title: "Security Education",   desc: "Learn at your own pace"       },
  { icon: Bug,          title: "Penetration Testing",  desc: "Pro-grade security tools"     },
  { icon: FlaskConical, title: "Security Labs",        desc: "Hands-on cyber exercises"     },
  { icon: FileText,     title: "Professional Reports", desc: "Export detailed findings"     },
]

const stats = [
  { icon: Users,    value: 180000,  suffix: "+", label: "Users Protected"  },
  { icon: Shield,   value: 2400000, suffix: "+", label: "Threats Detected" },
  { icon: Activity, value: 99,      suffix: "%", label: "Uptime"           },
  { icon: Zap,      value: 1,       suffix: "s", label: "Avg Scan Time"    },
]

const regularTools = [
  { icon: Lock,          label: "Password Analyzer"   },
  { icon: Globe,         label: "Website Detector"    },
  { icon: ShieldAlert,   label: "Data Breach Checker" },
  { icon: AlertTriangle, label: "Phishing Awareness"  },
  { icon: Brain,         label: "Cyber Safety Quiz"   },
]

export default function Home() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const h = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", h)
    return () => window.removeEventListener("mousemove", h)
  }, [])

  return (
    <div className="min-h-screen overflow-hidden theme-page-bg">

      <style>{`
        @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:0}10%{opacity:1}90%{opacity:.5}100%{transform:translateY(-100vh) scale(0);opacity:0}}
        @keyframes scanLine{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(59,130,246,.3)}50%{box-shadow:0 0 50px rgba(59,130,246,.6)}}
        .fu{animation:fadeSlideUp .7s ease forwards;opacity:0}
        .d1{animation-delay:.1s}.d2{animation-delay:.25s}.d3{animation-delay:.4s}
        .d4{animation-delay:.55s}.d5{animation-delay:.7s}
      `}</style>

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none theme-grid-bg" />

      {/* Glow orbs */}
      <div className="fixed pointer-events-none" style={{ top:-200, left:"20%", width:600, height:600, background:"radial-gradient(circle,var(--glow-a) 0%,transparent 70%)", borderRadius:"50%" }} />
      <div className="fixed pointer-events-none" style={{ bottom:-200, right:"10%", width:500, height:500, background:"radial-gradient(circle,var(--glow-b) 0%,transparent 70%)", borderRadius:"50%" }} />

      {/* Mouse spotlight */}
      <div className="fixed pointer-events-none" style={{ left:mousePos.x-200, top:mousePos.y-200, width:400, height:400, background:"radial-gradient(circle,rgba(var(--accent-rgb),0.04) 0%,transparent 70%)", borderRadius:"50%", transition:"left .1s,top .1s", zIndex:0 }} />

      {/* Particles */}
      {[...Array(12)].map((_,i)=>(
        <Particle key={i} style={{ left:`${8+i*8}%`, bottom:0, animationDelay:`${i*.7}s`, animationDuration:`${7+(i%4)}s`, width:i%3===0?3:2, height:i%3===0?3:2 }} />
      ))}

      {/* Scan line */}
      <div className="fixed inset-x-0 pointer-events-none" style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(var(--accent-rgb),0.15),transparent)", animation:"scanLine 12s linear infinite", zIndex:1 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* HERO */}
        <div className="pt-24 pb-20 text-center">
          <div className="fu d1 inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background:"rgba(var(--accent-rgb),0.08)", border:"1px solid rgba(var(--accent-rgb),0.2)" }}>
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full" style={{ background:"var(--accent)" }} />
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background:"var(--accent)", opacity:.4 }} />
            </div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".7rem", color:"var(--accent)", letterSpacing:".1em" }}>
              CYBERSECURITY EDUCATION &amp; TESTING PLATFORM
            </span>
          </div>

          <h1 className="fu d2 font-extrabold leading-none tracking-tight mb-6"
            style={{ fontSize:"clamp(3rem,7vw,5.5rem)", color:"var(--text)" }}>
            Security at
            <br/>
            <span style={{ color:"var(--accent)" }}>every step.</span>
          </h1>

          <p className="fu d3 text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color:"var(--text-sub)" }}>
            We believe cybersecurity education belongs to{" "}
            <span style={{ color:"var(--accent)" }}>everyone</span> — from first-time internet users to seasoned professionals.
          </p>

          <div className="fu d4 flex items-center justify-center gap-4 flex-wrap">
            <button onClick={()=>navigate("/regular-user")}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
              style={{ background:"linear-gradient(135deg,#1d4ed8,#0369a1)", border:"1px solid rgba(96,165,250,.3)", color:"#fff", animation:"glowPulse 3s ease-in-out infinite" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              I'm a Regular User <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <button onClick={()=>navigate("/login")}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
              style={{ background:"var(--input-bg)", border:"1px solid var(--border-hover)", color:"var(--text-sub)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--text)";e.currentTarget.style.transform="translateY(-2px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border-hover)";e.currentTarget.style.color="var(--text-sub)";e.currentTarget.style.transform="translateY(0)"}}>
              I'm a Technical User <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="fu d5 grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {stats.map(({icon:Icon,value,suffix,label})=>(
            <div key={label} className="rounded-2xl p-5 text-center transition-all duration-300 theme-stat-card"
              style={{ border:"1px solid var(--border)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border-hover)";e.currentTarget.style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)"}}>
              <Icon size={16} className="mx-auto mb-2" style={{ color:"rgba(var(--accent-rgb),0.5)" }}/>
              <div className="text-2xl font-extrabold mb-0.5" style={{ fontFamily:"'JetBrains Mono',monospace", color:"var(--text)" }}>
                <Counter target={value} suffix={suffix}/>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".62rem", color:"var(--text-muted)", letterSpacing:".1em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* USER PATH CARDS */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", letterSpacing:".15em", color:"rgba(var(--accent-rgb),0.6)" }}>// CHOOSE YOUR PATH</span>
            <h2 className="text-3xl font-extrabold mt-3" style={{ color:"var(--text)" }}>Who are you?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Regular */}
            <div onClick={()=>navigate("/regular-user")}
              onMouseEnter={()=>setHoveredCard("regular")} onMouseLeave={()=>setHoveredCard(null)}
              className="group relative cursor-pointer rounded-2xl p-8 overflow-hidden transition-all duration-300"
              style={{
                background: hoveredCard==="regular" ? "linear-gradient(135deg,rgba(29,78,216,.2),rgba(14,116,144,.12))" : "var(--bg-card)",
                border: hoveredCard==="regular" ? "1px solid rgba(59,130,246,.45)" : "1px solid var(--border)",
                transform: hoveredCard==="regular" ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hoveredCard==="regular" ? "0 24px 50px rgba(29,78,216,.2)" : "none",
              }}>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: hoveredCard==="regular" ? "linear-gradient(135deg,#1d4ed8,#0369a1)" : "rgba(29,78,216,.15)", color:"#60a5fa", boxShadow: hoveredCard==="regular" ? "0 0 24px rgba(29,78,216,.5)" : "none" }}>
                  <Shield size={24}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold" style={{ color:"var(--text)" }}>Regular User</h3>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", background:"rgba(29,78,216,.2)", color:"#93c5fd", border:"1px solid rgba(59,130,246,.3)", padding:"2px 8px", borderRadius:4 }}>BEGINNER FRIENDLY</span>
                  </div>
                  <p className="text-sm mb-5" style={{ color:"var(--text-sub)", lineHeight:1.7 }}>
                    Check if a website is safe, test your password strength, see if your data was leaked, and learn to spot scams. No tech skills needed.
                  </p>
                  <div className="space-y-1.5">
                    {regularTools.map(({icon:Icon,label})=>(
                      <div key={label} className="flex items-center gap-2">
                        <Icon size={12} style={{ color:"rgba(var(--accent-rgb),0.5)", flexShrink:0 }}/>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", color:"var(--text-muted)" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold tracking-widest transition-all duration-300"
                style={{ color: hoveredCard==="regular" ? "#60a5fa" : "rgba(96,165,250,.3)" }}>
                EXPLORE TOOLS <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>

            {/* Technical */}
            <div onClick={()=>navigate("/login")}
              onMouseEnter={()=>setHoveredCard("tech")} onMouseLeave={()=>setHoveredCard(null)}
              className="group relative cursor-pointer rounded-2xl p-8 overflow-hidden transition-all duration-300"
              style={{
                background: hoveredCard==="tech" ? "linear-gradient(135deg,rgba(124,58,237,.18),rgba(6,182,212,.1))" : "var(--bg-card)",
                border: hoveredCard==="tech" ? "1px solid rgba(124,58,237,.45)" : "1px solid var(--border)",
                transform: hoveredCard==="tech" ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hoveredCard==="tech" ? "0 24px 50px rgba(124,58,237,.2)" : "none",
              }}>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: hoveredCard==="tech" ? "linear-gradient(135deg,#7c3aed,#0e7490)" : "rgba(124,58,237,.15)", color:"#a78bfa", boxShadow: hoveredCard==="tech" ? "0 0 24px rgba(124,58,237,.5)" : "none" }}>
                  <Bug size={24}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold" style={{ color:"var(--text)" }}>Technical User</h3>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", background:"rgba(124,58,237,.2)", color:"#c4b5fd", border:"1px solid rgba(124,58,237,.3)", padding:"2px 8px", borderRadius:4 }}>PROFESSIONAL</span>
                  </div>
                  <p className="text-sm mb-5" style={{ color:"var(--text-sub)", lineHeight:1.7 }}>
                    Access penetration testing tools, run security labs, and generate professional reports. Built for security researchers and IT pros.
                  </p>
                  <div className="space-y-1.5">
                    {[{icon:Bug,label:"Penetration Testing"},{icon:FlaskConical,label:"Security Labs"},{icon:FileText,label:"Professional Reports"}].map(({icon:Icon,label})=>(
                      <div key={label} className="flex items-center gap-2">
                        <Icon size={12} style={{ color:"rgba(167,139,250,.5)", flexShrink:0 }}/>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", color:"var(--text-muted)" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold tracking-widest transition-all duration-300"
                style={{ color: hoveredCard==="tech" ? "#a78bfa" : "rgba(167,139,250,.3)" }}>
                LAUNCH TOOLS <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div id="features" className="mb-24">
          <div className="text-center mb-12">
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", letterSpacing:".15em", color:"rgba(var(--accent-rgb),0.6)" }}>// PLATFORM CAPABILITIES</span>
            <h2 className="text-3xl font-extrabold mt-3" style={{ color:"var(--text)" }}>Comprehensive Security Platform</h2>
            <p className="text-sm mt-2" style={{ color:"var(--text-muted)" }}>Everything you need to stay safe and test systems — in one place.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(({icon:Icon,title,desc},i)=>(
              <div key={title} className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-250 theme-stat-card"
                style={{ border:"1px solid var(--border)" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border-hover)";e.currentTarget.style.transform="translateY(-3px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)"}}>
                <div className="absolute top-3 right-4" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", color:"rgba(var(--accent-rgb),0.15)" }}>
                  {String(i+1).padStart(2,"0")}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:"rgba(var(--accent-rgb),0.1)", color:"var(--accent)" }}>
                  <Icon size={18}/>
                </div>
                <h4 className="font-bold mb-1" style={{ color:"var(--text)" }}>{title}</h4>
                <p className="text-xs" style={{ color:"var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <div id="about" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", letterSpacing:".15em", color:"rgba(var(--accent-rgb),0.6)" }}>// ABOUT US</span>
            <h2 className="text-3xl font-extrabold mt-3" style={{ color:"var(--text)" }}>Built for everyone. Trusted by security pros.</h2>
            <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color:"var(--text-muted)" }}>CyberCare was founded with a single mission — make cybersecurity knowledge accessible to all, regardless of technical background.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title:"Our Mission", body:"We bridge the gap between complex security concepts and everyday users. From students to senior engineers, CyberCare gives everyone the tools to stay safe online." },
              { title:"Our Platform", body:"CyberCare combines education, real-time scanning tools, and hands-on penetration testing labs into one unified platform — no installs, no sign-ups for basic tools." },
              { title:"Open & Private", body:"Your data never leaves your device for client-side tools. We believe privacy is a right, not a feature. No tracking, no ads, no selling your information." },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-2xl p-6 transition-all duration-300 theme-stat-card"
                style={{ border:"1px solid var(--border)" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-hover)"; e.currentTarget.style.transform="translateY(-3px)" }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)" }}>
                <h4 className="font-bold mb-3 text-base" style={{ color:"var(--text)" }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"var(--text-muted)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LEGAL */}
        <div id="legal" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", letterSpacing:".15em", color:"rgba(var(--accent-rgb),0.6)" }}>// LEGAL</span>
            <h2 className="text-3xl font-extrabold mt-3" style={{ color:"var(--text)" }}>Transparency & Terms</h2>
            <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color:"var(--text-muted)" }}>We keep our policies simple and honest. Here's what you need to know.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label:"01", title:"Terms of Use", body:"CyberCare is an educational platform. All penetration testing tools are intended for use on systems you own or have explicit written permission to test. Unauthorized use against third-party systems is strictly prohibited and may be illegal." },
              { label:"02", title:"Privacy Policy", body:"For client-side tools (Password Analyzer, URL Checker, etc.), all processing happens locally in your browser. No data is transmitted to our servers. For tools that require API calls, only the minimum necessary data is sent and is never stored or shared." },
              { label:"03", title:"Responsible Disclosure", body:"If you discover a vulnerability in our platform, please disclose it responsibly by contacting our security team. We appreciate the security community's efforts to keep CyberCare safe for all users." },
              { label:"04", title:"Disclaimer", body:"Results from CyberCare tools are informational only and do not constitute professional legal or security advice. Always consult a qualified cybersecurity professional for critical decisions involving your infrastructure." },
            ].map(({ label, title, body }) => (
              <div key={title} className="rounded-2xl p-6 relative transition-all duration-300 theme-stat-card"
                style={{ border:"1px solid var(--border)" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-hover)"; e.currentTarget.style.transform="translateY(-3px)" }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)" }}>
                <div className="absolute top-4 right-5" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".6rem", color:"rgba(var(--accent-rgb),0.15)" }}>{label}</div>
                <h4 className="font-bold mb-3 text-base" style={{ color:"var(--text)" }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"var(--text-muted)" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div id="contact" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".65rem", letterSpacing:".15em", color:"rgba(var(--accent-rgb),0.6)" }}>// CONTACT</span>
            <h2 className="text-3xl font-extrabold mt-3" style={{ color:"var(--text)" }}>Get in Touch</h2>
            <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color:"var(--text-muted)" }}>Have a question, feedback, or want to collaborate? We'd love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { icon:"✉️", title:"General Enquiries", value:"hello@cybercare.app", sub:"For general questions and feedback" },
              { icon:"🔐", title:"Security Reports", value:"security@cybercare.app", sub:"Responsible vulnerability disclosure" },
              { icon:"🤝", title:"Partnerships", value:"partners@cybercare.app", sub:"Collaborations & institutional access" },
            ].map(({ icon, title, value, sub }) => (
              <div key={title} className="rounded-2xl p-6 text-center transition-all duration-300 theme-stat-card"
                style={{ border:"1px solid var(--border)" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border-hover)"; e.currentTarget.style.transform="translateY(-3px)" }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)" }}>
                <div className="text-2xl mb-3">{icon}</div>
                <h4 className="font-bold mb-1 text-sm" style={{ color:"var(--text)" }}>{title}</h4>
                <p className="text-xs font-mono mb-1" style={{ color:"var(--accent)" }}>{value}</p>
                <p className="text-xs" style={{ color:"var(--text-muted)" }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mb-20 rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background:"var(--footer-card-bg)", border:"1px solid var(--footer-card-border)" }}>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#1d4ed8,#0369a1)", boxShadow:"0 0 30px rgba(29,78,216,.5)" }}>
              <Shield size={24} className="text-white"/>
            </div>
            <h2 className="text-3xl font-extrabold mb-3" style={{ color:"var(--text)" }}>Start protecting yourself today</h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color:"var(--text-muted)" }}>
              Free to use. No sign-up required. Your data never leaves your device.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={()=>navigate("/regular-user")}
                className="px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
                style={{ background:"linear-gradient(135deg,#1d4ed8,#0369a1)", border:"1px solid rgba(96,165,250,.3)", color:"#fff" }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 28px rgba(59,130,246,.5)";e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)"}}>
                Get Started — It's Free
              </button>
              <button onClick={()=>navigate("/login")}
                className="px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
                style={{ background:"transparent", border:"1px solid var(--border-hover)", color:"var(--text-sub)" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border-hover)";e.currentTarget.style.color="var(--text)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border-hover)";e.currentTarget.style.color="var(--text-sub)"}}>
                Technical Tools →
              </button>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="pb-8 flex items-center justify-between text-xs"
          style={{ borderTop:"1px solid var(--border)", paddingTop:"2rem", color:"var(--text-muted)" }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>© 2025 CyberCare</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>All systems operational</span>
          </div>
        </div>

      </div>
    </div>
  )
}