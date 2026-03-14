import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">

      <Link
        to="/"
        className="text-xl font-bold text-accent cursor-pointer 
        transition-all duration-300
        hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]
        hover:scale-105"
      >
        CyberCare
      </Link>

      <div className="flex gap-6 text-sm text-muted">
        <span className="hover:text-white transition cursor-pointer">Features</span>
        <span className="hover:text-white transition cursor-pointer">About</span>
        <span className="hover:text-white transition cursor-pointer">Legal</span>
        <span className="hover:text-white transition cursor-pointer">Contact</span>
      </div>

    </nav>
  )
}