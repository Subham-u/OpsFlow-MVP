import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createClient()

  // Get all projects
  const { data: projects, error: projectsError } = await supabase.from("projects").select("*")

  if (projectsError) {
    return NextResponse.json({ error: projectsError.message }, { status: 500 })
  }

  // Get all team members
  const { data: members, error: membersError } = await supabase.from("team_members").select("*")

  if (membersError) {
    return NextResponse.json({ error: membersError.message }, { status: 500 })
  }

  const now = new Date()
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(now.getDate() + 7)

  const projectStats = {
    total: projects.length,
    completed: projects.filter((p) => p.status.toLowerCase() === "completed").length,
    inProgress: projects.filter((p) => p.status.toLowerCase() === "in progress").length,
    upcoming: projects.filter((p) => {
      if (!p.due_date) return false
      const dueDate = new Date(p.due_date)
      return dueDate > now
    }).length,
    dueThisWeek: projects.filter((p) => {
      if (!p.due_date) return false
      const dueDate = new Date(p.due_date)
      return dueDate > now && dueDate <= oneWeekFromNow
    }).length,
    nextDeadline: "None",
  }

  // Get the next deadline
  const upcomingProjects = projects.filter((p) => {
    if (!p.due_date) return false
    const dueDate = new Date(p.due_date)
    return dueDate > now
  })

  if (upcomingProjects.length > 0) {
    const sortedByDueDate = [...upcomingProjects].sort((a, b) => {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })

    if (sortedByDueDate[0].due_date) {
      projectStats.nextDeadline = new Date(sortedByDueDate[0].due_date).toLocaleDateString()
    }
  }

  const teamStats = {
    total: members.length,
    active: members.filter((m) => m.status.toLowerCase() === "active").length,
    onLeave: members.filter((m) => m.status.toLowerCase() === "on leave").length,
    inactive: members.filter((m) => m.status.toLowerCase() === "inactive").length,
    byDepartment: {},
  }

  // Count members by department
  members.forEach((member) => {
    const dept = member.department
    if (!teamStats.byDepartment[dept]) {
      teamStats.byDepartment[dept] = 0
    }
    teamStats.byDepartment[dept]++
  })

  return NextResponse.json({
    projectStats,
    teamStats,
  })
}
