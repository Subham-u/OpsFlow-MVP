"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Circle,
  Clock,
  Star,
  StarOff,
  CalendarIcon,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Filter,
  Zap,
  Award,
  Flame,
  Target,
  BarChart3,
  Tag,
  Paperclip,
  MessageSquare,
  AlertCircle,
  Timer,
  Plus,
  Search,
  Sparkles,
  Brain,
  ArrowRight,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Task type definition with enhanced properties
type Task = {
  id: string
  title: string
  description: string
  project: string
  dueDate: string
  priority: "High" | "Medium" | "Low"
  status: "Not Started" | "In Progress" | "Completed" | "On Hold" | "Blocked"
  completed: boolean
  starred: boolean
  tags: string[]
  subtasks: Subtask[]
  attachments: number
  comments: number
  estimatedTime: number // in minutes
  actualTime: number // in minutes
  createdAt: string
  updatedAt: string
  assignee?: string
}

type Subtask = {
  id: string
  title: string
  completed: boolean
}

// Productivity stats type
type ProductivityStats = {
  tasksCompleted: number
  tasksCreated: number
  streak: number
  weeklyProgress: number
  focusTime: number // in minutes
}

// Add AI task suggestions functionality
const useAiTaskSuggestions = (tasks: Task[]) => {
  const [suggestions, setSuggestions] = useState<{
    priorityChanges: { id: string; suggestedPriority: "High" | "Medium" | "Low" }[]
    timeEstimateChanges: { id: string; suggestedTime: number }[]
    taskBreakdownSuggestions: { id: string; suggestedSubtasks: string[] }[]
    generalSuggestions: string[]
  }>({
    priorityChanges: [],
    timeEstimateChanges: [],
    taskBreakdownSuggestions: [],
    generalSuggestions: [],
  })

  useEffect(() => {
    // In a real app, this would call an AI API
    // This is a mock implementation
    const mockAnalysis = {
      priorityChanges: [
        {
          id: tasks[0]?.id || "1",
          suggestedPriority: "High" as const,
        },
      ],
      timeEstimateChanges: [
        {
          id: tasks[0]?.id || "1",
          suggestedTime: 180, // 3 hours
        },
      ],
      taskBreakdownSuggestions: [
        {
          id: tasks[0]?.id || "1",
          suggestedSubtasks: [
            "Research competitor designs",
            "Create mobile wireframes",
            "Create desktop wireframes",
            "Prepare presentation for review",
          ],
        },
      ],
      generalSuggestions: [
        "Consider grouping related design tasks together for better workflow",
        "The marketing campaign tasks could benefit from being scheduled earlier in the week",
        "Based on your work patterns, morning hours seem most productive for complex tasks",
      ],
    }

    setSuggestions(mockAnalysis)
  }, [tasks])

  return suggestions
}

export function MyTasks() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design homepage wireframes",
      description: "Create wireframes for the new homepage design including mobile and desktop versions",
      project: "Website Redesign",
      dueDate: "Today",
      priority: "High",
      status: "In Progress",
      completed: false,
      starred: true,
      tags: ["design", "ui"],
      subtasks: [
        { id: "1-1", title: "Research competitor websites", completed: true },
        { id: "1-2", title: "Create mobile wireframes", completed: false },
        { id: "1-3", title: "Create desktop wireframes", completed: false },
      ],
      attachments: 2,
      comments: 3,
      estimatedTime: 120,
      actualTime: 45,
      createdAt: "2023-08-01",
      updatedAt: "2023-08-02",
    },
    {
      id: "2",
      title: "Create user personas",
      description: "Develop detailed user personas for the target audience",
      project: "Mobile App Development",
      dueDate: "Tomorrow",
      priority: "Medium",
      status: "Not Started",
      completed: false,
      starred: false,
      tags: ["research", "ux"],
      subtasks: [
        { id: "2-1", title: "Conduct user interviews", completed: false },
        { id: "2-2", title: "Analyze survey results", completed: false },
      ],
      attachments: 1,
      comments: 0,
      estimatedTime: 180,
      actualTime: 0,
      createdAt: "2023-08-02",
      updatedAt: "2023-08-02",
    },
    {
      id: "3",
      title: "Review content strategy",
      description: "Review and finalize content strategy document with marketing team",
      project: "Marketing Campaign",
      dueDate: "Aug 5",
      priority: "Low",
      status: "In Progress",
      completed: false,
      starred: false,
      tags: ["content", "marketing"],
      subtasks: [],
      attachments: 3,
      comments: 5,
      estimatedTime: 60,
      actualTime: 30,
      createdAt: "2023-08-01",
      updatedAt: "2023-08-03",
    },
    {
      id: "4",
      title: "Finalize social media posts",
      description: "Finalize copy and graphics for social media campaign launch",
      project: "Marketing Campaign",
      dueDate: "Aug 3",
      priority: "Medium",
      status: "In Progress",
      completed: false,
      starred: true,
      tags: ["social", "content"],
      subtasks: [
        { id: "4-1", title: "Write post copy", completed: true },
        { id: "4-2", title: "Design graphics", completed: false },
      ],
      attachments: 4,
      comments: 2,
      estimatedTime: 90,
      actualTime: 60,
      createdAt: "2023-07-30",
      updatedAt: "2023-08-02",
    },
  ])

  // Productivity stats
  const [stats, setStats] = useState<ProductivityStats>({
    tasksCompleted: 12,
    tasksCreated: 18,
    streak: 5,
    weeklyProgress: 68,
    focusTime: 420, // 7 hours
  })

  // UI state
  const [activeView, setActiveView] = useState<"list" | "board" | "matrix" | "focus">("list")
  const [groupBy, setGroupBy] = useState<"none" | "project" | "priority" | "status">("none")
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "title">("dueDate")
  const [filterPriority, setFilterPriority] = useState<"all" | "High" | "Medium" | "Low">("all")
  const [filterProject, setFilterProject] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedTasks, setExpandedTasks] = useState<string[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    project: "",
    priority: "Medium",
    dueDate: "",
    tags: [],
    subtasks: [],
  })
  const [newSubtask, setNewSubtask] = useState("")
  const [newTag, setNewTag] = useState("")
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showProductivityInsights, setShowProductivityInsights] = useState(false)

  const [viewType, setViewType] = useState<"list" | "board" | "matrix" | "focus">("list")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [searchText, setSearchText] = useState("")
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [taskViewSettings, setTaskViewSettings] = useLocalStorage("task-view-settings", {
    showCompleted: false,
    groupBy: "none" as "none" | "project" | "priority" | "status" | "dueDate",
    sortBy: "dueDate" as "dueDate" | "priority" | "title" | "project" | "createdAt",
    sortDirection: "asc" as "asc" | "desc",
  })

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Filter by completion status
      if (!showCompleted && task.completed) return false

      // Filter by priority
      if (filterPriority !== "all" && task.priority !== filterPriority) return false

      // Filter by project
      if (filterProject !== "all" && task.project !== filterProject) return false

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.project.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by starred first
      if (a.starred && !b.starred) return -1
      if (!a.starred && b.starred) return 1

      // Then sort by the selected sort method
      switch (sortBy) {
        case "dueDate":
          return a.dueDate.localeCompare(b.dueDate)
        case "priority": {
          const priorityOrder = { High: 0, Medium: 1, Low: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        }
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const aiSuggestions = useAiTaskSuggestions(tasks)

  // Enhanced filtered tasks with search and date filtering
  const enhancedFilteredTasks = useMemo(() => {
    return filteredTasks.filter((task) => {
      // Apply search filter
      if (searchText) {
        const searchLower = searchText.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(searchLower)
        const matchesDescription = task.description.toLowerCase().includes(searchLower)
        const matchesProject = task.project.toLowerCase().includes(searchLower)
        const matchesTags = task.tags.some((tag) => tag.toLowerCase().includes(searchLower))

        if (!(matchesTitle || matchesDescription || matchesProject || matchesTags)) {
          return false
        }
      }

      // Apply date filter
      if (dateFilter) {
        const taskDate = new Date(task.dueDate)
        const filterDate = new Date(dateFilter)

        // Compare year, month, and day only
        if (
          taskDate.getFullYear() !== filterDate.getFullYear() ||
          taskDate.getMonth() !== filterDate.getMonth() ||
          taskDate.getDate() !== filterDate.getDate()
        ) {
          return false
        }
      }

      return true
    })
  }, [filteredTasks, searchText, dateFilter])

  // Group tasks if grouping is enabled
  const groupedTasks = () => {
    if (groupBy === "none") return { "All Tasks": filteredTasks }

    return filteredTasks.reduce(
      (groups, task) => {
        const key = groupBy === "project" ? task.project : groupBy === "priority" ? task.priority : task.status

        if (!groups[key]) groups[key] = []
        groups[key].push(task)
        return groups
      },
      {} as Record<string, Task[]>,
    )
  }

  // Handle task toggle
  const handleTaskToggle = (taskId: string, checked: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: checked,
              status: checked ? "Completed" : "In Progress",
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : task,
      ),
    )

    const taskTitle = tasks.find((task) => task.id === taskId)?.title

    // Update stats
    if (checked) {
      setStats((prev) => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
      }))

      // Show celebration animation
      toast({
        title: "🎉 Task completed!",
        description: taskTitle,
      })
    } else {
      setStats((prev) => ({
        ...prev,
        tasksCompleted: Math.max(0, prev.tasksCompleted - 1),
      }))

      toast({
        title: "Task reopened",
        description: taskTitle,
      })
    }
  }

  // Handle subtask toggle
  const handleSubtaskToggle = (taskId: string, subtaskId: string, checked: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed: checked } : subtask,
              ),
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : task,
      ),
    )
  }

  // Toggle task star status
  const toggleTaskStar = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, starred: !task.starred } : task)))
  }

  // Toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "Not Started":
        return <Circle className="h-4 w-4 text-gray-400" />
      case "On Hold":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "Blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  // Calculate subtask progress
  const calculateSubtaskProgress = (subtasks: Subtask[]) => {
    if (subtasks.length === 0) return 100
    return Math.round((subtasks.filter((st) => st.completed).length / subtasks.length) * 100)
  }

  // Format time (minutes to hours and minutes)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask) return

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTask.id ? { ...editingTask, updatedAt: new Date().toISOString().split("T")[0] } : task,
      ),
    )

    setIsEditDialogOpen(false)
    setEditingTask(null)

    toast({
      title: "Task updated",
      description: "Your changes have been saved",
    })
  }

  // Add new subtask to editing task
  const addSubtaskToEditingTask = () => {
    if (!editingTask || !newSubtask.trim()) return

    setEditingTask({
      ...editingTask,
      subtasks: [
        ...editingTask.subtasks,
        {
          id: `${editingTask.id}-${editingTask.subtasks.length + 1}`,
          title: newSubtask,
          completed: false,
        },
      ],
    })

    setNewSubtask("")
  }

  // Add new tag to editing task
  const addTagToEditingTask = () => {
    if (!editingTask || !newTag.trim()) return
    if (editingTask.tags.includes(newTag)) return

    setEditingTask({
      ...editingTask,
      tags: [...editingTask.tags, newTag],
    })

    setNewTag("")
  }

  // Remove tag from editing task
  const removeTagFromEditingTask = (tag: string) => {
    if (!editingTask) return

    setEditingTask({
      ...editingTask,
      tags: editingTask.tags.filter((t) => t !== tag),
    })
  }

  // Create new task
  const createNewTask = () => {
    if (!newTask.title || !newTask.project || !newTask.dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toISOString().split("T")[0]
    const newTaskComplete: Task = {
      id: `task-${tasks.length + 1}`,
      title: newTask.title || "",
      description: newTask.description || "",
      project: newTask.project || "",
      dueDate: newTask.dueDate || now,
      priority: (newTask.priority as "High" | "Medium" | "Low") || "Medium",
      status: "Not Started",
      completed: false,
      starred: false,
      tags: newTask.tags || [],
      subtasks: newTask.subtasks || [],
      attachments: 0,
      comments: 0,
      estimatedTime: 0,
      actualTime: 0,
      createdAt: now,
      updatedAt: now,
    }

    setTasks((prev) => [...prev, newTaskComplete])

    // Reset form
    setNewTask({
      title: "",
      description: "",
      project: "",
      priority: "Medium",
      dueDate: "",
      tags: [],
      subtasks: [],
    })

    setIsNewTaskDialogOpen(false)

    // Update stats
    setStats((prev) => ({
      ...prev,
      tasksCreated: prev.tasksCreated + 1,
    }))

    toast({
      title: "Task created",
      description: "New task has been added to your list",
    })
  }

  // Add subtask to new task
  const addSubtaskToNewTask = () => {
    if (!newSubtask.trim()) return

    setNewTask({
      ...newTask,
      subtasks: [
        ...(newTask.subtasks || []),
        {
          id: `new-${Date.now()}`,
          title: newSubtask,
          completed: false,
        },
      ],
    })

    setNewSubtask("")
  }

  // Add tag to new task
  const addTagToNewTask = () => {
    if (!newTag.trim()) return
    if (newTask.tags?.includes(newTag)) return

    setNewTask({
      ...newTask,
      tags: [...(newTask.tags || []), newTag],
    })

    setNewTag("")
  }

  // Remove tag from new task
  const removeTagFromNewTask = (tag: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags?.filter((t) => t !== tag) || [],
    })
  }

  // Start timer for a task
  const startTimer = (taskId: string) => {
    // Stop any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setActiveTaskId(taskId)
    setIsTimerRunning(true)
    setTimerSeconds(0)

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1)
    }, 1000)

    toast({
      title: "Timer started",
      description: `Tracking time for: ${tasks.find((t) => t.id === taskId)?.title}`,
    })
  }

  // Stop timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (activeTaskId) {
      const minutes = Math.floor(timerSeconds / 60)

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTaskId
            ? {
                ...task,
                actualTime: task.actualTime + minutes,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : task,
        ),
      )

      // Update stats
      setStats((prev) => ({
        ...prev,
        focusTime: prev.focusTime + minutes,
      }))

      toast({
        title: "Timer stopped",
        description: `Added ${formatTime(minutes)} to task`,
      })
    }

    setIsTimerRunning(false)
    setActiveTaskId(null)
    setTimerSeconds(0)
  }

  // Format timer display
  const formatTimerDisplay = () => {
    const minutes = Math.floor(timerSeconds / 60)
    const seconds = timerSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Get unique projects for filter
  const uniqueProjects = Array.from(new Set(tasks.map((task) => task.project)))

  // Handle drag and drop for board view
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    // If dropped in a different column, update the task status
    if (source.droppableId !== destination.droppableId) {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.id === result.draggableId) {
            let newStatus: "Not Started" | "In Progress" | "Completed" | "On Hold" | "Blocked"

            switch (destination.droppableId) {
              case "todo":
                newStatus = "Not Started"
                break
              case "in-progress":
                newStatus = "In Progress"
                break
              case "completed":
                newStatus = "Completed"
                break
              case "on-hold":
                newStatus = "On Hold"
                break
              case "blocked":
                newStatus = "Blocked"
                break
              default:
                newStatus = task.status
            }

            return {
              ...task,
              status: newStatus,
              completed: newStatus === "Completed",
              updatedAt: new Date().toISOString().split("T")[0],
            }
          }
          return task
        })
      })

      toast({
        title: "Task status updated",
        description: `Task moved to ${destination.droppableId.replace(/-/g, " ")}`,
      })
    }
  }

  // Render AI suggestions panel
  const renderAiSuggestions = () => {
    if (!showAiSuggestions) return null

    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">AI Task Suggestions</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowAiSuggestions(false)}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {aiSuggestions.priorityChanges.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Priority Recommendations</h4>
              <ul className="space-y-1 text-sm">
                {aiSuggestions.priorityChanges.map((change) => {
                  const task = tasks.find((t) => t.id === change.id)
                  return task ? (
                    <li key={change.id} className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>
                        Consider changing <span className="font-medium">{task.title}</span> from {task.priority} to{" "}
                        {change.suggestedPriority} priority
                      </span>
                    </li>
                  ) : null
                })}
              </ul>
            </div>
          )}

          {aiSuggestions.timeEstimateChanges.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Time Estimate Adjustments</h4>
              <ul className="space-y-1 text-sm">
                {aiSuggestions.timeEstimateChanges.map((change) => {
                  const task = tasks.find((t) => t.id === change.id)
                  return task ? (
                    <li key={change.id} className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>
                        <span className="font-medium">{task.title}</span> might take {formatTime(change.suggestedTime)}{" "}
                        instead of {formatTime(task.estimatedTime)}
                      </span>
                    </li>
                  ) : null
                })}
              </ul>
            </div>
          )}

          {aiSuggestions.taskBreakdownSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Task Breakdown Suggestions</h4>
              {aiSuggestions.taskBreakdownSuggestions.map((suggestion) => {
                const task = tasks.find((t) => t.id === suggestion.id)
                return task ? (
                  <div key={suggestion.id} className="space-y-1">
                    <p className="text-sm">
                      Consider breaking down <span className="font-medium">{task.title}</span> into these subtasks:
                    </p>
                    <ul className="space-y-1 text-sm pl-6 list-disc">
                      {suggestion.suggestedSubtasks.map((subtask, index) => (
                        <li key={index}>{subtask}</li>
                      ))}
                    </ul>
                  </div>
                ) : null
              })}
            </div>
          )}

          {aiSuggestions.generalSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">General Productivity Tips</h4>
              <ul className="space-y-1 text-sm">
                {aiSuggestions.generalSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <Brain className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Apply All Suggestions
          </Button>
        </div>
      </div>
    )
  }

  // Render task list view
  const renderTaskList = () => {
    const groups = groupedTasks()

    return (
      <div className="space-y-6">
        {Object.entries(groups).map(([groupName, groupTasks]) => (
          <div key={groupName} className="space-y-4">
            {groupBy !== "none" && (
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">{groupName}</h3>
                <Badge variant="outline">{groupTasks.length}</Badge>
              </div>
            )}

            <div className="space-y-3">
              {groupTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "rounded-lg border bg-card shadow-sm transition-all duration-200",
                    expandedTasks.includes(task.id) ? "p-4" : "p-3",
                    task.completed ? "bg-muted/50" : "",
                    task.starred ? "border-l-4 border-l-amber-400" : "",
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`task-${task.id}`}
                      className="mt-0.5"
                      checked={task.completed}
                      onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                          <label
                            htmlFor={`task-${task.id}`}
                            className={cn(
                              "font-medium cursor-pointer hover:underline truncate",
                              task.completed ? "line-through text-muted-foreground" : "",
                            )}
                          >
                            {task.title}
                          </label>

                          {task.subtasks.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => toggleTaskStar(task.id)}
                                >
                                  {task.starred ? (
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  ) : (
                                    <StarOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span className="sr-only">{task.starred ? "Unstar task" : "Star task"}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{task.starred ? "Unstar task" : "Star task"}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => toggleTaskExpansion(task.id)}
                                >
                                  {expandedTasks.includes(task.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {expandedTasks.includes(task.id) ? "Collapse" : "Expand"}
                                  </span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{expandedTasks.includes(task.id) ? "Collapse" : "Expand"}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTask(task)}>Edit task</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => startTimer(task.id)}>Start timer</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete task</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-1 text-sm text-muted-foreground">
                        <span>{task.project}</span>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(task.status)}
                          <span>Due {task.dueDate}</span>
                        </div>
                      </div>

                      {expandedTasks.includes(task.id) && (
                        <div className="mt-3 space-y-3">
                          {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}

                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {task.subtasks.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium">Subtasks</span>
                                <span>{calculateSubtaskProgress(task.subtasks)}% complete</span>
                              </div>

                              <Progress value={calculateSubtaskProgress(task.subtasks)} className="h-1" />

                              <div className="space-y-1 mt-2">
                                {task.subtasks.map((subtask) => (
                                  <div key={subtask.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`subtask-${subtask.id}`}
                                      checked={subtask.completed}
                                      onCheckedChange={(checked) =>
                                        handleSubtaskToggle(task.id, subtask.id, checked as boolean)
                                      }
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
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <div className="flex items-center space-x-3">
                              {task.attachments > 0 && (
                                <span className="flex items-center">
                                  <Paperclip className="h-3 w-3 mr-1" />
                                  {task.attachments}
                                </span>
                              )}

                              {task.comments > 0 && (
                                <span className="flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {task.comments}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>

                              {task.estimatedTime > 0 && (
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(task.actualTime)}/{formatTime(task.estimatedTime)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                              Edit
                            </Button>
                            <Button variant="default" size="sm" onClick={() => startTimer(task.id)}>
                              Start Timer
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Render task board view (Kanban style)
  const renderTaskBoard = () => {
    const statusColumns = [
      { id: "Not Started", title: "To Do" },
      { id: "In Progress", title: "In Progress" },
      { id: "On Hold", title: "On Hold" },
      { id: "Completed", title: "Completed" },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((column) => {
          const columnTasks = filteredTasks.filter((task) => task.status === column.id)

          return (
            <div key={column.id} className="flex flex-col">
              <div className="rounded-t-md bg-muted p-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">{column.title}</h3>
                <Badge variant="outline">{columnTasks.length}</Badge>
              </div>

              <div className="flex-1 border rounded-b-md p-2 bg-card/50 min-h-[300px] space-y-2">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "rounded-md border bg-card p-3 shadow-sm",
                      task.starred ? "border-l-4 border-l-amber-400" : "",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleTaskStar(task.id)}>
                        {task.starred ? (
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ) : (
                          <StarOff className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>

                    {task.subtasks.length > 0 && (
                      <div className="mt-2">
                        <Progress value={calculateSubtaskProgress(task.subtasks)} className="h-1" />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>Subtasks</span>
                          <span>
                            {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {task.dueDate}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{task.project}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleEditTask(task)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Render priority matrix view (Eisenhower matrix)
  const renderMatrixViewOriginal = () => {
    const matrix = {
      "urgent-important": filteredTasks.filter((t) => t.priority === "High"),
      "not-urgent-important": filteredTasks.filter((t) => t.priority === "Medium"),
      "urgent-not-important": filteredTasks.filter((t) => t.priority === "Low" && new Date(t.dueDate) <= new Date()),
      "not-urgent-not-important": filteredTasks.filter((t) => t.priority === "Low" && new Date(t.dueDate) > new Date()),
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md bg-red-50 dark:bg-red-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-1 text-red-500" />
            Urgent & Important
          </h3>
          <div className="space-y-2">
            {matrix["urgent-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["urgent-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>

        <div className="border rounded-md bg-orange-50 dark:bg-orange-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-orange-500" />
            Important, Not Urgent
          </h3>
          <div className="space-y-2">
            {matrix["not-urgent-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["not-urgent-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>

        <div className="border rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1 text-yellow-500" />
            Urgent, Not Important
          </h3>
          <div className="space-y-2">
            {matrix["urgent-not-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["urgent-not-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>

        <div className="border rounded-md bg-green-50 dark:bg-green-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Target className="h-4 w-4 mr-1 text-green-500" />
            Neither Urgent nor Important
          </h3>
          <div className="space-y-2">
            {matrix["not-urgent-not-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["not-urgent-not-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render focus mode view
  const renderFocusViewOriginal = () => {
    // Get the most important task that's not completed
    const focusTask = filteredTasks
      .filter((t) => !t.completed)
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { High: 0, Medium: 1, Low: 2 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff

        // Then by due date
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })[0]

    if (!focusTask) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Award className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">All caught up!</h3>
          <p className="text-muted-foreground mb-6">You've completed all your tasks. Take a moment to celebrate!</p>
          <Button onClick={() => setIsNewTaskDialogOpen(true)}>Create a new task</Button>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-medium mb-1">Focus Mode</h3>
          <p className="text-muted-foreground">Focus on one task at a time for maximum productivity</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{focusTask.title}</span>
              <Badge variant="outline" className={getPriorityColor(focusTask.priority)}>
                {focusTask.priority}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due {focusTask.dueDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{focusTask.project}</span>
              </div>
            </div>

            {focusTask.description && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{focusTask.description}</p>
              </div>
            )}

            {focusTask.subtasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Subtasks</h4>
                <div className="space-y-2">
                  {focusTask.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`focus-subtask-${subtask.id}`}
                        checked={subtask.completed}
                        onCheckedChange={(checked) => handleSubtaskToggle(focusTask.id, subtask.id, checked as boolean)}
                      />
                      <label
                        htmlFor={`focus-subtask-${subtask.id}`}
                        className={cn(
                          "text-sm cursor-pointer",
                          subtask.completed ? "line-through text-muted-foreground" : "",
                        )}
                      >
                        {subtask.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Timer</h4>
                {isTimerRunning && activeTaskId === focusTask.id ? (
                  <div className="text-lg font-mono">{formatTimerDisplay()}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {focusTask.actualTime > 0 ? `${formatTime(focusTask.actualTime)} tracked` : "No time tracked yet"}
                  </div>
                )}
              </div>

              {isTimerRunning && activeTaskId === focusTask.id ? (
                <Button variant="destructive" className="w-full" onClick={stopTimer}>
                  <Timer className="mr-2 h-4 w-4" />
                  Stop Timer
                </Button>
              ) : (
                <Button variant="default" className="w-full" onClick={() => startTimer(focusTask.id)}>
                  <Timer className="mr-2 h-4 w-4" />
                  Start Timer
                </Button>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleEditTask(focusTask)}>
              Edit Task
            </Button>
            <Button variant="default" onClick={() => handleTaskToggle(focusTask.id, true)}>
              Complete Task
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => {
              const nextTask = filteredTasks
                .filter((t) => !t.completed && t.id !== focusTask.id)
                .sort((a, b) => {
                  const priorityOrder = { High: 0, Medium: 1, Low: 2 }
                  const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
                  if (priorityDiff !== 0) return priorityDiff
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                })[0]

              if (nextTask) {
                handleTaskToggle(focusTask.id, true)
                toast({
                  title: "Moving to next task",
                  description: nextTask.title,
                })
              }
            }}
          >
            Skip and move to next task
          </Button>
        </div>
      </div>
    )
  }

  // Render productivity insights
  const renderProductivityInsights = () => {
    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Productivity Insights</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowProductivityInsights(false)}>
            Close
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md bg-muted p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
            <div className="text-sm text-muted-foreground">Tasks Completed</div>
          </div>

          <div className="rounded-md bg-muted p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-2">
              <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>

          <div className="rounded-md bg-muted p-3 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold">{formatTime(stats.focusTime)}</div>
            <div className="text-sm text-muted-foreground">Focus Time</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Weekly Goal Progress</span>
            <span>{stats.weeklyProgress}%</span>
          </div>
          <Progress value={stats.weeklyProgress} className="h-2" />
        </div>

        <div className="rounded-md bg-muted p-3">
          <h4 className="text-sm font-medium mb-2">Productivity Tips</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <Zap className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
              <span>Try to complete your high priority tasks first thing in the morning.</span>
            </li>
            <li className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 text-purple-500" />
              <span>Use the timer feature to stay focused and track your productivity.</span>
            </li>
            <li className="flex items-start">
              <Target className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
              <span>Break down large tasks into smaller subtasks for better progress tracking.</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  // Render board view
  const renderBoardView = () => {
    const columns = [
      { id: "todo", title: "To Do", status: "Not Started" },
      { id: "in-progress", title: "In Progress", status: "In Progress" },
      { id: "on-hold", title: "On Hold", status: "On Hold" },
      { id: "blocked", title: "Blocked", status: "Blocked" },
      { id: "completed", title: "Completed", status: "Completed" },
    ]

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="rounded-t-md bg-muted p-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">{column.title}</h3>
                <Badge variant="outline">
                  {enhancedFilteredTasks.filter((task) => task.status === column.status).length}
                </Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 border rounded-b-md p-2 bg-card/50 min-h-[300px] space-y-2 overflow-y-auto"
                  >
                    {enhancedFilteredTasks
                      .filter((task) => task.status === column.status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={cn(
                                "rounded-md border bg-card p-3 shadow-sm",
                                task.starred ? "border-l-4 border-l-amber-400" : "",
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium text-sm">{task.title}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => toggleTaskStar(task.id)}
                                >
                                  {task.starred ? (
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                  ) : (
                                    <StarOff className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>

                              {task.subtasks.length > 0 && (
                                <div className="mt-2">
                                  <Progress value={calculateSubtaskProgress(task.subtasks)} className="h-1" />
                                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                    <span>Subtasks</span>
                                    <span>
                                      {task.subtasks.filter((st) => st.completed).length}/{task.subtasks.length}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="mt-2 flex items-center justify-between">
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {task.dueDate}
                                </div>
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{task.project}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => handleEditTask(task)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    )
  }

  // Render matrix view
  const renderMatrixView = () => {
    const matrix = {
      "urgent-important": enhancedFilteredTasks.filter((t) => t.priority === "High"),
      "not-urgent-important": enhancedFilteredTasks.filter((t) => t.priority === "Medium"),
      "urgent-not-important": enhancedFilteredTasks.filter(
        (t) => t.priority === "Low" && new Date(t.dueDate) <= new Date(),
      ),
      "not-urgent-not-important": enhancedFilteredTasks.filter(
        (t) => t.priority === "Low" && new Date(t.dueDate) > new Date(),
      ),
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md bg-red-50 dark:bg-red-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-1 text-red-500" />
            Urgent & Important
          </h3>
          <div className="space-y-2">
            {matrix["urgent-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["urgent-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>

        <div className="border rounded-md bg-orange-50 dark:bg-orange-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-orange-500" />
            Important, Not Urgent
          </h3>
          <div className="space-y-2">
            {matrix["not-urgent-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["not-urgent-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>

        <div className="border rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1 text-yellow-500" />
            Urgent, Not Important
          </h3>
          <div className="space-y-2">
            {matrix["urgent-not-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["urgent-not-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>

        <div className="border rounded-md bg-green-50 dark:bg-green-900/20 p-3">
          <h3 className="font-medium mb-2 flex items-center">
            <Target className="h-4 w-4 mr-1 text-green-500" />
            Neither Urgent nor Important
          </h3>
          <div className="space-y-2">
            {matrix["not-urgent-not-important"].map((task) => (
              <div key={task.id} className="rounded-md border bg-card p-2 shadow-sm">
                <div className="flex items-start">
                  <Checkbox
                    id={`matrix-${task.id}`}
                    className="mt-0.5 mr-2"
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                  <div>
                    <label
                      htmlFor={`matrix-${task.id}`}
                      className={cn(
                        "font-medium cursor-pointer hover:underline",
                        task.completed ? "line-through text-muted-foreground" : "",
                      )}
                    >
                      {task.title}
                    </label>
                    <div className="text-xs text-muted-foreground mt-1">
                      {task.project} • Due {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {matrix["not-urgent-not-important"].length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-2">No tasks in this quadrant</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render focus mode view
  const renderFocusView = () => {
    // Get the most important task that's not completed
    const focusTask = enhancedFilteredTasks
      .filter((t) => !t.completed)
      .sort((a, b) => {
        // Sort by priority first
        const priorityOrder = { High: 0, Medium: 1, Low: 2 }
        const priorityDiff =
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        if (priorityDiff !== 0) return priorityDiff

        // Then by due date
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })[0]

    if (!focusTask) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Award className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">All caught up!</h3>
          <p className="text-muted-foreground mb-6">You've completed all your tasks. Take a moment to celebrate!</p>
          <Button onClick={() => setIsNewTaskDialogOpen(true)}>Create a new task</Button>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-medium mb-1">Focus Mode</h3>
          <p className="text-muted-foreground">Focus on one task at a time for maximum productivity</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{focusTask.title}</span>
              <Badge variant="outline" className={getPriorityColor(focusTask.priority)}>
                {focusTask.priority}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due {focusTask.dueDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>{focusTask.project}</span>
              </div>
            </div>

            {focusTask.description && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{focusTask.description}</p>
              </div>
            )}

            {focusTask.subtasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Subtasks</h4>
                <div className="space-y-2">
                  {focusTask.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`focus-subtask-${subtask.id}`}
                        checked={subtask.completed}
                        onCheckedChange={(checked) => handleSubtaskToggle(focusTask.id, subtask.id, checked as boolean)}
                      />
                      <label
                        htmlFor={`focus-subtask-${subtask.id}`}
                        className={cn(
                          "text-sm cursor-pointer",
                          subtask.completed ? "line-through text-muted-foreground" : "",
                        )}
                      >
                        {subtask.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Timer</h4>
                {isTimerRunning && activeTaskId === focusTask.id ? (
                  <div className="text-lg font-mono">{formatTimerDisplay()}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {focusTask.actualTime > 0 ? `${formatTime(focusTask.actualTime)} tracked` : "No time tracked yet"}
                  </div>
                )}
              </div>

              {isTimerRunning && activeTaskId === focusTask.id ? (
                <Button variant="destructive" className="w-full" onClick={stopTimer}>
                  <Timer className="mr-2 h-4 w-4" />
                  Stop Timer
                </Button>
              ) : (
                <Button variant="default" className="w-full" onClick={() => startTimer(focusTask.id)}>
                  <Timer className="mr-2 h-4 w-4" />
                  Start Timer
                </Button>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleEditTask(focusTask)}>
              Edit Task
            </Button>
            <Button variant="default" onClick={() => handleTaskToggle(focusTask.id, true)}>
              Complete Task
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => {
              const nextTask = enhancedFilteredTasks
                .filter((t) => !t.completed && t.id !== focusTask.id)
                .sort((a, b) => {
                  const priorityOrder = { High: 0, Medium: 1, Low: 2 }
                  const priorityDiff =
                    priorityOrder[a.priority as keyof typeof priorityOrder] -
                    priorityOrder[b.priority as keyof typeof priorityOrder]
                  if (priorityDiff !== 0) return priorityDiff
                  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                })[0]

              if (nextTask) {
                handleTaskToggle(focusTask.id, true)
                toast({
                  title: "Moving to next task",
                  description: nextTask.title,
                })
              }
            }}
          >
            Skip and move to next task
          </Button>
        </div>
      </div>
    )
  }

  // Add this to the return statement, replacing the existing Tabs component
  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">My Tasks</CardTitle>
        <div className="flex items-center space-x-2">
          {isTimerRunning && (
            <div className="flex items-center mr-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse" />
              <span className="font-mono">{formatTimerDisplay()}</span>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => setShowProductivityInsights(!showProductivityInsights)}>
            <BarChart3 className="h-4 w-4 mr-1" />
            Stats
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">View all</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        {showProductivityInsights ? (
          renderProductivityInsights()
        ) : (
          <div className="space-y-4">
            {renderAiSuggestions()}

            <div className="flex items-center justify-between px-2">
              <Tabs
                defaultValue="list"
                value={viewType}
                onValueChange={(value) => setViewType(value as any)}
                className="w-full"
              >
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="list">List</TabsTrigger>
                    <TabsTrigger value="board">Board</TabsTrigger>
                    <TabsTrigger value="matrix">Matrix</TabsTrigger>
                    <TabsTrigger value="focus">Focus</TabsTrigger>
                  </TabsList>

                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-[200px] pl-8"
                      />
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-3.5 w-3.5 mr-1" />
                          Filter
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Priority</h4>
                            <Select value={filterPriority} onValueChange={setFilterPriority as any}>
                              <SelectTrigger>
                                <SelectValue placeholder="Filter by priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Project</h4>
                            <Select value={filterProject} onValueChange={setFilterProject}>
                              <SelectTrigger>
                                <SelectValue placeholder="Filter by project" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Projects</SelectItem>
                                {uniqueProjects.map((project) => (
                                  <SelectItem key={project} value={project}>
                                    {project}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Due Date</h4>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="show-completed"
                              checked={taskViewSettings.showCompleted}
                              onCheckedChange={(checked) =>
                                setTaskViewSettings({
                                  ...taskViewSettings,
                                  showCompleted: !!checked,
                                })
                              }
                            />
                            <label htmlFor="show-completed" className="text-sm cursor-pointer">
                              Show completed tasks
                            </label>
                          </div>

                          <div className="flex justify-between">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFilterPriority("all")
                                setFilterProject("all")
                                setDateFilter(undefined)
                                setTaskViewSettings({
                                  ...taskViewSettings,
                                  showCompleted: false,
                                })
                              }}
                            >
                              Reset
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Filters applied",
                                  description: "Your task view has been updated",
                                })
                              }}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="sm" onClick={() => setShowAiSuggestions(!showAiSuggestions)}>
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      AI
                    </Button>

                    <Button variant="default" size="sm" onClick={() => setIsNewTaskDialogOpen(true)}>
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      New
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <TabsContent value="list" className="m-0">
                    {renderTaskList()}
                  </TabsContent>
                  <TabsContent value="board" className="m-0">
                    {renderBoardView()}
                  </TabsContent>
                  <TabsContent value="matrix" className="m-0">
                    {renderMatrixView()}
                  </TabsContent>
                  <TabsContent value="focus" className="m-0">
                    {renderFocusView()}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to your task here. Click save when you're done.</DialogDescription>
          </DialogHeader>

          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Task Name</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-project">Project</Label>
                  <Select
                    value={editingTask.project}
                    onValueChange={(value) => setEditingTask({ ...editingTask, project: value })}
                  >
                    <SelectTrigger id="edit-project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueProjects.map((project) => (
                        <SelectItem key={project} value={project}>
                          {project}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingTask.priority}
                    onValueChange={(value) =>
                      setEditingTask({
                        ...editingTask,
                        priority: value as "High" | "Medium" | "Low",
                      })
                    }
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingTask.status}
                    onValueChange={(value) =>
                      setEditingTask({
                        ...editingTask,
                        status: value as any,
                        completed: value === "Completed",
                      })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-due-date">Due Date</Label>
                  <Input
                    id="edit-due-date"
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Subtasks</Label>
                <div className="space-y-2">
                  {editingTask.subtasks.map(
                    (subtask, index) =>
                      (
                        <div key={subtask.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={(checked) => {
                          const updatedSubtasks = [...editingTask.subtasks]
                          updatedSubtasks[index].completed = !!checked
                          setEditingTask({ ...editingTask, subtasks: updatedSubtasks })
                        }}
                      />
                      <Input
                        value={subtask.title}
                        onChange={(e) => {
                          const updatedSubtasks = [...editingTask.subtasks]
                          updatedSubtasks[index].title = e.target.value
                          setEditingTask({ ...editingTask, subtasks: updatedSubtasks })
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updatedSubtasks = editingTask.subtasks.filter((_, i) => i !== index)
                          setEditingTask({ ...editingTask, subtasks: updatedSubtasks })
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"rentColor"\
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                      ),
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex items-center space-x-2">
                  <Input type="text" placeholder="New tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                  <Button type="button" onClick={addTagToEditingTask}>
                    Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {editingTask.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <Button variant="ghost" size="icon" onClick={() => removeTagFromEditingTask(tag)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <path d="M18 6 6 18" />
                          <path d="M6 6 18 18" />
                        </svg>
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={saveEditedTask}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>Create a new task to add to your list.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-title">Task Name</Label>
              <Input
                id="new-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-project">Project</Label>
                <Select value={newTask.project} onValueChange={(value) => setNewTask({ ...newTask, project: value })}>
                  <SelectTrigger id="new-project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueProjects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new-priority">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger id="new-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-due-date">Due Date</Label>
              <Input
                id="new-due-date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Subtasks</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="New subtask"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                />
                <Button type="button" onClick={addSubtaskToNewTask}>
                  Add Subtask
                </Button>
              </div>
              <div className="space-y-2">
                {(newTask.subtasks || []).map((subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-2">
                    <Checkbox checked={subtask.completed} disabled />
                    <Input value={subtask.title} disabled />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex items-center space-x-2">
                <Input type="text" placeholder="New tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                <Button type="button" onClick={addTagToNewTask}>
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {(newTask.tags || []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <Button variant="ghost" size="icon" onClick={() => removeTagFromNewTask(tag)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M18 6 6 18" />
                        <path d="M6 6 18 18" />
                      </svg>
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsNewTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={createNewTask}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
