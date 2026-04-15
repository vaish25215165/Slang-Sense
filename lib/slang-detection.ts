import "server-only"

import type { SlangEntry } from "@/lib/slang-data"
import { loadCSVDatabase } from "@/lib/slang-csv"

const csvDatabase = loadCSVDatabase()

export function detectSlang(text: string): SlangEntry[] {
  const lower = text.toLowerCase()
  const found: SlangEntry[] = []
  const sorted = [...csvDatabase].sort((a, b) => b.word.length - a.word.length)

  for (const entry of sorted) {
    const wordLower = entry.word.toLowerCase()
    const regex = new RegExp(`(?<![a-z])${wordLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z])`, "i")

    if (regex.test(lower) && !found.find((existing) => existing.word === entry.word)) {
      found.push(entry)
    }
  }

  return found
}

export function getDatabaseStats() {
  return {
    dbSize: csvDatabase.length,
    sample: csvDatabase.slice(0, 6),
    tones: ["positive", "neutral", "negative", "sarcastic"] as const,
    generations: ["Gen-Z", "Gen-Alpha", "Millennial"] as const,
  }
}

export function buildSlangContext(entries: SlangEntry[]): string {
  if (entries.length === 0) {
    return "No slang terms were detected in the user message."
  }

  return entries
    .map(
      (entry) =>
        `- ${entry.word}: ${entry.meaning} Tone: ${entry.tone}. Example: ${entry.example}`,
    )
    .join("\n")
}
