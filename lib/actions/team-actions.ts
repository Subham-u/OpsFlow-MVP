"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Import the notification service at the top of the file
import { notifyNewTeamMember } from "@/lib/email/notification-service"

// Team member schema for validation
const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().optional(),
  status: z.string().default("Active"),
  avatar: z.string().optional(),
})

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>

// Team member CRUD operations
export async function getTeamMembers() {
  const supabase = createClient()

  const { data, error } = await supabase.from("team_members").select("*").order("name", { ascending: true })

  if (error) {
    throw new Error(`Error fetching team members: ${error.message}`)
  }

  return data
}

export async function getTeamMemberById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("team_members").select("*").eq("id", id).single()

  if (error) {
    throw new Error(`Error fetching team member: ${error.message}`)
  }

  return data
}

// Check if an email already exists in the database
async function emailExists(email: string, excludeId?: string) {
  const supabase = createClient()
  let query = supabase.from("team_members").select("id").eq("email", email)

  // If we're updating a team member, exclude their own ID from the check
  if (excludeId) {
    query = query.neq("id", excludeId)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error checking email existence: ${error.message}`)
  }

  return data && data.length > 0
}

// Update the createTeamMember function to include email notification
export async function createTeamMember(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())

  try {
    const validatedData = teamMemberSchema.parse(rawData)

    // Check if email already exists
    const exists = await emailExists(validatedData.email)
    if (exists) {
      return {
        success: false,
        error: `A team member with the email ${validatedData.email} already exists`,
      }
    }

    const supabase = createClient()
    const { data, error } = await supabase.from("team_members").insert(validatedData).select()

    if (error) {
      // Handle specific database errors
      if (error.code === "23505" && error.message.includes("team_members_email")) {
        return {
          success: false,
          error: `A team member with this email already exists`,
        }
      }
      return { success: false, error: error.message }
    }

    // Send email notification
    // Note: In a real app, you would get the current user from the session
    const currentUser = {
      id: "user-1",
      name: "Admin User",
      email: "subham.m23csai@nst.rishihood.edu.in",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AU",
      role: "Admin" as const,
      status: "online" as const,
    }

    try {
      await notifyNewTeamMember(data[0].id, currentUser)
    } catch (emailError) {
      console.warn("Email notification failed but team member was created:", emailError)
      // Continue with the operation even if email fails
    }

    revalidatePath("/team")

    return { success: true, data: data[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to create team member" }
  }
}

// Update the updateTeamMember function to check for existing emails
export async function updateTeamMember(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())

  try {
    const validatedData = teamMemberSchema.parse(rawData)

    // Check if email already exists (excluding the current team member)
    const exists = await emailExists(validatedData.email, id)
    if (exists) {
      return {
        success: false,
        error: `Another team member with the email ${validatedData.email} already exists`,
      }
    }

    const supabase = createClient()
    const { data, error } = await supabase.from("team_members").update(validatedData).eq("id", id).select()

    if (error) {
      // Handle specific database errors
      if (error.code === "23505" && error.message.includes("team_members_email")) {
        return {
          success: false,
          error: `Another team member with this email already exists`,
        }
      }
      return { success: false, error: error.message }
    }

    revalidatePath("/team")
    revalidatePath(`/team/${id}`)

    return { success: true, data: data[0] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to update team member" }
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("team_members").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/team")

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete team member" }
  }
}
