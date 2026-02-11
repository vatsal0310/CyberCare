export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 border-b border-white/10">
      <h1 className="text-xl font-bold text-accent">CyberCare</h1>
      <div className="flex gap-6 text-sm text-muted">
        <span>Features</span>
        <span>About</span>
        <span>Legal</span>
        <span>Contact</span>
      </div>
    </nav>
  )
}
