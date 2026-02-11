import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import RegularUser from "./pages/RegularUser"
import TechnicalUser from "./pages/TechnicalUser"

// Regular User Tools
import UrlChecker from "./pages/tools/UrlChecker"
import PasswordAnalyzer from "./pages/tools/PasswordAnalyzer"
import PhishingAwareness from "./pages/tools/PhishingAwareness"
import DataBreach from "./pages/tools/DataBreach"
import FakeWebsite from "./pages/tools/FakeWebsite"
import CyberQuiz from "./pages/tools/CyberQuiz"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regular-user" element={<RegularUser />} />
        <Route path="/technical-user" element={<TechnicalUser />} />

        {/* Regular user tools */}
        <Route path="/tools/url-checker" element={<UrlChecker />} />
        <Route path="/tools/password-analyzer" element={<PasswordAnalyzer />} />
        <Route path="/tools/phishing-awareness" element={<PhishingAwareness />} />
        <Route path="/tools/data-breach" element={<DataBreach />} />
        <Route path="/tools/fake-website" element={<FakeWebsite />} />
        <Route path="/tools/cyber-quiz" element={<CyberQuiz />} />
      </Routes>
    </BrowserRouter>
  )
}
