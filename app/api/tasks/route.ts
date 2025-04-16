import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Get search params if any
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  const assigneeId = searchParams.get("assigneeId")
  const status = searchParams.get("status")
  const priority = searchParams.get("priority")
  const dueDate = searchParams.get("dueDate")
  const search = searchParams.get("search")

  let query = supabase.from("tasks").select(`
      *,
      projects:project_id (id, name, status),
      team_members:assignee_id (id, name, avatar, role)
    `)

  // Apply filters if provided
  if (projectId) {
    query = query.eq("project_id", projectId)
  }

  if (assigneeId) {
    query = query.eq("assignee_id", assigneeId)
  }

  if (status) {
    query = query.eq("status", status)
  }

  if (priority) {
    query = query.eq("priority", priority)
  }

  if (dueDate === "today") {
    const today = new Date().toISOString().split("T")[0]
    query = query.eq("due_date", today)
  } else if (dueDate === "overdue") {
    const today = new Date().toISOString().split("T")[0]
    query = query.lt("due_date", today).not("status", "eq", "Completed")
  } else if (dueDate === "upcoming") {
    const today = new Date().toISOString().split("T")[0]
    query = query.gt("due_date", today)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query.order("due_date", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tasks: data })
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from("tasks")
      .insert([body])
      .select(`
      *,
      projects:project_id (id, name, status),
      team_members:assignee_id (id, name, avatar, role)
    `)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ task: data[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
