"use client"

import { format } from "date-fns"
import { CheckCircle, Clock, Edit, MoreHorizontal, Trash2, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TaskDetailButton } from "@/components/tasks/task-detail-button"

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

export function TaskTable({
  tasks,
  getPriorityColor,
  getStatusColor,
  onEdit,
  onDelete,
  onAssign,
  onStatusChange,
}: {
  tasks: Task[]
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onAssign: (task: Task) => void
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
              <TableRow>
                <TableCell className="font-medium">
                <TaskDetailButton
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onPriorityChange={(taskId, newPriority) => {
                    // You would need to implement this function in the parent component
                    console.log(`Change priority of task ${taskId} to ${newPriority}`)
                  }}
                  >
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                    )}
                  </div>
                </TaskDetailButton>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>{task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No due date"}</TableCell>
                <TableCell>{task.projects?.name || "No project"}</TableCell>
                <TableCell>
                  {task.team_members ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={task.team_members.avatar || "/placeholder.svg"}
                          alt={task.team_members.name}
                        />
                        <AvatarFallback>
                          {task.team_members.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.team_members.name}</span>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAssign(task)
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(task)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(task.id, "To Do")}
                          disabled={task.status === "To Do"}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Mark as To Do
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(task.id, "In Progress")}
                          disabled={task.status === "In Progress"}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange(task.id, "Completed")}
                          disabled={task.status === "Completed"}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
