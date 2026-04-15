import "server-only"

import { readFileSync } from "fs"
import { join } from "path"

import type { SlangEntry } from "@/lib/slang-data"

let cachedDatabase: SlangEntry[] | null = null

export function loadCSVDatabase(): SlangEntry[] {
  if (cachedDatabase) {
    return cachedDatabase
  }

  try {
    const csvPath = join(process.cwd(), "data", "urbandict-word-defs.csv")
    const content = readFileSync(csvPath, "utf-8")
    const lines = content.trim().split("\n")
    const entries: SlangEntry[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const cols = parseCSVLine(line)
      if (cols.length < 5) continue

      const tone = cols[2].trim() as SlangEntry["tone"]
      const generation = cols[4].trim() as SlangEntry["generation"]

      entries.push({
        word: cols[0].trim(),
        meaning: cols[1].trim(),
        tone: ["positive", "neutral", "negative", "sarcastic"].includes(tone) ? tone : "neutral",
        example: cols[3].trim(),
        generation: ["Gen-Z", "Gen-Alpha", "Millennial"].includes(generation) ? generation : "Gen-Z",
        source: "database",
      })
    }

    cachedDatabase = entries
    return entries
  } catch {
    cachedDatabase = []
    return cachedDatabase
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]

    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += ch
    }
  }

  result.push(current)
  return result
}
