import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import RegularUser from "./pages/RegularUser"
import TechnicalUser from "./pages/TechnicalUser"
import LoginPage from "./pages/LoginPage.jsx"
import ConsentForm from "./pages/ConsentForm.jsx"
import ProtectedTechRoute from "./components/ProtectedTechRoute.jsx"

// Regular User Tools
import PasswordAnalyzer from "./pages/tools/regular/PasswordAnalyzer"
import PhishingAwareness from "./pages/tools/regular/PhishingAwareness.jsx"
import DataBreach from "./pages/tools/regular/DataBreach"
import Quiz from "./pages/tools/regular/Quiz.jsx"
import FakeWebsiteDetector from "./pages/tools/regular/FakeWebsiteDetector"
import SpamDetector from "./pages/tools/regular/EmailSpamDetector.jsx"

// Tech user tools
import VulnerabilityAnalyzer from "./pages/tools/tech/VulnerabilityAnalyzer"
import AttackGraph from "./pages/tools/tech/attack-graph/AttackGraph"
import SocLab from "./pages/tools/tech/soc-lab/SocLab";
import SqliLab from "./pages/tools/tech/security-labs/SqliLab";
import SecurityLabsDashboard from "./pages/tools/tech/security-labs/SecurityLabsDashboard";
import LabDashboard   from "./pages/tools/tech/password-lab/LabDashboard";
import LabPage        from "./pages/tools/tech/password-lab/LabPage";
import LabResult      from "./pages/tools/tech/password-lab/LabResult";
import LabLeaderboard from "./pages/tools/tech/password-lab/LabLeaderboard";
import LabAnalytics   from "./pages/tools/tech/password-lab/LabAnalytics";

// ── Guided Workflow ───────────────────────────────────────────────────────────
import MissionComplete from "./pages/tools/tech/guided-workflow/MissionComplete"
import WorkflowDashboard from "./pages/tools/tech/guided-workflow/WorkflowDashboard"
import PentestLearnPage from "./pages/tools/tech/guided-workflow/PentestLearnPage"
import WebSecLearnPage from "./pages/tools/tech/guided-workflow/WebSecLearnPage"
import RoadmapView from "./pages/tools/tech/guided-workflow/RoadmapView.jsx"

// Routes where the top Navbar should be hidden
const HIDE_NAVBAR_ROUTES = ["/technical-user", "/regular-user", "/tools", "/consent"]

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

        {/* ── Consent gate ── */}
        <Route path="/consent" element={<ConsentForm />} />

        {/* ── Protected technical-user routes ── */}
        <Route
          path="/technical-user"
          element={
            <ProtectedTechRoute>
              <TechnicalUser />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/vulnerability-analyzer"
          element={
            <ProtectedTechRoute>
              <VulnerabilityAnalyzer />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/attack-graph"
          element={
            <ProtectedTechRoute>
              <AttackGraph />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/soc-lab"
          element={
            <ProtectedTechRoute>
              <SocLab />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/security-labs"
          element={
            <ProtectedTechRoute>
              <SecurityLabsDashboard />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/sqli-lab"
          element={
            <ProtectedTechRoute>
              <SqliLab />
            </ProtectedTechRoute>
          }
        />

        <Route path="/technical-user/password-lab" element={
            <ProtectedTechRoute><LabDashboard /></ProtectedTechRoute>
          } />
          <Route path="/technical-user/password-lab/lab" element={
            <ProtectedTechRoute><LabPage /></ProtectedTechRoute>
          } />
          <Route path="/technical-user/password-lab/result" element={
            <ProtectedTechRoute><LabResult /></ProtectedTechRoute>
          } />
          <Route path="/technical-user/password-lab/leaderboard" element={
            <ProtectedTechRoute><LabLeaderboard /></ProtectedTechRoute>
          } />
          <Route path="/technical-user/password-lab/analytics" element={
            <ProtectedTechRoute><LabAnalytics /></ProtectedTechRoute>
          } />

        {/* ── Guided Workflow routes ── */}
        <Route
          path="/technical-user/guided-workflow"
          element={
            <ProtectedTechRoute>
              <WorkflowDashboard />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/guided-workflow/pentest/module/:moduleId"
          element={
            <ProtectedTechRoute>
              <PentestLearnPage />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/guided-workflow/websec/module/:moduleId"
          element={
            <ProtectedTechRoute>
              <WebSecLearnPage />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/guided-workflow/pentest/roadmap"
          element={
            <ProtectedTechRoute>
              <RoadmapView />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/guided-workflow/websec/roadmap"
          element={
            <ProtectedTechRoute>
              <RoadmapView />
            </ProtectedTechRoute>
          }
        />
        <Route
          path="/technical-user/guided-workflow/mission-complete"
          element={
            <ProtectedTechRoute>
              <MissionComplete />
            </ProtectedTechRoute>
          }
        />

        {/* Regular user tools */}
        <Route path="/tools/password-analyzer" element={<PasswordAnalyzer />} />
        <Route path="/tools/phishing-awareness" element={<PhishingAwareness />} />
        <Route path="/tools/data-breach" element={<DataBreach />} />
        <Route path="/tools/spam-detection" element={<SpamDetector />} />
        <Route path="/tools/quiz" element={<Quiz />} />
        <Route path="/tools/fake-website-detector" element={<FakeWebsiteDetector />} />
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
