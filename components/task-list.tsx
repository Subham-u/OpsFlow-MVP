import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define the Task type based on our database schema
type Task = {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  projects: {
    id: string
    name: string
  }
  team_members: {
    id: string
    name: string
    avatar: string
  } | null
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found. Create a new task to get started.</p>
      </div>
    )
  }

  // Function to get the appropriate color for priority badges
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

  // Function to get the appropriate color for status badges
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Link href={`/tasks/${task.id}`} key={task.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

                <div className="flex justify-between items-center">
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>

                  <div className="text-sm text-muted-foreground">
                    {task.due_date && (
                      <span>Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-sm">{task.projects?.name}</div>

                  {task.team_members && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={task.team_members.avatar || "/placeholder.svg"} alt={task.team_members.name} />
                      <AvatarFallback>
                        {task.team_members.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
