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
      style={{ width: 2, height: 2, background: "rgba(96,165,250,0.6)", animation: "floatUp 8s linear infinite", ...style }} />
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
    <div className="min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(180deg,#020b18 0%,#040d1f 50%,#020b18 100%)" }}>

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
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage:`linear-gradient(rgba(59,130,246,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.04) 1px,transparent 1px)`,
        backgroundSize:"56px 56px"
      }}/>

      {/* Glow orbs */}
      <div className="fixed pointer-events-none" style={{top:-200,left:"20%",width:600,height:600,background:"radial-gradient(circle,rgba(29,78,216,.15) 0%,transparent 70%)",borderRadius:"50%"}}/>
      <div className="fixed pointer-events-none" style={{bottom:-200,right:"10%",width:500,height:500,background:"radial-gradient(circle,rgba(14,116,144,.12) 0%,transparent 70%)",borderRadius:"50%"}}/>

      {/* Mouse spotlight */}
      <div className="fixed pointer-events-none" style={{left:mousePos.x-200,top:mousePos.y-200,width:400,height:400,background:"radial-gradient(circle,rgba(59,130,246,.04) 0%,transparent 70%)",borderRadius:"50%",transition:"left .1s,top .1s",zIndex:0}}/>

      {/* Particles */}
      {[...Array(12)].map((_,i)=>(
        <Particle key={i} style={{left:`${8+i*8}%`,bottom:0,animationDelay:`${i*.7}s`,animationDuration:`${7+(i%4)}s`,width:i%3===0?3:2,height:i%3===0?3:2}}/>
      ))}

      {/* Scan line */}
      <div className="fixed inset-x-0 pointer-events-none" style={{height:1,background:"linear-gradient(90deg,transparent,rgba(59,130,246,.2),transparent)",animation:"scanLine 12s linear infinite",zIndex:1}}/>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── HERO ── */}
        <div className="pt-24 pb-20 text-center">

          <div className="fu d1 inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{background:"rgba(29,78,216,.12)",border:"1px solid rgba(59,130,246,.25)"}}>
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"/>
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping" style={{opacity:.4}}/>
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".7rem",color:"#93c5fd",letterSpacing:".1em"}}>
              CYBERSECURITY EDUCATION &amp; TESTING PLATFORM
            </span>
          </div>

          <h1 className="fu d2 font-extrabold leading-none tracking-tight mb-6"
            style={{fontSize:"clamp(3rem,7vw,5.5rem)"}}>
            <span style={{background:"linear-gradient(135deg,#f0f9ff 0%,#bfdbfe 40%,#93c5fd 70%,#60a5fa 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Security at
            </span>
            <br/>
            <span style={{background:"linear-gradient(135deg,#60a5fa 0%,#22d3ee 60%,#34d399 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              every step.
            </span>
          </h1>

          <p className="fu d3 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{color:"rgba(148,163,184,.7)"}}>
            We believe cybersecurity education belongs to{" "}
            <span style={{color:"#93c5fd"}}>everyone</span> — from first-time internet users to seasoned professionals.
          </p>

          <div className="fu d4 flex items-center justify-center gap-4 flex-wrap">
            <button onClick={()=>navigate("/regular-user")}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
              style={{background:"linear-gradient(135deg,#1d4ed8,#0369a1)",border:"1px solid rgba(96,165,250,.3)",color:"#fff",animation:"glowPulse 3s ease-in-out infinite"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              I'm a Regular User <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <button onClick={()=>navigate("/technical-user")}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
              style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(203,213,225,.85)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(96,165,250,.4)";e.currentTarget.style.color="#fff";e.currentTarget.style.transform="translateY(-2px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.12)";e.currentTarget.style.color="rgba(203,213,225,.85)";e.currentTarget.style.transform="translateY(0)"}}>
              I'm a Technical User <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="fu d5 grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {stats.map(({icon:Icon,value,suffix,label})=>(
            <div key={label} className="rounded-2xl p-5 text-center transition-all duration-300"
              style={{background:"rgba(7,14,34,.7)",border:"1px solid rgba(59,130,246,.1)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(59,130,246,.35)";e.currentTarget.style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(59,130,246,.1)";e.currentTarget.style.transform="translateY(0)"}}>
              <Icon size={16} className="mx-auto mb-2" style={{color:"rgba(96,165,250,.5)"}}/>
              <div className="text-2xl font-extrabold text-white mb-0.5" style={{fontFamily:"'JetBrains Mono',monospace"}}>
                <Counter target={value} suffix={suffix}/>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".62rem",color:"rgba(148,163,184,.4)",letterSpacing:".1em"}}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── USER PATH CARDS ── */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",letterSpacing:".15em",color:"rgba(59,130,246,.6)"}}>// CHOOSE YOUR PATH</span>
            <h2 className="text-3xl font-extrabold text-white mt-3">Who are you?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Regular */}
            <div onClick={()=>navigate("/regular-user")}
              onMouseEnter={()=>setHoveredCard("regular")} onMouseLeave={()=>setHoveredCard(null)}
              className="group relative cursor-pointer rounded-2xl p-8 overflow-hidden transition-all duration-300"
              style={{
                background:hoveredCard==="regular"?"linear-gradient(135deg,rgba(29,78,216,.2),rgba(14,116,144,.12))":"rgba(7,14,34,.85)",
                border:hoveredCard==="regular"?"1px solid rgba(59,130,246,.45)":"1px solid rgba(59,130,246,.15)",
                transform:hoveredCard==="regular"?"translateY(-4px)":"translateY(0)",
                boxShadow:hoveredCard==="regular"?"0 24px 50px rgba(29,78,216,.2)":"none",
              }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none transition-opacity duration-300"
                style={{background:"radial-gradient(circle at 100% 0%,rgba(59,130,246,.12) 0%,transparent 60%)",opacity:hoveredCard==="regular"?1:0}}/>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{background:hoveredCard==="regular"?"linear-gradient(135deg,#1d4ed8,#0369a1)":"rgba(29,78,216,.15)",color:"#60a5fa",boxShadow:hoveredCard==="regular"?"0 0 24px rgba(29,78,216,.5)":"none"}}>
                  <Shield size={24}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">Regular User</h3>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",background:"rgba(29,78,216,.2)",color:"#93c5fd",border:"1px solid rgba(59,130,246,.3)",padding:"2px 8px",borderRadius:4}}>BEGINNER FRIENDLY</span>
                  </div>
                  <p className="text-sm mb-5" style={{color:"rgba(148,163,184,.65)",lineHeight:1.7}}>
                    Check if a website is safe, test your password strength, see if your data was leaked, and learn to spot scams. No tech skills needed.
                  </p>
                  <div className="space-y-1.5">
                    {regularTools.map(({icon:Icon,label})=>(
                      <div key={label} className="flex items-center gap-2">
                        <Icon size={12} style={{color:"rgba(96,165,250,.5)",flexShrink:0}}/>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"rgba(148,163,184,.5)"}}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold tracking-widest transition-all duration-300"
                style={{color:hoveredCard==="regular"?"#60a5fa":"rgba(96,165,250,.3)"}}>
                EXPLORE TOOLS <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>

            {/* Technical */}
            <div onClick={()=>navigate("/technical-user")}
              onMouseEnter={()=>setHoveredCard("tech")} onMouseLeave={()=>setHoveredCard(null)}
              className="group relative cursor-pointer rounded-2xl p-8 overflow-hidden transition-all duration-300"
              style={{
                background:hoveredCard==="tech"?"linear-gradient(135deg,rgba(124,58,237,.18),rgba(6,182,212,.1))":"rgba(7,14,34,.85)",
                border:hoveredCard==="tech"?"1px solid rgba(124,58,237,.45)":"1px solid rgba(124,58,237,.15)",
                transform:hoveredCard==="tech"?"translateY(-4px)":"translateY(0)",
                boxShadow:hoveredCard==="tech"?"0 24px 50px rgba(124,58,237,.2)":"none",
              }}>
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none transition-opacity duration-300"
                style={{background:"radial-gradient(circle at 100% 0%,rgba(124,58,237,.12) 0%,transparent 60%)",opacity:hoveredCard==="tech"?1:0}}/>
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{background:hoveredCard==="tech"?"linear-gradient(135deg,#7c3aed,#0e7490)":"rgba(124,58,237,.15)",color:"#a78bfa",boxShadow:hoveredCard==="tech"?"0 0 24px rgba(124,58,237,.5)":"none"}}>
                  <Bug size={24}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">Technical User</h3>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",background:"rgba(124,58,237,.2)",color:"#c4b5fd",border:"1px solid rgba(124,58,237,.3)",padding:"2px 8px",borderRadius:4}}>PROFESSIONAL</span>
                  </div>
                  <p className="text-sm mb-5" style={{color:"rgba(148,163,184,.65)",lineHeight:1.7}}>
                    Access penetration testing tools, run security labs, and generate professional reports. Built for security researchers and IT pros.
                  </p>
                  <div className="space-y-1.5">
                    {[{icon:Bug,label:"Penetration Testing"},{icon:FlaskConical,label:"Security Labs"},{icon:FileText,label:"Professional Reports"}].map(({icon:Icon,label})=>(
                      <div key={label} className="flex items-center gap-2">
                        <Icon size={12} style={{color:"rgba(167,139,250,.5)",flexShrink:0}}/>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",color:"rgba(148,163,184,.5)"}}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold tracking-widest transition-all duration-300"
                style={{color:hoveredCard==="tech"?"#a78bfa":"rgba(167,139,250,.3)"}}>
                LAUNCH TOOLS <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>

          </div>
        </div>

        {/* ── FEATURES GRID ── */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".65rem",letterSpacing:".15em",color:"rgba(59,130,246,.6)"}}>// PLATFORM CAPABILITIES</span>
            <h2 className="text-3xl font-extrabold text-white mt-3">Comprehensive Security Platform</h2>
            <p className="text-sm mt-2" style={{color:"rgba(148,163,184,.5)"}}>Everything you need to stay safe and test systems — in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(({icon:Icon,title,desc},i)=>(
              <div key={title} className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-250"
                style={{background:"rgba(7,14,34,.7)",border:"1px solid rgba(59,130,246,.1)"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(59,130,246,.35)";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.background="rgba(12,22,48,.9)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(59,130,246,.1)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.background="rgba(7,14,34,.7)"}}>
                <div className="absolute top-3 right-4" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:".6rem",color:"rgba(59,130,246,.15)"}}>
                  {String(i+1).padStart(2,"0")}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{background:"rgba(29,78,216,.15)",color:"#60a5fa"}}>
                  <Icon size={18}/>
                </div>
                <h4 className="font-bold text-white mb-1">{title}</h4>
                <p className="text-xs" style={{color:"rgba(148,163,184,.5)"}}>{desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{background:"linear-gradient(90deg,transparent,rgba(59,130,246,.5),transparent)"}}/>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="mb-20 rounded-3xl p-12 text-center relative overflow-hidden"
          style={{background:"linear-gradient(135deg,rgba(29,78,216,.12) 0%,rgba(14,116,144,.08) 100%)",border:"1px solid rgba(59,130,246,.2)"}}>
          <div className="absolute inset-0 pointer-events-none"
            style={{background:"radial-gradient(ellipse at 50% 0%,rgba(59,130,246,.1) 0%,transparent 60%)"}}/>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{background:"linear-gradient(135deg,#1d4ed8,#0369a1)",boxShadow:"0 0 30px rgba(29,78,216,.5)"}}>
              <Shield size={24} className="text-white"/>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Start protecting yourself today</h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{color:"rgba(148,163,184,.6)"}}>
              Free to use. No sign-up required. Your data never leaves your device.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={()=>navigate("/regular-user")}
                className="px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
                style={{background:"linear-gradient(135deg,#1d4ed8,#0369a1)",border:"1px solid rgba(96,165,250,.3)",color:"#fff"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 0 28px rgba(59,130,246,.5)";e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)"}}>
                Get Started — It's Free
              </button>
              <button onClick={()=>navigate("/technical-user")}
                className="px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200"
                style={{background:"transparent",border:"1px solid rgba(255,255,255,.12)",color:"rgba(203,213,225,.7)"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.3)";e.currentTarget.style.color="#fff"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.12)";e.currentTarget.style.color="rgba(203,213,225,.7)"}}>
                Technical Tools →
              </button>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="pb-8 flex items-center justify-between text-xs"
          style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:"2rem",color:"rgba(148,163,184,.3)"}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace"}}>© 2025 CyberCare</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span style={{fontFamily:"'JetBrains Mono',monospace"}}>All systems operational</span>
          </div>
        </div>

      </div>
    </div>
  )
}
