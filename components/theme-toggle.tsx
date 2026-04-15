"use client"

import { Moon, Sun, Heart } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const themes = [
  { id: "dark", label: "Black", icon: Moon },
  { id: "light", label: "White", icon: Sun },
  { id: "pink", label: "Pink", icon: Heart },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="theme-toggle">
        {themes.map((t) => (
          <div key={t.id} style={{ width: 32, height: 32, borderRadius: "50%" }} />
        ))}
      </div>
    )
  }

  return (
    <div className="theme-toggle">
      {themes.map((t) => {
        const Icon = t.icon
        const isActive = theme === t.id
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`theme-toggle-btn ${isActive ? "active" : ""}`}
            aria-label={`Switch to ${t.label} theme`}
          >
            <Icon size={16} />
          </button>
        )
      })}
    </div>
  )
}
