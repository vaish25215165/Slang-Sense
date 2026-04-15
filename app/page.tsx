import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SlangAnalyzer } from "@/components/slang-analyzer"
import { SlangOfTheDay } from "@/components/slang-of-the-day"
import { TrendingSlang } from "@/components/trending-slang"
import { Sparkles, Zap, Brain } from "lucide-react"

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg">
            <div className="hero-bg-circle-1" />
            <div className="hero-bg-circle-2" />
          </div>
          
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              AI-Powered Slang Decoder
            </div>
            
            <h1 className="hero-title">
              Decode the Internet&apos;s <span className="hero-title-accent">Slang</span>
            </h1>
            
            <p className="hero-description">
              Understand Gen-Z & Gen-Alpha language instantly using AI. Enter any slang word or sentence and get instant meanings, tones, and examples.
            </p>

            <SlangAnalyzer />
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Brain size={24} />
                </div>
                <h3 className="feature-title">NLP Analysis</h3>
                <p className="feature-description">
                  Advanced Natural Language Processing to detect and analyze slang in any text.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Zap size={24} />
                </div>
                <h3 className="feature-title">Instant Results</h3>
                <p className="feature-description">
                  Get meanings, tones, and examples in seconds with our AI-powered engine.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Sparkles size={24} />
                </div>
                <h3 className="feature-title">Always Updated</h3>
                <p className="feature-description">
                  Our database is constantly updated with the latest internet slang and trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Slang of the Day & Trending */}
        <section className="content-section">
          <div className="content-container">
            <div className="slang-section-wrapper">
              <SlangOfTheDay />
            </div>
            <TrendingSlang />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
