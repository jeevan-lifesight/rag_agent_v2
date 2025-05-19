"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PlusCircle, ChevronDown, ChevronRight, Pin, Trash2, History } from "lucide-react"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  title: string
  isPinned: boolean
  updatedAt: Date
  preview: string
}

interface SidebarProps {
  onNewChat?: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
  const [conversations, setConversations] = useState<{
    pinned: Conversation[]
    today: Conversation[]
    previous: Conversation[]
  }>({
    pinned: [
      {
        id: "1",
        title: "Marketing Mix Modeling Overview",
        isPinned: true,
        updatedAt: new Date(),
        preview: "A detailed explanation of MMM principles and applications",
      },
    ],
    today: [
      {
        id: "2",
        title: "Strategies for monetizing your YouTube channel",
        isPinned: false,
        updatedAt: new Date(),
        preview: "Effective strategies to increase revenue from YouTube content",
      },
      {
        id: "3",
        title: "Tips for personal growth and self-improvement",
        isPinned: false,
        updatedAt: new Date(),
        preview: "Practical advice for personal development",
      },
      {
        id: "4",
        title: "Understanding cybersecurity and ethical hacking",
        isPinned: false,
        updatedAt: new Date(),
        preview: "Overview of cybersecurity principles and ethical hacking",
      },
      {
        id: "5",
        title: "Guidelines for managing client web development projects",
        isPinned: false,
        updatedAt: new Date(),
        preview: "Best practices for client management in web development",
      },
      {
        id: "6",
        title: "Comprehensive guide to building apps with React Native",
        isPinned: false,
        updatedAt: new Date(),
        preview: "Step-by-step guide to React Native development",
      },
    ],
    previous: [
      {
        id: "7",
        title: "A collection of resources for mobile app design prototypes",
        isPinned: false,
        updatedAt: new Date(Date.now() - 86400000 * 2),
        preview: "Curated resources for mobile app design",
      },
      {
        id: "8",
        title: "Overview of different types of ROI and their applications",
        isPinned: false,
        updatedAt: new Date(Date.now() - 86400000 * 3),
        preview: "Detailed explanation of ROI types and calculations",
      },
      {
        id: "9",
        title: "Troubleshooting common SSL/TLS issues",
        isPinned: false,
        updatedAt: new Date(Date.now() - 86400000 * 4),
        preview: "Solutions for common SSL/TLS problems",
      },
      {
        id: "10",
        title: "Essential templates for software developers",
        isPinned: false,
        updatedAt: new Date(Date.now() - 86400000 * 5),
        preview: "Collection of useful templates for developers",
      },
      {
        id: "11",
        title: "Exploring mobile app development using Go programming language",
        isPinned: false,
        updatedAt: new Date(Date.now() - 86400000 * 6),
        preview: "Guide to mobile development with Go",
      },
    ],
  })

  const [todayExpanded, setTodayExpanded] = useState(true)
  const [previousExpanded, setPreviousExpanded] = useState(true)
  const [activeConversation, setActiveConversation] = useState<string | null>("2")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null)

  const handleNewConversation = () => {
    if (onNewChat) onNewChat();
  }

  const handlePinConversation = (id: string) => {
    // Logic to pin/unpin a conversation
    console.log("Pinning conversation", id)
  }

  const handleDeleteConversation = (id: string) => {
    setDeleteConfirmOpen(id)
  }

  const confirmDelete = (id: string) => {
    // Logic to delete a conversation
    console.log("Deleting conversation", id)
    setDeleteConfirmOpen(null)
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(null)
  }

  const renderConversationItem = (conversation: Conversation) => (
    <div
      key={conversation.id}
      className={cn(
        "relative group py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors",
        activeConversation === conversation.id && "bg-indigo-50 hover:bg-indigo-50",
      )}
      onClick={() => setActiveConversation(conversation.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm text-gray-800 line-clamp-1">{conversation.title}</h3>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              handlePinConversation(conversation.id)
            }}
          >
            <Pin
              className={cn("h-4 w-4", conversation.isPinned ? "fill-indigo-500 text-indigo-500" : "text-gray-500")}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteConversation(conversation.id)
            }}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{conversation.preview}</p>

      {deleteConfirmOpen === conversation.id && (
        <div className="absolute inset-0 bg-white rounded-md shadow-md p-3 z-10">
          <p className="text-sm text-gray-800 mb-2">Delete this conversation permanently?</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                cancelDelete()
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                confirmDelete(conversation.id)
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Ask Mia</h1>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNewConversation}>
            <PlusCircle className="h-5 w-5 text-indigo-600" />
          </Button>
        </div>
      </div>

      <div className="flex items-center px-4 py-2 border-b border-gray-200">
        <History className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-sm font-medium text-gray-700">History</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.pinned.length > 0 && (
            <div className="mb-2">
              <h3 className="text-xs font-medium text-gray-500 px-3 py-1">PINNED</h3>
              {conversations.pinned.map(renderConversationItem)}
            </div>
          )}

          <Collapsible open={todayExpanded} onOpenChange={setTodayExpanded}>
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-1">
              <h3 className="text-xs font-medium text-gray-500">TODAY</h3>
              {todayExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>{conversations.today.map(renderConversationItem)}</CollapsibleContent>
          </Collapsible>

          <Collapsible open={previousExpanded} onOpenChange={setPreviousExpanded} className="mt-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-1">
              <h3 className="text-xs font-medium text-gray-500">PREVIOUS 7 DAYS</h3>
              {previousExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>{conversations.previous.map(renderConversationItem)}</CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  )
}
