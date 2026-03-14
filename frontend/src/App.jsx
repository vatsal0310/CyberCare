import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import RegularUser from "./pages/RegularUser"
import TechnicalUser from "./pages/TechnicalUser"

// Regular User Tools
import PasswordAnalyzer from "./pages/tools/regular/PasswordAnalyzer"
import PhishingAwareness from "./pages/tools/regular/PhishingAwareness.jsx"
import DataBreach from "./pages/tools/regular/DataBreach"
import Quiz from "./pages/tools/regular/Quiz.jsx"
import FakeWebsiteDetector from "./pages/tools/regular/FakeWebsiteDetector";

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
        <Route path="/tools/spam-detection" element={<SpamDetector />} />
        <Route path="/tools/quiz" element={<Quiz />} />
        <Route path="/tools/fake-website-detector" element={<FakeWebsiteDetector />} />
        
        {/* Technical Tools */}
        <Route path="/tools/penetration-testing" element={<PenetrationTesting />} />
        
      </Routes>
    </BrowserRouter>
  )
}
