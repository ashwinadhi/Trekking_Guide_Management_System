"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Send, Phone, Video, Paperclip, Smile, MoreVertical, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function ChatPage() {
  const { toast } = useToast()
  const [selectedChat, setSelectedChat] = useState("head-guide")
  const [message, setMessage] = useState("")

  const conversations = [
    {
      id: "head-guide",
      name: "Head Guide",
      role: "Trek Guide",
      avatar: "/images/mountain-sunrise.jpg",
      lastMessage: "Perfect! I'll prepare the detailed itinerary for your Everest Base Camp trek.",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
      booking: "Everest Base Camp Trek - March 2024",
    },
    {
      id: "support-team",
      name: "Support Team",
      role: "Customer Support",
      avatar: "/images/sherpa-village.jpg",
      lastMessage: "Your equipment rental has been confirmed. Delivery scheduled for tomorrow.",
      timestamp: "1 hour ago",
      unread: 0,
      online: true,
      booking: "Equipment Rental",
    },
    {
      id: "maya-guide",
      name: "Maya Gurung",
      role: "Local Guide - Pokhara",
      avatar: "/images/prayer-flags.jpg",
      lastMessage: "The weather looks great for paragliding tomorrow!",
      timestamp: "3 hours ago",
      unread: 1,
      online: false,
      booking: "Pokhara Day Tour - March 15",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "head-guide",
      content:
        "Hello! Thank you for booking the Everest Base Camp trek with me. I'm excited to guide you on this incredible journey!",
      timestamp: "10:30 AM",
      type: "text",
    },
    {
      id: 2,
      sender: "user",
      content: "Hi! I'm really looking forward to it. I have a few questions about the preparation.",
      timestamp: "10:32 AM",
      type: "text",
    },
    {
      id: 3,
      sender: "head-guide",
      content: "Of course! I'm here to help. What would you like to know?",
      timestamp: "10:33 AM",
      type: "text",
    },
    {
      id: 4,
      sender: "user",
      content: "What's the weather like in March? And do I need to rent any equipment?",
      timestamp: "10:35 AM",
      type: "text",
    },
    {
      id: 5,
      sender: "head-guide",
      content:
        "March is actually a great time! Days are usually clear with temperatures around 10-15°C at lower elevations. It gets much colder at higher altitudes though.",
      timestamp: "10:37 AM",
      type: "text",
    },
    {
      id: 6,
      sender: "head-guide",
      content: "Here's a photo from last March at Everest Base Camp - you can see the conditions are excellent!",
      timestamp: "10:38 AM",
      type: "image",
      imageUrl: "/images/everest-base-camp.jpg",
    },
    {
      id: 7,
      sender: "head-guide",
      content:
        "For equipment, I recommend renting a good down jacket and sleeping bag if you don't have them. I can arrange this for you through our equipment rental service.",
      timestamp: "10:40 AM",
      type: "text",
    },
    {
      id: 8,
      sender: "user",
      content: "That photo looks amazing! Yes, please help me with the equipment rental. What else should I prepare?",
      timestamp: "10:42 AM",
      type: "text",
    },
    {
      id: 9,
      sender: "head-guide",
      content: "Perfect! I'll prepare the detailed itinerary for your Everest Base Camp trek.",
      timestamp: "10:45 AM",
      type: "text",
    },
  ]

  const currentChat = conversations.find((conv) => conv.id === selectedChat)

  const handleSendMessage = () => {
    const t = message.trim()
    if (t.length < 1) {
      toast({
        title: "Message required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      })
      return
    }
    if (t.length > 2000) {
      toast({ title: "Message too long", description: "Maximum 2000 characters.", variant: "destructive" })
      return
    }
    console.log("Sending message:", t)
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-700">
                Technie Trek
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/treks" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Treks
                </Link>
                <Link href="/chat" className="text-gray-900 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Messages
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Messages</span>
                  <Badge variant="secondary">{conversations.filter((c) => c.unread > 0).length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                        selectedChat === conversation.id ? "bg-green-50 border-l-4 border-l-green-500" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                            <AvatarFallback>
                              {conversation.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{conversation.role}</p>
                          <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                          <p className="text-xs text-green-600 mt-1">{conversation.booking}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-green-600 text-white text-xs">{conversation.unread}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentChat?.avatar || "/placeholder.svg"} alt={currentChat?.name} />
                      <AvatarFallback>
                        {currentChat?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{currentChat?.name}</h3>
                      <p className="text-sm text-gray-600">{currentChat?.role}</p>
                      <p className="text-xs text-green-600">{currentChat?.booking}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === "user" ? "bg-green-600 text-white" : "bg-white border shadow-sm"
                      }`}
                    >
                      {msg.type === "text" && <p className="text-sm">{msg.content}</p>}
                      {msg.type === "image" && (
                        <div>
                          <p className="text-sm mb-2">{msg.content}</p>
                          <Image
                            src={msg.imageUrl || "/placeholder.svg"}
                            alt="Shared image"
                            width={200}
                            height={150}
                            className="rounded-lg"
                          />
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-green-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="pr-10"
                      required
                      maxLength={2000}
                    />
                    <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
