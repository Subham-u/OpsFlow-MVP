"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { updateTaskStatus } from "@/lib/actions/task-actions"

export default function TaskDetailActions({ task }: { task: any }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleMarkComplete = async () => {
    if (task.status === "Completed") return

    setIsUpdating(true)
    try {
      const result = await updateTaskStatus(task.id, "Completed")

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Task completed",
        description: "The task has been marked as completed.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex justify-end">
      <Button variant="outline" className="mr-2" onClick={() => router.push(`/tasks/${task.id}/edit`)}>
        Edit Task
      </Button>
      <Button onClick={handleMarkComplete} disabled={isUpdating || task.status === "Completed"}>
        <CheckCircle className="mr-2 h-4 w-4" />
        {task.status === "Completed" ? "Completed" : "Mark as Complete"}
      </Button>
    </div>
  )
}
