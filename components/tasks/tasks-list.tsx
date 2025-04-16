import { getTasks } from "@/lib/data"
import { TaskCard } from "@/components/tasks/task-card"
import { EmptyState } from "@/components/empty-state"
import { CheckSquare } from "lucide-react"

interface TasksListProps {
  status?: string
  priority?: string
  projectId?: string
  assigneeId?: string
  search?: string
}

export async function TasksList({ status, priority, projectId, assigneeId, search }: TasksListProps) {
  const tasks = await getTasks({
    status,
    priority,
    projectId,
    assigneeId,
    search,
  })

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="custom"
        customIcon={CheckSquare}
        title="No tasks found"
        description="No tasks match your current filters."
      />
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
