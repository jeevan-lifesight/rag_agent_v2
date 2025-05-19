import { cn } from "@/lib/utils"
import { User, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  status?: "sending" | "sent" | "cancelled"
}

interface ChatMessageProps {
  message: Message
}

function formatMath(content: string) {
  // Replace \$$ ... \$$ with $$ ... $$ for block math
  // Replace [ ... ] with $$ ... $$ for block math
  // Also replace double backslashes with single backslashes for KaTeX
  let formatted = content
    .replace(/\\\$\$([\s\S]*?)\\\$\$/g, (match, p1) => `$$${p1}$$`)
    .replace(/\[\s*([\s\S]*?)\s*\]/g, (match, p1) => `$$${p1}$$`)
    .replace(/\\/g, "\\");

  // Ensure all block math is surrounded by blank lines
  // This regex finds all $$...$$ blocks and ensures they are wrapped with blank lines
  formatted = formatted.replace(/(^|[^\n])\$\$([\s\S]*?)\$\$([^\n]|$)/g, (match, before, content, after) => {
    let prefix = before && before !== '\n' ? '\n' : '';
    let suffix = after && after !== '\n' ? '\n' : '';
    return `${prefix}$$${content}$$${suffix}`;
  });

  // Remove any accidental triple newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  return formatted;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  if (!isUser) {
    console.log('Assistant message content:', formatMath(message.content));
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%]", isUser ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-full shrink-0",
            isUser ? "ml-3 bg-indigo-100" : "mr-3 bg-gray-100",
          )}
        >
          {isUser ? <User className="h-4 w-4 text-indigo-600" /> : <Bot className="h-4 w-4 text-gray-600" />}
        </div>

        <div>
          <div
            className={cn(
              "px-4 py-3 rounded-lg",
              isUser ? "bg-indigo-50 text-gray-800" : "bg-gray-50 text-gray-800",
              message.status === "cancelled" && "opacity-50",
            )}
          >
            {isUser ? (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="max-w-none text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {formatMath(message.content)}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {message.status === "cancelled" && <p className="text-xs text-red-500 mt-1">Message generation cancelled</p>}
        </div>
      </div>
    </div>
  )
}
