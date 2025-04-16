"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  startDate: string
  dueDate: string
  assignee: string
  tags: string[]
  progress: number
}

interface TaskTimelineViewProps {
  tasks: Task[]
}

export default function TaskTimelineView({ tasks }: TaskTimelineViewProps) {
  const [timeScale, setTimeScale] = useState("week")
  const [currentDate, setCurrentDate] = useState(new Date())

  // Calculate timeline dates based on current date and time scale
  const getTimelineDates = () => {
    const dates = []
    const startDate = new Date(currentDate)

    if (timeScale === "day") {
      // For day view, show hours
      for (let i = 8; i <= 20; i++) {
        const date = new Date(startDate)
        date.setHours(i, 0, 0, 0)
        dates.push(date)
      }
    } else if (timeScale === "week") {
      // For week view, show days
      startDate.setDate(startDate.getDate() - startDate.getDay()) // Start from Sunday
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        dates.push(date)
      }
    } else if (timeScale === "month") {
      // For month view, show days of the month
      startDate.setDate(1) // Start from the 1st of the month
      const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()
      for (let i = 1; i <= lastDay; i++) {
        const date = new Date(startDate)
        date.setDate(i)
        dates.push(date)
      }
    } else if (timeScale === "quarter") {
      // For quarter view, show months in the quarter
      const quarterStartMonth = Math.floor(startDate.getMonth() / 3) * 3
      startDate.setMonth(quarterStartMonth)
      for (let i = 0; i < 3; i++) {
        const date = new Date(startDate)
        date.setMonth(quarterStartMonth + i)
        dates.push(date)
      }
    }

    return dates
  }

  const timelineDates = getTimelineDates()

  // Format date for display based on time scale
  const formatDate = (date: Date) => {
    if (timeScale === "day") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (timeScale === "week") {
      return date.toLocaleDateString([], { weekday: "short", day: "numeric" })
    } else if (timeScale === "month") {
      return date.toLocaleDateString([], { day: "numeric", weekday: "short" })
    } else if (timeScale === "quarter") {
      return date.toLocaleDateString([], { month: "short", year: "numeric" })
    }
    return date.toLocaleDateString()
  }

  // Navigate timeline
  const navigateTimeline = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)

    if (timeScale === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (timeScale === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    } else if (timeScale === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (timeScale === "quarter") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 3 : -3))
    }

    setCurrentDate(newDate)
  }

  // Check if task falls within the timeline period
  const isTaskInTimeline = (task: Task, startDate: Date, endDate: Date) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.dueDate)

    return taskStart <= endDate && taskEnd >= startDate
  }

  // Get tasks for the current timeline
  const getTasksForTimeline = () => {
    let startDate, endDate

    if (timeScale === "day") {
      startDate = new Date(currentDate)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(currentDate)
      endDate.setHours(23, 59, 59, 999)
    } else if (timeScale === "week") {
      startDate = new Date(currentDate)
      startDate.setDate(currentDate.getDate() - currentDate.getDay()) // Start from Sunday
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
      endDate.setHours(23, 59, 59, 999)
    } else if (timeScale === "month") {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
    } else if (timeScale === "quarter") {
      const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3
      startDate = new Date(currentDate.getFullYear(), quarterStartMonth, 1)
      endDate = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0, 23, 59, 59, 999)
    }

    return tasks.filter((task) => isTaskInTimeline(task, startDate!, endDate!))
  }

  const timelineTasks = getTasksForTimeline()

  // Calculate task position and width in the timeline
  const getTaskStyle = (task: Task) => {
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.dueDate)

    let startPosition = 0
    let width = 0

    if (timeScale === "day") {
      // For day view
      const dayStart = new Date(currentDate)
      dayStart.setHours(8, 0, 0, 0)
      const dayEnd = new Date(currentDate)
      dayEnd.setHours(20, 0, 0, 0)

      const totalMinutes = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60)

      const taskStartTime = Math.max(taskStart.getTime(), dayStart.getTime())
      const taskEndTime = Math.min(taskEnd.getTime(), dayEnd.getTime())

      const startMinutes = (taskStartTime - dayStart.getTime()) / (1000 * 60)
      const durationMinutes = (taskEndTime - taskStartTime) / (1000 * 60)

      startPosition = (startMinutes / totalMinutes) * 100
      width = (durationMinutes / totalMinutes) * 100
    } else if (timeScale === "week") {
      // For week view
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      weekEnd.setHours(0, 0, 0, 0)

      const totalDays = 7

      const taskStartDay = Math.max(taskStart.getTime(), weekStart.getTime())
      const taskEndDay = Math.min(taskEnd.getTime(), weekEnd.getTime())

      const startDays = (taskStartDay - weekStart.getTime()) / (1000 * 60 * 60 * 24)
      const durationDays = (taskEndDay - taskStartDay) / (1000 * 60 * 60 * 24)

      startPosition = (startDays / totalDays) * 100
      width = (durationDays / totalDays) * 100
    } else if (timeScale === "month") {
      // For month view
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const totalDays = monthEnd.getDate()

      const taskStartDay = Math.max(taskStart.getTime(), monthStart.getTime())
      const taskEndDay = Math.min(taskEnd.getTime(), monthEnd.getTime())

      const startDays = (taskStartDay - monthStart.getTime()) / (1000 * 60 * 60 * 24)
      const durationDays = (taskEndDay - taskStartDay) / (1000 * 60 * 60 * 24)

      startPosition = (startDays / totalDays) * 100
      width = (durationDays / totalDays) * 100
    } else if (timeScale === "quarter") {
      // For quarter view
      const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3
      const quarterStart = new Date(currentDate.getFullYear(), quarterStartMonth, 1)
      const quarterEnd = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0)

      const totalDays = (quarterEnd.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24)

      const taskStartDay = Math.max(taskStart.getTime(), quarterStart.getTime())
      const taskEndDay = Math.min(taskEnd.getTime(), quarterEnd.getTime())

      const startDays = (taskStartDay - quarterStart.getTime()) / (1000 * 60 * 60 * 24)
      const durationDays = (taskEndDay - taskStartDay) / (1000 * 60 * 60 * 24)

      startPosition = (startDays / totalDays) * 100
      width = (durationDays / totalDays) * 100
    }

    return {
      left: `${startPosition}%`,
      width: `${Math.max(width, 3)}%`, // Ensure minimum width for visibility
    }
  }

  // Get current time period label
  const getCurrentPeriodLabel = () => {
    if (timeScale === "day") {
      return currentDate.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    } else if (timeScale === "week") {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${weekStart.toLocaleDateString([], { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}`
    } else if (timeScale === "month") {
      return currentDate.toLocaleDateString([], { month: "long", year: "numeric" })
    } else if (timeScale === "quarter") {
      const quarterStartMonth = Math.floor(currentDate.getMonth() / 3) * 3
      const quarterStart = new Date(currentDate.getFullYear(), quarterStartMonth, 1)
      const quarterEnd = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0)
      return `Q${Math.floor(quarterStartMonth / 3) + 1} ${currentDate.getFullYear()} (${quarterStart.toLocaleDateString([], { month: "short" })} - ${quarterEnd.toLocaleDateString([], { month: "short" })})`
    }
    return ""
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Timeline View</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={timeScale} onValueChange={setTimeScale}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Scale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={() => navigateTimeline("prev")}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="font-medium">{getCurrentPeriodLabel()}</div>
          <Button variant="outline" size="sm" onClick={() => navigateTimeline("next")}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="mt-6 relative overflow-x-auto">
          {/* Timeline header */}
          <div className="grid grid-cols-1 mb-2">
            <div className="flex min-w-[600px]">
              <div className="w-[150px] flex-shrink-0"></div>
              <div className="flex-1 flex">
                {timelineDates.map((date, index) => (
                  <div key={index} className="flex-1 text-center text-sm font-medium">
                    {formatDate(date)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Timeline grid lines */}
            <div className="relative h-8">
              <div className="absolute inset-0 flex">
                <div className="w-[150px] flex-shrink-0 border-r"></div>
                <div className="flex-1 flex">
                  {timelineDates.map((date, index) => (
                    <div key={index} className="flex-1 border-r last:border-r-0"></div>
                  ))}
                </div>
              </div>

              {/* Current time indicator */}
              {timeScale === "day" && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                  style={{
                    left: `calc(150px + ${((new Date().getHours() * 60 + new Date().getMinutes() - 8 * 60) / (12 * 60)) * 100}%)`,
                    display: new Date().getHours() >= 8 && new Date().getHours() <= 20 ? "block" : "none",
                  }}
                ></div>
              )}
            </div>

            {/* Tasks */}
            {timelineTasks.length > 0 ? (
              timelineTasks.map((task) => (
                <div key={task.id} className="relative h-16 border-t">
                  <div className="absolute inset-0 flex">
                    <div className="w-[150px] flex-shrink-0 border-r p-2 truncate">
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{task.assignee}</div>
                    </div>
                    <div className="flex-1 relative">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`absolute top-2 bottom-2 rounded-md flex items-center px-2 text-xs font-medium text-white ${
                                task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                              }`}
                              style={getTaskStyle(task)}
                            >
                              <div className="truncate">{task.title}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <div className="font-medium">{task.title}</div>
                              <div className="text-xs flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {task.startDate} - {task.dueDate}
                              </div>
                              <div className="text-xs flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> {task.priority} priority
                              </div>
                              <div className="text-xs flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Progress: {task.progress}%
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                No tasks scheduled for this time period
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
