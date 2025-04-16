"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, PlusCircle, Search } from "lucide-react"
import { AddTaskDialog } from "@/components/tasks/add-task-dialog"

interface TasksHeaderProps {
  statuses: string[]
  priorities: string[]
}

export function TasksHeader({ statuses, priorities }: TasksHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const currentStatus = searchParams.get("status") || ""
  const currentPriority = searchParams.get("priority") || ""
  const currentProjectId = searchParams.get("projectId") || ""
  const currentAssigneeId = searchParams.get("assigneeId") || ""

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("status", value)
    } else {
      params.delete("status")
    }
    router.push(`/tasks?${params.toString()}`)
  }

  const handlePriorityChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("priority", value)
    } else {
      params.delete("priority")
    }
    router.push(`/tasks?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    router.push(`/tasks?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/tasks")
    setSearchQuery("")
  }

  const hasFilters = currentStatus || currentPriority || currentProjectId || currentAssigneeId || searchQuery

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckSquare className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-x-2 md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <form onSubmit={handleSearch} className="flex-1 md:max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currentPriority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="h-8 px-2 lg:px-3">
              Clear
            </Button>
          )}
        </div>
      </div>

      <AddTaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
