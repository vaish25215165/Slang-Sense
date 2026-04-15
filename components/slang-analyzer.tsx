"use client"

import { useState } from "react"
import { Search, Sparkles, Loader2, Database, Bot } from "lucide-react"
import { SlangResultCard } from "./slang-result-card"
import { trendingSlang, type SlangEntry } from "@/lib/slang-data"

const movingSlang = [
  ...trendingSlang,
  "let him cook",
  "left no crumbs",
  "main character energy",
  "aura farming",
  "say less",
  "iykyk",
  "touch grass",
  "gen z stare",
  "no cap",
  "locked in",
  "glazing",
]

export function SlangAnalyzer() {
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<SlangEntry[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [dbSize, setDbSize] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [explainingWord, setExplainingWord] = useState<string | null>(null)
  const [aiExplanation, setAiExplanation] = useState<{ word: string; text: string } | null>(null)
  const [explanationError, setExplanationError] = useState<string | null>(null)

  const analyzeSlang = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)
    setHasSearched(true)
    setError(null)
    setAiExplanation(null)
    setExplanationError(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      })

      if (!res.ok) throw new Error("Analysis failed")

      const data = await res.json()
      setResults(data.results || [])
      setDbSize(data.dbSize || null)
    } catch {
      setError("Analysis failed. Please try again.")
      setResults([])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleChipClick = (chip: string) => {
    setInput(chip)
  }

  const resetAnalyzer = () => {
    setResults([])
    setHasSearched(false)
    setError(null)
    setAiExplanation(null)
    setExplanationError(null)
    setExplainingWord(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return

    if (!input.trim()) {
      resetAnalyzer()
      return
    }

    analyzeSlang()
  }

  const explainWithAI = async (entry: SlangEntry) => {
    setExplainingWord(entry.word)
    setExplanationError(null)

    try {
      const res = await fetch("/api/explain-slang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: entry.word,
          originalText: input.trim() || entry.example,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Could not explain slang")
      }

      setAiExplanation({
        word: entry.word,
        text: data.explanation || "I couldn't explain this slang right now.",
      })
    } catch (err) {
      setExplanationError(err instanceof Error ? err.message : "Could not explain slang.")
      setAiExplanation(null)
    } finally {
      setExplainingWord(null)
    }
  }

  const dbResults = results.filter((r) => r.source !== "ai")
  const aiResults = results.filter((r) => r.source === "ai")

  return (
    <div className="analyzer-wrapper">
      {/* DB Badge */}
      {dbSize !== null && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.75rem", color: "var(--muted-foreground)",
            background: "color-mix(in srgb, var(--muted) 60%, transparent)",
            padding: "0.25rem 0.75rem", borderRadius: "9999px", border: "1px solid var(--border)"
          }}>
            <Database size={12} />
            Urban Dictionary dataset loaded — {dbSize} entries
          </span>
        </div>
      )}

      {/* Search Input */}
      <div className="analyzer-input-wrapper">
        <div className="analyzer-input-container">
          <Search size={20} className="analyzer-input-icon" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter slang word or sentence..."
            className="analyzer-input"
          />
        </div>

        <button
          onClick={analyzeSlang}
          disabled={!input.trim() || isAnalyzing}
          className="analyzer-btn"
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analyze Slang
            </>
          )}
        </button>
      </div>

      <div className="slang-ticker" aria-label="Trending slang ticker">
        <div className="slang-ticker-fade slang-ticker-fade-left" />
        <div className="slang-ticker-fade slang-ticker-fade-right" />
        <div className="slang-ticker-track">
          {[...movingSlang, ...movingSlang].map((chip, index) => (
            <button
              key={`${chip}-${index}`}
              onClick={() => handleChipClick(chip)}
              className="slang-ticker-item"
              type="button"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Example Chips */}
      <div className="example-chips">
        {movingSlang.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChipClick(chip)}
            className="example-chip"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isAnalyzing && (
        <div className="analyzer-loading">
          <div className="analyzer-spinner">
            <div className="analyzer-spinner-track" />
            <div className="analyzer-spinner-fill" />
          </div>
          <p className="analyzer-loading-text">Checking dataset + AI for slang...</p>
        </div>
      )}

      {/* Error */}
      {!isAnalyzing && error && (
        <div className="results-empty" style={{ color: "var(--destructive)" }}>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {!isAnalyzing && hasSearched && !error && (
        <div className="analyzer-results">
          <div className="results-header">
            <Sparkles size={20} />
            <h2 className="results-title">
              AI Slang Analysis
              {results.length > 0 && (
                <span style={{ fontSize: "0.8rem", fontWeight: 400, marginLeft: "0.5rem", color: "var(--muted-foreground)" }}>
                  ({results.length} found)
                </span>
              )}
            </h2>
          </div>

          {results.length > 0 ? (
            <>
              {/* Database results */}
              {dbResults.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <p style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    fontSize: "0.75rem", color: "var(--muted-foreground)",
                    marginBottom: "0.75rem"
                  }}>
                    <Database size={12} /> From Urban Dictionary dataset
                  </p>
                  <div className="results-grid">
                    {dbResults.map((result, i) => (
                      <SlangResultCard
                        key={result.word}
                        entry={result}
                        delay={i * 100}
                        onExplain={explainWithAI}
                        isExplaining={explainingWord === result.word}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* AI results */}
              {aiResults.length > 0 && (
                <div>
                  <p style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    fontSize: "0.75rem", color: "var(--muted-foreground)",
                    marginBottom: "0.75rem"
                  }}>
                    <Bot size={12} /> Identified by Groq AI
                  </p>
                  <div className="results-grid">
                    {aiResults.map((result, i) => (
                      <SlangResultCard
                        key={result.word}
                        entry={result}
                        delay={(dbResults.length + i) * 100}
                        onExplain={explainWithAI}
                        isExplaining={explainingWord === result.word}
                      />
                    ))}
                  </div>
                </div>
              )}

              {(aiExplanation || explanationError) && (
                <div className="analyzer-ai-explanation">
                  <div className="results-header">
                    <Sparkles size={18} />
                    <h3 className="results-title" style={{ fontSize: "1rem" }}>
                      AI Meaning
                      {aiExplanation && (
                        <span style={{ fontSize: "0.8rem", fontWeight: 400, marginLeft: "0.5rem", color: "var(--muted-foreground)" }}>
                          ({aiExplanation.word})
                        </span>
                      )}
                    </h3>
                  </div>

                  {aiExplanation && <p className="analyzer-ai-explanation-text">{aiExplanation.text}</p>}
                  {explanationError && <p className="analyzer-ai-explanation-error">{explanationError}</p>}
                </div>
              )}
            </>
          ) : (
            <div className="results-empty">
              <p>No slang words detected in your input. Try entering some Gen-Z slang!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
