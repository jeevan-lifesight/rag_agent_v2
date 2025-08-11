"use client"

// NOTE: Make sure to install @types/react and @types/lucide-react for type safety.
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatMessage } from "./chat-message"
import { ThinkingIndicator } from "./thinking-indicator"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  status?: "sending" | "sent" | "cancelled"
}

export const MiaChat = forwardRef((props, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "What is MMM?",
      timestamp: new Date(Date.now() - 60000),
      status: "sent",
    },
    {
      id: "2",
      role: "assistant",
      content:
        "MMM encompasses various strategies that integrate different channels and formats to enhance customer engagement. It involves the seamless combination of online and offline tactics, ensuring a cohesive experience for users across platforms. By leveraging data analytics and consumer insights, MMM aims to create personalized marketing campaigns that resonate with diverse audiences, ultimately driving brand loyalty and sales.",
      timestamp: new Date(Date.now() - 55000),
      status: "sent",
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking) return
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      status: "sending",
    }
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInputValue("")
    setIsThinking(true)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    try {
      // Call FastAPI backend
      const res = await fetch("http://localhost:9001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
        }),
      })
      if (!res.ok) throw new Error("Backend error")
      const data = await res.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        status: "sent",
      }
      setMessages((prev: Message[]) => [
        ...prev.map((m: Message) => (m.id === userMessage.id ? { ...m, status: "sent" as const } : m)),
        assistantMessage,
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev: Message[]) => prev.map((m: Message) => (m.id === userMessage.id ? { ...m, status: "cancelled" as const } : m)))
    } finally {
      setIsThinking(false)
    }
  }

  const handleCancelMessage = () => {
    setIsThinking(false)
    setMessages((prev: Message[]) => prev.map((m: Message) => (m.status === "sending" ? { ...m, status: "cancelled" as const } : m)))
  }

  useImperativeHandle(ref, () => ({
    reset: () => setMessages([]),
  }));

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to MIA</h2>
                <p className="text-gray-600 mb-6">
                  Your Marketing Intelligence Assistant. Ask me anything about marketing data, analytics, or strategies.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isThinking && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="You can ask me anything related to data! I am here to help."
              className={cn(
                "resize-none pr-20 min-h-[56px] max-h-[150px] overflow-y-auto",
                "focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0",
              )}
              disabled={isThinking}
            />
            <div className="absolute right-2 bottom-2 flex space-x-2">
              {isThinking ? (
                <Button variant="outline" size="sm" onClick={handleCancelMessage} className="h-8">
                  Cancel
                </Button>
              ) : (
                <Button
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700",
                    (!inputValue.trim() || isThinking) && "opacity-50 cursor-not-allowed",
                  )}
                  disabled={!inputValue.trim() || isThinking}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Mia can make mistakes. Please check responses for accuracy.
          </p>
        </div>
      </div>
    </div>
  )
})
