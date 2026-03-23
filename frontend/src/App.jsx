import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import RegularUser from "./pages/RegularUser"
import TechnicalUser from "./pages/TechnicalUser"
import LoginPage from "./pages/LoginPage.jsx"
// Regular User Tools
import PasswordAnalyzer from "./pages/tools/regular/PasswordAnalyzer"
import PhishingAwareness from "./pages/tools/regular/PhishingAwareness.jsx"
import DataBreach from "./pages/tools/regular/DataBreach"
import Quiz from "./pages/tools/regular/Quiz.jsx"
import FakeWebsiteDetector from "./pages/tools/regular/FakeWebsiteDetector"
import SpamDetector from "./pages/tools/regular/EmailSpamDetector.jsx"

//Tech user tools
import VulnerabilityAnalyzer from "./pages/tools/tech/VulnerabilityAnalyzer"
import AttackGraph from "./pages/tools/tech/attack-graph/AttackGraph"

// Routes where the top Navbar should be hidden
// (tech side has its own sidebar navigation)
const HIDE_NAVBAR_ROUTES = ["/technical-user", "/regular-user", "/tools"]

function AppContent() {
  const location = useLocation()
  const hideNavbar = HIDE_NAVBAR_ROUTES.some(route =>
    location.pathname.startsWith(route)
  )

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/regular-user" element={<RegularUser />} />
        <Route path="/technical-user" element={<TechnicalUser />} />

        {/* Regular user tools */}
        <Route path="/tools/password-analyzer" element={<PasswordAnalyzer />} />
        <Route path="/tools/phishing-awareness" element={<PhishingAwareness />} />
        <Route path="/tools/data-breach" element={<DataBreach />} />
        <Route path="/tools/spam-detection" element={<SpamDetector />} />
        <Route path="/tools/quiz" element={<Quiz />} />
        <Route path="/tools/fake-website-detector" element={<FakeWebsiteDetector />} />
        
         {/* technical user tools */}
        <Route path="/technical-user/vulnerability-analyzer" element={<VulnerabilityAnalyzer />} />
        <Route path="/technical-user/attack-graph" element={<AttackGraph />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}