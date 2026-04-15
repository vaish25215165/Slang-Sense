"use client"

import { useState } from "react"
import { Search, BookOpen } from "lucide-react"

import { getToneEmoji, type SlangEntry } from "@/lib/slang-data"

interface LibraryClientProps {
  entries: SlangEntry[]
}

export function LibraryClient({ entries }: LibraryClientProps) {
  const [search, setSearch] = useState("")
  const [selectedTone, setSelectedTone] = useState<string | null>(null)

  const filteredSlang = entries.filter((entry) => {
    const matchesSearch =
      entry.word.toLowerCase().includes(search.toLowerCase()) ||
      entry.meaning.toLowerCase().includes(search.toLowerCase())
    const matchesTone = !selectedTone || entry.tone === selectedTone
    return matchesSearch && matchesTone
  })

  const tones: Array<{ value: SlangEntry["tone"] | null; label: string }> = [
    { value: null, label: "All" },
    { value: "positive", label: "Positive" },
    { value: "neutral", label: "Neutral" },
    { value: "negative", label: "Negative" },
    { value: "sarcastic", label: "Sarcastic" },
  ]

  return (
    <>
      <div className="library-header">
        <div className="library-badge">
          <BookOpen size={16} />
          Slang Library
        </div>
        <h1 className="library-title">Browse All Slang</h1>
        <p className="library-description">
          Explore our comprehensive collection of Gen-Z and Gen-Alpha slang terms.
        </p>
      </div>

      <div className="library-controls">
        <div className="library-search">
          <Search size={16} className="library-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slang..."
            className="library-search-input"
          />
        </div>

        <div className="library-filters">
          {tones.map((tone) => (
            <button
              key={tone.label}
              onClick={() => setSelectedTone(tone.value)}
              className={`library-filter-btn ${selectedTone === tone.value ? "active" : ""}`}
            >
              {tone.value && <span style={{ marginRight: "0.25rem" }}>{getToneEmoji(tone.value)}</span>}
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      <p className="library-count">
        Showing {filteredSlang.length} of {entries.length} slang terms
      </p>

      <div className="library-grid">
        {filteredSlang.map((entry, index) => (
          <div
            key={`${entry.word}-${entry.example}-${entry.generation}`}
            className="library-card"
            style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
          >
            <div className="library-card-header">
              <h3 className="library-card-word">{entry.word}</h3>
              <div className="library-card-meta">
                <span className="library-card-emoji">{getToneEmoji(entry.tone)}</span>
                <span className="library-card-generation">{entry.generation}</span>
              </div>
            </div>

            <p className="library-card-meaning">{entry.meaning}</p>
            <p className="library-card-example">"{entry.example}"</p>
          </div>
        ))}
      </div>

      {filteredSlang.length === 0 && (
        <div className="library-empty">
          <p>No slang terms found matching your search.</p>
        </div>
      )}
    </>
  )
}
