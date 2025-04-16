import { createClient } from "@/lib/supabase/server"
import { cache } from "react"

export const getProjects = cache(
  async (options?: {
    status?: string
    starred?: boolean
    limit?: number
    search?: string
  }) => {
    const supabase = createClient()
    let query = supabase.from("projects").select("*")

    if (options?.status) {
      query = query.eq("status", options.status)
    }

    if (options?.starred) {
      query = query.eq("is_starred", true)
    }

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    return data || []
  },
)

export const getTeamMembers = cache(
  async (options?: {
    department?: string
    status?: string
    limit?: number
    search?: string
  }) => {
    const supabase = createClient()
    let query = supabase.from("team_members").select("*")

    if (options?.department) {
      query = query.eq("department", options.department)
    }

    if (options?.status) {
      query = query.eq("status", options.status)
    }

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,email.ilike.%${options.search}%,role.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query.order("name", { ascending: true })

    if (error) {
      console.error("Error fetching team members:", error)
      return []
    }

    return data || []
  },
)

export const getTasks = cache(
  async (options?: {
    status?: string
    priority?: string
    projectId?: string
    assigneeId?: string
    limit?: number
    search?: string
  }) => {
    const supabase = createClient()
    let query = supabase.from("tasks").select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)

    if (options?.status) {
      query = query.eq("status", options.status)
    }

    if (options?.priority) {
      query = query.eq("priority", options.priority)
    }

    if (options?.projectId) {
      query = query.eq("project_id", options.projectId)
    }

    if (options?.assigneeId) {
      query = query.eq("assignee_id", options.assigneeId)
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tasks:", error)
      return []
    }

    return data || []
  },
)

export const getProjectStats = cache(async () => {
  const supabase = createClient()

  // Get all projects
  const { data: projects, error } = await supabase.from("projects").select("*")

  if (error) {
    console.error("Error fetching project stats:", error)
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      upcoming: 0,
      dueThisWeek: 0,
      nextDeadline: "None",
      byStatus: {},
      byMonth: {},
    }
  }

  const now = new Date()
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(now.getDate() + 7)

  const completed = projects.filter((p) => p.status.toLowerCase() === "completed").length
  const inProgress = projects.filter((p) => p.status.toLowerCase() === "in progress").length

  // Get upcoming deadlines (due dates in the future)
  const upcomingProjects = projects.filter((p) => {
    if (!p.due_date) return false
    const dueDate = new Date(p.due_date)
    return dueDate > now
  })

  // Get projects due this week
  const dueThisWeek = projects.filter((p) => {
    if (!p.due_date) return false
    const dueDate = new Date(p.due_date)
    return dueDate > now && dueDate <= oneWeekFromNow
  }).length

  // Get the next deadline
  let nextDeadline = "None"
  if (upcomingProjects.length > 0) {
    const sortedByDueDate = [...upcomingProjects].sort((a, b) => {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })

    if (sortedByDueDate[0].due_date) {
      nextDeadline = new Date(sortedByDueDate[0].due_date).toLocaleDateString()
    }
  }

  // Count projects by status
  const byStatus = {}
  projects.forEach((project) => {
    const status = project.status
    if (!byStatus[status]) {
      byStatus[status] = 0
    }
    byStatus[status]++
  })

  // Count projects by month
  const byMonth = {}
  projects.forEach((project) => {
    if (project.created_at) {
      const date = new Date(project.created_at)
      const month = date.toLocaleString("default", { month: "long" })
      if (!byMonth[month]) {
        byMonth[month] = 0
      }
      byMonth[month]++
    }
  })

  return {
    total: projects.length,
    completed,
    inProgress,
    upcoming: upcomingProjects.length,
    dueThisWeek,
    nextDeadline,
    byStatus,
    byMonth,
  }
})

export const getTeamStats = cache(async () => {
  const supabase = createClient()

  // Get all team members
  const { data: members, error } = await supabase.from("team_members").select("*")

  if (error) {
    console.error("Error fetching team stats:", error)
    return {
      total: 0,
      active: 0,
      byDepartment: {},
      byStatus: {},
    }
  }

  const active = members.filter((m) => m.status.toLowerCase() === "active").length

  // Count members by department
  const byDepartment = {}
  members.forEach((member) => {
    const dept = member.department
    if (!byDepartment[dept]) {
      byDepartment[dept] = 0
    }
    byDepartment[dept]++
  })

  // Count members by status
  const byStatus = {}
  members.forEach((member) => {
    const status = member.status
    if (!byStatus[status]) {
      byStatus[status] = 0
    }
    byStatus[status]++
  })

  return {
    total: members.length,
    active,
    byDepartment,
    byStatus,
  }
})

export const getTaskStats = cache(async () => {
  const supabase = createClient()

  // Get all tasks
  const { data: tasks, error } = await supabase.from("tasks").select("*")

  if (error) {
    console.error("Error fetching task stats:", error)
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      toDo: 0,
      highPriority: 0,
      dueThisWeek: 0,
      overdue: 0,
      byStatus: {},
      byPriority: {},
    }
  }

  const now = new Date()
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(now.getDate() + 7)

  const completed = tasks.filter((t) => t.status.toLowerCase() === "completed").length
  const inProgress = tasks.filter((t) => t.status.toLowerCase() === "in progress").length
  const toDo = tasks.filter((t) => t.status.toLowerCase() === "to do").length
  const highPriority = tasks.filter((t) => t.priority.toLowerCase() === "high").length

  // Get tasks due this week
  const dueThisWeek = tasks.filter((t) => {
    if (!t.due_date) return false
    const dueDate = new Date(t.due_date)
    return dueDate > now && dueDate <= oneWeekFromNow
  }).length

  // Get overdue tasks
  const overdue = tasks.filter((t) => {
    if (!t.due_date) return false
    const dueDate = new Date(t.due_date)
    return dueDate < now && t.status.toLowerCase() !== "completed"
  }).length

  // Count tasks by status
  const byStatus = {}
  tasks.forEach((task) => {
    const status = task.status
    if (!byStatus[status]) {
      byStatus[status] = 0
    }
    byStatus[status]++
  })

  // Count tasks by priority
  const byPriority = {}
  tasks.forEach((task) => {
    const priority = task.priority
    if (!byPriority[priority]) {
      byPriority[priority] = 0
    }
    byPriority[priority]++
  })

  return {
    total: tasks.length,
    completed,
    inProgress,
    toDo,
    highPriority,
    dueThisWeek,
    overdue,
    byStatus,
    byPriority,
  }
})

export const getDepartments = cache(async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("team_members")
    .select("department")
    .order("department", { ascending: true })

  if (error) {
    console.error("Error fetching departments:", error)
    return []
  }

  // Extract unique departments
  const departments = [...new Set(data.map((item) => item.department))]

  return departments
})

export const getProjectStatuses = cache(async () => {
  const supabase = createClient()

  const { data, error } = await supabase.from("projects").select("status").order("status", { ascending: true })

  if (error) {
    console.error("Error fetching project statuses:", error)
    return []
  }

  // Extract unique statuses
  const statuses = [...new Set(data.map((item) => item.status))]

  return statuses
})

export const getTaskStatuses = cache(async () => {
  const supabase = createClient()

  const { data, error } = await supabase.from("tasks").select("status").order("status", { ascending: true })

  if (error) {
    console.error("Error fetching task statuses:", error)
    return []
  }

  // Extract unique statuses
  const statuses = [...new Set(data.map((item) => item.status))]

  return statuses
})

export const getTaskPriorities = cache(async () => {
  const supabase = createClient()

  const { data, error } = await supabase.from("tasks").select("priority").order("priority", { ascending: true })

  if (error) {
    console.error("Error fetching task priorities:", error)
    return []
  }

  // Extract unique priorities
  const priorities = [...new Set(data.map((item) => item.priority))]

  return priorities
})

export const searchProjects = cache(async (query: string) => {
  if (!query || query.length < 2) return []

  const supabase = createClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error searching projects:", error)
    return []
  }

  return data || []
})

export const searchTeamMembers = cache(async (query: string) => {
  if (!query || query.length < 2) return []

  const supabase = createClient()

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,role.ilike.%${query}%`)
    .order("name", { ascending: true })
    .limit(5)

  if (error) {
    console.error("Error searching team members:", error)
    return []
  }

  return data || []
})

export const searchTasks = cache(async (query: string) => {
  if (!query || query.length < 2) return []

  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error searching tasks:", error)
    return []
  }

  return data || []
})

export const getProjectsWithDeadlinesSoon = cache(async (days = 7) => {
  const supabase = createClient()

  const now = new Date()
  const future = new Date()
  future.setDate(now.getDate() + days)

  const nowStr = now.toISOString().split("T")[0]
  const futureStr = future.toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .gte("due_date", nowStr)
    .lte("due_date", futureStr)
    .not("status", "eq", "Completed")
    .order("due_date", { ascending: true })

  if (error) {
    console.error("Error fetching projects with upcoming deadlines:", error)
    return []
  }

  return data || []
})

export const getTasksWithDeadlinesSoon = cache(async (days = 7) => {
  const supabase = createClient()

  const now = new Date()
  const future = new Date()
  future.setDate(now.getDate() + days)

  const nowStr = now.toISOString().split("T")[0]
  const futureStr = future.toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .gte("due_date", nowStr)
    .lte("due_date", futureStr)
    .not("status", "eq", "Completed")
    .order("due_date", { ascending: true })

  if (error) {
    console.error("Error fetching tasks with upcoming deadlines:", error)
    return []
  }

  return data || []
})

export const getOverdueTasks = cache(async () => {
  const supabase = createClient()

  const now = new Date()
  const nowStr = now.toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .lt("due_date", nowStr)
    .not("status", "eq", "Completed")
    .order("due_date", { ascending: true })

  if (error) {
    console.error("Error fetching overdue tasks:", error)
    return []
  }

  return data || []
})

export const getRecentlyUpdatedProjects = cache(async (limit = 5) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recently updated projects:", error)
    return []
  }

  return data || []
})

export const getRecentlyUpdatedTasks = cache(async (limit = 5) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recently updated tasks:", error)
    return []
  }

  return data || []
})

export const getTeamMembersByStatus = cache(async (status: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("status", status)
    .order("name", { ascending: true })

  if (error) {
    console.error(`Error fetching team members with status ${status}:`, error)
    return []
  }

  return data || []
})

export const getTasksByStatus = cache(async (status: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .eq("status", status)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching tasks with status ${status}:`, error)
    return []
  }

  return data || []
})

export const getTasksByPriority = cache(async (priority: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .eq("priority", priority)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching tasks with priority ${priority}:`, error)
    return []
  }

  return data || []
})

export const getTasksByProject = cache(async (projectId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error)
    return []
  }

  return data || []
})

export const getTasksByAssignee = cache(async (assigneeId: string) => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name),
      assignee:assignee_id(id, name, avatar)
    `)
    .eq("assignee_id", assigneeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching tasks for assignee ${assigneeId}:`, error)
    return []
  }

  return data || []
})

export const getUnassignedTasks = cache(async () => {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      *,
      project:project_id(id, name)
    `)
    .is("assignee_id", null)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching unassigned tasks:", error)
    return []
  }

  return data || []
})
