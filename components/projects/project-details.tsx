"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Share2,
  Trash,
  MessageSquare,
  Star,
  StarOff,
  Send,
  ChevronDown,
  Play,
  Pause,
  AlertTriangle,
  Award,
  Zap,
  Smile,
  ThumbsUp,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

// Import the date utilities
import { formatDate, formatDateTime } from "@/lib/date-utils"

// Import server actions
import {
  getProjectById,
  toggleProjectStar,
  addTask,
  updateTaskStatus,
  toggleTaskTracking,
  incrementTaskTimeTracked,
  addTaskComment,
  addTaskChecklistItem,
  toggleTaskChecklistItem,
  deleteTask,
  addProjectMember,
  addProjectFile,
  addProjectRisk,
  addProjectMilestone,
  toggleMilestoneStatus,
  addProjectComment,
  updateProject,
} from "@/lib/actions/project-actions"

import { getTeamMembers } from "@/lib/actions/team-actions"
import { getCurrentUser } from "@/lib/actions/user-actions"

type ProjectMember = {
  id: string
  name: string
  role: string
  avatar: string
  initials: string
}

type ProjectTask = {
  id: string
  title: string
  description: string
  status: "done" | "todo" | "in-progress" | "review"
  priority: string
  due_date: string
  assigned_to: string
  timeTracked: number
  isTracking: boolean
  comments: ProjectComment[]
  checklist: {
    id: string
    text: string
    completed: boolean
  }[]
}

type ProjectFile = {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedAt: string
}

type ProjectComment = {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  text: string
  timestamp: string
  reactions: { emoji: string; count: number }[]
}

type ProjectRisk = {
  id: string
  title: string
  impact: "low" | "medium" | "high"
  probability: "low" | "medium" | "high"
  status: "mitigated" | "active" | "accepted"
  owner: string
}

type ProjectMilestone = {
  id: string
  title: string
  dueDate: string
  completed: boolean
  description: string
}

type Project = {
  id: string
  name: string
  description: string
  status: string
  progress: number
  startDate: string
  dueDate: string
  isStarred: boolean
  members: ProjectMember[]
  tasks: {
    total: number
    completed: number
    items: ProjectTask[]
  }
  files: ProjectFile[]
  risks: ProjectRisk[]
  milestones: ProjectMilestone[]
  comments: ProjectComment[]
  analytics: {
    taskCompletionRate: number
    onTimeCompletion: number
    teamActivity: { date: string; count: number }[]
    tasksByStatus: { status: string; count: number }[]
    tasksByPriority: { priority: string; count: number }[]
  }
}

interface TeamMember {
  id: string
  name: string
  role: string
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  assigned_to: string
}

interface UpdateProjectData {
  tasks?: {
    items: ProjectTask[]
  }
}

export function ProjectDetails({ id }: { id: string }) {
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [openTaskDialog, setOpenTaskDialog] = useState(false)
  const [openMemberDialog, setOpenMemberDialog] = useState(false)
  const [openRiskDialog, setOpenRiskDialog] = useState(false)
  const [openMilestoneDialog, setOpenMilestoneDialog] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskAssignee, setTaskAssignee] = useState("")
  const [taskDueDate, setTaskDueDate] = useState("")
  const [taskPriority, setTaskPriority] = useState("medium")
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [memberRole, setMemberRole] = useState("member")
  const [riskTitle, setRiskTitle] = useState("")
  const [riskImpact, setRiskImpact] = useState<"low" | "medium" | "high">("medium")
  const [riskProbability, setRiskProbability] = useState<"low" | "medium" | "high">("medium")
  const [riskOwner, setRiskOwner] = useState("")
  const [milestoneTitle, setMilestoneTitle] = useState("")
  const [milestoneDueDate, setMilestoneDueDate] = useState("")
  const [milestoneDescription, setMilestoneDescription] = useState("")
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null)
  const [commentText, setCommentText] = useState("")
  const [projectComment, setProjectComment] = useState("")
  const [checklistItem, setChecklistItem] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAddingMember, setIsAddingMember] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isDeletingTask, setIsDeletingTask] = useState(false)
  const [isUpdatingTask, setIsUpdatingTask] = useState(false)

  // Fetch project data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjectById(id)
        setProject(projectData)

        const teamMembersData = await getTeamMembers()
        // Filter out members who are already in the project
        const availableMembers = teamMembersData.filter(
          (member: TeamMember) => !projectData.members.some((projectMember: TeamMember) => projectMember.id === member.id)
        )
        setTeamMembers(availableMembers)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  // Time tracking interval
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (project) {
      interval = setInterval(async () => {
        const trackingTask = project.tasks.items.find((task) => task.isTracking)

        if (trackingTask) {
          try {
            const result = await incrementTaskTimeTracked(trackingTask.id, project.id, 1)

            if (result.success) {
              // Update local state
              setProject((prevProject) => {
                if (!prevProject) return null

                const updatedTasks = prevProject.tasks.items.map((task) => {
                  if (task.id === trackingTask.id) {
                    return {
                      ...task,
                      timeTracked: result.timeTracked || task.timeTracked + 1,
                    }
                  }
                  return task
                })

                return {
                  ...prevProject,
                  tasks: {
                    ...prevProject.tasks,
                    items: updatedTasks,
                  },
                }
              })
            }
          } catch (error) {
            console.error("Error updating time tracked:", error)
          }
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [project])

  const handleAddTask = async () => {
    if (!taskTitle) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      })
      return
    }

    if (!taskDueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    setIsAddingTask(true)
    try {
      const result = await addTask(project!.id, {
        title: taskTitle,
        description: taskDescription,
        status: "todo",
        assignee_id: taskAssignee || null,
        due_date: taskDueDate,
        priority: taskPriority,
      })

      if (result.success) {
        toast({
          title: "Task added",
          description: "The task has been added successfully",
        })

        // Update local state immediately
        setProject(prev => prev ? {
          ...prev,
          tasks: {
            ...prev.tasks,
            total: prev.tasks.total + 1,
            items: [...prev.tasks.items, {
              id: result.taskId,
              title: taskTitle,
              description: taskDescription,
              status: "todo",
              priority: taskPriority,
              due_date: taskDueDate,
              assigned_to: taskAssignee,
              timeTracked: 0,
              isTracking: false,
              comments: [],
              checklist: []
            }]
          }
        } : null)

        // Reset form and close dialog
        setTaskTitle("")
        setTaskDescription("")
        setTaskAssignee("")
        setTaskDueDate("")
        setTaskPriority("medium")
        setOpenTaskDialog(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAddingTask(false)
    }
  }

  const handleAddMember = async () => {
    if (!selectedMemberId) {
      toast({
        title: "Error",
        description: "Please select a team member",
        variant: "destructive",
      })
      return
    }

    if (!memberRole) {
      toast({
        title: "Error",
        description: "Role is required",
        variant: "destructive",
      })
      return
    }

    // Check if member already exists in the project
    if (project?.members.some(member => member.id === selectedMemberId)) {
      toast({
        title: "Error",
        description: "This team member is already part of the project",
        variant: "destructive",
      })
      return
    }

    setIsAddingMember(true)
    try {
      const result = await addProjectMember(project!.id, {
        member_id: selectedMemberId,
        role: memberRole === "manager" ? "Project Manager" : 
              memberRole === "developer" ? "Developer" : 
              memberRole === "designer" ? "Designer" : "Team Member",
      })

      if (result.success) {
        toast({
          title: "Member added",
          description: "Team member has been added to the project",
        })

        // Update local state immediately
        const newMember = teamMembers.find(member => member.id === selectedMemberId)
        if (newMember) {
          setProject(prev => prev ? {
            ...prev,
            members: [...prev.members, {
              id: newMember.id,
              name: newMember.name,
              role: memberRole,
              avatar: newMember.avatar || "/placeholder.svg",
              initials: newMember.initials
            }]
          } : null)
        }

        // Reset form and close dialog
        setSelectedMemberId("")
        setMemberRole("member")
        setOpenMemberDialog(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add member",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding member:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleAddRisk = async () => {
    if (!riskTitle) {
      toast({
        title: "Error",
        description: "Risk title is required",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await addProjectRisk(project!.id, {
        title: riskTitle,
        impact: riskImpact,
        probability: riskProbability,
        status: "active",
        owner: riskOwner || null,
      })

      if (result.success) {
        toast({
          title: "Risk added",
          description: "The risk has been added to the project",
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Reset form and close dialog
        setRiskTitle("")
        setRiskImpact("medium")
        setRiskProbability("medium")
        setRiskOwner("")
        setOpenRiskDialog(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add risk",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding risk:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAddMilestone = async () => {
    if (!milestoneTitle) {
      toast({
        title: "Error",
        description: "Milestone title is required",
        variant: "destructive",
      })
      return
    }

    if (!milestoneDueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await addProjectMilestone(project!.id, {
        title: milestoneTitle,
        due_date: milestoneDueDate,
        description: milestoneDescription,
        completed: false,
      })

      if (result.success) {
        toast({
          title: "Milestone added",
          description: "The milestone has been added to the project",
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Reset form and close dialog
        setMilestoneTitle("")
        setMilestoneDueDate("")
        setMilestoneDescription("")
        setOpenMilestoneDialog(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add milestone",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding milestone:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    setIsDeletingTask(true)
    try {
      const result = await deleteTask(taskId, project!.id)

      if (result.success) {
        toast({
          title: "Task deleted",
          description: "The task has been deleted successfully",
        })

        // Update local state immediately
        setProject(prev => prev ? {
          ...prev,
          tasks: {
            ...prev.tasks,
            total: prev.tasks.total - 1,
            completed: prev.tasks.completed - (prev.tasks.items.find(t => t.id === taskId)?.status === "done" ? 1 : 0),
            items: prev.tasks.items.filter(task => task.id !== taskId)
          }
        } : null)

        // Close task dialog if open
        if (selectedTask?.id === taskId) {
          setSelectedTask(null)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeletingTask(false)
    }
  }

  const handleTaskStatusChange = async (task: Task, newStatus: string) => {
    try {
      const result = await updateTaskStatus(task.id, project!.id, newStatus)

      if (result.success) {
        toast({
          title: "Task updated",
          description: `Task status changed to ${newStatus}`,
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Update selected task if open
        if (selectedTask?.id === task.id) {
          const updatedTask = updatedProject.tasks.items.find((t: Task) => t.id === task.id)
          if (updatedTask) {
            setSelectedTask(updatedTask)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update task status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleTaskPriorityChange = async (task: ProjectTask, newPriority: string) => {
    try {
      const formData = new FormData()
      formData.append("tasks", JSON.stringify({
        items: project!.tasks.items.map((t: ProjectTask) =>
          t.id === task.id ? { ...t, priority: newPriority } : t
        ),
      }))

      const result = await updateProject(project!.id, formData)

      if (result.success) {
        toast({
          title: "Task updated",
          description: `Task priority changed to ${newPriority}`,
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Update selected task if open
        if (selectedTask?.id === task.id) {
          const updatedTask = updatedProject.tasks.items.find((t: ProjectTask) => t.id === task.id)
          if (updatedTask) {
            setSelectedTask(updatedTask)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update task priority",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating task priority:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleTaskDueDateChange = async (task: ProjectTask, newDueDate: string) => {
    try {
      const formData = new FormData()
      formData.append("tasks", JSON.stringify({
        items: project!.tasks.items.map((t: ProjectTask) =>
          t.id === task.id ? { ...t, due_date: newDueDate } : t
        ),
      }))

      const result = await updateProject(project!.id, formData)

      if (result.success) {
        toast({
          title: "Task updated",
          description: `Task due date changed to ${newDueDate}`,
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Update selected task if open
        if (selectedTask?.id === task.id) {
          const updatedTask = updatedProject.tasks.items.find((t: ProjectTask) => t.id === task.id)
          if (updatedTask) {
            setSelectedTask(updatedTask)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update task due date",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating task due date:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleTaskAssigneeChange = async (task: ProjectTask, newAssignee: string) => {
    try {
      const formData = new FormData()
      formData.append("tasks", JSON.stringify({
        items: project!.tasks.items.map((t: ProjectTask) =>
          t.id === task.id ? { ...t, assigned_to: newAssignee } : t
        ),
      }))

      const result = await updateProject(project!.id, formData)

      if (result.success) {
        toast({
          title: "Task updated",
          description: `Task assignee changed to ${newAssignee}`,
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Update selected task if open
        if (selectedTask?.id === task.id) {
          const updatedTask = updatedProject.tasks.items.find((t: ProjectTask) => t.id === task.id)
          if (updatedTask) {
            setSelectedTask(updatedTask)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update task assignee",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating task assignee:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleToggleTimeTracking = async (taskId: string) => {
    if (!project) return

    const task = project.tasks.items.find((t) => t.id === taskId)
    if (!task) return

    const isTracking = !task.isTracking

    try {
      const result = await toggleTaskTracking(taskId, project.id, isTracking)

      if (result.success) {
        toast({
          title: isTracking ? "Time tracking started" : "Time tracking stopped",
          description: isTracking ? "The timer has started for this task" : "The timer has been stopped",
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Update selected task if open
        if (selectedTask?.id === taskId) {
          const updatedTask = updatedProject.tasks.items.find((task) => task.id === taskId)
          if (updatedTask) {
            setSelectedTask(updatedTask)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to toggle time tracking",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling time tracking:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAddComment = async (taskId: string) => {
    if (!commentText.trim()) {
      return
    }

    try {
      // Get the current user's ID from your auth system
      // This should be replaced with your actual auth implementation
      const currentUser = await getCurrentUser()
      console.log(currentUser)
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to add comments",
          variant: "destructive",
        })
        return
      }

      const result = await addTaskComment(taskId, project!.id, {
        text: commentText,
        user_id: currentUser.id, // Use the actual user ID
      })

      if (result.success) {
        toast({
          title: "Comment added",
          description: "Your comment has been added to the task",
        })

        // Update local state immediately
        setProject(prev => prev ? {
          ...prev,
          tasks: {
            ...prev.tasks,
            items: prev.tasks.items.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  comments: [...task.comments, {
                    id: result.commentId,
                    text: commentText,
                    user: {
                      id: currentUser.id,
                      name: currentUser.name,
                      avatar: currentUser.avatar || "/placeholder.svg",
                      initials: currentUser.initials || currentUser.name.substring(0, 2).toUpperCase()
                    },
                    timestamp: new Date().toISOString(),
                    reactions: []
                  }]
                }
              }
              return task
            })
          }
        } : null)

        // Update selected task if open
        if (selectedTask?.id === taskId) {
          setSelectedTask(prev => prev ? {
            ...prev,
            comments: [...prev.comments, {
              id: result.commentId,
              text: commentText,
              user: {
                id: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar || "/placeholder.svg",
                initials: currentUser.initials || currentUser.name.substring(0, 2).toUpperCase()
              },
              timestamp: new Date().toISOString(),
              reactions: []
            }]
          } : null)
        }

        setCommentText("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAddProjectComment = async () => {
    if (!projectComment.trim()) {
      return
    }

    try {
      // Get the current user's ID from your auth system
      // This should be replaced with your actual auth implementation
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to add comments",
          variant: "destructive",
        })
        return
      }

      const result = await addProjectComment(project!.id, {
        text: projectComment,
        user_id: currentUser.id, // Use the actual user ID
      })

      if (result.success) {
        toast({
          title: "Comment added",
          description: "Your comment has been added to the project",
        })

        // Update local state immediately
        setProject(prev => prev ? {
          ...prev,
          comments: [...prev.comments, {
            id: result.commentId,
            text: projectComment,
            user: {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar || "/placeholder.svg",
              initials: currentUser.initials || currentUser.name.substring(0, 2).toUpperCase()
            },
            timestamp: new Date().toISOString(),
            reactions: []
          }]
        } : null)

        setProjectComment("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding project comment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAddChecklistItem = async (taskId: string) => {
    if (!checklistItem.trim()) {
      return
    }

    try {
      const result = await addTaskChecklistItem(taskId, project!.id, checklistItem)

      if (result.success) {
        toast({
          title: "Checklist item added",
          description: "The item has been added to the checklist",
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Update selected task if open
        if (selectedTask?.id === taskId) {
          const updatedTask = updatedProject.tasks.items.find((task) => task.id === taskId)
          if (updatedTask) {
            setSelectedTask(updatedTask)
          }
        }

        setChecklistItem("")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add checklist item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding checklist item:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleToggleChecklistItem = async (taskId: string, itemId: string, completed: boolean) => {
    try {
      const result = await toggleTaskChecklistItem(itemId, project!.id, completed)

      if (result.success) {
        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)

        // Update selected task if open
        if (selectedTask?.id === taskId) {
          const updatedTask = updatedProject.tasks.items.find((task) => task.id === taskId)
          if (updatedTask) {
            setSelectedTask(updatedTask)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update checklist item",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling checklist item:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleToggleStarProject = async () => {
    if (!project) return

    try {
      const result = await toggleProjectStar(project.id, project.isStarred)

      if (result.success) {
        toast({
          title: project.isStarred ? "Project unstarred" : "Project starred",
          description: project.isStarred ? "Project removed from favorites" : "Project added to favorites",
        })

        // Update local state immediately for better UX
        setProject({
          ...project,
          isStarred: !project.isStarred,
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update project",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling project star:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleToggleMilestoneStatus = async (milestoneId: string) => {
    if (!project) return

    const milestone = project.milestones.find((m) => m.id === milestoneId)
    if (!milestone) return

    try {
      const result = await toggleMilestoneStatus(milestoneId, project.id, !milestone.completed)

      if (result.success) {
        toast({
          title: "Milestone updated",
          description: `Milestone marked as ${milestone.completed ? "incomplete" : "complete"}`,
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update milestone",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling milestone status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !project) return

    const file = files[0]

    try {
      // In a real app, we would use the current user's ID
      const mockUserId = "00000000-0000-0000-0000-000000000000"

      const result = await addProjectFile(project.id, file, mockUserId)

      if (result.success) {
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully`,
        })

        // Refresh project data
        const updatedProject = await getProjectById(id)
        setProject(updatedProject)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload file",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "In Progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Almost Done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Just Started":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getRiskImpactColor = (impact: string) => {
    switch (impact) {
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

  const getRiskStatusColor = (status: string) => {
    switch (status) {
      case "mitigated":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "active":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const formatTimeTracked = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const filteredTasks = project?.tasks.items.filter((task) => {
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by priority
    if (filterPriority && task.priority !== filterPriority) {
      return false
    }

    // Filter by assignee
    if (filterAssignee && task.assignee.name !== filterAssignee) {
      return false
    }

    // Filter completed tasks
    if (!showCompletedTasks && task.status === "done") {
      return false
    }

    return true
  })

  const tasksByStatus = {
    todo: filteredTasks?.filter((task) => task.status === "todo") || [],
    "in-progress": filteredTasks?.filter((task) => task.status === "in-progress") || [],
    review: filteredTasks?.filter((task) => task.status === "review") || [],
    done: filteredTasks?.filter((task) => task.status === "done") || [],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleStarProject}>
                {project.isStarred ? (
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ) : (
                  <StarOff className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" /> Change Due Date
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" /> Set as Template
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Zap className="mr-2 h-4 w-4" /> Automate Tasks
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" /> Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{formatDate(project.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{formatDate(project.dueDate)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasks</p>
                      <p className="font-medium">
                        {project.tasks.completed} / {project.tasks.total} completed
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Team Members</p>
                      <p className="font-medium">{project.members.length} members</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks and Files Tabs */}
            <Tabs defaultValue="tasks">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-4 space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input
                      placeholder="Search tasks..."
                      className="w-full md:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-10">
                            Priority <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-all"
                                checked={!filterPriority}
                                onCheckedChange={() => setFilterPriority(null)}
                              />
                              <label htmlFor="priority-all" className="text-sm font-medium">
                                All
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-high"
                                checked={filterPriority === "high"}
                                onCheckedChange={() => setFilterPriority(filterPriority === "high" ? null : "high")}
                              />
                              <label htmlFor="priority-high" className="text-sm font-medium">
                                High
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-medium"
                                checked={filterPriority === "medium"}
                                onCheckedChange={() => setFilterPriority(filterPriority === "medium" ? null : "medium")}
                              />
                              <label htmlFor="priority-medium" className="text-sm font-medium">
                                Medium
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="priority-low"
                                checked={filterPriority === "low"}
                                onCheckedChange={() => setFilterPriority(filterPriority === "low" ? null : "low")}
                              />
                              <label htmlFor="priority-low" className="text-sm font-medium">
                                Low
                              </label>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-10">
                            Assignee <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="assignee-all"
                                checked={!filterAssignee}
                                onCheckedChange={() => setFilterAssignee(null)}
                              />
                              <label htmlFor="assignee-all" className="text-sm font-medium">
                                All
                              </label>
                            </div>
                            {project.members.map((member) => (
                              <div key={member.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`assignee-${member.id}`}
                                  checked={filterAssignee === member.name}
                                  onCheckedChange={() =>
                                    setFilterAssignee(filterAssignee === member.name ? null : member.name)
                                  }
                                />
                                <label htmlFor={`assignee-${member.id}`} className="text-sm font-medium">
                                  {member.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-completed"
                        checked={showCompletedTasks}
                        onCheckedChange={setShowCompletedTasks}
                      />
                      <Label htmlFor="show-completed">Show completed</Label>
                    </div>

                    <Dialog open={openTaskDialog} onOpenChange={setOpenTaskDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Add New Task</DialogTitle>
                          <DialogDescription>Create a new task for this project.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="task-title">Task Title</Label>
                            <Input
                              id="task-title"
                              placeholder="Enter task title"
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="task-description">Description</Label>
                            <Textarea
                              id="task-description"
                              placeholder="Enter task description"
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="task-assignee">Assignee</Label>
                              <select
                                id="task-assignee"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={taskAssignee}
                                onChange={(e) => setTaskAssignee(e.target.value)}
                              >
                                <option value="">Select assignee</option>
                                {project.members.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="task-due-date">Due Date</Label>
                              <Input
                                id="task-due-date"
                                type="date"
                                value={taskDueDate}
                                onChange={(e) => setTaskDueDate(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="task-priority">Priority</Label>
                            <select
                              id="task-priority"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={taskPriority}
                              onChange={(e) => setTaskPriority(e.target.value)}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenTaskDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddTask} disabled={isAddingTask}>
                            {isAddingTask ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              "Add Task"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {viewMode === "list" ? (
                  <Card>
                    <CardContent className="p-0">
                      <div className="space-y-4 p-4">
                        {filteredTasks?.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No tasks found matching your filters</p>
                          </div>
                        ) : (
                          filteredTasks?.map((task) => (
                            <div
                              key={task.id}
                              className={`flex flex-col rounded-lg border p-3 ${task.status === "done" ? "bg-muted/30" : ""}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    checked={task.status === "done"}
                                    onCheckedChange={(checked) => {
                                      handleTaskStatusChange(task, checked ? "done" : "todo")
                                    }}
                                  />
                                  <div>
                                    <h3
                                      className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                                    >
                                      {task.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {task.description}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </div>

                              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                                    <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{task.assignee.name}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Due {formatDate(task.dueDate)}</span>
                                  </div>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => setSelectedTask(task)}
                                  >
                                    Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(tasksByStatus).map(([status, tasks]) => (
                      <Card key={status} className="overflow-hidden">
                        <CardHeader className="p-3 bg-muted/50">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span className="capitalize">{status.replace("-", " ")}</span>
                            <Badge variant="outline">{tasks.length}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                          <div className="space-y-2 min-h-[100px]">
                            {tasks.length === 0 ? (
                              <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                                No tasks
                              </div>
                            ) : (
                              tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="rounded-md border bg-card p-3 shadow-sm cursor-pointer hover:border-primary/50"
                                  onClick={() => setSelectedTask(task)}
                                >
                                  <div className="flex items-start justify-between">
                                    <h3 className="font-medium text-sm">{task.title}</h3>
                                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                                  <div className="mt-2 flex items-center justify-between">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {formatDate(task.dueDate)}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Project Files</CardTitle>
                    <div className="flex gap-2">
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                      <Button size="sm" onClick={handleUploadFile}>
                        <Plus className="mr-2 h-4 w-4" /> Upload File
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.files.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No files uploaded yet</p>
                          <Button variant="outline" className="mt-4" onClick={handleUploadFile}>
                            <Plus className="mr-2 h-4 w-4" /> Upload your first file
                          </Button>
                        </div>
                      ) : (
                        project.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              <div className="rounded-md bg-muted p-2">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">{file.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {file.size} • Uploaded by {file.uploadedBy} on {formatDate(file.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Rename
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Project Milestones</CardTitle>
                    <Dialog open={openMilestoneDialog} onOpenChange={setOpenMilestoneDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Milestone
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Add New Milestone</DialogTitle>
                          <DialogDescription>Create a new milestone for this project.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="milestone-title">Milestone Title</Label>
                            <Input
                              id="milestone-title"
                              placeholder="Enter milestone title"
                              value={milestoneTitle}
                              onChange={(e) => setMilestoneTitle(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="milestone-due-date">Due Date</Label>
                            <Input
                              id="milestone-due-date"
                              type="date"
                              value={milestoneDueDate}
                              onChange={(e) => setMilestoneDueDate(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="milestone-description">Description</Label>
                            <Textarea
                              id="milestone-description"
                              placeholder="Enter milestone description"
                              value={milestoneDescription}
                              onChange={(e) => setMilestoneDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenMilestoneDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddMilestone}>Add Milestone</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No milestones created yet</p>
                          <Button variant="outline" className="mt-4" onClick={() => setOpenMilestoneDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Create your first milestone
                          </Button>
                        </div>
                      ) : (
                        project.milestones.map((milestone) => (
                          <div key={milestone.id} className="flex items-start space-x-4 rounded-lg border p-4">
                            <div className="mt-1">
                              <Checkbox
                                checked={milestone.completed}
                                onCheckedChange={() => handleToggleMilestoneStatus(milestone.id)}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className={`font-medium ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {milestone.title}
                                </h3>
                                <Badge variant={milestone.completed ? "outline" : "default"}>
                                  {milestone.completed ? "Completed" : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-muted-foreground">Due {formatDate(milestone.dueDate)}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Risks Tab */}
              <TabsContent value="risks" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Project Risks</CardTitle>
                    <Dialog open={openRiskDialog} onOpenChange={setOpenRiskDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Risk
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Add New Risk</DialogTitle>
                          <DialogDescription>Identify a new risk for this project.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="risk-title">Risk Title</Label>
                            <Input
                              id="risk-title"
                              placeholder="Enter risk title"
                              value={riskTitle}
                              onChange={(e) => setRiskTitle(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="risk-impact">Impact</Label>
                              <select
                                id="risk-impact"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={riskImpact}
                                onChange={(e) => setRiskImpact(e.target.value as "low" | "medium" | "high")}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="risk-probability">Probability</Label>
                              <select
                                id="risk-probability"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={riskProbability}
                                onChange={(e) => setRiskProbability(e.target.value as "low" | "medium" | "high")}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="risk-owner">Risk Owner</Label>
                            <select
                              id="risk-owner"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={riskOwner}
                              onChange={(e) => setRiskOwner(e.target.value)}
                            >
                              <option value="">Select owner</option>
                              {project.members.map((member) => (
                                <option key={member.id} value={member.name}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenRiskDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddRisk}>Add Risk</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.risks.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No risks identified yet</p>
                          <Button variant="outline" className="mt-4" onClick={() => setOpenRiskDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add your first risk
                          </Button>
                        </div>
                      ) : (
                        project.risks.map((risk) => (
                          <div key={risk.id} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AlertTriangle
                                  className={`h-5 w-5 ${risk.impact === "high" ? "text-red-500" : risk.impact === "medium" ? "text-orange-500" : "text-green-500"}`}
                                />
                                <h3 className="font-medium">{risk.title}</h3>
                              </div>
                              <Badge variant="outline" className={getRiskStatusColor(risk.status)}>
                                {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Impact</p>
                                <Badge variant="outline" className={getRiskImpactColor(risk.impact)}>
                                  {risk.impact.charAt(0).toUpperCase() + risk.impact.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Probability</p>
                                <Badge variant="outline" className={getRiskImpactColor(risk.probability)}>
                                  {risk.probability.charAt(0).toUpperCase() + risk.probability.slice(1)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Owner</p>
                                <p className="font-medium">{risk.owner}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Project Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Task Completion Rate</h3>
                      <p className="text-3xl font-bold mt-2">{project.analytics.taskCompletionRate}%</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">On-Time Completion</h3>
                      <p className="text-3xl font-bold mt-2">{project.analytics.onTimeCompletion}%</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Team Activity</h3>
                      <p className="text-3xl font-bold mt-2">
                        {project.analytics.teamActivity.reduce((sum, item) => sum + item.count, 0)} actions
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-4">Tasks by Status</h3>
                      <div className="space-y-3">
                        {project.analytics.tasksByStatus.map((item) => (
                          <div key={item.status} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{item.status.replace("-", " ")}</span>
                              <span>{item.count}</span>
                            </div>
                            <Progress value={(item.count / project.tasks.total) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="text-sm font-medium mb-4">Tasks by Priority</h3>
                      <div className="space-y-3">
                        {project.analytics.tasksByPriority.map((item) => (
                          <div key={item.priority} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{item.priority}</span>
                              <span>{item.count}</span>
                            </div>
                            <Progress
                              value={(item.count / project.tasks.total) * 100}
                              className={`h-2 ${
                                item.priority === "high"
                                  ? "bg-red-500"
                                  : item.priority === "medium"
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Team Members</CardTitle>
                <Dialog open={openMemberDialog} onOpenChange={setOpenMemberDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>Select a team member to add to this project.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="member-select">Team Member</Label>
                        <select
                          id="member-select"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedMemberId}
                          onChange={(e) => setSelectedMemberId(e.target.value)}
                        >
                          <option value="">Select a team member</option>
                          {teamMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="member-role">Role</Label>
                        <select
                          id="member-role"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={memberRole}
                          onChange={(e) => setMemberRole(e.target.value)}
                        >
                          <option value="manager">Project Manager</option>
                          <option value="developer">Developer</option>
                          <option value="designer">Designer</option>
                          <option value="member">Team Member</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenMemberDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember} disabled={isAddingMember}>
                        {isAddingMember ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Member"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Project Discussion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                      <AvatarFallback>YO</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        className="min-h-[80px]"
                        value={projectComment}
                        onChange={(e) => setProjectComment(e.target.value)}
                      />
                      <Button
                        className="ml-auto"
                        size="sm"
                        onClick={handleAddProjectComment}
                        disabled={!projectComment.trim()}
                      >
                        <Send className="mr-2 h-4 w-4" /> Post
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {project.comments.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No comments yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Be the first to start the discussion</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {project.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{comment.user.name}</h4>
                              <span className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {comment.reactions.map((reaction, index) => (
                                <Badge key={index} variant="outline" className="text-xs py-0 h-6">
                                  {reaction.emoji} {reaction.count}
                                </Badge>
                              ))}
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Smile className="h-3 w-3 mr-1" /> React
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" /> Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                  {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                </Badge>
              </div>
              <DialogDescription>{selectedTask.description}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Assignee</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedTask.assignee.avatar || "/placeholder.svg"} alt={selectedTask.assignee.name} />
                      <AvatarFallback>{selectedTask.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span>{selectedTask.assignee.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="mt-1">{formatDate(selectedTask.dueDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <select
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTask.status}
                    onChange={(e) => handleTaskStatusChange(selectedTask, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Tracked</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono">{formatTimeTracked(selectedTask.timeTracked)}</span>
                    <Button
                      variant={selectedTask.isTracking ? "destructive" : "outline"}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => handleToggleTimeTracking(selectedTask.id)}
                    >
                      {selectedTask.isTracking ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" /> Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" /> Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Checklist</h4>
                  <Badge variant="outline">
                    {selectedTask.checklist.filter((item) => item.completed).length}/{selectedTask.checklist.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {selectedTask.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`checklist-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={(checked) =>
                          handleToggleChecklistItem(selectedTask.id, item.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`checklist-${item.id}`}
                        className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Add checklist item..."
                    className="h-8 text-sm"
                    value={checklistItem}
                    onChange={(e) => setChecklistItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && checklistItem.trim()) {
                        handleAddChecklistItem(selectedTask.id)
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => handleAddChecklistItem(selectedTask.id)}
                    disabled={!checklistItem.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Comments</h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {selectedTask.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  ) : (
                    selectedTask.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                          <AvatarFallback>{comment.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-medium">{comment.user.name}</h4>
                            <span className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {comment.reactions.map((reaction, index) => (
                              <Badge key={index} variant="outline" className="text-xs py-0 h-5">
                                {reaction.emoji} {reaction.count}
                              </Badge>
                            ))}
                            <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <Textarea
                    placeholder="Add a comment..."
                    className="min-h-[60px]"
                    ref={commentInputRef}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    className="self-end"
                    size="sm"
                    onClick={() => handleAddComment(selectedTask.id)}
                    disabled={!commentText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  handleDeleteTask(selectedTask.id)
                  setSelectedTask(null)
                }}
                disabled={isDeletingTask}
              >
                {isDeletingTask ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" /> Delete Task
                  </>
                )}
              </Button>
              <Button onClick={() => setSelectedTask(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
