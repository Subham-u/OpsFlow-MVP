"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Edit, MoreHorizontal, Trash2, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskDetailButton } from "./task-detail-button"

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  due_date: string | null
  project_id: string | null
  assignee_id: string | null
  projects: {
    id: string
    name: string
  } | null
  team_members: {
    id: string
    name: string
    avatar: string | null
    role: string
  } | null
}

export function TaskKanban({
  tasks,
  getPriorityColor,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
}: {
  tasks: Task[]
  getPriorityColor: (priority: string) => string
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onAssign: (task: Task) => void
  onStatusChange: (taskId: string, newStatus: string) => void
}) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === "To Do")
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress")
  const completedTasks = tasks.filter((task) => task.status === "Completed")

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId)
    setDraggingTaskId(taskId)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    onStatusChange(taskId, status)
    setDraggingTaskId(null)
  }

  // Render a task card
  const renderTaskCard = (task: Task) => (
    <Card
      key={task.id}
      className={`mb-3 ${draggingTaskId === task.id ? "opacity-50" : ""}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
    >
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
          <CardTitle className="text-sm">{task.title}</CardTitle>
          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}

          <div className="flex justify-between items-center">
            <div className="text-xs font-medium">{task.projects?.name || "No project"}</div>

            <div className="text-xs text-muted-foreground">
              {task.due_date && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{format(new Date(task.due_date), "MMM d")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        {task.team_members ? (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.team_members.avatar || "/placeholder.svg"} alt={task.team_members.name} />
            <AvatarFallback>
              {task.team_members.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onAssign(task)
            }}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
      </TaskDetailButton>
    </Card>
  )

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* To Do Column */}
      <div className="bg-gray-50 rounded-lg p-4" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, "To Do")}>
        <h3 className="font-medium mb-4 flex items-center">
          <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
          To Do ({todoTasks.length})
        </h3>
        <div className="space-y-3">
          {todoTasks.map(renderTaskCard)}
          {todoTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column</p>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div
        className="bg-blue-50 rounded-lg p-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "In Progress")}
      >
        <h3 className="font-medium mb-4 flex items-center">
          <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
          In Progress ({inProgressTasks.length})
        </h3>
        <div className="space-y-3">
          {inProgressTasks.map(renderTaskCard)}
          {inProgressTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column</p>
          )}
        </div>
      </div>

      {/* Completed Column */}
      <div
        className="bg-green-50 rounded-lg p-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "Completed")}
      >
        <h3 className="font-medium mb-4 flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
          Completed ({completedTasks.length})
        </h3>
        <div className="space-y-3">
          {completedTasks.map(renderTaskCard)}
          {completedTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks in this column</p>
          )}
        </div>
      </div>
    </div>
  )
}
