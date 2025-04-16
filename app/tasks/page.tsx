import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { TaskDashboard } from "@/components/task-dashboard"

export default async function TasksPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch all tasks with related data
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`
      *,
      projects:project_id (id, name, status),
      team_members:assignee_id (id, name, avatar, role)
    `)
    .order("due_date", { ascending: true })

  // Fetch all projects for filtering
  const { data: projects, error: projectsError } = await supabase.from("projects").select("id, name").order("name")

  // Fetch all team members for assignment
  const { data: teamMembers, error: teamMembersError } = await supabase
    .from("team_members")
    .select("id, name, avatar, role")
    .order("name")

  if (tasksError || projectsError || teamMembersError) {
    console.error("Error fetching data:", { tasksError, projectsError, teamMembersError })
    return <div>Error loading tasks. Please try again later.</div>
  }

  return (
    <div className="container mx-auto py-4">
      <TaskDashboard initialTasks={tasks || []} projects={projects || []} teamMembers={teamMembers || []} />
    </div>
  )
}
