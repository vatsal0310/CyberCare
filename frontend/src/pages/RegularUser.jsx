import ToolCard from "../components/ToolCard"
import {
  Search,
  Lock,
  AlertTriangle,
  Database,
  Shield,
  Brain
} from "lucide-react"

export default function RegularUser() {
  return (
    <div className="px-10 py-20 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Stay Safe Online</h1>
        <p className="text-muted max-w-2xl mx-auto">
          Easy-to-use tools and educational resources to help protect you from online threats.
          No technical knowledge required.
        </p>
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ToolCard
          icon={<Lock />}
          title="Password Strength Analyzer"
          description="Test how strong your password is"
          link="/tools/password-analyzer"
        />

        <ToolCard
          icon={<Brain />}
          title="Email Spam Detector"
          description="Spam Detection"
          link="/tools/spam-detection"
        />

        <ToolCard
          icon={<Database />}
          title="Data Breach Checker"
          description="See if your data was exposed"
          link="/tools/data-breach"
        />

        <ToolCard
          icon={<AlertTriangle />}
          title="Scam & Phishing Awareness"
          description="Learn to recognize online threats"
          link="/tools/phishing-awareness"
        />

        <ToolCard
          icon={<Shield />}
          title="Fake Website Detector"
          description="Verify website legitimacy"
          link="/tools/fake-website"
        />
      </div>
    </div>
  )
}
