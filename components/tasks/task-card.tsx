"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { Calendar, CheckCircle2, Clock, Edit, MoreVertical, Trash } from "lucide-react"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog"
import { updateTaskStatus } from "@/lib/actions/task-actions"
import { toast } from "@/components/ui/use-toast"
import { TaskDetailButton } from "@/components/tasks/task-detail-button"

interface TaskCardProps {
  task: any
}

export function TaskCard({ task }: TaskCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "to do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "on hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
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

  const handleMarkAsCompleted = async () => {
    if (task.status === "Completed") return

    setIsUpdating(true)
    try {
      const result = await updateTaskStatus(task.id, "Completed")
      if (result.success) {
        toast({
          title: "Task updated",
          description: "Task marked as completed",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update task",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <TaskDetailButton
        task={task}
        onStatusChange={async (id, status) => {
          setIsUpdating(true)
          try {
            const result = await updateTaskStatus(id, status)
            if (result.success) {
              toast({
                title: "Task updated",
                description: `Task status changed to ${status}`,
              })
            } else {
              toast({
                title: "Error",
                description: result.error || "Failed to update task",
                variant: "destructive",
              })
            }
          } catch (error) {
            toast({
              title: "Error",
              description: "An unexpected error occurred",
              variant: "destructive",
            })
          } finally {
            setIsUpdating(false)
          }
        }}
      >
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{task.title}</span>
                </div>
                {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={`${getStatusColor(task.status)} font-medium`} variant="outline">
                    {task.status}
                  </Badge>
                  <Badge className={`${getPriorityColor(task.priority)} font-medium`} variant="outline">
                    {task.priority} Priority
                  </Badge>
                  {task.project && (
                    <Badge variant="outline" className="font-medium">
                      {task.project.name}
                    </Badge>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {task.status !== "Completed" && (
                    <DropdownMenuItem onClick={handleMarkAsCompleted} disabled={isUpdating}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4 bg-muted/50">
            <div className="flex items-center text-xs text-muted-foreground">
              {task.due_date ? (
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  <span>Due {formatDate(task.due_date)}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  <span>No due date</span>
                </div>
              )}
            </div>
            <div>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Assigned to</span>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={task.assignee.avatar || `/placeholder.svg?height=24&width=24&query=${task.assignee.name}`}
                      alt={task.assignee.name}
                    />
                    <AvatarFallback className="text-xs">{getInitials(task.assignee.name)}</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Unassigned</span>
              )}
            </div>
          </CardFooter>
        </Card>
      </TaskDetailButton>

      <EditTaskDialog task={task} open={showEditDialog} onOpenChange={setShowEditDialog} />

      <DeleteTaskDialog
        taskId={task.id}
        taskTitle={task.title}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
