import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import RegularUser from "./pages/RegularUser"
import TechnicalUser from "./pages/TechnicalUser"

// Regular User Tools
import PasswordAnalyzer from "./pages/tools/regular/PasswordAnalyzer"
import PhishingAwareness from "./pages/tools/regular/PhishingAwareness.jsx"
import DataBreach from "./pages/tools/regular/DataBreach"
import FakeWebsite from "./pages/tools/regular/FakeWebsite.jsx"

// Technical Tools
import PenetrationTesting from "./pages/tools/technical/penetrationtesting.jsx"
import SpamDetector from "./pages/tools/regular/EmailSpamDetector.jsx"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regular-user" element={<RegularUser />} />
        <Route path="/technical-user" element={<TechnicalUser />} />

        {/* Regular user tools */}
        <Route path="/tools/password-analyzer" element={<PasswordAnalyzer />} />
        <Route path="/tools/phishing-awareness" element={<PhishingAwareness />} />
        <Route path="/tools/data-breach" element={<DataBreach />} />
        <Route path="/tools/fake-website" element={<FakeWebsite />} />
        <Route path="/tools/spam-detection" element={<SpamDetector />} />
        
        {/* Technical Tools */}
        <Route path="/tools/penetration-testing" element={<PenetrationTesting />} />
        
      </Routes>
    </BrowserRouter>
  )
}
