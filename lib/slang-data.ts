export interface SlangEntry {
  word: string
  meaning: string
  tone: "positive" | "neutral" | "negative" | "sarcastic"
  example: string
  generation: "Gen-Z" | "Gen-Alpha" | "Millennial"
  source?: "database" | "ai"
}

export const trendingSlang = ["rizz", "delulu", "aura", "ate", "cooked", "goated"]

export function getToneEmoji(tone: SlangEntry["tone"]): string {
  switch (tone) {
    case "positive":
      return ":)"
    case "neutral":
      return ":|"
    case "negative":
      return "!"
    case "sarcastic":
      return ";)"
  }
}
