"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Users, Filter, Clock, Calendar, BarChart2, AlertTriangle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
  initials: string
  status: "available" | "busy" | "away" | "offline"
  workload: number // 0-100
  tasks: {
    id: string
    title: string
    project: string
    dueDate: string
    priority: "low" | "medium" | "high" | "critical"
    status: "todo" | "in-progress" | "review" | "done"
  }[]
  schedule: {
    date: string
    availability: "available" | "partial" | "unavailable"
    events: {
      id: string
      title: string
      startTime: string
      endTime: string
      type: "meeting" | "focus" | "pto" | "other"
    }[]
  }[]
  skills: string[]
  capacity: number // hours per week
  utilized: number // hours assigned
}

export function TeamWorkload() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>(["all"])
  const [viewMode, setViewMode] = useState<"schedule" | "workload" | "capacity">("schedule")
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null)
  const [filterSkills, setFilterSkills] = useState<string[]>([])
  const [filterAvailability, setFilterAvailability] = useState<string | null>(null)

  // Sample team members
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Project Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      status: "available",
      workload: 85,
      tasks: [
        {
          id: "t1",
          title: "Project planning",
          project: "Website Redesign",
          dueDate: "2023-08-15",
          priority: "high",
          status: "in-progress",
        },
        {
          id: "t2",
          title: "Team coordination",
          project: "Mobile App Development",
          dueDate: "2023-08-10",
          priority: "medium",
          status: "todo",
        },
      ],
      schedule: [
        {
          date: format(addDays(weekStart, 0), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e1",
              title: "Team Standup",
              startTime: "09:00",
              endTime: "09:30",
              type: "meeting",
            },
            {
              id: "e2",
              title: "Project Planning",
              startTime: "14:00",
              endTime: "16:00",
              type: "focus",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 1), "yyyy-MM-dd"),
          availability: "partial",
          events: [
            {
              id: "e3",
              title: "Client Meeting",
              startTime: "11:00",
              endTime: "12:30",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 2), "yyyy-MM-dd"),
          availability: "available",
          events: [],
        },
        {
          date: format(addDays(weekStart, 3), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e4",
              title: "Sprint Planning",
              startTime: "10:00",
              endTime: "11:30",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 4), "yyyy-MM-dd"),
          availability: "partial",
          events: [
            {
              id: "e5",
              title: "1:1 Meetings",
              startTime: "13:00",
              endTime: "17:00",
              type: "meeting",
            },
          ],
        },
      ],
      skills: ["Project Management", "Agile", "Leadership"],
      capacity: 40,
      utilized: 34,
    },
    {
      id: "2",
      name: "Beth Smith",
      role: "UI/UX Designer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "BS",
      status: "busy",
      workload: 95,
      tasks: [
        {
          id: "t3",
          title: "Homepage wireframes",
          project: "Website Redesign",
          dueDate: "2023-08-12",
          priority: "high",
          status: "in-progress",
        },
        {
          id: "t4",
          title: "Mobile app mockups",
          project: "Mobile App Development",
          dueDate: "2023-08-18",
          priority: "high",
          status: "todo",
        },
      ],
      schedule: [
        {
          date: format(addDays(weekStart, 0), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e6",
              title: "Team Standup",
              startTime: "09:00",
              endTime: "09:30",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 1), "yyyy-MM-dd"),
          availability: "busy",
          events: [
            {
              id: "e7",
              title: "Design Sprint",
              startTime: "09:00",
              endTime: "17:00",
              type: "focus",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 2), "yyyy-MM-dd"),
          availability: "busy",
          events: [
            {
              id: "e8",
              title: "Design Sprint",
              startTime: "09:00",
              endTime: "17:00",
              type: "focus",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 3), "yyyy-MM-dd"),
          availability: "partial",
          events: [
            {
              id: "e9",
              title: "Design Review",
              startTime: "13:00",
              endTime: "15:00",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 4), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e10",
              title: "Team Standup",
              startTime: "09:00",
              endTime: "09:30",
              type: "meeting",
            },
          ],
        },
      ],
      skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
      capacity: 40,
      utilized: 38,
    },
    {
      id: "3",
      name: "Carl Davis",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CD",
      status: "away",
      workload: 70,
      tasks: [
        {
          id: "t5",
          title: "Implement homepage",
          project: "Website Redesign",
          dueDate: "2023-08-20",
          priority: "medium",
          status: "todo",
        },
        {
          id: "t6",
          title: "Fix responsive issues",
          project: "Marketing Campaign",
          dueDate: "2023-08-11",
          priority: "high",
          status: "in-progress",
        },
      ],
      schedule: [
        {
          date: format(addDays(weekStart, 0), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e11",
              title: "Team Standup",
              startTime: "09:00",
              endTime: "09:30",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 1), "yyyy-MM-dd"),
          availability: "available",
          events: [],
        },
        {
          date: format(addDays(weekStart, 2), "yyyy-MM-dd"),
          availability: "unavailable",
          events: [
            {
              id: "e12",
              title: "PTO",
              startTime: "09:00",
              endTime: "17:00",
              type: "pto",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 3), "yyyy-MM-dd"),
          availability: "unavailable",
          events: [
            {
              id: "e13",
              title: "PTO",
              startTime: "09:00",
              endTime: "17:00",
              type: "pto",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 4), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e14",
              title: "Code Review",
              startTime: "14:00",
              endTime: "15:00",
              type: "meeting",
            },
          ],
        },
      ],
      skills: ["React", "TypeScript", "CSS", "HTML"],
      capacity: 40,
      utilized: 28,
    },
    {
      id: "4",
      name: "Dana Wilson",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DW",
      status: "available",
      workload: 60,
      tasks: [
        {
          id: "t7",
          title: "API development",
          project: "Mobile App Development",
          dueDate: "2023-08-25",
          priority: "high",
          status: "in-progress",
        },
        {
          id: "t8",
          title: "Database optimization",
          project: "Website Redesign",
          dueDate: "2023-08-15",
          priority: "medium",
          status: "todo",
        },
      ],
      schedule: [
        {
          date: format(addDays(weekStart, 0), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e15",
              title: "Team Standup",
              startTime: "09:00",
              endTime: "09:30",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 1), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e16",
              title: "Architecture Review",
              startTime: "11:00",
              endTime: "12:00",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 2), "yyyy-MM-dd"),
          availability: "available",
          events: [],
        },
        {
          date: format(addDays(weekStart, 3), "yyyy-MM-dd"),
          availability: "partial",
          events: [
            {
              id: "e17",
              title: "API Planning",
              startTime: "14:00",
              endTime: "16:00",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 4), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e18",
              title: "Team Standup",
              startTime: "09:00",
              endTime: "09:30",
              type: "meeting",
            },
          ],
        },
      ],
      skills: ["Node.js", "Python", "SQL", "API Design"],
      capacity: 40,
      utilized: 24,
    },
    {
      id: "5",
      name: "Eric Brown",
      role: "QA Engineer",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EB",
      status: "offline",
      workload: 50,
      tasks: [
        {
          id: "t9",
          title: "Test homepage",
          project: "Website Redesign",
          dueDate: "2023-08-22",
          priority: "medium",
          status: "todo",
        },
        {
          id: "t10",
          title: "Regression testing",
          project: "Mobile App Development",
          dueDate: "2023-08-28",
          priority: "low",
          status: "todo",
        },
      ],
      schedule: [
        {
          date: format(addDays(weekStart, 0), "yyyy-MM-dd"),
          availability: "unavailable",
          events: [
            {
              id: "e19",
              title: "PTO",
              startTime: "09:00",
              endTime: "17:00",
              type: "pto",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 1), "yyyy-MM-dd"),
          availability: "unavailable",
          events: [
            {
              id: "e20",
              title: "PTO",
              startTime: "09:00",
              endTime: "17:00",
              type: "pto",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 2), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e21",
              title: "QA Planning",
              startTime: "10:00",
              endTime: "11:00",
              type: "meeting",
            },
          ],
        },
        {
          date: format(addDays(weekStart, 3), "yyyy-MM-dd"),
          availability: "available",
          events: [],
        },
        {
          date: format(addDays(weekStart, 4), "yyyy-MM-dd"),
          availability: "available",
          events: [
            {
              id: "e22",
              title: "Test Review",
              startTime: "15:00",
              endTime: "16:00",
              type: "meeting",
            },
          ],
        },
      ],
      skills: ["Manual Testing", "Automated Testing", "Test Planning"],
      capacity: 40,
      utilized: 20,
    },
  ]

  // Generate days for the week
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  })

  // Navigation functions
  const navigatePreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7))
  }

  const navigateNextWeek = () => {
    setWeekStart(addDays(weekStart, 7))
  }

  const navigateToday = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  // Toggle team member selection
  const toggleTeamMemberSelection = (id: string) => {
    if (id === "all") {
      setSelectedTeamMembers(["all"])
      return
    }

    setSelectedTeamMembers((prev) => {
      // Remove "all" from selection
      const withoutAll = prev.filter((p) => p !== "all")

      // Toggle the selected member
      const newSelection = withoutAll.includes(id) ? withoutAll.filter((p) => p !== id) : [...withoutAll, id]

      // If nothing is selected, default to "all"
      return newSelection.length === 0 ? ["all"] : newSelection
    })
  }

  // Filter team members
  const filteredTeamMembers = teamMembers.filter((member) => {
    if (selectedTeamMembers.includes("all")) {
      // Apply other filters
      if (filterDepartment && !member.role.includes(filterDepartment)) {
        return false
      }

      if (filterSkills.length > 0 && !filterSkills.some((skill) => member.skills.includes(skill))) {
        return false
      }

      if (filterAvailability) {
        const todaySchedule = member.schedule.find((s) => s.date === format(new Date(), "yyyy-MM-dd"))
        if (todaySchedule && todaySchedule.availability !== filterAvailability) {
          return false
        }
      }

      return true
    }

    return selectedTeamMembers.includes(member.id)
  })

  // Get availability color
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500"
      case "partial":
        return "bg-yellow-500"
      case "busy":
      case "unavailable":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "focus":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "pto":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get workload color
  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return "text-red-500"
    if (workload >= 75) return "text-yellow-500"
    if (workload >= 50) return "text-blue-500"
    return "text-green-500"
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-purple-100 text-purple-800"
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Render schedule view
  const renderScheduleView = () => {
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-6 gap-2 mb-4">
            <div className="col-span-1"></div>
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={`text-center font-medium ${
                  isSameDay(day, new Date()) ? "bg-primary/10 rounded-md p-1" : ""
                }`}
              >
                <div>{format(day, "EEE")}</div>
                <div>{format(day, "d MMM")}</div>
              </div>
            ))}
          </div>

          {filteredTeamMembers.map((member) => (
            <div key={member.id} className="grid grid-cols-6 gap-2 mb-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              </div>

              {weekDays.map((day, dayIndex) => {
                const daySchedule = member.schedule.find((s) => s.date === format(day, "yyyy-MM-dd"))

                return (
                  <div
                    key={dayIndex}
                    className={`border rounded-md p-2 min-h-[100px] ${
                      isSameDay(day, new Date()) ? "bg-primary/5 border-primary/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <Badge
                        variant="outline"
                        className={`${getAvailabilityColor(daySchedule?.availability || "available")} text-white text-xs px-1 py-0`}
                      >
                        {daySchedule?.availability || "available"}
                      </Badge>
                    </div>

                    <ScrollArea className="h-[80px]">
                      <div className="space-y-1">
                        {daySchedule?.events.map((event, eventIndex) => (
                          <TooltipProvider key={eventIndex}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`${getEventTypeColor(event.type)} text-xs p-1 rounded border truncate cursor-pointer`}
                                >
                                  {event.startTime} - {event.title}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <div className="space-y-1">
                                  <p className="font-medium">{event.title}</p>
                                  <p className="text-xs">
                                    {event.startTime} - {event.endTime}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render workload view
  const renderWorkloadView = () => {
    return (
      <div className="space-y-4">
        {filteredTeamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`font-medium ${getWorkloadColor(member.workload)}`}>{member.workload}% Workload</div>
                  <Badge variant={member.workload > 85 ? "destructive" : member.workload > 70 ? "warning" : "success"}>
                    {member.workload > 85 ? "Overloaded" : member.workload > 70 ? "High" : "Balanced"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Workload</span>
                  <span>{member.workload}%</span>
                </div>
                <Progress value={member.workload} className="h-2" />

                <div className="flex justify-between text-sm mt-4">
                  <span>Capacity Utilization</span>
                  <span>
                    {member.utilized}/{member.capacity} hours
                  </span>
                </div>
                <Progress value={(member.utilized / member.capacity) * 100} className="h-2" />
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Current Tasks ({member.tasks.length})</div>
                <div className="space-y-2">
                  {member.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-muted-foreground">{task.project}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <div className="text-xs">Due {new Date(task.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {member.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render capacity view
  const renderCapacityView = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Team Capacity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-sm truncate">{member.name}</div>
                      <div className="text-sm">
                        {member.utilized}/{member.capacity}h
                      </div>
                    </div>
                    <Progress
                      value={(member.utilized / member.capacity) * 100}
                      className="h-2 mt-1"
                      indicatorClassName={
                        member.utilized > member.capacity
                          ? "bg-red-500"
                          : member.utilized > member.capacity * 0.8
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Capacity Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTeamMembers
                  .filter((member) => member.utilized > member.capacity * 0.8)
                  .map((member) => (
                    <div key={member.id} className="flex items-start gap-2 p-2 border rounded-md">
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${member.utilized > member.capacity ? "text-red-500" : "text-yellow-500"}`}
                      />
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {member.utilized > member.capacity
                            ? `Overallocated by ${member.utilized - member.capacity} hours`
                            : `Near capacity (${Math.round((member.utilized / member.capacity) * 100)}%)`}
                        </div>
                      </div>
                    </div>
                  ))}

                {filteredTeamMembers.filter((member) => member.utilized > member.capacity * 0.8).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">No capacity alerts at this time</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Available Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTeamMembers
                  .filter((member) => member.utilized < member.capacity * 0.7)
                  .map((member) => (
                    <div key={member.id} className="flex items-start gap-2 p-2 border rounded-md">
                      <div className="flex items-center gap-2 w-full">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {member.capacity - member.utilized}h available
                        </Badge>
                      </div>
                    </div>
                  ))}

                {filteredTeamMembers.filter((member) => member.utilized < member.capacity * 0.7).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No team members with significant available capacity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(weekStart, "MMM d")} - {format(weekDays[4], "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={navigateNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="ml-2" onClick={navigateToday}>
            Today
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "schedule" | "workload" | "capacity")}>
            <TabsList>
              <TabsTrigger value="schedule" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="workload" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Workload</span>
              </TabsTrigger>
              <TabsTrigger value="capacity" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Capacity</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Department</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filterDepartment === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterDepartment(null)}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterDepartment === "Developer" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterDepartment("Developer")}
                    >
                      Development
                    </Button>
                    <Button
                      variant={filterDepartment === "Designer" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterDepartment("Designer")}
                    >
                      Design
                    </Button>
                    <Button
                      variant={filterDepartment === "Manager" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterDepartment("Manager")}
                    >
                      Management
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Skills</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    {["React", "TypeScript", "UI Design", "Project Management", "API Design", "Testing"].map(
                      (skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={filterSkills.includes(skill)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilterSkills([...filterSkills, skill])
                              } else {
                                setFilterSkills(filterSkills.filter((s) => s !== skill))
                              }
                            }}
                          />
                          <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Availability</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={filterAvailability === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterAvailability(null)}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterAvailability === "available" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterAvailability("available")}
                    >
                      Available
                    </Button>
                    <Button
                      variant={filterAvailability === "partial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterAvailability("partial")}
                    >
                      Partial
                    </Button>
                    <Button
                      variant={filterAvailability === "unavailable" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterAvailability("unavailable")}
                    >
                      Unavailable
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterDepartment(null)
                      setFilterSkills([])
                      setFilterAvailability(null)
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Team members selection */}
        <Card className="md:w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 py-1">
                <Checkbox
                  id="member-all"
                  checked={selectedTeamMembers.includes("all")}
                  onCheckedChange={() => toggleTeamMemberSelection("all")}
                />
                <Label htmlFor="member-all">All Team Members</Label>
              </div>
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedTeamMembers.includes(member.id)}
                    onCheckedChange={() => toggleTeamMemberSelection(member.id)}
                    disabled={selectedTeamMembers.includes("all")}
                  />
                  <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div>{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <Card className="flex-1">
          <CardContent className="p-4">
            {viewMode === "schedule" && renderScheduleView()}
            {viewMode === "workload" && renderWorkloadView()}
            {viewMode === "capacity" && renderCapacityView()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
