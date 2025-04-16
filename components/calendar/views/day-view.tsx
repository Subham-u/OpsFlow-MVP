"use client"
import { format, isSameDay } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"

interface DayViewProps {
  currentDate: Date
  events: any[]
  handleEventClick: (event: any) => void
  isLoading: boolean
}

export function DayView({ currentDate, events, handleEventClick, isLoading }: DayViewProps) {
  // Generate hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Filter events for the current day
  const dayEvents = events.filter((event) => {
    const eventDate = event.date || (event.isMultiDay ? event.startDate : null)
    if (!eventDate) return false

    return isSameDay(eventDate, currentDate)
  })

  // Get events for a specific hour
  const getEventsForHour = (hour: number) => {
    return dayEvents.filter((event) => {
      if (event.isAllDay) return false

      const startHour = Number.parseInt(event.startTime.split(":")[0])
      return startHour === hour
    })
  }

  // Get all-day events
  const allDayEvents = dayEvents.filter((event) => event.isAllDay)

  // Calculate position and height for an event
  const calculateEventPosition = (event: any) => {
    if (!event.startTime || !event.endTime) return { top: 0, height: 60 }

    const startHour = Number.parseInt(event.startTime.split(":")[0])
    const startMinute = Number.parseInt(event.startTime.split(":")[1])
    const endHour = Number.parseInt(event.endTime.split(":")[0])
    const endMinute = Number.parseInt(event.endTime.split(":")[1])

    const top = startHour * 60 + startMinute
    const height = endHour * 60 + endMinute - top

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  // Add this state for the current time indicator
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update the current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">{format(currentDate, "EEEE, MMMM d, yyyy")}</h2>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="border rounded-md p-2 bg-muted/20">
          <div className="text-sm font-medium mb-2">All-day Events</div>
          <div className="flex flex-wrap gap-2">
            {allDayEvents.map((event) => (
              <TooltipProvider key={event.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`${event.color} text-white text-xs p-2 rounded cursor-pointer hover:opacity-90 flex items-center`}
                      onClick={() => handleEventClick(event)}
                    >
                      <span>{event.title}</span>
                      <Badge variant="outline" className="ml-2 bg-white/20 text-white border-white/30">
                        {event.category}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      {event.description && <p className="text-xs">{event.description}</p>}
                      <div className="flex items-center text-xs">
                        <span className="font-medium">Project: </span>
                        <span className="ml-1">{event.project}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs">
                          <span className="font-medium">Location: </span>
                          <span className="ml-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex border-t pt-2">
                  <Skeleton className="h-16 w-16" />
                  <div className="flex-1 ml-4">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Time indicators */}
              <div className="absolute top-0 left-0 w-16 h-full border-r">
                {hours.map((hour) => (
                  <div key={hour} className="absolute text-xs text-muted-foreground" style={{ top: `${hour * 60}px` }}>
                    {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                  </div>
                ))}
              </div>

              {/* Hour rows */}
              <div className="ml-16">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-t relative"
                    style={{
                      backgroundColor: hour >= 9 && hour < 17 ? "rgba(var(--primary), 0.05)" : "transparent",
                    }}
                  >
                    {/* Half-hour marker */}
                    <div className="absolute w-full h-[1px] top-[30px] bg-muted-foreground/10"></div>

                    {/* Events for this hour */}
                    {getEventsForHour(hour).map((event) => {
                      const position = calculateEventPosition(event)

                      return (
                        <TooltipProvider key={event.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`absolute ${event.color} text-white rounded p-1 left-1 right-1 overflow-hidden cursor-pointer hover:opacity-90`}
                                style={{
                                  top: position.top,
                                  height: position.height,
                                  transform: "translateY(-60px)", // Adjust for the hour offset
                                }}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="text-xs font-medium">{event.title}</div>
                                <div className="text-xs opacity-80">
                                  {event.startTime} - {event.endTime}
                                </div>
                                {Number.parseInt(position.height) > 50 && (
                                  <div className="text-xs mt-1 opacity-80 truncate">{event.location}</div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <div className="space-y-1">
                                <p className="font-medium">{event.title}</p>
                                {event.description && <p className="text-xs">{event.description}</p>}
                                <div className="flex items-center text-xs">
                                  <span className="font-medium">Time: </span>
                                  <span className="ml-1">
                                    {event.startTime} - {event.endTime}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs">
                                  <span className="font-medium">Project: </span>
                                  <span className="ml-1">{event.project}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center text-xs">
                                    <span className="font-medium">Location: </span>
                                    <span className="ml-1">{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Current time indicator */}
              {isSameDay(currentDate, new Date()) && (
                <div
                  className="absolute left-0 right-0 border-t border-red-500 z-10"
                  style={{
                    top: `${currentTime.getHours() * 60 + currentTime.getMinutes() + 16}px`,
                  }}
                >
                  <div className="absolute -top-2 -left-1 w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="absolute -top-6 -left-1 text-xs font-medium text-red-500">
                    {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
