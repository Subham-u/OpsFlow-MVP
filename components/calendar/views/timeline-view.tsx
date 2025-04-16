"use client"

import { useState } from "react"
import { format, addMonths, subMonths, isSameMonth, isAfter, isBefore, startOfMonth, endOfMonth } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TimelineViewProps {
  currentDate: Date
  events: any[]
  handleEventClick: (event: any) => void
  isLoading: boolean
}

export function TimelineView({ currentDate, events, handleEventClick, isLoading }: TimelineViewProps) {
  const [timelineDate, setTimelineDate] = useState(currentDate)
  const [timelineRange, setTimelineRange] = useState(3) // Default to 3 months

  // Calculate start and end dates for the timeline
  const startDate = startOfMonth(timelineDate)
  const endDate = endOfMonth(addMonths(timelineDate, timelineRange - 1))

  // Generate months for the timeline
  const months = []
  let currentMonth = startDate
  while (isBefore(currentMonth, endDate) || isSameMonth(currentMonth, endDate)) {
    months.push(new Date(currentMonth))
    currentMonth = addMonths(currentMonth, 1)
  }

  // Filter events for the timeline period
  const timelineEvents = events
    .filter((event) => {
      const eventDate = event.date || (event.isMultiDay ? event.startDate : null)
      if (!eventDate) return false

      return (
        (isAfter(eventDate, startDate) || isSameMonth(eventDate, startDate)) &&
        (isBefore(eventDate, endDate) || isSameMonth(eventDate, endDate))
      )
    })
    .sort((a, b) => {
      const dateA = a.date || (a.isMultiDay ? a.startDate : new Date())
      const dateB = b.date || (b.isMultiDay ? b.startDate : new Date())
      return dateA.getTime() - dateB.getTime()
    })

  // Group events by project
  const projectGroups: Record<string, any[]> = {}

  timelineEvents.forEach((event) => {
    if (!projectGroups[event.project]) {
      projectGroups[event.project] = []
    }

    projectGroups[event.project].push(event)
  })

  // Navigation functions
  const navigatePrevious = () => {
    setTimelineDate(subMonths(timelineDate, timelineRange))
  }

  const navigateNext = () => {
    setTimelineDate(addMonths(timelineDate, timelineRange))
  }

  // Calculate position for an event in the timeline
  const calculateEventPosition = (event: any) => {
    const eventDate = event.date || (event.isMultiDay ? event.startDate : new Date())
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    const eventDays = (eventDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)

    return {
      left: `${(eventDays / totalDays) * 100}%`,
      width:
        event.isMultiDay && event.startDate && event.endDate
          ? `${((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100}%`
          : "120px",
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(startDate, "MMM yyyy")} - {format(endDate, "MMM yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant={timelineRange === 3 ? "default" : "outline"} size="sm" onClick={() => setTimelineRange(3)}>
            3 Months
          </Button>
          <Button variant={timelineRange === 6 ? "default" : "outline"} size="sm" onClick={() => setTimelineRange(6)}>
            6 Months
          </Button>
          <Button variant={timelineRange === 12 ? "default" : "outline"} size="sm" onClick={() => setTimelineRange(12)}>
            1 Year
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-8">
              <div className="flex border-b pb-2">
                {Array.from({ length: timelineRange }).map((_, index) => (
                  <div key={index} className="flex-1 px-2">
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>

              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <div className="relative h-12 bg-muted/30 rounded-md">
                    <Skeleton className="absolute h-8 w-24 top-2 left-1/4" />
                    <Skeleton className="absolute h-8 w-32 top-2 left-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timeline header with months */}
              <div className="flex border-b pb-2">
                {months.map((month, index) => (
                  <div key={index} className="flex-1 px-2 text-center font-medium">
                    {format(month, "MMMM yyyy")}
                  </div>
                ))}
              </div>

              {/* Timeline grid */}
              <div className="space-y-8">
                {Object.keys(projectGroups).length > 0 ? (
                  Object.keys(projectGroups).map((project) => (
                    <div key={project} className="space-y-2">
                      <h3 className="font-medium">{project}</h3>
                      <div className="relative h-12 bg-muted/30 rounded-md">
                        {/* Month dividers */}
                        {months.map((month, index) => (
                          <div
                            key={index}
                            className="absolute h-full border-l border-dashed border-muted-foreground/30"
                            style={{ left: `${(index / months.length) * 100}%` }}
                          ></div>
                        ))}

                        {/* Events */}
                        {projectGroups[project].map((event) => {
                          const position = calculateEventPosition(event)

                          return (
                            <TooltipProvider key={event.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`absolute h-8 top-2 ${event.color} text-white text-xs rounded px-2 flex items-center justify-center cursor-pointer hover:opacity-90`}
                                    style={{
                                      left: position.left,
                                      width: position.width,
                                      minWidth: "80px",
                                    }}
                                    onClick={() => handleEventClick(event)}
                                  >
                                    <span className="truncate">{event.title}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-medium">{event.title}</p>
                                    {event.description && <p className="text-xs">{event.description}</p>}
                                    <div className="flex items-center text-xs">
                                      <span className="font-medium">Date: </span>
                                      <span className="ml-1">
                                        {event.isMultiDay && event.startDate && event.endDate
                                          ? `${format(event.startDate, "MMM d")} - ${format(event.endDate, "MMM d, yyyy")}`
                                          : format(event.date, "MMM d, yyyy")}
                                      </span>
                                    </div>
                                    {event.category && (
                                      <Badge variant="outline" className="text-xs">
                                        {event.category}
                                      </Badge>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No events found</h3>
                    <p className="text-muted-foreground mt-1">No events scheduled in the selected time period</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
