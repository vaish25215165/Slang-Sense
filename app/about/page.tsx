import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Target, Lightbulb, Code2, Users, Brain, MessageSquare, Sparkles, TrendingUp } from "lucide-react"

const objectives = [
  { icon: Brain, text: "Detect slang words using Natural Language Processing" },
  { icon: MessageSquare, text: "Provide clear meanings and examples" },
  { icon: Sparkles, text: "Analyze tone and context of slang" },
  { icon: TrendingUp, text: "Improve communication between generations" },
]

const technologies = [
  { name: "React", description: "Frontend framework for building user interfaces" },
  { name: "Next.js", description: "React framework for production applications" },
  { name: "Natural Language Processing", description: "AI-powered text analysis" },
  { name: "Slang Dataset", description: "Comprehensive Gen-Z/Alpha slang database" },
]

const teamMembers = [
  { name: "vaishnavee", role: "Frontend and Overall" },
  { name: "ayleen", role: "Backend" },
  { name: "kashish", role: "Backend" },
  { name: "tanya", role: "NLP" },
]

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content content-section">
        <div className="about-container">
          {/* Header */}
          <div className="about-header">
            <div className="about-badge">
              <Target size={16} />
              About Us
            </div>
            <h1 className="about-title">About Slang Sense</h1>
            <p className="about-subtitle">
              Bridging the generational communication gap with AI
            </p>
          </div>

          {/* Aim Section */}
          <section className="about-section">
            <div className="about-section-card">
              <div className="about-section-header">
                <div className="about-section-icon">
                  <Target size={24} />
                </div>
                <h2 className="about-section-title">Aim of the Project</h2>
              </div>
              <p className="about-section-text">
                The goal of Slang Sense is to help people understand modern internet slang using AI. 
                As language evolves rapidly on social media and online platforms, communication between 
                different generations can become challenging. Our AI-powered tool bridges this gap by 
                providing instant, accurate interpretations of Gen-Z and Gen-Alpha slang terms, making 
                digital communication more accessible to everyone.
              </p>
            </div>
          </section>

          {/* Objectives Section */}
          <section className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon">
                <Lightbulb size={24} />
              </div>
              <h2 className="about-section-title">Objectives</h2>
            </div>
            <div className="about-grid">
              {objectives.map((objective, index) => (
                <div key={index} className="about-objective-card">
                  <div className="about-objective-icon">
                    <objective.icon size={20} />
                  </div>
                  <p className="about-objective-text">{objective.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technology Section */}
          <section className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon">
                <Code2 size={24} />
              </div>
              <h2 className="about-section-title">Technology Used</h2>
            </div>
            <div className="about-grid">
              {technologies.map((tech, index) => (
                <div key={index} className="about-tech-card">
                  <h3 className="about-tech-name">{tech.name}</h3>
                  <p className="about-tech-description">{tech.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon">
                <Users size={24} />
              </div>
              <h2 className="about-section-title">Team</h2>
            </div>
            <div className="about-team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="about-team-card">
                  <div className="about-team-avatar">
                    <Users size={32} />
                  </div>
                  <h3 className="about-team-name">{member.name}</h3>
                  <p className="about-team-role">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
