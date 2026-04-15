import { NextRequest, NextResponse } from "next/server"
import type { SlangEntry } from "@/lib/slang-data"
import { detectSlang, getDatabaseStats } from "@/lib/slang-detection"
import { defaultOpenAIModel, fallbackOpenAIModels, openai } from "@/lib/openai"

const { dbSize, sample, tones, generations } = getDatabaseStats()

async function detectWithAI(text: string, alreadyFound: SlangEntry[]): Promise<SlangEntry[]> {
  const knownWords = alreadyFound.map((e) => e.word.toLowerCase())

  const prompt = `You are a slang analysis expert. Analyze this text and find any slang words or phrases NOT in this already-found list: ${JSON.stringify(knownWords)}.

Text to analyze: "${text}"

For each NEW slang word/phrase found, return a JSON array. Each item must have:
- word: the slang word/phrase
- meaning: clear explanation (1-2 sentences)
- tone: exactly one of "positive", "neutral", "negative", "sarcastic"  
- example: a usage example sentence
- generation: exactly one of "Gen-Z", "Gen-Alpha", "Millennial"

Return ONLY a JSON array, no other text. If no new slang found, return [].`

  try {
    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return []
    }

    const modelCandidates = [defaultOpenAIModel, ...fallbackOpenAIModels].filter(
      (model, index, list) => Boolean(model) && list.indexOf(model) === index,
    )

    for (const model of modelCandidates) {
      try {
        const response = await openai.responses.create({
          model,
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: "You extract modern internet slang and respond with valid JSON only." }],
            },
            {
              role: "user",
              content: [{ type: "input_text", text: prompt }],
            },
          ],
        })

        const clean = (response.output_text || "[]").replace(/```json|```/g, "").trim()
        const parsed = JSON.parse(clean)

        return parsed
          .filter(
            (item: Partial<SlangEntry>) =>
              item.word &&
              item.meaning &&
              ["positive", "neutral", "negative", "sarcastic"].includes(item.tone || "") &&
              item.example &&
              ["Gen-Z", "Gen-Alpha", "Millennial"].includes(item.generation || ""),
          )
          .map((item: SlangEntry) => ({ ...item, source: "ai" as const }))
      } catch {
        continue
      }
    }

    return []
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 })
    }

    // Step 1: Check the CSV dataset
    const fromDB = detectSlang(text)

    // Step 2: Ask OpenAI for anything not in the database
    const fromAI = await detectWithAI(text, fromDB)

    const results = [...fromDB, ...fromAI]

    return NextResponse.json({ results, dbSize })
  } catch (err) {
    console.error("Analyze error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint: return database stats and sample entries
export async function GET() {
  return NextResponse.json({
    dbSize,
    sample,
    tones,
    generations,
  })
}
