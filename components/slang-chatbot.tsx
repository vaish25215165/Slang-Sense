"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, Maximize2, MessageCircle, Minimize2, Send, Sparkles, X } from "lucide-react"

import type { SlangEntry } from "@/lib/slang-data"

const quickSuggestions = ["Explain rizz", "What is no cap?", "Analyze this sentence"]

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  highlights?: string[]
  detectedSlang?: SlangEntry[]
}

export function SlangChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey, I'm Slang Sense AI. Ask me about slang, paste a sentence, or use one of the quick prompts below.",
    },
  ])
  const [isWaiting, setIsWaiting] = useState(false)
  const [isAnimatingReply, setIsAnimatingReply] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typedMessageId, setTypedMessageId] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isWaiting, isAnimatingReply])

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = "0px"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }, [input])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current)
      }
    }
  }, [])

  const animateAssistantReply = (messageId: string, fullText: string) =>
    new Promise<void>((resolve) => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current)
      }

      let i = 0
      setTypedMessageId(messageId)
      setIsAnimatingReply(true)

      typingTimerRef.current = setInterval(() => {
        i += 1

        setMessages((current) =>
          current.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content: fullText.slice(0, i),
                }
              : message,
          ),
        )

        if (i >= fullText.length) {
          if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current)
          }
          typingTimerRef.current = null
          setTypedMessageId(null)
          setIsAnimatingReply(false)
          resolve()
        }
      }, 20)
    })

  const sendMessage = async (rawText?: string) => {
    const text = (rawText ?? input).trim()
    if (!text || isWaiting || isAnimatingReply) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    }

    setMessages((current) => [...current, userMessage])
    setInput("")
    setIsOpen(true)
    setIsWaiting(true)
    setError(null)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Chat failed")
      }

      const assistantId = `assistant-${Date.now()}`
      const highlights = Array.isArray(data.slangMatches) ? data.slangMatches : []
      const detectedSlang = Array.isArray(data.detectedSlang) ? data.detectedSlang : []

      setMessages((current) => [
        ...current,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          highlights,
          detectedSlang,
        },
      ])

      setIsWaiting(false)
      await animateAssistantReply(assistantId, data.reply || "I couldn't generate a response just now.")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      setError(message)
      setIsWaiting(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const renderHighlightedText = (text: string, highlights: string[] = []) => {
    if (highlights.length === 0 || !text) {
      return text
    }

    const escaped = highlights
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)
      .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

    if (escaped.length === 0) {
      return text
    }

    const regex = new RegExp(`(${escaped.join("|")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) => {
      const isMatch = highlights.some((entry) => entry.toLowerCase() === part.toLowerCase())

      if (!isMatch) {
        return <span key={`${part}-${index}`}>{part}</span>
      }

      return (
        <mark key={`${part}-${index}`} className="chatbot-highlight">
          {part}
        </mark>
      )
    })
  }

  const isBusy = isWaiting || isAnimatingReply
  const shellClassName = `chatbot-shell${isFullscreen ? " chatbot-shell-fullscreen" : ""}`
  const windowClassName = `chatbot-window${isFullscreen ? " chatbot-window-fullscreen" : ""}`

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
    setIsFullscreen(false)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    setIsFullscreen(false)
  }

  const handleToggleFullscreen = () => {
    setIsMinimized(false)
    setIsFullscreen((current) => !current)
  }

  return (
    <>
      <button
        type="button"
        className={`chatbot-fab ${isOpen ? "chatbot-fab-hidden" : ""}`}
        onClick={handleOpen}
        aria-label="Open Slang Sense AI chat"
      >
        <MessageCircle size={22} />
      </button>

      {isOpen && (
        <div className={shellClassName}>
          <div className={windowClassName}>
            <div className="chatbot-header">
              <div className="chatbot-title-wrap">
                <div className="chatbot-avatar">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="chatbot-title">Slang Sense AI</h3>
                  <p className="chatbot-subtitle">Your slang-savvy AI sidekick</p>
                </div>
              </div>

              <div className="chatbot-controls">
                <button
                  type="button"
                  className="chatbot-control-btn"
                  onClick={handleMinimize}
                  aria-label="Minimize chat"
                >
                  <span className="chatbot-minimize-line" />
                </button>

                <button
                  type="button"
                  className="chatbot-control-btn"
                  onClick={handleToggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen chat" : "Open fullscreen chat"}
                >
                  <Maximize2 size={15} />
                </button>

                <button
                  type="button"
                  className="chatbot-control-btn chatbot-close"
                  onClick={handleClose}
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {isMinimized ? (
              <button
                type="button"
                className="chatbot-minimized-bar"
                onClick={() => setIsMinimized(false)}
                aria-label="Restore chat"
              >
                <span>Slang Sense AI</span>
                <Minimize2 size={16} className="chatbot-minimized-icon" />
              </button>
            ) : (
              <>
                <div className="chatbot-messages">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`chatbot-message-row chatbot-message-row-${message.role}`}
                    >
                      <div className={`chatbot-message chatbot-message-${message.role}`}>
                        {message.role === "assistant" && (
                          <div className="chatbot-message-label">
                            <Sparkles size={12} />
                            AI
                          </div>
                        )}

                        <p className="chatbot-message-text">
                          {renderHighlightedText(message.content, message.highlights)}
                          {typedMessageId === message.id && <span className="chatbot-caret" />}
                        </p>

                        {message.role === "assistant" &&
                          message.detectedSlang &&
                          message.detectedSlang.length > 0 && (
                            <div className="chatbot-slang-list">
                              {message.detectedSlang.map((entry) => (
                                <span key={`${message.id}-${entry.word}`} className="chatbot-slang-pill">
                                  <strong>{entry.word}</strong>
                                  {entry.meaning}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}

                  {isWaiting && (
                    <div className="chatbot-message-row chatbot-message-row-assistant">
                      <div className="chatbot-message chatbot-message-assistant chatbot-typing-bubble">
                        <div className="chatbot-message-label">
                          <Sparkles size={12} />
                          AI
                        </div>
                        <div className="chatbot-typing" aria-label="Thinking">
                          <span className="chatbot-dots">
                            <span />
                            <span />
                            <span />
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="chatbot-error">
                      {error}
                    </div>
                  )}

                  <div ref={scrollRef} />
                </div>

                <div className="chatbot-suggestions">
                  {quickSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="chatbot-suggestion"
                      onClick={() => void sendMessage(suggestion)}
                      disabled={isBusy}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <div className="chatbot-input-wrap">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about slang or paste a sentence..."
                    className="chatbot-input"
                    rows={1}
                  />

                  <button
                    type="button"
                    className="chatbot-send"
                    onClick={() => void sendMessage()}
                    disabled={!input.trim() || isBusy}
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
