import Link from "next/link"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Calendar, CheckCircle2, Clock } from "lucide-react"
import { getTasks } from "@/lib/data"

interface TaskDetailProps {
  taskId: string
}

export async function TaskDetail({ taskId }: TaskDetailProps) {
  const tasks = await getTasks({ search: taskId })
  const task = tasks.find((t) => t.id === taskId)

  if (!task) {
    notFound()
  }

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

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              {task.project && (
                <CardDescription>
                  Project:{" "}
                  <Link href={`/projects/${task.project.id}`} className="hover:underline">
                    {task.project.name}
                  </Link>
                </CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(task.status)} font-medium`} variant="outline">
                {task.status}
              </Badge>
              <Badge className={`${getPriorityColor(task.priority)} font-medium`} variant="outline">
                {task.priority} Priority
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {task.description && (
            <div className="space-y-2">
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Due Date</h3>
              {task.due_date ? (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>No due date</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Assignee</h3>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={task.assignee.avatar || `/placeholder.svg?height=24&width=24&query=${task.assignee.name}`}
                      alt={task.assignee.name}
                    />
                    <AvatarFallback className="text-xs">{getInitials(task.assignee.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">{task.assignee.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Unassigned</span>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Created</h3>
            <p className="text-muted-foreground">{formatDate(task.created_at)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div></div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/tasks`}>Back to Tasks</Link>
            </Button>
            {task.status !== "Completed" && (
              <Button className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Mark as Completed
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
