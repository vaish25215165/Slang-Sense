"use client"

import { type SlangEntry, getToneEmoji } from "@/lib/slang-data"
import { Database, Bot, Sparkles } from "lucide-react"

interface SlangResultCardProps {
  entry: SlangEntry
  delay?: number
  onExplain?: (entry: SlangEntry) => void
  isExplaining?: boolean
}

export function SlangResultCard({ entry, delay = 0, onExplain, isExplaining = false }: SlangResultCardProps) {
  const toneClass = `tone-${entry.tone}`

  return (
    <div
      className="result-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="result-card-header">
        <h3 className="result-card-word">{entry.word}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {entry.source && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.65rem", padding: "0.15rem 0.4rem",
              borderRadius: "9999px", border: "1px solid var(--border)",
              color: "var(--muted-foreground)",
              background: entry.source === "ai"
                ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                : "color-mix(in srgb, var(--muted) 60%, transparent)"
            }}>
              {entry.source === "ai" ? <Bot size={10} /> : <Database size={10} />}
              {entry.source === "ai" ? "AI" : "DB"}
            </span>
          )}
          <span className="result-card-generation">{entry.generation}</span>
        </div>
      </div>

      <div className="result-card-body">
        <div>
          <p className="result-card-label">Meaning</p>
          <p className="result-card-text">{entry.meaning}</p>
        </div>

        <div>
          <p className="result-card-label">Tone</p>
          <div className="result-card-tone">
            <span className="result-card-tone-emoji">{getToneEmoji(entry.tone)}</span>
            <span className={`result-card-tone-text ${toneClass}`}>
              {entry.tone}
            </span>
          </div>
        </div>

        <div>
          <p className="result-card-label">Example</p>
          <p className="result-card-example">"{entry.example}"</p>
        </div>

        {onExplain && (
          <button
            type="button"
            className="result-card-ai-btn"
            onClick={() => onExplain(entry)}
            disabled={isExplaining}
          >
            <Sparkles size={14} />
            {isExplaining ? "Explaining..." : "Ask AI for full meaning"}
          </button>
        )}
      </div>
    </div>
  )
}
