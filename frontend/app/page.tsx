"use client"

import { useRef } from "react"
import { MiaChat } from "@/components/mia-chat"
import { Sidebar } from "@/components/sidebar"

export default function MiaPage() {
  const chatRef = useRef<{ reset: () => void }>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onNewChat={() => chatRef.current?.reset()} />
      <MiaChat ref={chatRef} />
    </div>
  )
}
