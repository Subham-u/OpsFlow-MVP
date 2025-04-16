"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useRealtimeProjects(initialProjects: any[] = []) {
  const [projects, setProjects] = useState(initialProjects)

  useEffect(() => {
    const supabase = createClient()

    // Set initial data
    if (initialProjects.length > 0) {
      setProjects(initialProjects)
    }

    // Subscribe to changes
    const channel = supabase
      .channel("public:projects")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProjects((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setProjects((prev) => prev.map((project) => (project.id === payload.new.id ? payload.new : project)))
          } else if (payload.eventType === "DELETE") {
            setProjects((prev) => prev.filter((project) => project.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialProjects])

  return projects
}

export function useRealtimeTeamMembers(initialMembers: any[] = []) {
  const [members, setMembers] = useState(initialMembers)

  useEffect(() => {
    const supabase = createClient()

    // Set initial data
    if (initialMembers.length > 0) {
      setMembers(initialMembers)
    }

    // Subscribe to changes
    const channel = supabase
      .channel("public:team_members")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_members",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMembers((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setMembers((prev) => prev.map((member) => (member.id === payload.new.id ? payload.new : member)))
          } else if (payload.eventType === "DELETE") {
            setMembers((prev) => prev.filter((member) => member.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialMembers])

  return members
}

export function useRealtimeTasks(initialTasks: any[] = []) {
  const [tasks, setTasks] = useState(initialTasks)

  useEffect(() => {
    const supabase = createClient()

    // Set initial data
    if (initialTasks.length > 0) {
      setTasks(initialTasks)
    }

    // Subscribe to changes
    const channel = supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) => prev.map((task) => (task.id === payload.new.id ? payload.new : task)))
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((task) => task.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialTasks])

  return tasks
}
