"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Users } from "lucide-react"
import { AddTeamMemberDialog } from "@/components/team/add-team-member-dialog"

interface TeamHeaderProps {
  departments: string[]
}

export function TeamHeader({ departments }: TeamHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const currentDepartment = searchParams.get("department") || ""
  const currentStatus = searchParams.get("status") || ""

  const handleDepartmentChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("department", value)
    } else {
      params.delete("department")
    }
    router.push(`/team?${params.toString()}`)
  }

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("status", value)
    } else {
      params.delete("status")
    }
    router.push(`/team?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }
    router.push(`/team?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/team")
    setSearchQuery("")
  }

  const hasFilters = currentDepartment || currentStatus || searchQuery

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight">Team</h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-x-2 md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <form onSubmit={handleSearch} className="flex-1 md:max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search team members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <Select value={currentDepartment} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="h-8 px-2 lg:px-3">
              Clear
            </Button>
          )}
        </div>
      </div>

      <AddTeamMemberDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}
