import { getProjects } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export async function ProjectList() {
  const projects = await getProjects()

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">No projects found.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {project.is_starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description || "No description"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Due: {project.due_date ? formatDate(project.due_date) : "No date"}
                  </p>
                </div>
                <StatusBadge status={project.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "on hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Badge className={`${getStatusColor(status)} font-medium`} variant="outline">
      {status}
    </Badge>
  )
}
