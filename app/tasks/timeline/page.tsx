import { TasksHeader } from "@/components/tasks/tasks-header"

export default function TimelineViewPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TasksHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <div>Timeline View Page</div>
      </main>
    </div>
  )
}
