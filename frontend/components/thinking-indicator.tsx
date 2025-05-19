"use client"

import { useEffect, useState } from "react"
import { Bot } from "lucide-react"

export function ThinkingIndicator() {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "."
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex">
      <div className="flex max-w-[85%]">
        <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 mr-3 bg-gray-100">
          <Bot className="h-4 w-4 text-gray-600" />
        </div>

        <div className="px-4 py-3 rounded-lg bg-gray-50 text-gray-800">
          <p className="text-sm">Thinking{dots}</p>
        </div>
      </div>
    </div>
  )
}
