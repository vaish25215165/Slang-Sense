import { NextRequest, NextResponse } from "next/server"

import { buildSlangContext, detectSlang } from "@/lib/slang-detection"
import { defaultOpenAIModel, fallbackOpenAIModels, openai } from "@/lib/openai"

async function explainSlang(phrase: string, originalText?: string) {
  const detected = detectSlang(`${phrase} ${originalText || ""}`.trim())
  const slangContext = buildSlangContext(detected)
  const modelCandidates = [defaultOpenAIModel, ...fallbackOpenAIModels].filter(
    (model, index, list) => Boolean(model) && list.indexOf(model) === index,
  )

  let lastError: unknown

  for (const model of modelCandidates) {
    try {
      const response = await openai.responses.create({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You explain slang phrases clearly and naturally. Give a plain-English meaning, when people use it, and a short example. Keep it concise but helpful.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Explain this slang phrase in a helpful way.

Phrase: "${phrase}"
Original user text: "${originalText || phrase}"

Detected slang context:
${slangContext}

Instructions:
- Explain the whole phrase, not just one word.
- If it is used metaphorically, say what it really means in conversation.
- Include a short example sentence.
- Keep it under 70 words.`,
              },
            ],
          },
        ],
      })

      return response.output_text?.trim() || "I couldn't explain this slang right now."
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

export async function POST(req: NextRequest) {
  try {
    const { phrase, originalText } = await req.json()

    if (!phrase || typeof phrase !== "string") {
      return NextResponse.json({ error: "Missing phrase" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 })
    }

    const explanation = await explainSlang(phrase, typeof originalText === "string" ? originalText : undefined)

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error("Explain slang error:", error)
    return NextResponse.json({ error: "Failed to explain slang" }, { status: 500 })
  }
}
