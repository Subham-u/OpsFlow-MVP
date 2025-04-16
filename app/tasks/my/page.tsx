import { TasksHeader } from "@/components/tasks/tasks-header"

export default function MyTasksPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TasksHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <div>My Tasks Page</div>
      </main>
    </div>
  )
}
