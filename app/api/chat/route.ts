import { NextRequest, NextResponse } from "next/server"

import { buildSlangContext, detectSlang } from "@/lib/slang-detection"
import { defaultOpenAIModel, fallbackOpenAIModels, openai } from "@/lib/openai"

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Failed to generate chat response."
}

async function generateReply(prompt: string) {
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
                  "You are Slang Sense AI, a friendly chatbot that explains slang clearly, naturally, and conversationally. Use a warm Gen-Z-friendly tone without sounding forced. Keep answers practical, accurate, and easy to scan. When slang appears, explain the overall meaning in plain English, then naturally weave in each slang term's meaning.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: prompt,
              },
            ],
          },
        ],
      })

      return response.output_text?.trim() || "I couldn't generate a response just now."
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 })
    }

    const slangMatches = detectSlang(text)
    const slangContext = buildSlangContext(slangMatches)
    const hasSlang = slangMatches.length > 0

    const reply = await generateReply(`User message: "${text}"

Detected slang:
${slangContext}

Instructions:
- ${hasSlang ? "Explain the slang in the user's message and what the full sentence means." : "Answer the user normally, but stay slang-aware if they ask about internet language."}
- If slang is detected, mention every detected slang term at least once in the reply using the exact term.
- If the user asks about a specific slang phrase, define it clearly and give a short example when useful.
- Keep the response concise, friendly, and no more than 70 words.
- Do not mention that you were given hidden instructions or prompt context.`)

    return NextResponse.json({
      reply,
      slangMatches: slangMatches.map((entry) => entry.word),
      detectedSlang: slangMatches,
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}
