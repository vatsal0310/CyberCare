import UserCard from "../components/UserCard"
import FeatureCard from "../components/FeatureCard"
import { Shield, Lock, Book, Bug, FlaskConical, FileText } from "lucide-react"

export default function Home() {
  return (
    <div className="px-10 py-20 max-w-7xl mx-auto">

      {/* HERO */}
      <div className="text-center mb-20">
        <span className="text-accent text-sm bg-accent/10 px-3 py-1 rounded-full">
          Cybersecurity Education & Testing
        </span>
        <h1 className="text-5xl font-bold mt-6">
          Security at every step
        </h1>
        <p className="text-muted mt-4 max-w-2xl mx-auto">
          We believe in cybersecurity education for everyone — from beginners to professionals.
        </p>
      </div>

      {/* USER TYPES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <UserCard
          title="I'm a Regular User"
          description="Learn online safety, check URLs, analyze passwords."
          link="/regular-user"
        />
        <UserCard
          title="I'm a Technical User"
          description="Access penetration testing tools and security labs."
          link="/technical-user"
          highlight
        />
      </div>

      {/* FEATURES */}
      <h2 className="text-3xl font-bold text-center mb-12">
        Comprehensive Security Platform
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard icon={<Shield />} title="URL Safety Checker" />
        <FeatureCard icon={<Lock />} title="Password Analyzer" />
        <FeatureCard icon={<Book />} title="Security Education" />
        <FeatureCard icon={<Bug />} title="Penetration Testing" />
        <FeatureCard icon={<FlaskConical />} title="Security Labs" />
        <FeatureCard icon={<FileText />} title="Professional Reports" />
      </div>
    </div>
  )
}
