"use server"

import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "./send-email"
import * as templates from "./email-templates"
import type { User } from "@/contexts/user-context"

// Helper to get team members from project
async function getProjectTeamMembers(projectId: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("project_members")
      .select(`
        team_members:member_id (
          id,
          name,
          email,
          role
        )
      `)
      .eq("project_id", projectId)

    if (error) {
      console.error("Error fetching project team members:", error)
      return []
    }

    return data.map((item) => item.team_members)
  } catch (error) {
    console.error("Error in getProjectTeamMembers:", error)
    return []
  }
}

// Helper to get team member by ID
async function getTeamMemberById(memberId: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("team_members").select("*").eq("id", memberId).single()

    if (error) {
      console.error("Error fetching team member:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getTeamMemberById:", error)
    return null
  }
}

// Helper to get project by ID
async function getProjectById(projectId: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single()

    if (error) {
      console.error("Error fetching project:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getProjectById:", error)
    return null
  }
}

// Helper to get task by ID
async function getTaskById(taskId: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").select("*").eq("id", taskId).single()

    if (error) {
      console.error("Error fetching task:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getTaskById:", error)
    return null
  }
}

// Helper to get admin emails
async function getAdminEmails() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("team_members").select("email").eq("role", "Admin")

    if (error) {
      console.error("Error fetching admin emails:", error)
      return []
    }

    return data.map((admin) => admin.email)
  } catch (error) {
    console.error("Error in getAdminEmails:", error)
    return []
  }
}

// Notification functions
export async function notifyNewTeamMember(memberId: string, addedBy: User) {
  try {
    const member = await getTeamMemberById(memberId)
    console.log("subham:",member)
    if (!member) return { success: false, error: "Team member not found" }

    const adminEmails = await getAdminEmails()
    if (adminEmails.length === 0) {
      console.log("No admin emails found, skipping notification")
      return { success: true, info: "No recipients available" }
    }

    // Send email to admins
    const emailResult = await sendEmail({
      to: adminEmails,
      bcc: member.email,
      subject: "New Team Member Added",
      html: templates.getNewTeamMemberTemplate(member, addedBy),
    })

    if (!emailResult.success) {
      console.warn("Email notification failed but team member was created:", emailResult.error)
      return {
        success: true,
        warning: "Team member created but email notification failed",
        emailError: emailResult.error,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in notifyNewTeamMember:", error)
    // Don't fail the whole operation if notification fails
    return {
      success: true,
      warning: "Team member created but email notification failed",
      error: (error as Error).message,
    }
  }
}

export async function notifyTaskAssigned(taskId: string, assignedBy: User) {
  try {
    const task = await getTaskById(taskId)
    if (!task || !task.assignee_id) return { success: false, error: "Task or assignee not found" }

    const assignee = await getTeamMemberById(task.assignee_id)
    if (!assignee) return { success: false, error: "Assignee not found" }

    const project = task.project_id ? await getProjectById(task.project_id) : null
    const projectName = project ? project.name : "General Tasks"

    // Send email to assignee
    await sendEmail({
      to: assignee.email,
      subject: `Task Assigned: ${task.title}`,
      html: templates.getTaskAssignedTemplate(task, assignee, assignedBy, projectName),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending task assigned notification:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function notifyTaskStatusUpdate(taskId: string, oldStatus: string, updatedBy: User) {
  try {
    const task = await getTaskById(taskId)
    if (!task) return { success: false, error: "Task not found" }

    const project = task.project_id ? await getProjectById(task.project_id) : null
    const projectName = project ? project.name : "General Tasks"

    // Get emails of people to notify
    const emailsToNotify: string[] = []

    // Add assignee if exists
    if (task.assignee_id) {
      const assignee = await getTeamMemberById(task.assignee_id)
      if (assignee) emailsToNotify.push(assignee.email)
    }

    // Add project members if in a project
    if (project) {
      const projectMembers = await getProjectTeamMembers(project.id)
      projectMembers.forEach((member) => {
        if (!emailsToNotify.includes(member.email)) {
          emailsToNotify.push(member.email)
        }
      })
    }

    // Add admins
    const adminEmails = await getAdminEmails()
    adminEmails.forEach((email) => {
      if (!emailsToNotify.includes(email)) {
        emailsToNotify.push(email)
      }
    })

    // Send email
    if (emailsToNotify.length > 0) {
      await sendEmail({
        to: emailsToNotify,
        subject: `Task Status Updated: ${task.title}`,
        html: templates.getTaskStatusUpdateTemplate(task, updatedBy, projectName, oldStatus),
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending task status update notification:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function notifyNewProject(projectId: string, createdBy: User) {
  try {
    const project = await getProjectById(projectId)
    if (!project) return { success: false, error: "Project not found" }

    const adminEmails = await getAdminEmails()

    // Send email to admins
    await sendEmail({
      to: adminEmails,
      subject: `New Project Created: ${project.name}`,
      html: templates.getNewProjectTemplate(project, createdBy),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending new project notification:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function notifyProjectMemberAdded(projectId: string, memberId: string, role: string, addedBy: User) {
  try {
    const project = await getProjectById(projectId)
    if (!project) return { success: false, error: "Project not found" }

    const member = await getTeamMemberById(memberId)
    if (!member) return { success: false, error: "Team member not found" }

    // Send email to the added member
    await sendEmail({
      to: member.email,
      subject: `Added to Project: ${project.name}`,
      html: templates.getProjectMemberAddedTemplate(project, member, addedBy, role),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending project member added notification:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function notifyMilestoneCompleted(projectId: string, milestoneId: string, completedBy: User) {
  try {
    const project = await getProjectById(projectId)
    if (!project) return { success: false, error: "Project not found" }

    // Get milestone details
    const supabase = createClient()
    const { data: milestone, error } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("id", milestoneId)
      .single()

    if (error || !milestone) return { success: false, error: "Milestone not found" }

    // Get project team members
    const projectMembers = await getProjectTeamMembers(projectId)
    const memberEmails = projectMembers.map((member) => member.email)

    // Send email to project members
    if (memberEmails.length > 0) {
      await sendEmail({
        to: memberEmails,
        subject: `Milestone Completed: ${milestone.title}`,
        html: templates.getMilestoneCompletedTemplate(project, milestone, completedBy),
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending milestone completed notification:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function notifyCommentAdded(
  entityType: "project" | "task",
  entityId: string,
  commentId: string,
  commentedBy: User,
) {
  try {
    let entity
    let projectId
    let projectName

    if (entityType === "project") {
      entity = await getProjectById(entityId)
      projectId = entityId
      projectName = entity?.name
    } else {
      entity = await getTaskById(entityId)
      projectId = entity?.project_id

      if (projectId) {
        const project = await getProjectById(projectId)
        projectName = project?.name
      }
    }

    if (!entity) return { success: false, error: `${entityType} not found` }

    // Get comment details
    const supabase = createClient()
    const { data: comment, error } = await supabase
      .from(entityType === "project" ? "project_comments" : "task_comments")
      .select("*")
      .eq("id", commentId)
      .single()

    if (error || !comment) return { success: false, error: "Comment not found" }

    // Get people to notify
    const emailsToNotify: string[] = []

    if (projectId) {
      // Add project members
      const projectMembers = await getProjectTeamMembers(projectId)
      projectMembers.forEach((member) => {
        if (!emailsToNotify.includes(member.email)) {
          emailsToNotify.push(member.email)
        }
      })
    }

    // If it's a task, add the assignee
    if (entityType === "task" && entity.assignee_id) {
      const assignee = await getTeamMemberById(entity.assignee_id)
      if (assignee && !emailsToNotify.includes(assignee.email)) {
        emailsToNotify.push(assignee.email)
      }
    }

    // Send email
    if (emailsToNotify.length > 0) {
      await sendEmail({
        to: emailsToNotify,
        subject: `New Comment on ${entityType === "project" ? "Project" : "Task"}: ${entity.name || entity.title}`,
        html: templates.getCommentAddedTemplate(
          entityType,
          entity.name || entity.title,
          comment,
          commentedBy,
          entityType === "task" ? projectName : undefined,
        ),
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending comment added notification:", error)
    return { success: false, error: (error as Error).message }
  }
}
