"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

type Conversation = {
  id: string
  recipient: {
    id: string
    name: string
    avatar?: string
    online?: boolean
  }
  lastMessage: {
    text: string
    timestamp: string
    read: boolean
    sender: "user" | "recipient"
  }
  unreadCount: number
}

type Message = {
  id: string
  text: string
  timestamp: string
  sender: "user" | "recipient"
  read: boolean
}

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // If not logged in, redirect to login page
  if (!loading && !user) {
    redirect("/login")
  }

  const conversations: Conversation[] = [
    {
      id: "1",
      recipient: {
        id: "101",
        name: "Priya Gupta",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
      lastMessage: {
        text: "Can you share the notes from today's lecture?",
        timestamp: "10:30 AM",
        read: false,
        sender: "recipient",
      },
      unreadCount: 2,
    },
    {
      id: "2",
      recipient: {
        id: "102",
        name: "Prof. Rajesh Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
      },
      lastMessage: {
        text: "Thank you for submitting your assignment on time.",
        timestamp: "Yesterday",
        read: true,
        sender: "recipient",
      },
      unreadCount: 0,
    },
    {
      id: "3",
      recipient: {
        id: "103",
        name: "Rahul Jain",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
      lastMessage: {
        text: "Let's meet at the library at 3 PM.",
        timestamp: "Yesterday",
        read: true,
        sender: "user",
      },
      unreadCount: 0,
    },
    {
      id: "4",
      recipient: {
        id: "104",
        name: "Neha Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
      },
      lastMessage: {
        text: "Are you joining the hackathon next week?",
        timestamp: "Monday",
        read: true,
        sender: "recipient",
      },
      unreadCount: 0,
    },
    {
      id: "5",
      recipient: {
        id: "105",
        name: "Amit Verma",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
      },
      lastMessage: {
        text: "Thanks for connecting! I'd love to hear about your experience at L&T.",
        timestamp: "Last week",
        read: true,
        sender: "user",
      },
      unreadCount: 0,
    },
  ]

  const messages: Record<string, Message[]> = {
    "1": [
      {
        id: "1-1",
        text: "Hi there! How are you doing?",
        timestamp: "10:15 AM",
        sender: "user",
        read: true,
      },
      {
        id: "1-2",
        text: "I'm good, thanks for asking! How about you?",
        timestamp: "10:20 AM",
        sender: "recipient",
        read: true,
      },
      {
        id: "1-3",
        text: "I'm doing well. Just working on the project for Prof. Kumar's class.",
        timestamp: "10:25 AM",
        sender: "user",
        read: true,
      },
      {
        id: "1-4",
        text: "Can you share the notes from today's lecture?",
        timestamp: "10:30 AM",
        sender: "recipient",
        read: false,
      },
      {
        id: "1-5",
        text: "I missed the first half due to a doctor's appointment.",
        timestamp: "10:30 AM",
        sender: "recipient",
        read: false,
      },
    ],
    "2": [
      {
        id: "2-1",
        text: "Hello Professor, I wanted to ask about the upcoming project deadline.",
        timestamp: "Yesterday",
        sender: "user",
        read: true,
      },
      {
        id: "2-2",
        text: "Hello! The deadline is next Friday at 11:59 PM. Make sure to submit it through the portal.",
        timestamp: "Yesterday",
        sender: "recipient",
        read: true,
      },
      {
        id: "2-3",
        text: "Thank you for the clarification. I'll make sure to submit it on time.",
        timestamp: "Yesterday",
        sender: "user",
        read: true,
      },
      {
        id: "2-4",
        text: "Thank you for submitting your assignment on time.",
        timestamp: "Yesterday",
        sender: "recipient",
        read: true,
      },
    ],
    "3": [
      {
        id: "3-1",
        text: "Hey Rahul, are you free to meet today to discuss the group project?",
        timestamp: "Yesterday",
        sender: "user",
        read: true,
      },
      {
        id: "3-2",
        text: "Yes, I'm free after 2 PM. Where would you like to meet?",
        timestamp: "Yesterday",
        sender: "recipient",
        read: true,
      },
      {
        id: "3-3",
        text: "Let's meet at the library at 3 PM.",
        timestamp: "Yesterday",
        sender: "user",
        read: true,
      },
    ],
  }

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation, messages])

  const filteredConversations = conversations.filter((conversation) =>
    conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    // In a real app, this would send the message to the server
    console.log(`Sending message to conversation ${selectedConversation}: ${newMessage}`)
    setNewMessage("")
  }

  const currentConversation = conversations.find((c) => c.id === selectedConversation)
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : []

  const handleBackToList = () => {
    setSelectedConversation(null)
  }

  if (loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-4 md:py-8">
      <h1 className="mb-4 md:mb-8 text-2xl md:text-3xl font-bold tracking-tight">Messages</h1>

      <div className="grid h-[calc(100vh-12rem)] grid-cols-1 overflow-hidden rounded-lg border md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
        {/* Conversations List - Only show on desktop or when no conversation is selected on mobile */}
        {(!isMobile || !selectedConversation) && (
          <div className="flex flex-col border-r">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              {filteredConversations.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${
                      selectedConversation === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.recipient.avatar} alt={conversation.recipient.name} />
                          <AvatarFallback>{conversation.recipient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.recipient.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{conversation.recipient.name}</p>
                          <p className="text-xs text-muted-foreground">{conversation.lastMessage.timestamp}</p>
                        </div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {conversation.lastMessage.sender === "user" ? "You: " : ""}
                          {conversation.lastMessage.text}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        )}

        {/* Messages Area - Only show when a conversation is selected or on desktop */}
        {(selectedConversation || !isMobile) && (
          <div className="flex flex-col">
            {/* Conversation Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                {isMobile && selectedConversation && (
                  <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-1">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <Avatar>
                  <AvatarImage src={currentConversation?.recipient.avatar} alt={currentConversation?.recipient.name} />
                  <AvatarFallback>{currentConversation?.recipient.name.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentConversation?.recipient.name || "Select a conversation"}</p>
                  {currentConversation && (
                    <p className="text-xs text-muted-foreground">
                      {currentConversation.recipient.online ? "Online" : "Offline"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            {selectedConversation ? (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="mt-1 text-right text-xs text-muted-foreground">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                  >
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <Send className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Your Messages</h3>
                <p className="mb-4 max-w-md text-muted-foreground">
                  Select a conversation from the list to view messages or start a new conversation.
                </p>
                <Button>Start a New Conversation</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

