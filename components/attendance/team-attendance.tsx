"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, UserX, Clock, Search, Filter, Coffee } from "lucide-react"
// Import the CardWrapper component
import { CardWrapper } from "@/components/ui/card-wrapper"

export function TeamAttendance() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sample team attendance data
  const teamMembers = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Project Manager",
      department: "Management",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      status: "present",
      clockInTime: "08:45 AM",
      workingHours: 7.5,
      onBreak: false,
      attendanceRate: 98,
      punctualityRate: 95,
    },
    {
      id: "2",
      name: "Beth Smith",
      role: "UI/UX Designer",
      department: "Design",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "BS",
      status: "present",
      clockInTime: "09:00 AM",
      workingHours: 7.0,
      onBreak: true,
      attendanceRate: 96,
      punctualityRate: 90,
    },
    {
      id: "3",
      name: "Carl Davis",
      role: "Frontend Developer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CD",
      status: "late",
      clockInTime: "09:30 AM",
      workingHours: 6.5,
      onBreak: false,
      attendanceRate: 92,
      punctualityRate: 85,
    },
    {
      id: "4",
      name: "Dana Wilson",
      role: "Backend Developer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DW",
      status: "absent",
      clockInTime: "-",
      workingHours: 0,
      onBreak: false,
      attendanceRate: 94,
      punctualityRate: 92,
    },
    {
      id: "5",
      name: "Eric Brown",
      role: "QA Engineer",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EB",
      status: "remote",
      clockInTime: "08:30 AM",
      workingHours: 7.5,
      onBreak: false,
      attendanceRate: 97,
      punctualityRate: 96,
    },
  ]

  // Filter team members based on search and filters
  const filteredMembers = teamMembers.filter((member) => {
    // Search filter
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Department filter
    if (departmentFilter !== "all" && member.department !== departmentFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && member.status !== statusFilter) {
      return false
    }

    return true
  })

  // Get status badge
  const getStatusBadge = (status: string, onBreak: boolean) => {
    if (onBreak) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          On Break
        </Badge>
      )
    }

    switch (status) {
      case "present":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Present
          </Badge>
        )
      case "late":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Late
          </Badge>
        )
      case "absent":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Absent
          </Badge>
        )
      case "remote":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Remote
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: string, onBreak: boolean) => {
    if (onBreak) {
      return <Coffee className="h-5 w-5 text-blue-500" />
    }

    switch (status) {
      case "present":
        return <UserCheck className="h-5 w-5 text-green-500" />
      case "late":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "absent":
        return <UserX className="h-5 w-5 text-red-500" />
      case "remote":
        return <UserCheck className="h-5 w-5 text-purple-500" />
      default:
        return <UserX className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search team members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <CardWrapper title="Team Attendance Overview" description="Current attendance status of your team">
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <UserCheck className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm font-medium">Present</p>
                  <p className="text-2xl font-bold">3</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm font-medium">Late</p>
                  <p className="text-2xl font-bold">1</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <UserX className="h-8 w-8 text-red-500 mb-2" />
                  <p className="text-sm font-medium">Absent</p>
                  <p className="text-2xl font-bold">1</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Coffee className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm font-medium">On Break</p>
                  <p className="text-2xl font-bold">1</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="list">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <div className="space-y-4">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden md:block text-right">
                            <p className="text-sm font-medium">Clock In</p>
                            <p className="text-sm text-muted-foreground">{member.clockInTime}</p>
                          </div>
                          <div className="hidden md:block text-right">
                            <p className="text-sm font-medium">Working Hours</p>
                            <p className="text-sm text-muted-foreground">{member.workingHours}h</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(member.status, member.onBreak)}
                            {getStatusBadge(member.status, member.onBreak)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No team members found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="stats">
                <div className="space-y-4">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <div key={member.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(member.status, member.onBreak)}
                            {getStatusBadge(member.status, member.onBreak)}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Attendance Rate</span>
                              <span className="font-medium">{member.attendanceRate}%</span>
                            </div>
                            <Progress value={member.attendanceRate} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Punctuality Rate</span>
                              <span className="font-medium">{member.punctualityRate}%</span>
                            </div>
                            <Progress value={member.punctualityRate} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No team members found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </CardWrapper>
      </div>
    </div>
  )
}
