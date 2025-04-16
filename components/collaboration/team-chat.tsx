"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  FileText,
  MoreHorizontal,
  Pin,
  Star,
  Users,
  Hash,
  Plus,
  Settings,
  MessageSquare,
  ThumbsUp,
  Heart,
  Laugh,
  Frown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
  id: string
  content: string
  timestamp: string
  sender: {
    id: string
    name: string
    avatar: string
    initials: string
    status: "online" | "away" | "offline" | "busy"
  }
  reactions?: {
    type: "like" | "love" | "laugh" | "sad"
    count: number
    reacted: boolean
  }[]
  attachments?: {
    type: "image" | "document" | "link"
    name: string
    url: string
    size?: string
  }[]
  isPinned?: boolean
}

type Channel = {
  id: string
  name: string
  description?: string
  isPrivate: boolean
  unread: number
  members: number
  isActive?: boolean
}

type DirectMessage = {
  id: string
  name: string
  avatar: string
  initials: string
  status: "online" | "offline" | "away" | "busy"
  unread: number
  isActive?: boolean
  lastMessage?: string
  lastMessageTime?: string
}

export function TeamChat() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"channels" | "direct">("channels")
  const [activeChannelId, setActiveChannelId] = useState("general")
  const [activeDmId, setActiveDmId] = useState("")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "general",
      name: "general",
      description: "General team discussions",
      isPrivate: false,
      unread: 0,
      members: 12,
      isActive: true,
    },
    {
      id: "design",
      name: "design",
      description: "Design discussions and feedback",
      isPrivate: false,
      unread: 3,
      members: 8,
    },
    {
      id: "development",
      name: "development",
      description: "Development updates and issues",
      isPrivate: false,
      unread: 0,
      members: 10,
    },
    {
      id: "marketing",
      name: "marketing",
      description: "Marketing strategies and campaigns",
      isPrivate: false,
      unread: 5,
      members: 6,
    },
    {
      id: "project-alpha",
      name: "project-alpha",
      description: "Private project channel",
      isPrivate: true,
      unread: 0,
      members: 5,
    },
  ])

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    {
      id: "user1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      status: "online",
      unread: 2,
      lastMessage: "Can you review the designs?",
      lastMessageTime: "10:30 AM",
    },
    {
      id: "user2",
      name: "Beth Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "BS",
      status: "busy",
      unread: 0,
      lastMessage: "Meeting at 2pm tomorrow",
      lastMessageTime: "Yesterday",
    },
    {
      id: "user3",
      name: "Carl Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CD",
      status: "away",
      unread: 0,
      lastMessage: "I'll check with the team",
      lastMessageTime: "Yesterday",
    },
    {
      id: "user4",
      name: "Dana Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DW",
      status: "offline",
      unread: 0,
      lastMessage: "Thanks for your help!",
      lastMessageTime: "Monday",
    },
    {
      id: "user5",
      name: "Eric Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EB",
      status: "online",
      unread: 0,
      lastMessage: "The API is now working",
      lastMessageTime: "Monday",
    },
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Good morning team! Let's discuss the project timeline for this week.",
      timestamp: "Today at 9:30 AM",
      sender: {
        id: "user1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
        status: "online",
      },
      reactions: [
        { type: "like", count: 3, reacted: true },
        { type: "love", count: 1, reacted: false },
      ],
      isPinned: true,
    },
    {
      id: "2",
      content:
        "I've updated the design files with the latest client feedback. Please take a look when you have a chance.",
      timestamp: "Today at 9:45 AM",
      sender: {
        id: "user2",
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "BS",
        status: "busy",
      },
      attachments: [{ type: "document", name: "Updated_Designs_V2.pdf", url: "#", size: "4.2 MB" }],
    },
    {
      id: "3",
      content: "The homepage redesign looks great! I especially like the new hero section.",
      timestamp: "Today at 10:15 AM",
      sender: {
        id: "user3",
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CD",
        status: "away",
      },
      reactions: [{ type: "like", count: 2, reacted: false }],
    },
    {
      id: "4",
      content: "Here's a screenshot of the mobile version. We still need to fix the navigation on smaller screens.",
      timestamp: "Today at 10:30 AM",
      sender: {
        id: "user2",
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "BS",
        status: "busy",
      },
      attachments: [{ type: "image", name: "Mobile_Screenshot.png", url: "/placeholder.svg?height=300&width=200" }],
    },
    {
      id: "5",
      content: "I'll work on fixing the mobile navigation issues this afternoon.",
      timestamp: "Today at 10:45 AM",
      sender: {
        id: "user4",
        name: "Dana Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DW",
        status: "offline",
      },
    },
    {
      id: "6",
      content: "Don't forget we have a client meeting tomorrow at 2 PM to present the progress.",
      timestamp: "Today at 11:00 AM",
      sender: {
        id: "user1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
        status: "online",
      },
      isPinned: true,
    },
    {
      id: "7",
      content: "I've added the meeting to the calendar and sent out invites to everyone.",
      timestamp: "Today at 11:15 AM",
      sender: {
        id: "user5",
        name: "Eric Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "EB",
        status: "online",
      },
    },
  ])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: `${messages.length + 1}`,
      content: message,
      timestamp: "Just now",
      sender: {
        id: "currentUser",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "YO",
        status: "online",
      },
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleChannelClick = (channelId: string) => {
    setChannels(
      channels.map((channel) => ({
        ...channel,
        isActive: channel.id === channelId,
        unread: channel.id === channelId ? 0 : channel.unread,
      })),
    )
    setDirectMessages(
      directMessages.map((dm) => ({
        ...dm,
        isActive: false,
      })),
    )
    setActiveChannelId(channelId)
    setActiveDmId("")
    setActiveTab("channels")
  }

  const handleDmClick = (dmId: string) => {
    setDirectMessages(
      directMessages.map((dm) => ({
        ...dm,
        isActive: dm.id === dmId,
        unread: dm.id === dmId ? 0 : dm.unread,
      })),
    )
    setChannels(
      channels.map((channel) => ({
        ...channel,
        isActive: false,
      })),
    )
    setActiveDmId(dmId)
    setActiveChannelId("")
    setActiveTab("direct")
  }

  const handleReaction = (messageId: string, reactionType: "like" | "love" | "laugh" | "sad") => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const existingReactions = msg.reactions || []
          const existingReactionIndex = existingReactions.findIndex((r) => r.type === reactionType)

          let updatedReactions = [...existingReactions]

          if (existingReactionIndex >= 0) {
            // Toggle reaction
            const reaction = existingReactions[existingReactionIndex]
            if (reaction.reacted) {
              // Remove reaction
              updatedReactions[existingReactionIndex] = {
                ...reaction,
                count: reaction.count - 1,
                reacted: false,
              }
              if (updatedReactions[existingReactionIndex].count === 0) {
                updatedReactions = updatedReactions.filter((r) => r.type !== reactionType)
              }
            } else {
              // Add reaction
              updatedReactions[existingReactionIndex] = {
                ...reaction,
                count: reaction.count + 1,
                reacted: true,
              }
            }
          } else {
            // Add new reaction type
            updatedReactions.push({
              type: reactionType,
              count: 1,
              reacted: true,
            })
          }

          return {
            ...msg,
            reactions: updatedReactions,
          }
        }
        return msg
      }),
    )
  }

  const handlePinMessage = (messageId: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            isPinned: !msg.isPinned,
          }
        }
        return msg
      }),
    )

    toast({
      title: "Message updated",
      description: "The message has been pinned to the channel.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredChannels = channels.filter((channel) => channel.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredDms = directMessages.filter((dm) => dm.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const activeChannel = channels.find((c) => c.id === activeChannelId)
  const activeDm = directMessages.find((d) => d.id === activeDmId)

  const pinnedMessages = messages.filter((m) => m.isPinned)

  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg border">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col bg-muted/30">
        <div className="p-4 border-b">
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

        <Tabs
          defaultValue="channels"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "channels" | "direct")}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid grid-cols-2 m-2">
            <TabsTrigger value="channels" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span>Channels</span>
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Direct</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {activeTab === "channels" ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <h4 className="text-sm font-medium">Channels</h4>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm ${
                        channel.isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => handleChannelClick(channel.id)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Hash className="h-4 w-4 shrink-0" />
                        <span className="truncate">{channel.name}</span>
                        {channel.isPrivate && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3 shrink-0"
                          >
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        )}
                      </div>
                      {channel.unread > 0 && (
                        <Badge variant="default" className="ml-auto shrink-0">
                          {channel.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <h4 className="text-sm font-medium">Direct Messages</h4>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {filteredDms.map((dm) => (
                    <button
                      key={dm.id}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm ${
                        dm.isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      }`}
                      onClick={() => handleDmClick(dm.id)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="relative">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={dm.avatar} alt={dm.name} />
                            <AvatarFallback>{dm.initials}</AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${getStatusColor(dm.status)} ring-1 ring-background`}
                          ></span>
                        </div>
                        <span className="truncate">{dm.name}</span>
                      </div>
                      {dm.unread > 0 && (
                        <Badge variant="default" className="ml-auto shrink-0">
                          {dm.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {activeTab === "channels" ? (
              <>
                <div className="bg-muted rounded-md p-1">
                  <Hash className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{activeChannel?.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeChannel?.description}</p>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={activeDm?.avatar} alt={activeDm?.name} />
                    <AvatarFallback>{activeDm?.initials}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(activeDm?.status || "offline")} ring-1 ring-background`}
                  ></span>
                </div>
                <div>
                  <h3 className="font-medium">{activeDm?.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeDm?.status}</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Users className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View members</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pin className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pinned messages</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Channel settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Pinned messages */}
        {pinnedMessages.length > 0 && (
          <div className="p-2 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Pinned Messages</span>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 group">
                <Avatar className="h-8 w-8 mt-0.5">
                  <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                  <AvatarFallback>{msg.sender.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{msg.sender.name}</span>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePinMessage(msg.id)}>
                            <Pin className="h-4 w-4 mr-2" />
                            {msg.isPinned ? "Unpin message" : "Pin message"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            Add to saved items
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Reply in thread
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete message</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="text-sm">{msg.content}</div>

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2">
                      {msg.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center p-2 rounded-md bg-muted">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center mr-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{attachment.name}</div>
                            <div className="text-xs text-muted-foreground">{attachment.size}</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {msg.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                            reaction.reacted ? "bg-primary/10 text-primary" : "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => handleReaction(msg.id, reaction.type)}
                        >
                          {reaction.type === "like" && <ThumbsUp className="h-3 w-3" />}
                          {reaction.type === "love" && <Heart className="h-3 w-3" />}
                          {reaction.type === "laugh" && <Laugh className="h-3 w-3" />}
                          {reaction.type === "sad" && <Frown className="h-3 w-3" />}
                          <span>{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              placeholder={`Message ${activeTab === "channels" ? `#${activeChannel?.name}` : activeDm?.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
