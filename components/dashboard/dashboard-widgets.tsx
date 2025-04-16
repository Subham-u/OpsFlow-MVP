"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import {
  BarChart3,
  Calendar,
  Clock,
  Cog,
  Folder,
  Grid3X3,
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  RefreshCw,
  Users,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  LinkIcon,
  Megaphone,
  Timer,
  ListTodo,
  UserCheck,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Import the CardWrapper component
import { CardWrapper } from "@/components/ui/card-wrapper"

// Add the useTimeTracking import
import { useTimeTracking } from "@/contexts/time-tracking-context"

// Widget type definition
type WidgetType =
  | "statistics"
  | "projects"
  | "tasks"
  | "team"
  | "calendar"
  | "time-tracking"
  | "announcements"
  | "quick-links"
  | "attendance"

// Widget definition
type Widget = {
  id: string
  type: WidgetType
  title: string
  size: "small" | "medium" | "large"
  minimized: boolean
  position: number
}

// Sample data for widgets
const sampleStatistics = [
  { name: "Total Projects", value: 24, change: 12, trend: "up" },
  { name: "Active Tasks", value: 42, change: -5, trend: "down" },
  { name: "Team Members", value: 16, change: 3, trend: "up" },
  { name: "Completion Rate", value: "78%", change: 8, trend: "up" },
]

const sampleProjects = [
  {
    id: "1",
    name: "Website Redesign",
    progress: 75,
    dueDate: "Aug 15",
    health: "on-track",
    members: [
      { name: "Alex", image: "/placeholder.svg?height=32&width=32" },
      { name: "Beth", image: "/placeholder.svg?height=32&width=32" },
      { name: "Carl", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: "2",
    name: "Mobile App Development",
    progress: 45,
    dueDate: "Sep 20",
    health: "at-risk",
    members: [
      { name: "Dana", image: "/placeholder.svg?height=32&width=32" },
      { name: "Eric", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: "3",
    name: "Marketing Campaign",
    progress: 90,
    dueDate: "Aug 5",
    health: "delayed",
    members: [
      { name: "Fiona", image: "/placeholder.svg?height=32&width=32" },
      { name: "Greg", image: "/placeholder.svg?height=32&width=32" },
    ],
  },
]

const sampleTasks = [
  {
    id: "1",
    title: "Design homepage wireframes",
    project: "Website Redesign",
    dueDate: "Today",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "2",
    title: "Create user personas",
    project: "Mobile App Development",
    dueDate: "Tomorrow",
    priority: "Medium",
    status: "Not Started",
  },
  {
    id: "3",
    title: "Review content strategy",
    project: "Marketing Campaign",
    dueDate: "Aug 5",
    priority: "Low",
    status: "In Progress",
  },
]

const sampleTeamActivity = [
  {
    id: "1",
    user: { name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "AJ" },
    action: "completed task",
    target: "Design homepage wireframes",
    time: "2 hours ago",
    isNew: true,
  },
  {
    id: "2",
    user: { name: "Beth Smith", avatar: "/placeholder.svg?height=32&width=32", initials: "BS" },
    action: "commented on",
    target: "Mobile App Development",
    time: "4 hours ago",
    isNew: true,
  },
  {
    id: "3",
    user: { name: "Carl Davis", avatar: "/placeholder.svg?height=32&width=32", initials: "CD" },
    action: "created task",
    target: "Implement authentication",
    time: "Yesterday",
    isNew: false,
  },
  {
    id: "4",
    user: { name: "Dana Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "DW" },
    action: "updated",
    target: "Marketing Campaign",
    time: "Yesterday",
    isNew: false,
  },
]

const sampleCalendarEvents = [
  {
    id: "1",
    title: "Team Meeting",
    date: "Today, 10:00 AM",
    type: "meeting",
  },
  {
    id: "2",
    title: "Project Deadline: Website Redesign",
    date: "Aug 15, 2023",
    type: "deadline",
  },
  {
    id: "3",
    title: "Client Presentation",
    date: "Tomorrow, 2:00 PM",
    type: "presentation",
  },
  {
    id: "4",
    title: "Marketing Campaign Launch",
    date: "Aug 5, 2023",
    type: "event",
  },
]

const sampleTimeEntries = [
  {
    id: "1",
    project: "Website Redesign",
    task: "Design homepage wireframes",
    duration: "2h 15m",
    date: "Today",
  },
  {
    id: "2",
    project: "Mobile App Development",
    task: "User research",
    duration: "1h 30m",
    date: "Today",
  },
  {
    id: "3",
    project: "Marketing Campaign",
    task: "Content creation",
    duration: "3h 45m",
    date: "Yesterday",
  },
]

const sampleAnnouncements = [
  {
    id: "1",
    title: "New Feature Release",
    content: "We've just released the new time tracking feature. Check it out!",
    date: "Today",
    author: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32", initials: "AD" },
  },
  {
    id: "2",
    title: "Office Closure",
    content: "The office will be closed on August 15th for maintenance.",
    date: "2 days ago",
    author: { name: "HR Team", avatar: "/placeholder.svg?height=32&width=32", initials: "HR" },
  },
]

const sampleQuickLinks = [
  { id: "1", title: "Projects", icon: <Folder className="h-4 w-4" />, url: "/projects" },
  { id: "2", title: "Tasks", icon: <ListTodo className="h-4 w-4" />, url: "/tasks" },
  { id: "3", title: "Team", icon: <Users className="h-4 w-4" />, url: "/team" },
  { id: "4", title: "Calendar", icon: <Calendar className="h-4 w-4" />, url: "/calendar" },
  { id: "5", title: "Time Tracking", icon: <Clock className="h-4 w-4" />, url: "/time-tracking" },
  { id: "6", title: "Analytics", icon: <BarChart3 className="h-4 w-4" />, url: "/analytics" },
]

// Default widgets configuration
const defaultWidgets: Widget[] = [
  { id: "statistics", type: "statistics", title: "Statistics Overview", size: "large", minimized: false, position: 0 },
  { id: "projects", type: "projects", title: "Recent Projects", size: "medium", minimized: false, position: 1 },
  { id: "tasks", type: "tasks", title: "My Tasks", size: "medium", minimized: false, position: 2 },
  { id: "team", type: "team", title: "Team Activity", size: "medium", minimized: false, position: 3 },
  { id: "attendance", type: "attendance", title: "Attendance Status", size: "medium", minimized: false, position: 4 },
  { id: "calendar", type: "calendar", title: "Calendar", size: "medium", minimized: false, position: 5 },
  { id: "quick-links", type: "quick-links", title: "Quick Links", size: "small", minimized: false, position: 6 },
]

// Widget content component
const WidgetContent = ({ type, size }: { type: WidgetType; size: Widget["size"] }) => {
  const getHealthIcon = (health: string) => {
    switch (health) {
      case "on-track":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
  }

  const getHealthText = (health: string) => {
    switch (health) {
      case "on-track":
        return "On Track"
      case "at-risk":
        return "At Risk"
      case "delayed":
        return "Delayed"
      default:
        return "On Track"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge variant="warning">Medium</Badge>
      case "Low":
        return <Badge variant="success">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4 text-blue-500" />
      case "deadline":
        return <Clock className="h-4 w-4 text-red-500" />
      case "presentation":
        return <FileText className="h-4 w-4 text-amber-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-green-500" />
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />
    }
  }

  switch (type) {
    case "statistics":
      return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {sampleStatistics.map((stat, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground">{stat.name}</div>
              <div className="flex items-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div
                  className={cn(
                    "ml-2 flex items-center text-xs",
                    stat.trend === "up" ? "text-green-500" : "text-red-500",
                  )}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )

    case "projects":
      return (
        <div className="space-y-4">
          {sampleProjects.slice(0, size === "small" ? 1 : size === "medium" ? 2 : 3).map((project) => (
            <div key={project.id} className="flex flex-col space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Link href={`/projects/${project.id}`} className="font-medium hover:underline truncate">
                  {project.name}
                </Link>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getHealthIcon(project.health)}
                  <span>{getHealthText(project.health)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member, i) => (
                    <Avatar key={i} className="h-7 w-7 border-2 border-background">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members.length > 3 && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Due {project.dueDate}</div>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/projects">View all projects</Link>
          </Button>
        </div>
      )

    case "tasks":
      return (
        <div className="space-y-4">
          {sampleTasks.slice(0, size === "small" ? 1 : size === "medium" ? 2 : 3).map((task) => (
            <div key={task.id} className="flex flex-col space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium truncate">{task.title}</div>
                {getPriorityBadge(task.priority)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">{task.project}</div>
                <div className="text-muted-foreground">Due {task.dueDate}</div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{task.status}</Badge>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/tasks/${task.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/tasks">View all tasks</Link>
          </Button>
        </div>
      )

    case "team":
      return (
        <div className="space-y-4">
          {sampleTeamActivity.slice(0, size === "small" ? 2 : size === "medium" ? 3 : 4).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  {activity.isNew && (
                    <Badge variant="success" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/team">View all activity</Link>
          </Button>
        </div>
      )

    case "calendar":
      return (
        <div className="space-y-4">
          <div className="rounded-md border p-3">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="py-1">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const isToday = i + 1 === new Date().getDate()
                const hasEvent = [5, 10, 15, 20].includes(i + 1)
                return (
                  <div
                    key={i}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-full text-xs",
                      isToday && "bg-primary text-primary-foreground",
                      hasEvent && !isToday && "bg-muted",
                    )}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Upcoming Events</h4>
            <div className="space-y-2">
              {sampleCalendarEvents.slice(0, size === "small" ? 1 : size === "medium" ? 2 : 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-lg border p-2">
                  <div className="flex items-center space-x-2">
                    {getEventTypeIcon(event.type)}
                    <div>
                      <div className="text-sm font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground">{event.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/calendar">View calendar</Link>
          </Button>
        </div>
      )

    case "time-tracking":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Recent Time Entries</h4>
            <Button variant="outline" size="sm">
              <Timer className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          </div>

          <div className="space-y-2">
            {sampleTimeEntries.slice(0, size === "small" ? 1 : size === "medium" ? 2 : 3).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <div className="text-sm font-medium">{entry.task}</div>
                  <div className="text-xs text-muted-foreground">{entry.project}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{entry.duration}</div>
                  <div className="text-xs text-muted-foreground">{entry.date}</div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/time-tracking">View all time entries</Link>
          </Button>
        </div>
      )

    case "announcements":
      return (
        <div className="space-y-4">
          {sampleAnnouncements.slice(0, size === "small" ? 1 : 2).map((announcement) => (
            <div key={announcement.id} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">{announcement.title}</div>
                <Badge variant="outline">{announcement.date}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={announcement.author.avatar} alt={announcement.author.name} />
                  <AvatarFallback>{announcement.author.initials}</AvatarFallback>
                </Avatar>
                Posted by {announcement.author.name}
              </div>
            </div>
          ))}
        </div>
      )

    case "quick-links":
      return (
        <div className="grid grid-cols-3 gap-2">
          {sampleQuickLinks.slice(0, size === "small" ? 6 : size === "medium" ? 9 : 12).map((link) => (
            <Button
              key={link.id}
              variant="outline"
              size="sm"
              className="h-auto py-2 flex flex-col items-center justify-center gap-1"
              asChild
            >
              <Link href={link.url}>
                {link.icon}
                <span className="text-xs">{link.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      )
    case "attendance":
      return <AttendanceWidgetComponent size={size} />

    default:
      return <div>Unknown widget type</div>
  }
}

export function DashboardWidgets() {
  const { toast } = useToast()
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [isAddingWidget, setIsAddingWidget] = useState(false)
  const [availableWidgets, setAvailableWidgets] = useState<WidgetType[]>([])

  // Initialize widgets from localStorage or defaults
  useEffect(() => {
    const savedWidgets = localStorage.getItem("dashboardWidgets")
    if (savedWidgets) {
      try {
        setWidgets(JSON.parse(savedWidgets))
      } catch (error) {
        console.error("Error parsing saved widgets:", error)
        setWidgets(defaultWidgets)
      }
    } else {
      setWidgets(defaultWidgets)
    }
  }, [])

  // Save widgets to localStorage when they change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem("dashboardWidgets", JSON.stringify(widgets))
    }
  }, [widgets])

  // Update available widgets when widgets change
  useEffect(() => {
    const usedWidgetTypes = widgets.map((widget) => widget.type)
    const available: WidgetType[] = [
      "statistics",
      "projects",
      "tasks",
      "team",
      "calendar",
      "time-tracking",
      "announcements",
      "quick-links",
      "attendance",
    ].filter((type) => !usedWidgetTypes.includes(type as WidgetType)) as WidgetType[]

    setAvailableWidgets(available)
  }, [widgets])

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(widgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index,
    }))

    setWidgets(updatedItems)

    toast({
      title: "Widget moved",
      description: "The widget position has been updated.",
    })
  }

  // Add a new widget
  const addWidget = (type: WidgetType) => {
    const widgetConfig = {
      id: `${type}-${Date.now()}`,
      type,
      title: getWidgetTitle(type),
      size: "medium" as const,
      minimized: false,
      position: widgets.length,
    }

    setWidgets([...widgets, widgetConfig])
    setIsAddingWidget(false)

    toast({
      title: "Widget added",
      description: `${widgetConfig.title} has been added to your dashboard.`,
    })
  }

  // Remove a widget
  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id))

    toast({
      title: "Widget removed",
      description: "The widget has been removed from your dashboard.",
    })
  }

  // Toggle widget minimized state
  const toggleMinimize = (id: string) => {
    setWidgets(widgets.map((widget) => (widget.id === id ? { ...widget, minimized: !widget.minimized } : widget)))
  }

  // Change widget size
  const changeSize = (id: string, size: Widget["size"]) => {
    setWidgets(widgets.map((widget) => (widget.id === id ? { ...widget, size } : widget)))

    toast({
      title: "Widget resized",
      description: `Widget size changed to ${size}.`,
    })
  }

  // Reset widgets to default
  const resetWidgets = () => {
    setWidgets(defaultWidgets)

    toast({
      title: "Widgets reset",
      description: "Your dashboard has been reset to the default layout.",
    })
  }

  // Get widget title based on type
  const getWidgetTitle = (type: WidgetType): string => {
    switch (type) {
      case "statistics":
        return "Statistics Overview"
      case "projects":
        return "Recent Projects"
      case "tasks":
        return "My Tasks"
      case "team":
        return "Team Activity"
      case "calendar":
        return "Calendar"
      case "time-tracking":
        return "Time Tracking"
      case "announcements":
        return "Announcements"
      case "quick-links":
        return "Quick Links"
      case "attendance":
        return "Attendance Status"
      default:
        return "Widget"
    }
  }

  // Get widget icon based on type
  const getWidgetIcon = (type: WidgetType) => {
    switch (type) {
      case "statistics":
        return <BarChart3 className="h-4 w-4" />
      case "projects":
        return <Folder className="h-4 w-4" />
      case "tasks":
        return <ListTodo className="h-4 w-4" />
      case "team":
        return <Users className="h-4 w-4" />
      case "calendar":
        return <Calendar className="h-4 w-4" />
      case "time-tracking":
        return <Clock className="h-4 w-4" />
      case "announcements":
        return <Megaphone className="h-4 w-4" />
      case "quick-links":
        return <LinkIcon className="h-4 w-4" />
      case "attendance":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Layers className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsAddingWidget(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Cog className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Dashboard Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetWidgets}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Default
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Add Widget Dialog */}
      {isAddingWidget && (
        <Card>
          <CardHeader>
            <CardTitle>Add Widget</CardTitle>
            <CardDescription>Select a widget to add to your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableWidgets.length > 0 ? (
                availableWidgets.map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="flex flex-col items-center justify-center h-24 gap-2"
                    onClick={() => addWidget(type)}
                  >
                    {getWidgetIcon(type)}
                    <span className="text-sm">{getWidgetTitle(type)}</span>
                  </Button>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  All available widgets are already on your dashboard
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingWidget(false)}>
              Cancel
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Widgets Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {widgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "col-span-1",
                          widget.size === "large" && "md:col-span-2 lg:col-span-3",
                          widget.size === "medium" && "lg:col-span-1",
                        )}
                      >
                        <CardWrapper
                          title={widget.title}
                          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
                          headerAction={
                            <div className="flex items-center gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Grid3X3 className="h-4 w-4" />
                                    <span className="sr-only">Resize</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Resize Widget</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => changeSize(widget.id, "small")}>
                                    Small
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => changeSize(widget.id, "medium")}>
                                    Medium
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => changeSize(widget.id, "large")}>
                                    Large
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleMinimize(widget.id)}
                              >
                                {widget.minimized ? (
                                  <Maximize2 className="h-4 w-4" />
                                ) : (
                                  <Minimize2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">{widget.minimized ? "Maximize" : "Minimize"}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeWidget(widget.id)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          }
                        >
                          <div {...provided.dragHandleProps} className="flex items-center gap-2 mb-2">
                            {getWidgetIcon(widget.type)}
                          </div>
                          {!widget.minimized && <WidgetContent type={widget.type} size={widget.size} />}
                        </CardWrapper>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

const AttendanceWidgetComponent = ({ size }: { size: Widget["size"] }) => {
  const [isPresent, setIsPresent] = useState(true)
  const { startBreak, endBreak, isBreakActive } = useTimeTracking()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Attendance Status</h4>
        <Badge variant={isPresent ? "success" : "destructive"}>{isPresent ? "Present" : "Absent"}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setIsPresent(!isPresent)}>
          Mark {isPresent ? "Absent" : "Present"}
        </Button>
        {isPresent && (
          <Button variant="secondary" onClick={isBreakActive ? endBreak : startBreak}>
            {isBreakActive ? "End Break" : "Start Break"}
          </Button>
        )}
      </div>
      {isPresent && isBreakActive && <div className="text-sm text-muted-foreground">You are currently on break.</div>}
    </div>
  )
}
