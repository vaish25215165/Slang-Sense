import { Github, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Image
                src="/images/logo.png"
                alt="Slang Sense Logo"
                fill
              />
            </div>
            <span className="footer-brand-name">Slang Sense</span>
          </div>
          
          <p className="footer-description">
            Slang Sense is an AI-based slang decoding tool that uses Natural Language Processing to analyze modern internet language.
          </p>
          
          <div className="footer-social">
            <Link href="#" className="footer-social-link">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="footer-social-link">
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Slang Sense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
