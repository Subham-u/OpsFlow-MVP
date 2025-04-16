"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Import the notification service at the top of the file
import { notifyTaskAssigned, notifyTaskStatusUpdate } from "@/lib/email/notification-service"

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  due_date: z.string().optional().nullable(),
  project_id: z.string().optional().nullable(),
  assignee_id: z.string().optional().nullable(),
})

export type TaskFormData = z.infer<typeof taskSchema>

export async function createTask(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())

  try {
    const validatedData = taskSchema.parse(rawData)

    const supabase = createClient()
    const { error } = await supabase.from("tasks").insert(validatedData)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/tasks")
    if (validatedData.project_id) {
      revalidatePath(`/projects/${validatedData.project_id}`)
    }

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateTask(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())

  try {
    const validatedData = taskSchema.parse(rawData)

    const supabase = createClient()
    const { error } = await supabase.from("tasks").update(validatedData).eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/tasks")
    if (validatedData.project_id) {
      revalidatePath(`/projects/${validatedData.project_id}`)
    }
    revalidatePath(`/tasks/${id}`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update task" }
  }
}

export async function deleteTask(id: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/tasks")

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete task" }
  }
}

// Update the updateTaskStatus function to include email notification
export async function updateTaskStatus(id: string, status: string) {
  try {
    // Get the current status before updating
    const supabase = createClient()
    const { data: currentTask, error: fetchError } = await supabase.from("tasks").select("status").eq("id", id).single()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    const oldStatus = currentTask.status

    // Update the status
    const { error } = await supabase.from("tasks").update({ status }).eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Send email notification
    // Note: In a real app, you would get the current user from the session
    const currentUser = {
      id: "ef30a226-4481-4db6-b679-a71d402eea2d",
      name: "Wonders",
      email: "wonder.creative.studio9@gmail.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AU",
      role: "Admin" as const,
      status: "online" as const,
    }

    await notifyTaskStatusUpdate(id, oldStatus, currentUser)

    revalidatePath("/")
    revalidatePath("/tasks")

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update task status" }
  }
}

// Update the updateTaskAssignee function to include email notification
export async function updateTaskAssignee(id: string, assignee_id: string | null) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").update({ assignee_id }).eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    // Send email notification if assignee is set
    if (assignee_id) {
      // Note: In a real app, you would get the current user from the session
      const currentUser = {
        id: "ef30a226-4481-4db6-b679-a71d402eea2d",
        name: "Wonders",
        email: "wonder.creative.studio9@gmail.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AU",
        role: "Admin" as const,
        status: "online" as const,
      }

      await notifyTaskAssigned(id, currentUser)
    }

    revalidatePath("/")
    revalidatePath("/tasks")

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update task assignee" }
  }
}

export async function getTaskById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
