"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { format, isAfter, isBefore, isToday, parseISO } from "date-fns"
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Edit,
  Trash2,
  UserPlus,
  LayoutGrid,
  List,
  Columns,
  TimerIcon as Timeline,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { TaskTable } from "@/components/tasks/task-table"
import { TaskKanban } from "@/components/tasks/task-kanban"
import { TaskTimeline } from "@/components/tasks/task-timeline"
import { TaskDetailButton } from "./task-detail-button"

// Import the server actions
import { updateTaskStatus, updateTaskAssignee } from "@/lib/actions/task-actions"

// Define types based on our database schema
type Project = {
  id: string
  name: string
}

type TeamMember = {
  id: string
  name: string
  avatar: string | null
  role: string
}

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  project_id: string | null
  assignee_id: string | null
  created_at: string
  projects: {
    id: string
    name: string
    status: string
  } | null
  team_members: {
    id: string
    name: string
    avatar: string | null
    role: string
  } | null
}

type TaskFormData = {
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  project_id: string | null
  assignee_id: string | null
}

// View types
type ViewType = "grid" | "table" | "kanban" 

export function TaskDashboard({
  initialTasks,
  projects,
  teamMembers,
}: {
  initialTasks: Task[]
  projects: Project[]
  teamMembers: TeamMember[]
}) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  // State for tasks and filtering
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)
  const [dueDateFilter, setDueDateFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("due_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewType, setViewType] = useState<ViewType>("grid")

  // State for task creation/editing
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    due_date: "",
    project_id: "",
    assignee_id: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...tasks]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query)),
      )
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter)
    }

    // Apply project filter
    if (projectFilter) {
      result = result.filter((task) => task.project_id === projectFilter)
    }

    // Apply assignee filter
    if (assigneeFilter) {
      result = result.filter((task) => task.assignee_id === assigneeFilter)
    }

    // Apply due date filter
    if (dueDateFilter) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      result = result.filter((task) => {
        if (!task.due_date) return false
        const dueDate = parseISO(task.due_date)

        switch (dueDateFilter) {
          case "today":
            return isToday(dueDate)
          case "overdue":
            return isBefore(dueDate, today) && task.status !== "Completed"
          case "upcoming":
            return isAfter(dueDate, today)
          default:
            return true
        }
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA: any
      let valueB: any

      switch (sortBy) {
        case "title":
          valueA = a.title
          valueB = b.title
          break
        case "priority":
          const priorityOrder = { High: 0, Medium: 1, Low: 2 }
          valueA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3
          valueB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3
          break
        case "status":
          const statusOrder = { "To Do": 0, "In Progress": 1, Completed: 2 }
          valueA = statusOrder[a.status as keyof typeof statusOrder] ?? 3
          valueB = statusOrder[b.status as keyof typeof statusOrder] ?? 3
          break
        case "due_date":
        default:
          valueA = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER
          valueB = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER
      }

      const compareResult = valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      return sortDirection === "asc" ? compareResult : -compareResult
    })

    setFilteredTasks(result)
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    projectFilter,
    assigneeFilter,
    dueDateFilter,
    sortBy,
    sortDirection,
  ])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter(null)
    setPriorityFilter(null)
    setProjectFilter(null)
    setAssigneeFilter(null)
    setDueDateFilter(null)
    setSortBy("due_date")
    setSortDirection("asc")
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Open create task dialog
  const openCreateDialog = () => {
    setFormData({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      due_date: "",
      project_id: "",
      assignee_id: "",
    })
    setIsCreateDialogOpen(true)
  }

  // Open edit task dialog
  const openEditDialog = (task: Task) => {
    setCurrentTask(task)
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || "",
      project_id: task.project_id || "",
      assignee_id: task.assignee_id || "",
    })
    setIsEditDialogOpen(true)
  }

  // Open delete task dialog
  const openDeleteDialog = (task: Task) => {
    setCurrentTask(task)
    setIsDeleteDialogOpen(true)
  }

  // Open assign task dialog
  const openAssignDialog = (task: Task) => {
    setCurrentTask(task)
    setFormData((prev) => ({ ...prev, assignee_id: task.assignee_id || "" }))
    setIsAssignDialogOpen(true)
  }

  // Create a new task
  const createTask = async () => {
    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([formData])
        .select(`
          *,
          projects:project_id (id, name, status),
          team_members:assignee_id (id, name, avatar, role)
        `)
        .single()

      if (error) throw error

      setTasks((prev) => [...prev, data])
      setIsCreateDialogOpen(false)
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update an existing task
  const updateTask = async () => {
    if (!currentTask) return

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("tasks")
        .update(formData)
        .eq("id", currentTask.id)
        .select(`
          *,
          projects:project_id (id, name, status),
          team_members:assignee_id (id, name, avatar, role)
        `)
        .single()

      if (error) throw error

      setTasks((prev) => prev.map((task) => (task.id === currentTask.id ? data : task)))
      setIsEditDialogOpen(false)
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete a task
  const deleteTask = async () => {
    if (!currentTask) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", currentTask.id)

      if (error) throw error

      setTasks((prev) => prev.filter((task) => task.id !== currentTask.id))
      setIsDeleteDialogOpen(false)
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Assign a task to a team member - UPDATED to use server action
  const assignTask = async () => {
    if (!currentTask) return

    setIsSubmitting(true)

    try {
      // Use the server action instead of direct Supabase call
      const result = await updateTaskAssignee(currentTask.id, formData.assignee_id || null)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Fetch the updated task to update the UI
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          projects:project_id (id, name, status),
          team_members:assignee_id (id, name, avatar, role)
        `)
        .eq("id", currentTask.id)
        .single()

      if (error) throw error

      setTasks((prev) => prev.map((task) => (task.id === currentTask.id ? data : task)))
      setIsAssignDialogOpen(false)
      toast({
        title: "Task assigned",
        description: "The task has been assigned successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign task",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update task status - UPDATED to use server action
  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // Use the server action instead of direct Supabase call
      const result = await updateTaskStatus(taskId, newStatus)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Fetch the updated task to update the UI
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          projects:project_id (id, name, status),
          team_members:assignee_id (id, name, avatar, role)
        `)
        .eq("id", taskId)
        .single()

      if (error) throw error

      setTasks((prev) => prev.map((task) => (task.id === taskId ? data : task)))
      toast({
        title: "Status updated",
        description: `Task status changed to ${newStatus}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
    }
  }

  // Get color for priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "in progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "to do":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </div>

      {/* Search and filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Filter className="mr-2 h-4 w-4" />
                {statusFilter || "Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter("To Do")}>To Do</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {priorityFilter || "Priority"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>All Priorities</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPriorityFilter("High")}>High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("Medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter("Low")}>Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {dueDateFilter ? dueDateFilter.charAt(0).toUpperCase() + dueDateFilter.slice(1) : "Due Date"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setDueDateFilter(null)}>All Dates</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDueDateFilter("today")}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDueDateFilter("overdue")}>Overdue</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDueDateFilter("upcoming")}>Upcoming</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("due_date")
                  setSortDirection("asc")
                }}
              >
                Due Date (Earliest)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("due_date")
                  setSortDirection("desc")
                }}
              >
                Due Date (Latest)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("priority")
                  setSortDirection("asc")
                }}
              >
                Priority (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("status")
                  setSortDirection("asc")
                }}
              >
                Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("title")
                  setSortDirection("asc")
                }}
              >
                Title (A-Z)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {projectFilter ? projects.find((p) => p.id === projectFilter)?.name || "Project" : "Project"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 max-h-[300px] overflow-y-auto">
              <DropdownMenuItem onClick={() => setProjectFilter(null)}>All Projects</DropdownMenuItem>
              <DropdownMenuSeparator />
              {projects.map((project) => (
                <DropdownMenuItem key={project.id} onClick={() => setProjectFilter(project.id)}>
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* View selector */}
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewType === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("grid")}
          className="w-10 h-10 p-0"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewType === "table" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("table")}
          className="w-10 h-10 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewType === "kanban" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("kanban")}
          className="w-10 h-10 p-0"
        >
          <Columns className="h-4 w-4" />
        </Button>
        {/* <Button
          variant={viewType === "timeline" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewType("timeline")}
          className="w-10 h-10 p-0"
        >
          <Timeline className="h-4 w-4" />
        </Button> */}
      </div>

      {/* Task views */}
      <div className="mt-6">
        {viewType === "grid" && (
          <TaskGrid
            tasks={filteredTasks}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onAssign={openAssignDialog}
            onStatusChange={handleUpdateTaskStatus}
          />
        )}

        {viewType === "table" && (
          <TaskTable
            tasks={filteredTasks}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onAssign={openAssignDialog}
            onStatusChange={handleUpdateTaskStatus}
          />
        )}

        {viewType === "kanban" && (
          <TaskKanban
            tasks={filteredTasks}
            getPriorityColor={getPriorityColor}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onAssign={openAssignDialog}
            onStatusChange={handleUpdateTaskStatus}
          />
        )}

        {/* {viewType === "timeline" && (
          <TaskTimeline
            tasks={filteredTasks}
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onAssign={openAssignDialog}
          />
        )} */}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your project management system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Task title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_id">Project</Label>
                <Select
                  value={formData.project_id || ""}
                  onValueChange={(value) => handleSelectChange("project_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee_id">Assignee</Label>
                <Select
                  value={formData.assignee_id || ""}
                  onValueChange={(value) => handleSelectChange("assignee_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createTask} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Make changes to the selected task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Task title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due_date">Due Date</Label>
              <Input
                id="edit-due_date"
                name="due_date"
                type="date"
                value={formData.due_date || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-project_id">Project</Label>
                <Select
                  value={formData.project_id || ""}
                  onValueChange={(value) => handleSelectChange("project_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-assignee_id">Assignee</Label>
                <Select
                  value={formData.assignee_id || ""}
                  onValueChange={(value) => handleSelectChange("assignee_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateTask} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteTask} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Task Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>Select a team member to assign this task to.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="assign-assignee_id">Assignee</Label>
              <Select
                value={formData.assignee_id || ""}
                onValueChange={(value) => handleSelectChange("assignee_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={assignTask} disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Task Grid Component
function TaskGrid({
  tasks,
  getPriorityColor,
  getStatusColor,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
}: {
  tasks: any[]
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  onEdit: (task: any) => void
  onDelete: (task: any) => void
  onAssign: (task: any) => void
  onStatusChange: (taskId: string, newStatus: string) => void
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id} className="h-full">
          <TaskDetailButton
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onPriorityChange={(taskId, newPriority) => {
                    // You would need to implement this function in the parent component
                    console.log(`Change priority of task ${taskId} to ${newPriority}`)
                  }}
            >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description || "No description provided."}
              </p>

              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>

                <div className="text-sm text-muted-foreground">
                  {task.due_date && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{format(new Date(task.due_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm font-medium">{task.projects?.name || "No project"}</div>

                {task.team_members ? (
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.team_members.avatar || "/placeholder.svg"} alt={task.team_members.name} />
                      <AvatarFallback>
                        {task.team_members.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAssign(task)
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          </TaskDetailButton>
          <CardFooter className="flex justify-between pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "To Do")} disabled={task.status === "To Do"}>
                  <Clock className="mr-2 h-4 w-4" /> To Do
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "In Progress")}
                  disabled={task.status === "In Progress"}
                >
                  <Clock className="mr-2 h-4 w-4" /> In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "Completed")}
                  disabled={task.status === "Completed"}
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
