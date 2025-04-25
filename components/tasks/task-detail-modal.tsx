"use client"

import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Download, MoreHorizontal, Star, X, CheckCircle2, AlertCircle, Flag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"

// Add keyframes for the slide-in animation
const slideInStyles = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  body.modal-open {
    overflow: hidden;
  }
`

interface TaskDetailModalProps {
  task: any
  onClose: () => void
  onStatusChange?: (taskId: string, status: string) => void
  onPriorityChange?: (taskId: string, priority: string) => void
}

export function TaskDetailModal({ task, onClose, onStatusChange, onPriorityChange }: TaskDetailModalProps) {
  // Add the styles to the document when the component mounts
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = slideInStyles
    document.head.appendChild(styleElement)

    // Prevent body scrolling when modal is open
    document.body.classList.add("modal-open")

    // Add escape key listener
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscKey)

    return () => {
      document.head.removeChild(styleElement)
      document.body.classList.remove("modal-open")
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [onClose])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
      case "in progress":
        return "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
      case "to do":
        return "bg-gray-50 text-gray-600 hover:bg-gray-50 hover:text-gray-600"
      case "on hold":
        return "bg-yellow-50 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-600"
      default:
        return "bg-gray-50 text-gray-600 hover:bg-gray-50 hover:text-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600 hover:bg-red-50 hover:text-red-600"
      case "medium":
        return "bg-orange-50 text-orange-600 hover:bg-orange-50 hover:text-orange-600"
      case "low":
        return "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
      default:
        return "bg-gray-50 text-gray-600 hover:bg-gray-50 hover:text-gray-600"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleStatusChange = (status: string) => {
    if (onStatusChange) {
      onStatusChange(task.id, status)
    }
  }

  const handlePriorityChange = (priority: string) => {
    if (onPriorityChange) {
      onPriorityChange(task.id, priority)
    }
  }

  // Mock activity data - in a real app, this would come from the database
  const activities = [
    {
      id: 1,
      user: task.assignee || { name: "System", avatar: null },
      action: `changed the status of "${task.title}" to ${task.status}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: 2,
      user: task.assignee || { name: "System", avatar: null },
      action: `updated the priority to ${task.priority}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: 3,
      user: { name: "Davis Donin", avatar: null },
      action: `uploaded file "User flow"`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      attachment: {
        name: "User Flow",
        type: "PDF",
        size: "2.35 mb",
      },
    },
    {
      id: 4,
      user: { name: "Talan Korsgaard", avatar: null },
      action: `created "${task.title}"`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ]

  // Group activities by day
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayActivities = activities.filter((activity) => activity.timestamp.toDateString() === today.toDateString())
  const yesterdayActivities = activities.filter(
    (activity) => activity.timestamp.toDateString() === yesterday.toDateString(),
  )
  const olderActivities = activities.filter(
    (activity) =>
      activity.timestamp.toDateString() !== today.toDateString() &&
      activity.timestamp.toDateString() !== yesterday.toDateString(),
  )

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-out forwards" }}
      />

      {/* Slide-in panel */}
      <div
        className="bg-background h-full w-full max-w-md shadow-lg z-10 overflow-auto"
        style={{
          animation: "slideIn 0.3s ease-out forwards",
        }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Clock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
                <DropdownMenuItem>Share Task</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Task content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{task.title}</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-[20px_1fr] gap-x-4 gap-y-4 items-start">
              <Clock className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Created time</p>
                <p className="text-sm text-muted-foreground">
                  {task.created_at ? formatDate(task.created_at) : "Not specified"}
                </p>
              </div>

              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 mt-1">
                <span className="h-2 w-2 rounded-full bg-white"></span>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge variant="outline" className={`${getStatusColor(task.status)} cursor-pointer`}>
                      {task.status}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange("To Do")}>
                      <AlertCircle className="mr-2 h-4 w-4 text-gray-500" />
                      To Do
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("In Progress")}>
                      <Clock className="mr-2 h-4 w-4 text-blue-500" />
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("On Hold")}>
                      <Flag className="mr-2 h-4 w-4 text-yellow-500" />
                      On Hold
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("Completed")}>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex h-4 w-4 items-center justify-center mt-1">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              </div>
              <div>
                <p className="text-sm font-medium">Priority</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge variant="outline" className={`${getPriorityColor(task.priority)} cursor-pointer`}>
                      {task.priority} Priority
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handlePriorityChange("Low")}>
                      <Flag className="mr-2 h-4 w-4 text-blue-500" />
                      Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePriorityChange("Medium")}>
                      <Flag className="mr-2 h-4 w-4 text-orange-500" />
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePriorityChange("High")}>
                      <Flag className="mr-2 h-4 w-4 text-red-500" />
                      High
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm text-muted-foreground">
                  {task.due_date ? formatDate(task.due_date) : "No due date"}
                </p>
              </div>

              {task.project && (
                <>
                  <div className="flex h-4 w-4 items-center justify-center mt-1">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Project</p>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600">
                      {task.project.name}
                    </Badge>
                  </div>
                </>
              )}

              {task.tags && task.tags.length > 0 && (
                <>
                  <div className="flex h-4 w-4 items-center justify-center mt-1">
                    <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {task.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {task.assignee && (
                <>
                  <Avatar className="h-4 w-4 mt-1">
                    <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Assignee</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage
                          src={
                            task.assignee.avatar || `/placeholder.svg?height=24&width=24&query=${task.assignee.name}`
                          }
                          alt={task.assignee.name}
                        />
                        <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {task.description && (
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}

            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="pt-4">
                <div className="space-y-6">
                  {todayActivities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Today</h4>
                      <div className="space-y-4">
                        {todayActivities.map((activity) => (
                          <div key={activity.id} className="flex gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  activity.user.avatar ||
                                  `/placeholder.svg?height=24&width=24&query=${activity.user.name || "/placeholder.svg"}`
                                }
                                alt={activity.user.name}
                              />
                              <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline flex-wrap">
                                <p className="text-sm font-medium">{activity.user.name}</p>
                                <p className="text-xs text-muted-foreground ml-1">{activity.action}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {activity.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>

                              {activity.attachment && (
                                <div className="mt-2 border rounded-md p-3 bg-gray-50 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="bg-red-100 p-2 rounded">
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-red-600"
                                      >
                                        <path
                                          d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M13 2v7h7"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium">{activity.attachment.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {activity.attachment.type} • {activity.attachment.size}
                                      </p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {yesterdayActivities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Yesterday</h4>
                      <div className="space-y-4">
                        {yesterdayActivities.map((activity) => (
                          <div key={activity.id} className="flex gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  activity.user.avatar ||
                                  `/placeholder.svg?height=24&width=24&query=${activity.user.name || "/placeholder.svg"}`
                                }
                                alt={activity.user.name}
                              />
                              <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline flex-wrap">
                                <p className="text-sm font-medium">{activity.user.name}</p>
                                <p className="text-xs text-muted-foreground ml-1">{activity.action}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {activity.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {olderActivities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Older</h4>
                      <div className="space-y-4">
                        {olderActivities.map((activity) => (
                          <div key={activity.id} className="flex gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  activity.user.avatar ||
                                  `/placeholder.svg?height=24&width=24&query=${activity.user.name || "/placeholder.svg"}`
                                }
                                alt={activity.user.name}
                              />
                              <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline flex-wrap">
                                <p className="text-sm font-medium">{activity.user.name}</p>
                                <p className="text-xs text-muted-foreground ml-1">{activity.action}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="subtasks" className="pt-4">
                <div className="flex items-center justify-center p-6 text-center">
                  <div>
                    <p className="text-muted-foreground">No subtasks yet</p>
                    <Button className="mt-4">Add Subtask</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="pt-4">
                <div className="flex items-center justify-center p-6 text-center">
                  <div>
                    <p className="text-muted-foreground">No comments yet</p>
                    <Button className="mt-4">Add Comment</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files" className="pt-4">
                <div className="flex items-center justify-center p-6 text-center">
                  <div>
                    <p className="text-muted-foreground">No files attached</p>
                    <Button className="mt-4">Upload File</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
