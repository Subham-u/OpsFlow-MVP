"use client"

import { useState } from "react"
import { format, isToday, parseISO, isValid } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, MapPin, Briefcase, DollarSign } from "lucide-react"

interface AgendaViewProps {
  currentDate: Date
  events: any[]
  handleEventClick: (event: any) => void
  isLoading: boolean
}

export function AgendaView({ currentDate, events, handleEventClick, isLoading }: AgendaViewProps) {
  const [filter, setFilter] = useState<string | null>(null)

  // Group events by date
  const groupedEvents = events.reduce((acc: Record<string, any[]>, event) => {
    // Skip if filtered out
    if (filter && event.type !== filter) {
      return acc
    }

    // Get the event date
    let eventDate: Date | null = null

    if (event.date) {
      eventDate = new Date(event.date)
    } else if (event.startDate) {
      eventDate = new Date(event.startDate)
    } else if (event.attendanceId) {
      // Try to find date from attendance record
      const dateStr = event.attendanceId.split("_")[1]
      if (dateStr && isValid(parseISO(dateStr))) {
        eventDate = parseISO(dateStr)
      }
    }

    if (!eventDate) return acc

    const dateKey = eventDate.toISOString().split("T")[0]

    if (!acc[dateKey]) {
      acc[dateKey] = []
    }

    acc[dateKey].push(event)
    return acc
  }, {})

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort()

  // Get event icon based on type
  const getEventIcon = (event: any) => {
    switch (event.type) {
      case "attendance":
        if (event.attendanceType === "clockIn") return <Clock className="h-4 w-4 text-emerald-500" />
        if (event.attendanceType === "clockOut") return <Clock className="h-4 w-4 text-slate-500" />
        if (event.attendanceType === "breakStart" || event.attendanceType === "breakEnd")
          return <Clock className="h-4 w-4 text-amber-500" />
        return <Clock className="h-4 w-4" />
      case "time-entry":
        return <Briefcase className="h-4 w-4 text-violet-500" />
      default:
        return <CalendarIcon className="h-4 w-4 text-blue-500" />
    }
  }

  // Get event badge based on type
  const getEventBadge = (event: any) => {
    if (event.type === "attendance") {
      if (event.attendanceType === "clockIn")
        return (
          <Badge variant="outline" className="bg-emerald-500 text-white">
            Clock In
          </Badge>
        )
      if (event.attendanceType === "clockOut")
        return (
          <Badge variant="outline" className="bg-slate-500 text-white">
            Clock Out
          </Badge>
        )
      if (event.attendanceType === "breakStart")
        return (
          <Badge variant="outline" className="bg-amber-500 text-white">
            Break Start
          </Badge>
        )
      if (event.attendanceType === "breakEnd")
        return (
          <Badge variant="outline" className="bg-amber-500 text-white">
            Break End
          </Badge>
        )
    }

    if (event.type === "time-entry") {
      return (
        <Badge variant="outline" className="bg-violet-500 text-white">
          {event.billable && <DollarSign className="h-3 w-3 mr-1" />}
          Time Entry
        </Badge>
      )
    }

    if (event.category) {
      return (
        <Badge variant="outline" className={`${event.color} text-white`}>
          {event.category}
        </Badge>
      )
    }

    return null
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === null ? "default" : "outline"} size="sm" onClick={() => setFilter(null)}>
          All
        </Button>
        <Button variant={filter === "project" ? "default" : "outline"} size="sm" onClick={() => setFilter("project")}>
          Projects
        </Button>
        <Button
          variant={filter === "attendance" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("attendance")}
        >
          Attendance
        </Button>
        <Button
          variant={filter === "time-entry" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("time-entry")}
        >
          Time Entries
        </Button>
      </div>

      {isLoading ? (
        // Loading skeleton
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, eventIndex) => (
                    <div key={eventIndex} className="flex items-start">
                      <Skeleton className="h-10 w-10 rounded-full mr-3" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.length > 0 ? (
            sortedDates.map((dateKey) => {
              const date = new Date(dateKey)
              const eventsForDate = groupedEvents[dateKey]

              return (
                <Card key={dateKey}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <div className={`font-medium ${isToday(date) ? "text-primary" : ""}`}>
                        {isToday(date) ? "Today - " : ""}
                        {format(date, "EEEE, MMMM d, yyyy")}
                      </div>
                      {isToday(date) && <Badge className="ml-2">Today</Badge>}
                    </div>
                    <div className="space-y-3">
                      {eventsForDate
                        .sort((a: any, b: any) => {
                          // Sort by time
                          const aTime = a.startTime || "00:00"
                          const bTime = b.startTime || "00:00"
                          return aTime.localeCompare(bTime)
                        })
                        .map((event: any) => (
                          <div
                            key={event.id}
                            className="flex items-start p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="mr-3 mt-1">{getEventIcon(event)}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{event.title}</div>
                                {getEventBadge(event)}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {event.startTime && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>
                                      {event.startTime}
                                      {event.endTime && event.endTime !== event.startTime && ` - ${event.endTime}`}
                                    </span>
                                  </div>
                                )}
                                {event.location && (
                                  <div className="flex items-center mt-1">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                                {event.project && (
                                  <div className="flex items-center mt-1">
                                    <Briefcase className="h-3 w-3 mr-1" />
                                    <span>{event.project}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-sm">
                {filter
                  ? `No ${filter} events found for this period. Try changing the filter or date range.`
                  : "No events found for this period. Try changing the date range."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
