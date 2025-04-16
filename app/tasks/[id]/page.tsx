import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar } from "lucide-react"
import { getTaskById } from "@/lib/actions/task-actions"
import TaskDetailActions from "./task-detail-actions"

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  try {
    // Use the server action to get the task
    const task = await getTaskById(params.id)

    // Fetch related data
    const { data: projectData } = await supabase
      .from("projects")
      .select("id, name")
      .eq("id", task.project_id || "")
      .single()

    const { data: assigneeData } = await supabase
      .from("team_members")
      .select("id, name, avatar, role, email")
      .eq("id", task.assignee_id || "")
      .single()

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
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Link href="/tasks" className="flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{task.title}</CardTitle>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Status</h3>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Due: {task.due_date ? format(new Date(task.due_date), "PPP") : "No due date"}</span>
                </div>

                <TaskDetailActions task={task} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Project</CardTitle>
              </CardHeader>
              <CardContent>
                {projectData ? (
                  <Link href={`/projects/${projectData.id}`} className="text-primary hover:underline">
                    {projectData.name}
                  </Link>
                ) : (
                  <p className="text-muted-foreground">No project assigned</p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Assignee</CardTitle>
              </CardHeader>
              <CardContent>
                {assigneeData ? (
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={assigneeData.avatar || "/placeholder.svg"} alt={assigneeData.name} />
                      <AvatarFallback>
                        {assigneeData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{assigneeData.name}</p>
                      <p className="text-sm text-muted-foreground">{assigneeData.role}</p>
                      <p className="text-sm text-muted-foreground">{assigneeData.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No assignee</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching task:", error)
    return notFound()
  }
}
