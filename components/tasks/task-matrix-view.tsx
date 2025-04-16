"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, ArrowUpRight, Calendar, Clock, MoveHorizontal, MoveVertical, CheckCircle2 } from "lucide-react"

// Define task type
interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignee: string
  tags: string[]
  importance: number // 1-10
  urgency: number // 1-10
}

interface TaskMatrixViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

const TaskMatrixView: React.FC<TaskMatrixViewProps> = ({ tasks, onTaskClick }) => {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null)

  // Calculate average importance and urgency
  const avgImportance = tasks.reduce((acc, task) => acc + task.importance, 0) / (tasks.length || 1)
  const avgUrgency = tasks.reduce((acc, task) => acc + task.urgency, 0) / (tasks.length || 1)

  // Filter tasks into quadrants
  const importantUrgentTasks = tasks.filter((task) => task.importance >= avgImportance && task.urgency >= avgUrgency)
  const importantNotUrgentTasks = tasks.filter((task) => task.importance >= avgImportance && task.urgency < avgUrgency)
  const notImportantUrgentTasks = tasks.filter((task) => task.importance < avgImportance && task.urgency >= avgUrgency)
  const notImportantNotUrgentTasks = tasks.filter(
    (task) => task.importance < avgImportance && task.urgency < avgUrgency,
  )

  // Get priority color
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Clock className="h-3 w-3 text-slate-500" />
      case "in-progress":
        return <Clock className="h-3 w-3 text-blue-500" />
      case "review":
        return <AlertCircle className="h-3 w-3 text-amber-500" />
      case "done":
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      default:
        return <Clock className="h-3 w-3 text-slate-500" />
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Task Matrix View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto min-h-[500px]">
          {/* Important & Urgent */}
          <Card
            className={`transition-colors duration-200 ${hoveredQuadrant === "important-urgent" ? "border-2 border-red-500" : ""}`}
            onMouseEnter={() => setHoveredQuadrant("important-urgent")}
            onMouseLeave={() => setHoveredQuadrant(null)}
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                Important & Urgent
              </CardTitle>
              <div className="text-xs text-muted-foreground">{importantUrgentTasks.length} tasks</div>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[180px]">
                <div className="space-y-2">
                  {importantUrgentTasks.map((task) => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left text-sm"
                            onClick={() => onTaskClick(task)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="truncate">{task.title}</div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(task.status)}
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <div className="font-medium">{task.title}</div>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{task.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Importance: {task.importance}, Urgency: {task.urgency}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {importantUrgentTasks.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No tasks in this quadrant</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Important & Not Urgent */}
          <Card
            className={`transition-colors duration-200 ${hoveredQuadrant === "important-not-urgent" ? "border-2 border-amber-500" : ""}`}
            onMouseEnter={() => setHoveredQuadrant("important-not-urgent")}
            onMouseLeave={() => setHoveredQuadrant(null)}
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <MoveHorizontal className="h-4 w-4 mr-1 text-amber-500" />
                Important & Not Urgent
              </CardTitle>
              <div className="text-xs text-muted-foreground">{importantNotUrgentTasks.length} tasks</div>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[180px]">
                <div className="space-y-2">
                  {importantNotUrgentTasks.map((task) => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left text-sm"
                            onClick={() => onTaskClick(task)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="truncate">{task.title}</div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(task.status)}
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <div className="font-medium">{task.title}</div>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{task.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Importance: {task.importance}, Urgency: {task.urgency}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {importantNotUrgentTasks.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No tasks in this quadrant</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Not Important & Urgent */}
          <Card
            className={`transition-colors duration-200 ${hoveredQuadrant === "not-important-urgent" ? "border-2 border-blue-500" : ""}`}
            onMouseEnter={() => setHoveredQuadrant("not-important-urgent")}
            onMouseLeave={() => setHoveredQuadrant(null)}
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <MoveVertical className="h-4 w-4 mr-1 text-blue-500" />
                Not Important & Urgent
              </CardTitle>
              <div className="text-xs text-muted-foreground">{notImportantUrgentTasks.length} tasks</div>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[180px]">
                <div className="space-y-2">
                  {notImportantUrgentTasks.map((task) => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left text-sm"
                            onClick={() => onTaskClick(task)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="truncate">{task.title}</div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(task.status)}
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <div className="font-medium">{task.title}</div>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{task.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Importance: {task.importance}, Urgency: {task.urgency}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {notImportantUrgentTasks.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No tasks in this quadrant</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Not Important & Not Urgent */}
          <Card
            className={`transition-colors duration-200 ${hoveredQuadrant === "not-important-not-urgent" ? "border-2 border-green-500" : ""}`}
            onMouseEnter={() => setHoveredQuadrant("not-important-not-urgent")}
            onMouseLeave={() => setHoveredQuadrant(null)}
          >
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                Not Important & Not Urgent
              </CardTitle>
              <div className="text-xs text-muted-foreground">{notImportantNotUrgentTasks.length} tasks</div>
            </CardHeader>
            <CardContent className="p-2">
              <ScrollArea className="h-[180px]">
                <div className="space-y-2">
                  {notImportantNotUrgentTasks.map((task) => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left text-sm"
                            onClick={() => onTaskClick(task)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="truncate">{task.title}</div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(task.status)}
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px]">
                          <div className="font-medium">{task.title}</div>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{task.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Importance: {task.importance}, Urgency: {task.urgency}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {notImportantNotUrgentTasks.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">No tasks in this quadrant</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskMatrixView
