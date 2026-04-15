import "server-only"

import OpenAI from "openai"

export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
})

export const defaultOpenAIModel =
  process.env.GROQ_MODEL || process.env.OPENAI_CHAT_MODEL || "llama-3.3-70b-versatile"

export const fallbackOpenAIModels = [
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
]
