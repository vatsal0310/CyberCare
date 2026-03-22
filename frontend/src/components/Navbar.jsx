import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import { Sun, Moon } from "lucide-react"

export default function Navbar() {
  const { isDark, toggle } = useTheme()

  return (
    <nav className="flex justify-between items-center px-10 py-5 border-b theme-navbar">

      <Link
        to="/"
        className="text-xl font-bold text-accent cursor-pointer 
        transition-all duration-300
        hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]
        hover:scale-105"
      >
        CyberCare
      </Link>

      <div className="flex items-center gap-6 text-sm theme-muted">
        <span className="hover:text-accent transition cursor-pointer">Features</span>
        <span className="hover:text-accent transition cursor-pointer">About</span>
        <span className="hover:text-accent transition cursor-pointer">Legal</span>
        <span className="hover:text-accent transition cursor-pointer">Contact</span>

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{
            background: isDark
              ? "linear-gradient(135deg,#0f2044,#0e3a5c)"
              : "linear-gradient(135deg,#e0f2fe,#bae6fd)",
            border: isDark
              ? "1px solid rgba(34,211,238,0.3)"
              : "1px solid rgba(14,116,144,0.3)",
            boxShadow: isDark
              ? "0 0 12px rgba(34,211,238,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 0 12px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          <span
            className="absolute left-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-300"
            style={{ opacity: isDark ? 1 : 0 }}
          >
            <Moon size={11} color="#22d3ee" />
          </span>
          <span
            className="absolute right-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-300"
            style={{ opacity: isDark ? 0 : 1 }}
          >
            <Sun size={11} color="#0369a1" />
          </span>

          <span
            className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              left: isDark ? "2px" : "calc(100% - 26px)",
              background: isDark
                ? "linear-gradient(135deg,#22d3ee,#0ea5e9)"
                : "linear-gradient(135deg,#fbbf24,#f59e0b)",
              boxShadow: isDark
                ? "0 0 8px rgba(34,211,238,0.6), 0 2px 4px rgba(0,0,0,0.3)"
                : "0 0 8px rgba(251,191,36,0.7), 0 2px 4px rgba(0,0,0,0.15)",
            }}
          >
            {isDark
              ? <Moon size={12} color="#0c4a6e" strokeWidth={2.5} />
              : <Sun size={12} color="#78350f" strokeWidth={2.5} />
            }
          </span>
        </button>
      </div>

    </nav>
  )
}
