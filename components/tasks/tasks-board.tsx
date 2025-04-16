"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useMemo } from "react"
import { useState, useEffect, useRef } from "react"
import {
  Clock,
  Sparkles,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  BarChart2,
  Star,
  StarOff,
  Plus,
  Search,
  List,
  KanbanIcon as LayoutKanban,
  LayoutGrid,
  Focus,
  MoreHorizontal,
  Zap,
  Brain,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Add more complex task type with additional properties
type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "critical"
  dueDate: string
  project: string
  assignee: {
    name: string
    avatar: string
    initials: string
  }
  tags: string[]
  energy: number // Energy level required (1-5)
  complexity: number // Complexity level (1-5)
  estimatedTime: number // in minutes
  actualTime: number // in minutes
  subtasks: Subtask[]
  dependencies: string[] // IDs of tasks this task depends on
  attachments: number
  comments: Comment[]
  progress: number // 0-100
  aiSuggestions?: AISuggestion
  pinned: boolean
  createdAt: string
  updatedAt: string
  completedAt?: string
  reminderSet?: string
  recurring?: string
}

type Subtask = {
  id: string
  title: string
  completed: boolean
}

type Comment = {
  id: string
  text: string
  author: {
    name: string
    avatar: string
    initials: string
  }
  createdAt: string
  reactions: { emoji: string; count: number }[]
}

type AISuggestion = {
  suggestedPriority?: string
  suggestedDueDate?: string
  relatedTasks?: string[]
  timeEstimate?: number
  suggestedTeamMembers?: string[]
  aiNotes?: string
}

type TaskViewMode = "board" | "list" | "calendar" | "timeline" | "focus" | "matrix"
type TaskSortOption = "dueDate" | "priority" | "title" | "project" | "estimatedTime" | "progress" | "energy"
type TaskFilterOption = { priority?: string; assignee?: string; dueDate?: string; tags?: string[]; project?: string }

export default function TasksBoard() {
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // State for tasks and UI
  const [tasks, setTasks] = useState<Task[]>([
    // Original tasks with enhanced properties
    {
      id: "1",
      title: "Design homepage wireframes",
      description: "Create wireframes for the new homepage design",
      status: "todo",
      priority: "high",
      dueDate: "2023-08-10",
      project: "Website Redesign",
      assignee: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      tags: ["design", "ui", "wireframes"],
      energy: 4,
      complexity: 3,
      estimatedTime: 120, // 2 hours
      actualTime: 0,
      subtasks: [
        { id: "1-1", title: "Research competitor websites", completed: true },
        { id: "1-2", title: "Create mobile wireframes", completed: false },
        { id: "1-3", title: "Create desktop wireframes", completed: false },
      ],
      dependencies: [],
      attachments: 2,
      comments: [
        {
          id: "c1",
          text: "Let's make sure we include mobile-first design principles",
          author: {
            name: "Dana Wilson",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "DW",
          },
          createdAt: "2023-08-05T10:30:00Z",
          reactions: [{ emoji: "👍", count: 2 }],
        },
      ],
      progress: 33,
      aiSuggestions: {
        suggestedPriority: "critical",
        suggestedDueDate: "2023-08-08",
        timeEstimate: 180,
        suggestedTeamMembers: ["Carl Davis", "Fiona Green"],
        aiNotes: "This task is blocking several dependent tasks. Consider prioritizing it or breaking it down further.",
      },
      pinned: true,
      createdAt: "2023-08-01T09:00:00Z",
      updatedAt: "2023-08-05T14:25:00Z",
      recurring: "never",
    },

    // Add more detailed tasks
    {
      id: "2",
      title: "Create user personas",
      description: "Develop detailed user personas for the target audience",
      status: "todo",
      priority: "medium",
      dueDate: "2023-08-15",
      project: "Mobile App Development",
      assignee: {
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "BS",
      },
      tags: ["research", "ux", "personas"],
      energy: 3,
      complexity: 4,
      estimatedTime: 240, // 4 hours
      actualTime: 0,
      subtasks: [
        { id: "2-1", title: "Conduct user interviews", completed: false },
        { id: "2-2", title: "Analyze survey results", completed: false },
        { id: "2-3", title: "Draft persona documents", completed: false },
      ],
      dependencies: [],
      attachments: 1,
      comments: [],
      progress: 0,
      pinned: false,
      createdAt: "2023-08-02T09:00:00Z",
      updatedAt: "2023-08-02T09:00:00Z",
      recurring: "never",
    },

    {
      id: "3",
      title: "Implement authentication",
      description: "Set up user authentication and authorization",
      status: "in-progress",
      priority: "critical",
      dueDate: "2023-08-12",
      project: "Mobile App Development",
      assignee: {
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "CD",
      },
      tags: ["development", "security", "backend"],
      energy: 5,
      complexity: 5,
      estimatedTime: 360, // 6 hours
      actualTime: 180,
      subtasks: [
        { id: "3-1", title: "Set up OAuth provider", completed: true },
        { id: "3-2", title: "Implement JWT handling", completed: false },
        { id: "3-3", title: "Create user roles and permissions", completed: false },
        { id: "3-4", title: "Write tests", completed: false },
      ],
      dependencies: [],
      attachments: 0,
      comments: [
        {
          id: "c2",
          text: "I'm running into issues with the OAuth integration. Might need an extra day.",
          author: {
            name: "Carl Davis",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "CD",
          },
          createdAt: "2023-08-08T15:45:00Z",
          reactions: [],
        },
      ],
      progress: 25,
      aiSuggestions: {
        suggestedTeamMembers: ["Greg Hall"],
        aiNotes: "Consider adding a security review after implementation.",
      },
      pinned: false,
      createdAt: "2023-08-03T14:00:00Z",
      updatedAt: "2023-08-08T15:45:00Z",
      recurring: "never",
    },

    {
      id: "4",
      title: "Design social media graphics",
      description: "Create graphics for social media campaign",
      status: "in-progress",
      priority: "medium",
      dueDate: "2023-08-08",
      project: "Marketing Campaign",
      assignee: {
        name: "Dana Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DW",
      },
      tags: ["design", "social-media", "graphics"],
      energy: 3,
      complexity: 2,
      estimatedTime: 180, // 3 hours
      actualTime: 120,
      subtasks: [
        { id: "4-1", title: "Create Instagram posts", completed: true },
        { id: "4-2", title: "Design Twitter banners", completed: true },
        { id: "4-3", title: "Make Facebook cover images", completed: false },
      ],
      dependencies: [],
      attachments: 4,
      comments: [],
      progress: 66,
      pinned: false,
      createdAt: "2023-08-04T10:00:00Z",
      updatedAt: "2023-08-07T11:30:00Z",
      recurring: "weekly",
    },

    {
      id: "5",
      title: "Review content strategy",
      description: "Review and finalize content strategy document",
      status: "review",
      priority: "low",
      dueDate: "2023-08-09",
      project: "Marketing Campaign",
      assignee: {
        name: "Eric Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EB",
      },
      tags: ["content", "strategy", "review"],
      energy: 2,
      complexity: 3,
      estimatedTime: 90, // 1.5 hours
      actualTime: 60,
      subtasks: [
        { id: "5-1", title: "Review SEO strategy", completed: true },
        { id: "5-2", title: "Analyze content calendar", completed: true },
        { id: "5-3", title: "Provide feedback", completed: false },
      ],
      dependencies: [],
      attachments: 2,
      comments: [],
      progress: 66,
      pinned: false,
      createdAt: "2023-08-05T09:00:00Z",
      updatedAt: "2023-08-07T16:15:00Z",
      recurring: "never",
    },

    {
      id: "6",
      title: "Finalize logo design",
      description: "Review and approve final logo design",
      status: "review",
      priority: "medium",
      dueDate: "2023-08-07",
      project: "Website Redesign",
      assignee: {
        name: "Fiona Green",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "FG",
      },
      tags: ["design", "branding", "logo"],
      energy: 2,
      complexity: 2,
      estimatedTime: 60, // 1 hour
      actualTime: 45,
      subtasks: [
        { id: "6-1", title: "Review color options", completed: true },
        { id: "6-2", title: "Check typography", completed: true },
        { id: "6-3", title: "Approve final version", completed: false },
      ],
      dependencies: [],
      attachments: 3,
      comments: [],
      progress: 66,
      pinned: false,
      createdAt: "2023-08-02T14:00:00Z",
      updatedAt: "2023-08-06T10:20:00Z",
      recurring: "never",
    },

    {
      id: "7",
      title: "Set up analytics",
      description: "Implement analytics tracking for the website",
      status: "done",
      priority: "medium",
      dueDate: "2023-08-05",
      project: "Website Redesign",
      assignee: {
        name: "Greg Hall",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "GH",
      },
      tags: ["development", "analytics", "tracking"],
      energy: 3,
      complexity: 3,
      estimatedTime: 120, // 2 hours
      actualTime: 90,
      subtasks: [
        { id: "7-1", title: "Set up Google Analytics", completed: true },
        { id: "7-2", title: "Configure event tracking", completed: true },
        { id: "7-3", title: "Create initial dashboard", completed: true },
      ],
      dependencies: [],
      attachments: 1,
      comments: [],
      progress: 100,
      pinned: false,
      createdAt: "2023-08-01T11:00:00Z",
      updatedAt: "2023-08-05T14:45:00Z",
      completedAt: "2023-08-05T14:45:00Z",
      recurring: "never",
    },

    {
      id: "8",
      title: "Create email templates",
      description: "Design and code email templates for campaign",
      status: "done",
      priority: "high",
      dueDate: "2023-08-04",
      project: "Marketing Campaign",
      assignee: {
        name: "Helen Irwin",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "HI",
      },
      tags: ["design", "email", "html"],
      energy: 4,
      complexity: 3,
      estimatedTime: 240, // 4 hours
      actualTime: 210,
      subtasks: [
        { id: "8-1", title: "Design newsletter template", completed: true },
        { id: "8-2", title: "Code responsive email", completed: true },
        { id: "8-3", title: "Test across email clients", completed: true },
      ],
      dependencies: [],
      attachments: 2,
      comments: [],
      progress: 100,
      pinned: false,
      createdAt: "2023-07-31T09:00:00Z",
      updatedAt: "2023-08-04T16:30:00Z",
      completedAt: "2023-08-04T16:30:00Z",
      recurring: "monthly",
    },
  ])

  // UI state
  const [viewMode, setViewMode] = useState<TaskViewMode>(isMobile ? "list" : "board")
  const [sortOption, setSortOption] = useState<TaskSortOption>("dueDate")
  const [filterOptions, setFilterOptions] = useState<TaskFilterOption>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newSubtask, setNewSubtask] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showProductivityInsights, setShowProductivityInsights] = useState(false)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [showTimeTracking, setShowTimeTracking] = useState(false)
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
    highPriority: 0,
    productivity: 0,
  })
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [flowMode, setFlowMode] = useState(false)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)

  // Set default view based on screen size
  useEffect(() => {
    if (isMobile) {
      setViewMode("list") // Use list view on mobile by default
    }
  }, [isMobile])

  // Calculate stats based on tasks
  useEffect(() => {
    const now = new Date()
    const stats = {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter((t) => new Date(t.dueDate) < now && t.status !== "done").length,
      upcoming: tasks.filter((t) => {
        const dueDate = new Date(t.dueDate)
        const threeDaysLater = new Date()
        threeDaysLater.setDate(now.getDate() + 3)
        return dueDate <= threeDaysLater && dueDate >= now && t.status !== "done"
      }).length,
      highPriority: tasks.filter((t) => t.priority === "high" || t.priority === "critical").length,
      productivity: Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) || 0,
    }
    setTaskStats(stats)
  }, [tasks])

  // Timer effect
  useEffect(() => {
    if (activeTimer) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [activeTimer])

  // Apply filters and sorting to tasks
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Filter by completion status
        if (!showCompletedTasks && task.status === "done") {
          return false
        }

        // Filter by search query
        if (
          searchQuery &&
          !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false
        }

        // Apply other filters
        if (filterOptions.priority && task.priority !== filterOptions.priority) {
          return false
        }

        if (filterOptions.assignee && task.assignee.name !== filterOptions.assignee) {
          return false
        }

        if (filterOptions.project && task.project !== filterOptions.project) {
          return false
        }

        if (filterOptions.tags && filterOptions.tags.length > 0) {
          if (!task.tags.some((tag) => filterOptions.tags?.includes(tag))) {
            return false
          }
        }

        // Due date filter (today, this week, overdue, etc.)
        if (filterOptions.dueDate) {
          const now = new Date()
          const taskDate = new Date(task.dueDate)

          if (filterOptions.dueDate === "today") {
            if (taskDate.toDateString() !== now.toDateString()) {
              return false
            }
          } else if (filterOptions.dueDate === "thisWeek") {
            const endOfWeek = new Date()
            endOfWeek.setDate(now.getDate() + (7 - now.getDay()))
            if (taskDate > endOfWeek || taskDate < now) {
              return false
            }
          } else if (filterOptions.dueDate === "overdue") {
            if (taskDate >= now || task.status === "done") {
              return false
            }
          }
        }

        return true
      })
      .sort((a, b) => {
        // Sort by pinned first
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1

        // Then by selected sort option
        switch (sortOption) {
          case "dueDate":
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          case "priority": {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          }
          case "title":
            return a.title.localeCompare(b.title)
          case "project":
            return a.project.localeCompare(b.project)
          case "estimatedTime":
            return b.estimatedTime - a.estimatedTime
          case "progress":
            return b.progress - a.progress
          case "energy":
            return b.energy - a.energy
          default:
            return 0
        }
      })
  }, [tasks, sortOption, filterOptions, searchQuery, showCompletedTasks])

  // Format time (seconds to HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
    setDraggedTask(taskId)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    setDraggedTask(null)

    // Don't update if dropping in the same column
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status === columnId) return

    // Update task status
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          // Calculate new progress based on status
          let newProgress = task.progress
          if (columnId === "done") {
            newProgress = 100
          } else if (columnId === "review") {
            newProgress = 75
          } else if (columnId === "in-progress") {
            newProgress = 25
          } else if (columnId === "todo") {
            newProgress = 0
          }

          return {
            ...task,
            status: columnId as "todo" | "in-progress" | "review" | "done",
            progress: newProgress,
            updatedAt: new Date().toISOString(),
            ...(columnId === "done" ? { completedAt: new Date().toISOString() } : {}),
          }
        }
        return task
      }),
    )

    toast({
      title: "Task updated",
      description: "Task status has been updated successfully",
    })

    // Add some fun celebration if task is completed
    if (columnId === "done") {
      toast({
        title: "🎉 Task completed!",
        description: "Great job! You're making excellent progress.",
      })
    }
  }

  // Handle move task from dropdown
  const handleMoveTask = (taskId: string, newStatus: "todo" | "in-progress" | "review" | "done") => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          // Calculate new progress based on status
          let newProgress = task.progress
          if (newStatus === "done") {
            newProgress = 100
          } else if (newStatus === "review") {
            newProgress = 75
          } else if (newStatus === "in-progress") {
            newProgress = 25
          } else if (newStatus === "todo") {
            newProgress = 0
          }

          return {
            ...task,
            status: newStatus,
            progress: newProgress,
            updatedAt: new Date().toISOString(),
            ...(newStatus === "done" ? { completedAt: new Date().toISOString() } : {}),
          }
        }
        return task
      }),
    )

    toast({
      title: "Task moved",
      description: `Task moved to ${newStatus.replace("-", " ")}`,
    })

    // Add some fun celebration if task is completed
    if (newStatus === "done") {
      toast({
        title: "🎉 Task completed!",
        description: "Great job! You're making excellent progress.",
      })
    }
  }

  // Handle start timer
  const handleStartTimer = (taskId: string) => {
    // Stop any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setActiveTimer(taskId)
    setTimerSeconds(0)
    setShowTimeTracking(true)

    toast({
      title: "Timer started",
      description: `Tracking time for: ${tasks.find((t) => t.id === taskId)?.title}`,
    })
  }

  // Handle stop timer
  const handleStopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (activeTimer) {
      const timeInMinutes = Math.ceil(timerSeconds / 60)

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTimer
            ? {
                ...task,
                actualTime: task.actualTime + timeInMinutes,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      )

      toast({
        title: "Timer stopped",
        description: `Tracked ${formatTime(timerSeconds)} for this task`,
      })
    }

    setActiveTimer(null)
    setTimerSeconds(0)
  }

  // Handle pin/unpin task
  const handlePinTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, pinned: !task.pinned } : task)))

    const task = tasks.find((t) => t.id === taskId)

    toast({
      title: task?.pinned ? "Task unpinned" : "Task pinned",
      description: task?.pinned ? "Task removed from pinned tasks" : "Task added to pinned tasks",
    })
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-purple-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "medium":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "low":
        return <Clock className="h-4 w-4 text-green-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Calculate remaining days to due date
  const getRemainingDays = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}`
    } else if (diffDays === 0) {
      return "Due today"
    } else {
      return `Due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
    }
  }

  // Add a new comment to a task
  const handleAddComment = () => {
    if (!selectedTask || !newComment.trim()) return

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      text: newComment,
      author: {
        name: "You", // In a real app, this would be the current user
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "YO",
      },
      createdAt: new Date().toISOString(),
      reactions: [],
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              comments: [...task.comments, newCommentObj],
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )

    setNewComment("")

    toast({
      title: "Comment added",
      description: "Your comment has been added to the task",
    })
  }

  // Add a new subtask
  const handleAddSubtask = () => {
    if (!selectedTask || !newSubtask.trim()) return

    const newSubtaskObj: Subtask = {
      id: `st${Date.now()}`,
      title: newSubtask,
      completed: false,
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              subtasks: [...task.subtasks, newSubtaskObj],
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )

    // Update the selected task to reflect changes
    setSelectedTask((prevTask) => {
      if (!prevTask) return null
      return {
        ...prevTask,
        subtasks: [...prevTask.subtasks, newSubtaskObj],
      }
    })

    setNewSubtask("")

    toast({
      title: "Subtask added",
      description: "New subtask has been added",
    })
  }

  // Toggle subtask completion
  const handleToggleSubtask = (subtaskId: string, completed: boolean) => {
    if (!selectedTask) return

    // Update the tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed } : subtask,
              ),
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )

    // Update the selected task to reflect changes
    setSelectedTask((prevTask) => {
      if (!prevTask) return null

      const updatedSubtasks = prevTask.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, completed } : subtask,
      )

      // Calculate new progress based on subtasks
      const completedSubtasks = updatedSubtasks.filter((st) => st.completed).length
      const totalSubtasks = updatedSubtasks.length
      const newProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : prevTask.progress

      return {
        ...prevTask,
        subtasks: updatedSubtasks,
        progress: newProgress,
      }
    })
  }

  // Request AI suggestions for a task
  const handleRequestAISuggestions = (taskId: string) => {
    // In a real app, this would make an API call to an AI service
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Simulate AI processing time
    toast({
      title: "Analyzing task...",
      description: "Our AI is analyzing your task to provide helpful suggestions.",
    })

    setTimeout(() => {
      // Generate mock AI suggestions
      const suggestions: AISuggestion = {
        suggestedPriority: task.priority === "low" ? "medium" : task.priority === "medium" ? "high" : "critical",
        suggestedDueDate: new Date(new Date(task.dueDate).setDate(new Date(task.dueDate).getDate() - 2))
          .toISOString()
          .split("T")[0],
        timeEstimate: Math.round(task.estimatedTime * 1.25), // Suggest 25% more time
        suggestedTeamMembers: ["Dana Wilson", "Carl Davis"],
        aiNotes:
          "Based on similar tasks, this might take longer than estimated. Consider breaking it down into smaller subtasks or allocating additional resources.",
        relatedTasks: tasks
          .filter((t) => t.id !== task.id && t.project === task.project)
          .slice(0, 3)
          .map((t) => t.title),
      }

      // Update the task with AI suggestions
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? { ...t, aiSuggestions: suggestions } : t)))

      // If the task is currently selected, update the selected task
      if (selectedTask?.id === taskId) {
        setSelectedTask((prev) => (prev ? { ...prev, aiSuggestions: suggestions } : null))
      }

      toast({
        title: "AI suggestions ready",
        description: "We've analyzed your task and provided recommendations.",
      })
    }, 1500)
  }

  // Apply AI suggestions to a task
  const handleApplyAISuggestions = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || !task.aiSuggestions) return

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              priority: (task.aiSuggestions?.suggestedPriority as "low" | "medium" | "high" | "critical") || t.priority,
              dueDate: task.aiSuggestions?.suggestedDueDate || t.dueDate,
              estimatedTime: task.aiSuggestions?.timeEstimate || t.estimatedTime,
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    )

    // If the task is currently selected, update the selected task
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              priority:
                (task.aiSuggestions?.suggestedPriority as "low" | "medium" | "high" | "critical") || prev.priority,
              dueDate: task.aiSuggestions?.suggestedDueDate || prev.dueDate,
              estimatedTime: task.aiSuggestions?.timeEstimate || prev.estimatedTime,
            }
          : null,
      )
    }

    toast({
      title: "AI suggestions applied",
      description: "The task has been updated with AI recommendations.",
    })
  }

  // Enter flow mode (distraction-free)
  const toggleFlowMode = () => {
    setFlowMode(!flowMode)

    toast({
      title: flowMode ? "Flow mode disabled" : "Flow mode enabled",
      description: flowMode ? "Welcome back to standard view" : "Distractions minimized. Focus on your tasks.",
    })
  }

  // Render the task board view (Kanban)
  const renderBoardView = () => {
    const columns = [
      { id: "todo", title: "To Do" },
      { id: "in-progress", title: "In Progress" },
      { id: "review", title: "Review" },
      { id: "done", title: "Done" },
    ]

    // Group tasks by status
    const tasksByStatus = {
      todo: filteredAndSortedTasks.filter((task) => task.status === "todo"),
      "in-progress": filteredAndSortedTasks.filter((task) => task.status === "in-progress"),
      review: filteredAndSortedTasks.filter((task) => task.status === "review"),
      done: filteredAndSortedTasks.filter((task) => task.status === "done"),
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card className={cn("h-full flex flex-col transition-all duration-200", draggedTask && "border-dashed")}>
              <CardHeader className="py-3 px-4 space-y-1">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  {column.title}
                  <Badge variant="outline" className="ml-2">
                    {tasksByStatus[column.id as keyof typeof tasksByStatus]?.length || 0}
                  </Badge>
                </CardTitle>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      column.id === "todo"
                        ? "bg-blue-500"
                        : column.id === "in-progress"
                          ? "bg-orange-500"
                          : column.id === "review"
                            ? "bg-purple-500"
                            : "bg-green-500",
                    )}
                    style={{
                      width: `${((tasksByStatus[column.id as keyof typeof tasksByStatus]?.length || 0) / Math.max(1, tasks.length)) * 100}%`,
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="px-2 pb-2 pt-0 flex-1 overflow-y-auto max-h-[calc(100vh-26rem)]">
                <div className="space-y-2 min-h-[50px]">
                  {(tasksByStatus[column.id as keyof typeof tasksByStatus]?.length || 0) === 0 ? (
                    <div className="h-24 flex items-center justify-center border border-dashed rounded-md text-muted-foreground text-sm p-2">
                      Drop tasks here
                    </div>
                  ) : (
                    tasksByStatus[column.id as keyof typeof tasksByStatus]?.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "rounded-md border bg-card p-3 shadow-sm cursor-move transition-all duration-150",
                          task.pinned && "border-l-4 border-l-amber-400",
                          draggedTask === task.id && "opacity-50",
                          task.priority === "critical" && "border-purple-300 dark:border-purple-800",
                          task.aiSuggestions && "border-l-4 border-l-cyan-400",
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => {
                          setSelectedTask(task)
                          setIsTaskDialogOpen(true)
                          setIsEditMode(false)
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 mr-2">
                            <h3 className="font-medium text-sm">{task.title}</h3>
                            {!flowMode && (
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                            )}
                          </div>
                          {!flowMode && (
                            <div className="flex flex-shrink-0">
                              {task.pinned && <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />}
                              {task.aiSuggestions && <Sparkles className="h-4 w-4 text-cyan-400 mr-1" />}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedTask(task)
                                      setIsTaskDialogOpen(true)
                                      setIsEditMode(true)
                                    }}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handlePinTask(task.id)
                                    }}
                                  >
                                    {task.pinned ? "Unpin task" : "Pin task"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleStartTimer(task.id)
                                    }}
                                  >
                                    Start timer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRequestAISuggestions(task.id)
                                    }}
                                  >
                                    Get AI insights
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMoveTask(task.id, "todo")
                                    }}
                                  >
                                    Move to To Do
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMoveTask(task.id, "in-progress")
                                    }}
                                  >
                                    Move to In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMoveTask(task.id, "review")
                                    }}
                                  >
                                    Move to Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMoveTask(task.id, "done")
                                    }}
                                  >
                                    Move to Done
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </div>

                        {!flowMode && (
                          <>
                            {task.subtasks.length > 0 && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>
                                    {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                                  </span>
                                  <span>{task.progress}%</span>
                                </div>
                                <Progress value={task.progress} className="h-1" />
                              </div>
                            )}

                            <div className="mt-3 flex items-center justify-between">
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </Badge>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDate(task.dueDate)}
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              {task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {task.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                      {tag}
                                    </span>
                                  ))}
                                  {task.tags.length > 2 && (
                                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                      +{task.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                              </Avatar>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  // Render task details dialog
  const renderTaskDialog = () => {
    if (!selectedTask) return null

    return (
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {isEditMode ? (
                <Input
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  className="text-lg"
                />
              ) : (
                <div className="flex items-center">
                  <span>{selectedTask.title}</span>
                  {selectedTask.pinned && <Star className="h-4 w-4 text-amber-400 fill-amber-400 ml-2" />}
                </div>
              )}
              {!isEditMode && (
                <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? (
                <Textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  className="mt-2"
                  placeholder="Task description"
                />
              ) : (
                selectedTask.description
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {isEditMode ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select
                    value={selectedTask.project}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, project: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedTask.status}
                    onValueChange={(value) =>
                      setSelectedTask({
                        ...selectedTask,
                        status: value as typeof selectedTask.status,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={selectedTask.priority}
                    onValueChange={(value) =>
                      setSelectedTask({
                        ...selectedTask,
                        priority: value as typeof selectedTask.priority,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={selectedTask.dueDate}
                    onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Energy Level (1-5)</Label>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[selectedTask.energy]}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, energy: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Complexity (1-5)</Label>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[selectedTask.complexity]}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, complexity: value[0] })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estimated Time (minutes)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={selectedTask.estimatedTime}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        estimatedTime: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Progress (%)</Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[selectedTask.progress]}
                    onValueChange={(value) => setSelectedTask({ ...selectedTask, progress: value[0] })}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={selectedTask.tags.join(", ")}
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Enter tags, separated by commas"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Project</div>
                    <div className="text-sm">{selectedTask.project}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <Badge
                      variant="outline"
                      className={cn(
                        selectedTask.status === "todo"
                          ? "border-blue-500 text-blue-600"
                          : selectedTask.status === "in-progress"
                            ? "border-orange-500 text-orange-600"
                            : selectedTask.status === "review"
                              ? "border-purple-500 text-purple-600"
                              : "border-green-500 text-green-600",
                      )}
                    >
                      {selectedTask.status === "todo"
                        ? "To Do"
                        : selectedTask.status === "in-progress"
                          ? "In Progress"
                          : selectedTask.status === "review"
                            ? "Review"
                            : "Done"}
                    </Badge>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-sm">
                      {formatDate(selectedTask.dueDate)} ({getRemainingDays(selectedTask.dueDate)})
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Assignee</div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={selectedTask.assignee.avatar} alt={selectedTask.assignee.name} />
                        <AvatarFallback>{selectedTask.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">Energy Level</div>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Zap
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < selectedTask.energy ? "text-amber-500 fill-amber-500" : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Complexity</div>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Brain
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < selectedTask.complexity ? "text-purple-500 fill-purple-500" : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Time</div>
                    <div className="text-sm">
                      {Math.floor(selectedTask.actualTime / 60)}h {selectedTask.actualTime % 60}m
                      {selectedTask.estimatedTime > 0 && (
                        <>
                          {" "}
                          / {Math.floor(selectedTask.estimatedTime / 60)}h {selectedTask.estimatedTime % 60}m
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {selectedTask.tags.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-1">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTask.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Progress</div>
                    <div className="text-sm">{selectedTask.progress}%</div>
                  </div>
                  <Progress value={selectedTask.progress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Subtasks</div>
                    <div className="text-sm">
                      {selectedTask.subtasks.filter((st) => st.completed).length}/{selectedTask.subtasks.length}{" "}
                      completed
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedTask.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subtask-${subtask.id}`}
                          checked={subtask.completed}
                          onCheckedChange={(checked) => handleToggleSubtask(subtask.id, checked as boolean)}
                        />
                        <label
                          htmlFor={`subtask-${subtask.id}`}
                          className={cn(
                            "text-sm cursor-pointer",
                            subtask.completed ? "line-through text-muted-foreground" : "",
                          )}
                        >
                          {subtask.title}
                        </label>
                      </div>
                    ))}

                    {selectedTask.subtasks.length === 0 && (
                      <div className="text-sm text-muted-foreground">No subtasks yet</div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add a subtask"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newSubtask.trim()) {
                          handleAddSubtask()
                        }
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                      Add
                    </Button>
                  </div>
                </div>

                {selectedTask.comments.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Comments</div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto">
                      {selectedTask.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{comment.author.name}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
                            </div>
                            <div className="text-sm mt-1">{comment.text}</div>
                            {comment.reactions.length > 0 && (
                              <div className="flex space-x-1 mt-1">
                                {comment.reactions.map((reaction, index) => (
                                  <div key={index} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                    {reaction.emoji} {reaction.count}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newComment.trim()) {
                        handleAddComment()
                      }
                    }}
                  />
                  <Button variant="outline" size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    Add
                  </Button>
                </div>

                {selectedTask.aiSuggestions && (
                  <div className="mt-4 p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium flex items-center">
                        <Sparkles className="h-4 w-4 text-cyan-500 mr-1" />
                        AI Suggestions
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleApplyAISuggestions(selectedTask.id)}>
                        Apply Suggestions
                      </Button>
                    </div>

                    <div className="space-y-2 text-sm">
                      {selectedTask.aiSuggestions.suggestedPriority && (
                        <div className="flex items-start space-x-2">
                          <div className="w-32 flex-shrink-0 font-medium">Priority:</div>
                          <div>
                            Suggested {selectedTask.aiSuggestions.suggestedPriority}
                            {selectedTask.aiSuggestions.suggestedPriority !== selectedTask.priority &&
                              ` (currently ${selectedTask.priority})`}
                          </div>
                        </div>
                      )}

                      {selectedTask.aiSuggestions.suggestedDueDate && (
                        <div className="flex items-start space-x-2">
                          <div className="w-32 flex-shrink-0 font-medium">Due Date:</div>
                          <div>
                            Suggested {formatDate(selectedTask.aiSuggestions.suggestedDueDate)}
                            {selectedTask.aiSuggestions.suggestedDueDate !== selectedTask.dueDate &&
                              ` (currently ${formatDate(selectedTask.dueDate)})`}
                          </div>
                        </div>
                      )}

                      {selectedTask.aiSuggestions.timeEstimate && (
                        <div className="flex items-start space-x-2">
                          <div className="w-32 flex-shrink-0 font-medium">Time Estimate:</div>
                          <div>
                            Suggested {Math.floor(selectedTask.aiSuggestions.timeEstimate / 60)}h{" "}
                            {selectedTask.aiSuggestions.timeEstimate % 60}m
                            {selectedTask.aiSuggestions.timeEstimate !== selectedTask.estimatedTime &&
                              ` (currently ${Math.floor(selectedTask.estimatedTime / 60)}h ${selectedTask.estimatedTime % 60}m)`}
                          </div>
                        </div>
                      )}

                      {selectedTask.aiSuggestions.suggestedTeamMembers &&
                        selectedTask.aiSuggestions.suggestedTeamMembers.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <div className="w-32 flex-shrink-0 font-medium">Team Members:</div>
                            <div>Consider involving {selectedTask.aiSuggestions.suggestedTeamMembers.join(", ")}</div>
                          </div>
                        )}

                      {selectedTask.aiSuggestions.relatedTasks &&
                        selectedTask.aiSuggestions.relatedTasks.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <div className="w-32 flex-shrink-0 font-medium">Related Tasks:</div>
                            <div>{selectedTask.aiSuggestions.relatedTasks.join(", ")}</div>
                          </div>
                        )}

                      {selectedTask.aiSuggestions.aiNotes && (
                        <div className="flex items-start space-x-2">
                          <div className="w-32 flex-shrink-0 font-medium">Notes:</div>
                          <div>{selectedTask.aiSuggestions.aiNotes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            {isEditMode ? (
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false)
                    // Reset to original task data
                    const originalTask = tasks.find((t) => t.id === selectedTask.id)
                    if (originalTask) {
                      setSelectedTask(originalTask)
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Update the task in the tasks array
                    setTasks((prevTasks) =>
                      prevTasks.map((task) => (task.id === selectedTask.id ? selectedTask : task)),
                    )
                    setIsEditMode(false)

                    toast({
                      title: "Task updated",
                      description: "Your changes have been saved",
                    })
                  }}
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <div className="flex justify-between w-full">
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handlePinTask(selectedTask.id)}>
                    {selectedTask.pinned ? (
                      <>
                        <StarOff className="h-4 w-4 mr-2" />
                        Unpin
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Pin
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(true)
                    }}
                  >
                    Edit
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleStartTimer(selectedTask.id)}>
                    <Timer className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>

                  <Button
                    onClick={() => {
                      const newStatus = selectedTask.status === "done" ? "todo" : "done"
                      handleMoveTask(selectedTask.id, newStatus)
                      setIsTaskDialogOpen(false)
                    }}
                  >
                    {selectedTask.status === "done" ? "Reopen Task" : "Complete Task"}
                  </Button>
                </div>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Render the time tracking overlay
  const renderTimeTrackingOverlay = () => {
    if (!showTimeTracking || !activeTimer) return null

    const task = tasks.find((t) => t.id === activeTimer)
    if (!task) return null

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-64 shadow-lg">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="truncate">Tracking: {task.title}</div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTimeTracking(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex flex-col items-center mt-2">
              <div className="text-2xl font-mono">{formatTime(timerSeconds)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Started {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <Button variant="destructive" size="sm" className="w-full" onClick={handleStopTimer}>
              Stop Timer
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Render task stats and analytics
  const renderTaskStats = () => {
    if (!showHeatmap) return null

    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Task Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Productivity Score</span>
                  <span>{taskStats.productivity}%</span>
                </div>
                <Progress value={taskStats.productivity} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium">Task Breakdown</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                    To Do
                  </span>
                  <span>{tasks.filter((t) => t.status === "todo").length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                    In Progress
                  </span>
                  <span>{tasks.filter((t) => t.status === "in-progress").length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                    Review
                  </span>
                  <span>{tasks.filter((t) => t.status === "review").length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                    Done
                  </span>
                  <span>{tasks.filter((t) => t.status === "done").length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Priority Distribution</div>
              <div className="h-32 flex items-end space-x-4">
                {["critical", "high", "medium", "low"].map((priority) => {
                  const count = tasks.filter((t) => t.priority === priority).length
                  const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0

                  return (
                    <div key={priority} className="flex-1 flex flex-col items-center">
                      <div className="text-xs mb-1">{count}</div>
                      <div
                        className={cn(
                          "w-full rounded-t-sm",
                          priority === "critical"
                            ? "bg-purple-500"
                            : priority === "high"
                              ? "bg-red-500"
                              : priority === "medium"
                                ? "bg-orange-500"
                                : "bg-green-500",
                        )}
                        style={{ height: `${Math.max(5, percentage)}%` }}
                      />
                      <div className="text-xs mt-1 capitalize">{priority}</div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium">Time Tracking</div>
                <div className="text-sm mt-1">
                  Total time tracked: {formatTime(tasks.reduce((acc, task) => acc + task.actualTime * 60, 0))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium">Task Highlights</div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                  <div className="text-sm">
                    {taskStats.overdue} overdue {taskStats.overdue === 1 ? "task" : "tasks"}
                  </div>
                </div>

                <div className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                  <Clock className="h-4 w-4 text-amber-500 mr-2" />
                  <div className="text-sm">
                    {taskStats.upcoming} upcoming {taskStats.upcoming === 1 ? "deadline" : "deadlines"}
                  </div>
                </div>

                <div className="flex items-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <div className="text-sm">
                    {taskStats.completed} completed {taskStats.completed === 1 ? "task" : "tasks"}
                  </div>
                </div>

                <div className="flex items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-purple-500 mr-2" />
                  <div className="text-sm">
                    {taskStats.highPriority} high priority {taskStats.highPriority === 1 ? "task" : "tasks"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">My Tasks</CardTitle>
        <div className="flex items-center space-x-2">
          {isTimerRunning && (
            <div className="flex items-center mr-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse" />
              <span className="font-mono">00:00:00</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <div className="space-y-4">
          {/* Mobile-optimized search and filter bar */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between px-2">
            <div className="flex items-center w-full md:w-auto">
              <div className="relative flex-1 md:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="ml-2" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between md:justify-end space-x-2">
              <div className="flex space-x-1">
                <Button
                  variant={viewMode === "board" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("board")}
                >
                  <LayoutKanban className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "matrix" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9 hidden md:flex"
                  onClick={() => setViewMode("matrix")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "focus" ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9 hidden md:flex"
                  onClick={() => setViewMode("focus")}
                >
                  <Focus className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={() => setIsNewTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2 md:block" />
                <span className="hidden md:inline">New Task</span>
                <span className="inline md:hidden">New</span>
              </Button>
            </div>
          </div>

          {/* Collapsible filters section - only visible when showFilters is true */}
          {showFilters && (
            <div className="p-4 border rounded-md bg-muted/30 space-y-4 mx-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  Hide
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-priority">Priority</Label>
                  <Select
                    value={filterOptions.priority || "all"}
                    onValueChange={(value) =>
                      setFilterOptions({ ...filterOptions, priority: value === "all" ? undefined : value })
                    }
                  >
                    <SelectTrigger id="filter-priority">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-due-date">Due Date</Label>
                  <Select
                    value={filterOptions.dueDate || "all"}
                    onValueChange={(value) =>
                      setFilterOptions({ ...filterOptions, dueDate: value === "all" ? undefined : value })
                    }
                  >
                    <SelectTrigger id="filter-due-date">
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setFilterOptions({})
                      setSortOption("dueDate")
                      setSearchQuery("")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-completed"
                  checked={showCompletedTasks}
                  onCheckedChange={(checked) => setShowCompletedTasks(!!checked)}
                />
                <label htmlFor="show-completed" className="text-sm cursor-pointer">
                  Show completed tasks
                </label>
              </div>
            </div>
          )}

          {/* Render the appropriate view */}
          {viewMode === "board" && renderBoardView()}
          {/* Other view renderers would go here */}
        </div>
      </CardContent>
      {renderTaskDialog()}
      {renderTimeTrackingOverlay()}
    </Card>
  )
}
