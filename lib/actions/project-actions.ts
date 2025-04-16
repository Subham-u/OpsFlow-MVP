"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Import the notification service at the top of the file
import {
  notifyNewProject,
  notifyProjectMemberAdded,
  notifyMilestoneCompleted,
  notifyCommentAdded,
} from "@/lib/email/notification-service"

// Project schema for validation
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  progress: z.number().min(0).max(100).default(0),
  start_date: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  is_starred: z.boolean().optional().default(false),
})

export type ProjectFormData = z.infer<typeof projectSchema>

// Task schema for validation
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional().nullable(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  due_date: z.string().optional().nullable(),
  assignee_id: z.string().optional().nullable(),
})

// Milestone schema for validation
const milestoneSchema = z.object({
  title: z.string().min(1, "Milestone title is required"),
  due_date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  completed: z.boolean().optional().default(false),
})

// Risk schema for validation
const riskSchema = z.object({
  title: z.string().min(1, "Risk title is required"),
  impact: z.string().min(1, "Impact is required"),
  probability: z.string().min(1, "Probability is required"),
  status: z.string().min(1, "Status is required"),
  owner: z.string().optional().nullable(),
})

// Comment schema for validation
const commentSchema = z.object({
  text: z.string().min(1, "Comment text is required"),
  user_id: z.string().min(1, "User ID is required"),
})

// Project member schema for validation
const projectMemberSchema = z.object({
  member_id: z.string().min(1, "Member ID is required"),
  role: z.string().min(1, "Role is required"),
})

// Project CRUD operations
export async function getProjects() {
  const supabase = createClient()

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Error fetching projects: ${error.message}`)
  }

  return data
}

export async function getProjectById(id: string) {
  const supabase = createClient()

  // Get project details
  const { data: project, error: projectError } = await supabase.from("projects").select("*").eq("id", id).single()

  if (projectError) {
    throw new Error(`Error fetching project: ${projectError.message}`)
  }

  // Get project members
  const { data: members, error: membersError } = await supabase
    .from("project_members")
    .select(`
      id,
      role,
      team_members:member_id (
        id,
        name,
        avatar,
        role
      )
    `)
    .eq("project_id", id)

  if (membersError) {
    throw new Error(`Error fetching project members: ${membersError.message}`)
  }

  // Format members data
  const formattedMembers = members.map((member) => ({
    id: member.id,
    name: member.team_members.name,
    role: member.role,
    avatar: member.team_members.avatar || `/placeholder.svg?height=40&width=40&query=${member.team_members.name}`,
    initials: getInitials(member.team_members.name),
  }))

  // Get tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      status,
      due_date,
      priority,
      time_tracked,
      is_tracking,
      assignee_id
    `)
    .eq("project_id", id)

  if (tasksError) {
    throw new Error(`Error fetching tasks: ${tasksError.message}`)
  }

  // Get task details (comments, checklist items)
  const tasksWithDetails = await Promise.all(
    tasks.map(async (task) => {
      // Get comments for this task
      const { data: comments, error: commentsError } = await supabase
        .from("task_comments")
        .select(`
        id,
        text,
        timestamp,
        team_members:user_id (
          id,
          name,
          avatar
        )
      `)
        .eq("task_id", task.id)
        .order("timestamp", { ascending: false })

      if (commentsError) {
        throw new Error(`Error fetching task comments: ${commentsError.message}`)
      }

      // Get reactions for each comment
      const commentsWithReactions = await Promise.all(
        comments.map(async (comment) => {
          const { data: reactions, error: reactionsError } = await supabase
            .from("comment_reactions")
            .select("*")
            .eq("comment_id", comment.id)

          if (reactionsError) {
            throw new Error(`Error fetching comment reactions: ${reactionsError.message}`)
          }

          return {
            id: comment.id,
            user: {
              name: comment.team_members.name,
              avatar:
                comment.team_members.avatar || `/placeholder.svg?height=32&width=32&query=${comment.team_members.name}`,
              initials: getInitials(comment.team_members.name),
            },
            text: comment.text,
            timestamp: comment.timestamp,
            reactions: reactions || [],
          }
        }),
      )

      // Get checklist items for this task
      const { data: checklist, error: checklistError } = await supabase
        .from("task_checklist_items")
        .select("*")
        .eq("task_id", task.id)

      if (checklistError) {
        throw new Error(`Error fetching task checklist: ${checklistError.message}`)
      }

      // Get assignee details
      let assignee = null
      if (task.assignee_id) {
        const { data: assigneeData, error: assigneeError } = await supabase
          .from("team_members")
          .select("id, name, avatar")
          .eq("id", task.assignee_id)
          .single()

        if (!assigneeError && assigneeData) {
          assignee = {
            name: assigneeData.name,
            avatar: assigneeData.avatar || `/placeholder.svg?height=32&width=32&query=${assigneeData.name}`,
            initials: getInitials(assigneeData.name),
          }
        }
      }

      return {
        ...task,
        assignee: assignee || {
          name: "Unassigned",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "UN",
        },
        comments: commentsWithReactions || [],
        checklist: checklist || [],
      }
    }),
  )

  // Get files
  const { data: files, error: filesError } = await supabase
    .from("project_files")
    .select(`
      id,
      name,
      type,
      size,
      uploaded_at,
      team_members:uploaded_by (
        id,
        name
      )
    `)
    .eq("project_id", id)
    .order("uploaded_at", { ascending: false })

  if (filesError) {
    throw new Error(`Error fetching project files: ${filesError.message}`)
  }

  // Format files data
  const formattedFiles = files.map((file) => ({
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedBy: file.team_members ? file.team_members.name : "Unknown",
    uploadedAt: file.uploaded_at,
  }))

  // Get risks
  const { data: risks, error: risksError } = await supabase
    .from("project_risks")
    .select(`
      id,
      title,
      impact,
      probability,
      status,
      team_members:owner (
        id,
        name
      )
    `)
    .eq("project_id", id)

  if (risksError) {
    throw new Error(`Error fetching project risks: ${risksError.message}`)
  }

  // Format risks data
  const formattedRisks = risks.map((risk) => ({
    id: risk.id,
    title: risk.title,
    impact: risk.impact,
    probability: risk.probability,
    status: risk.status,
    owner: risk.team_members ? risk.team_members.name : "Unassigned",
  }))

  // Get milestones
  const { data: milestones, error: milestonesError } = await supabase
    .from("project_milestones")
    .select("*")
    .eq("project_id", id)
    .order("due_date", { ascending: true })

  if (milestonesError) {
    throw new Error(`Error fetching project milestones: ${milestonesError.message}`)
  }

  // Get project comments
  const { data: projectComments, error: projectCommentsError } = await supabase
    .from("project_comments")
    .select(`
      id,
      text,
      timestamp,
      team_members:user_id (
        id,
        name,
        avatar
      )
    `)
    .eq("project_id", id)
    .order("timestamp", { ascending: false })

  if (projectCommentsError) {
    throw new Error(`Error fetching project comments: ${projectCommentsError.message}`)
  }

  // Get reactions for each project comment
  const projectCommentsWithReactions = await Promise.all(
    projectComments.map(async (comment) => {
      const { data: reactions, error: reactionsError } = await supabase
        .from("project_comment_reactions")
        .select("*")
        .eq("comment_id", comment.id)

      if (reactionsError) {
        throw new Error(`Error fetching project comment reactions: ${reactionsError.message}`)
      }

      return {
        id: comment.id,
        user: {
          name: comment.team_members.name,
          avatar:
            comment.team_members.avatar || `/placeholder.svg?height=40&width=40&query=${comment.team_members.name}`,
          initials: getInitials(comment.team_members.name),
        },
        text: comment.text,
        timestamp: comment.timestamp,
        reactions: reactions || [],
      }
    }),
  )

  // Calculate analytics
  const completedTasks = tasksWithDetails.filter((task) => task.status === "done").length
  const totalTasks = tasksWithDetails.length

  const analytics = {
    taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    onTimeCompletion: 85, // This would need more complex logic based on due dates
    teamActivity: [
      { date: "2023-07-01", count: 5 },
      { date: "2023-07-08", count: 8 },
      { date: "2023-07-15", count: 12 },
      { date: "2023-07-22", count: 7 },
      { date: "2023-07-29", count: 10 },
    ],
    tasksByStatus: [
      { status: "todo", count: tasksWithDetails.filter((task) => task.status === "todo").length },
      { status: "in-progress", count: tasksWithDetails.filter((task) => task.status === "in-progress").length },
      { status: "review", count: tasksWithDetails.filter((task) => task.status === "review").length },
      { status: "done", count: completedTasks },
    ],
    tasksByPriority: [
      { priority: "low", count: tasksWithDetails.filter((task) => task.priority === "low").length },
      { priority: "medium", count: tasksWithDetails.filter((task) => task.priority === "medium").length },
      { priority: "high", count: tasksWithDetails.filter((task) => task.priority === "high").length },
    ],
  }

  // Combine all data
  return {
    ...project,
    members: formattedMembers,
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      items: tasksWithDetails,
    },
    files: formattedFiles,
    risks: formattedRisks,
    milestones: milestones,
    comments: projectCommentsWithReactions,
    analytics,
  }
}

// Update the createProject function to include email notification
export async function createProject(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())

  // Convert checkbox value to boolean
  const is_starred = formData.get("is_starred") === "on"

  // Convert progress to number
  const progress = Number.parseInt(formData.get("progress") as string) || 0

  try {
    const validatedData = projectSchema.parse({
      ...rawData,
      is_starred,
      progress,
    })

    const supabase = createClient()
    const { data, error } = await supabase.from("projects").insert(validatedData).select()

    if (error) {
      return { success: false, error: error.message }
    }

    // Send email notification
    // Note: In a real app, you would get the current user from the session
    const currentUser = {
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AU",
      role: "Admin" as const,
      status: "online" as const,
    }

    await notifyNewProject(data[0].id, currentUser)

    revalidatePath("/")
    revalidatePath("/projects")

    return { success: true, data: data[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProject(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())

  // Convert checkbox value to boolean
  const is_starred = formData.get("is_starred") === "on"

  // Convert progress to number
  const progress = Number.parseInt(formData.get("progress") as string) || 0

  try {
    const validatedData = projectSchema.parse({
      ...rawData,
      is_starred,
      progress,
    })

    const supabase = createClient()
    const { data, error } = await supabase.from("projects").update(validatedData).eq("id", id).select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)

    return { success: true, data: data[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/projects")

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete project" }
  }
}

export async function toggleProjectStar(id: string, currentValue: boolean) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("projects").update({ is_starred: !currentValue }).eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/")
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update project" }
  }
}

// Task operations
export async function addTask(projectId: string, data: any) {
  try {
    const validatedData = taskSchema.parse(data)

    const supabase = createClient()
    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        ...validatedData,
        project_id: projectId,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: task[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to add task" }
  }
}

export async function updateTask(taskId: string, projectId: string, data: any) {
  try {
    const validatedData = taskSchema.parse(data)

    const supabase = createClient()
    const { data: task, error } = await supabase.from("tasks").update(validatedData).eq("id", taskId).select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: task[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update task" }
  }
}

export async function deleteTask(taskId: string, projectId: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", taskId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete task" }
  }
}

export async function updateTaskStatus(taskId: string, projectId: string, status: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Update project progress
    await updateProjectProgress(projectId)

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update task status" }
  }
}

export async function toggleTaskTracking(taskId: string, projectId: string, isTracking: boolean) {
  try {
    const supabase = createClient()

    // If we're starting tracking, stop tracking on all other tasks first
    if (isTracking) {
      await supabase.from("tasks").update({ is_tracking: false }).eq("project_id", projectId)
    }

    // Update this task's tracking status
    const { error } = await supabase.from("tasks").update({ is_tracking: isTracking }).eq("id", taskId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to toggle task tracking" }
  }
}

export async function incrementTaskTimeTracked(taskId: string, projectId: string, seconds: number) {
  try {
    const supabase = createClient()

    // Get current time tracked
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("time_tracked")
      .eq("id", taskId)
      .single()

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    // Update time tracked
    const newTimeTracked = (task.time_tracked || 0) + seconds

    const { error } = await supabase.from("tasks").update({ time_tracked: newTimeTracked }).eq("id", taskId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, timeTracked: newTimeTracked }
  } catch (error) {
    return { success: false, error: "Failed to update time tracked" }
  }
}

// Task comment operations
// Update the addTaskComment function to include email notification
export async function addTaskComment(taskId: string, projectId: string, data: any) {
  try {
    const validatedData = commentSchema.parse(data)

    const supabase = createClient()
    const { data: comment, error } = await supabase
      .from("task_comments")
      .insert({
        ...validatedData,
        task_id: taskId,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    // Send email notification
    // Note: In a real app, you would get the current user from the session
    const currentUser = {
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AU",
      role: "Admin" as const,
      status: "online" as const,
    }

    await notifyCommentAdded("task", taskId, comment[0].id, currentUser)

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: comment[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to add comment" }
  }
}

// Task checklist operations
export async function addTaskChecklistItem(taskId: string, projectId: string, text: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("task_checklist_items")
      .insert({
        task_id: taskId,
        text,
        completed: false,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: data[0] }
  } catch (error) {
    return { success: false, error: "Failed to add checklist item" }
  }
}

export async function toggleTaskChecklistItem(itemId: string, projectId: string, completed: boolean) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("task_checklist_items").update({ completed }).eq("id", itemId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update checklist item" }
  }
}

// Project member operations
// Update the addProjectMember function to include email notification
export async function addProjectMember(projectId: string, data: any) {
  try {
    const validatedData = projectMemberSchema.parse(data)

    const supabase = createClient()
    const { data: member, error } = await supabase
      .from("project_members")
      .insert({
        ...validatedData,
        project_id: projectId,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    // Send email notification
    // Note: In a real app, you would get the current user from the session
    const currentUser = {
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AU",
      role: "Admin" as const,
      status: "online" as const,
    }

    await notifyProjectMemberAdded(projectId, validatedData.member_id, validatedData.role, currentUser)

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: member[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to add project member" }
  }
}

export async function removeProjectMember(memberId: string, projectId: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("project_members").delete().eq("id", memberId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to remove project member" }
  }
}

// File operations
export async function addProjectFile(projectId: string, file: File, uploadedBy: string) {
  try {
    const supabase = createClient()

    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from("project-files").upload(`${projectId}/${fileName}`, file)

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    // Get file URL
    const { data: urlData } = supabase.storage.from("project-files").getPublicUrl(`${projectId}/${fileName}`)

    // Add file record to database
    const { data, error } = await supabase
      .from("project_files")
      .insert({
        project_id: projectId,
        name: file.name,
        type: file.type.split("/")[1].toUpperCase(),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploaded_by: uploadedBy,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: data[0], url: urlData.publicUrl }
  } catch (error) {
    return { success: false, error: "Failed to upload file" }
  }
}

export async function deleteProjectFile(fileId: string, projectId: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("project_files").delete().eq("id", fileId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete file" }
  }
}

// Risk operations
export async function addProjectRisk(projectId: string, data: any) {
  try {
    const validatedData = riskSchema.parse(data)

    const supabase = createClient()
    const { data: risk, error } = await supabase
      .from("project_risks")
      .insert({
        ...validatedData,
        project_id: projectId,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: risk[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to add risk" }
  }
}

export async function updateProjectRisk(riskId: string, projectId: string, data: any) {
  try {
    const validatedData = riskSchema.parse(data)

    const supabase = createClient()
    const { data: risk, error } = await supabase.from("project_risks").update(validatedData).eq("id", riskId).select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: risk[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update risk" }
  }
}

export async function deleteProjectRisk(riskId: string, projectId: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("project_risks").delete().eq("id", riskId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete risk" }
  }
}

// Milestone operations
// Update the toggleMilestoneStatus function to include email notification
export async function toggleMilestoneStatus(milestoneId: string, projectId: string, completed: boolean) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("project_milestones").update({ completed }).eq("id", milestoneId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Only send notification if milestone is being completed
    if (completed) {
      // Note: In a real app, you would get the current user from the session
      const currentUser = {
        id: "user-1",
        name: "Admin User",
        email: "admin@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AU",
        role: "Admin" as const,
        status: "online" as const,
      }

      await notifyMilestoneCompleted(projectId, milestoneId, currentUser)
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update milestone status" }
  }
}

export async function addProjectMilestone(projectId: string, data: any) {
  try {
    const validatedData = milestoneSchema.parse(data)

    const supabase = createClient()
    const { data: milestone, error } = await supabase
      .from("project_milestones")
      .insert({
        ...validatedData,
        project_id: projectId,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: milestone[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to add milestone" }
  }
}

export async function deleteProjectMilestone(milestoneId: string, projectId: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("project_milestones").delete().eq("id", milestoneId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete milestone" }
  }
}

// Project comment operations
// Update the addProjectComment function to include email notification
export async function addProjectComment(projectId: string, data: any) {
  try {
    const validatedData = commentSchema.parse(data)

    const supabase = createClient()
    const { data: comment, error } = await supabase
      .from("project_comments")
      .insert({
        ...validatedData,
        project_id: projectId,
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    // Send email notification
    // Note: In a real app, you would get the current user from the session
    const currentUser = {
      id: "user-1",
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AU",
      role: "Admin" as const,
      status: "online" as const,
    }

    await notifyCommentAdded("project", projectId, comment[0].id, currentUser)

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: comment[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to add comment" }
  }
}

// Helper function to update project progress based on task completion
async function updateProjectProgress(projectId: string) {
  const supabase = createClient()

  // Get all tasks for this project
  const { data: tasks, error: tasksError } = await supabase.from("tasks").select("status").eq("project_id", projectId)

  if (tasksError || !tasks.length) {
    return
  }

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const progress = Math.round((completedTasks / tasks.length) * 100)

  // Update project progress
  await supabase.from("projects").update({ progress }).eq("id", projectId)
}

// Helper function to get initials from name
function getInitials(name: string): string {
  if (!name) return "??"

  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
