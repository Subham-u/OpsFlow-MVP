"use client"

import { useMemo } from "react"
import { format, isBefore, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Trash2, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

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

export function TaskTimeline({
  tasks,
  getPriorityColor,
  getStatusColor,
  onEdit,
  onDelete,
  onAssign,
}: {
  tasks: Task[]
  getPriorityColor: (priority: string) => string
  getStatusColor: (status: string) => string
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onAssign: (task: Task) => void
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Filter tasks with due dates
  const tasksWithDueDate = useMemo(() => tasks.filter((task) => task.due_date), [tasks])

  // Get days in current month
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }

  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasksWithDueDate.filter((task) => {
      const dueDate = new Date(task.due_date!)
      return isSameDay(dueDate, day)
    })
  }

  // Check if a day is today
  const isToday = (day: Date) => {
    return isSameDay(day, new Date())
  }

  // Check if a day is in the past
  const isPast = (day: Date) => {
    return isBefore(day, new Date()) && !isToday(day)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found matching your filters.</p>
      </div>
    )
  }

  if (tasksWithDueDate.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No tasks with due dates found. Timeline view requires tasks with due dates.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {daysInMonth.map((day, index) => {
          const dayTasks = getTasksForDay(day)
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] border rounded-md p-2 ${
                isToday(day) ? "bg-blue-50 border-blue-200" : isPast(day) ? "bg-gray-50" : ""
              }`}
            >
              <div className="text-right text-sm font-medium mb-1">{format(day, "d")}</div>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded-md ${
                      task.status === "Completed"
                        ? "bg-green-100"
                        : isPast(day) && task.status !== "Completed"
                          ? "bg-red-100"
                          : "bg-blue-100"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium truncate">{task.title}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <MoreHorizontal className="h-3 w-3" />
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
                          {!task.team_members && (
                            <DropdownMenuItem onClick={() => onAssign(task)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Assign
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <Badge className={getPriorityColor(task.priority) + " text-[10px] px-1 py-0"}>
                        {task.priority}
                      </Badge>
                      {task.team_members && (
                        <Avatar className="h-4 w-4">
                          <AvatarImage
                            src={task.team_members.avatar || "/placeholder.svg"}
                            alt={task.team_members.name}
                          />
                          <AvatarFallback className="text-[8px]">
                            {task.team_members.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground">+{dayTasks.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
