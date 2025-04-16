"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface TeamViewProps {
  currentDate: Date
  events: any[]
  handleEventClick: (event: any) => void
  isLoading: boolean
}

export function TeamView({ currentDate, events, handleEventClick, isLoading }: TeamViewProps) {
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 0 }))
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>(["1", "2", "3", "4", "5"])

  // Sample team members
  const teamMembers = [
    { id: "1", name: "John Doe", role: "Project Manager", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", name: "Jane Smith", role: "Designer", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "3", name: "Mike Johnson", role: "Developer", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "4", name: "Sarah Williams", role: "Marketing", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "5", name: "David Brown", role: "Content Writer", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  // Generate days for the week
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 0 }),
  })

  // Navigation functions
  const navigatePreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7))
  }

  const navigateNextWeek = () => {
    setWeekStart(addDays(weekStart, 7))
  }

  const navigateToday = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))
  }

  // Toggle team member selection
  const toggleTeamMember = (id: string) => {
    setSelectedTeamMembers((prev) => (prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]))
  }

  // Get events for a specific day and team member
  const getEventsForDayAndMember = (day: Date, memberId: string) => {
    return events.filter((event) => {
      const eventDate = event.date || (event.isMultiDay ? event.startDate : null)
      if (!eventDate) return false

      return isSameDay(eventDate, day) && event.attendees && event.attendees.includes(memberId)
    })
  }

  // Check if a team member is available on a specific day
  const getMemberAvailability = (day: Date, memberId: string) => {
    const memberEvents = getEventsForDayAndMember(day, memberId)

    // Calculate total hours booked
    let totalHoursBooked = 0
    memberEvents.forEach((event) => {
      if (event.isAllDay) {
        totalHoursBooked = 8 // Assume 8-hour workday
      } else if (event.startTime && event.endTime) {
        const startHour = Number.parseInt(event.startTime.split(":")[0])
        const startMinute = Number.parseInt(event.startTime.split(":")[1])
        const endHour = Number.parseInt(event.endTime.split(":")[0])
        const endMinute = Number.parseInt(event.endTime.split(":")[1])

        const duration = endHour - startHour + (endMinute - startMinute) / 60
        totalHoursBooked += duration
      }
    })

    // Determine availability status
    if (totalHoursBooked >= 6) {
      return { status: "busy", color: "bg-red-500", hours: totalHoursBooked }
    } else if (totalHoursBooked >= 3) {
      return { status: "partial", color: "bg-amber-500", hours: totalHoursBooked }
    } else {
      return { status: "available", color: "bg-green-500", hours: totalHoursBooked }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(weekStart, "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={navigateNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="ml-2" onClick={navigateToday}>
            Today
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Users className="h-4 w-4" />
            Team Availability
          </Button>
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
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedTeamMembers.includes(member.id)}
                    onCheckedChange={() => toggleTeamMember(member.id)}
                  />
                  <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
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

        {/* Team schedule */}
        <Card className="flex-1">
          <CardContent className="p-4">
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-4">
                <div className="grid grid-cols-8 gap-2 border-b pb-2">
                  <div className="col-span-1"></div>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton key={index} className="h-6 w-full" />
                  ))}
                </div>

                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-8 gap-2">
                    <Skeleton className="h-10 w-full flex items-center" />
                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <Skeleton key={dayIndex} className="h-10 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Week days header */}
                <div className="grid grid-cols-8 gap-2 border-b pb-2">
                  <div className="col-span-1"></div>
                  {weekDays.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center font-medium ${
                        isSameDay(day, new Date()) ? "bg-primary/10 rounded-md" : ""
                      }`}
                    >
                      <div>{format(day, "EEE")}</div>
                      <div>{format(day, "d")}</div>
                    </div>
                  ))}
                </div>

                {/* Team members schedule */}
                {teamMembers
                  .filter((member) => selectedTeamMembers.includes(member.id))
                  .map((member) => (
                    <div key={member.id} className="grid grid-cols-8 gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm truncate">{member.name}</div>
                      </div>

                      {weekDays.map((day, dayIndex) => {
                        const dayEvents = getEventsForDayAndMember(day, member.id)
                        const availability = getMemberAvailability(day, member.id)

                        return (
                          <div
                            key={dayIndex}
                            className={`border rounded-md p-1 min-h-[60px] ${
                              isSameDay(day, new Date()) ? "bg-primary/5 border-primary/20" : ""
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <Badge variant="outline" className={`${availability.color} text-white text-xs px-1 py-0`}>
                                {availability.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{availability.hours}h</span>
                            </div>

                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((event) => (
                                <TooltipProvider key={event.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-90`}
                                        onClick={() => handleEventClick(event)}
                                      >
                                        {event.title}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      <div className="space-y-1">
                                        <p className="font-medium">{event.title}</p>
                                        {event.description && <p className="text-xs">{event.description}</p>}
                                        {!event.isAllDay && (
                                          <div className="flex items-center text-xs">
                                            <span className="font-medium">Time: </span>
                                            <span className="ml-1">
                                              {event.startTime} - {event.endTime}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}

                              {dayEvents.length > 2 && (
                                <div className="text-xs text-center text-muted-foreground">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
