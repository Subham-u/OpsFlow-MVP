"use client"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect, useRef } from "react"

interface WeekViewProps {
  currentDate: Date
  events: any[]
  handleEventClick: (event: any) => void
  isLoading: boolean
}

export function WeekView({ currentDate, events, handleEventClick, isLoading }: WeekViewProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Generate days for the week
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 0 }),
    end: endOfWeek(currentDate, { weekStartsOn: 0 }),
  })

  // Generate hours for the day (business hours)
  const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

  // Get events for a specific day and hour
  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      if (!event.date && !event.startDate) return false
      if (event.isAllDay) return false

      const eventDate = event.date || event.startDate
      if (!isSameDay(eventDate, day)) return false

      const startHour = Number.parseInt(event.startTime.split(":")[0])
      return startHour === hour
    })
  }

  // Get all-day events for a specific day
  const getAllDayEventsForDay = (day: Date) => {
    return events.filter((event) => {
      if (!event.date && !event.startDate) return false
      if (!event.isAllDay) return false

      const eventDate = event.date || event.startDate
      return isSameDay(eventDate, day)
    })
  }

  // Calculate position and height for an event
  const calculateEventPosition = (event: any) => {
    if (!event.startTime || !event.endTime) return { top: 0, height: 60 }

    const startHour = Number.parseInt(event.startTime.split(":")[0])
    const startMinute = Number.parseInt(event.startTime.split(":")[1])
    const endHour = Number.parseInt(event.endTime.split(":")[0])
    const endMinute = Number.parseInt(event.endTime.split(":")[1])

    const top = (startHour - 8) * 60 + startMinute // Adjust for 8 AM start
    const height = endHour * 60 + endMinute - (startHour * 60 + startMinute)

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  return (
    <div className="space-y-4">
      {/* All-day events */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`text-center font-medium p-2 ${isSameDay(day, new Date()) ? "bg-primary/10 rounded-md" : ""} ${
              !isSameMonth(day, currentDate) ? "text-muted-foreground" : ""
            }`}
          >
            <div>{format(day, "EEE")}</div>
            <div>{format(day, "d")}</div>
          </div>
        ))}

        {weekDays.map((day, dayIndex) => {
          const allDayEvents = getAllDayEventsForDay(day)

          return (
            <div
              key={dayIndex}
              className={`border rounded-md p-1 min-h-[60px] ${
                isSameDay(day, new Date()) ? "bg-primary/5 border-primary/20" : ""
              }`}
            >
              {allDayEvents.length > 0 ? (
                <div className="space-y-1">
                  {allDayEvents.slice(0, 2).map((event) => (
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
                            <div className="flex items-center text-xs">
                              <span className="font-medium">Project: </span>
                              <span className="ml-1">{event.project}</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}

                  {allDayEvents.length > 2 && (
                    <div className="text-xs text-center text-muted-foreground">+{allDayEvents.length - 2} more</div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-center text-muted-foreground h-full flex items-center justify-center">
                  No all-day events
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-8 gap-2">
              <div className="col-span-1">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-16 mb-2" />
                ))}
              </div>

              <div className="col-span-7 grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className="space-y-2">
                    {Array.from({ length: 12 }).map((_, hourIndex) => (
                      <Skeleton key={hourIndex} className="h-16 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-2">
              {/* Time indicators */}
              <div className="col-span-1">
                {hours.map((hour) => (
                  <div key={hour} className="h-16 flex items-start justify-end pr-2 text-xs text-muted-foreground">
                    {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                  </div>
                ))}
              </div>

              {/* Week grid */}
              <div className="col-span-7 grid grid-cols-7 gap-2">
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="relative">
                    {/* Hour cells */}
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-16 border-t relative"
                        style={{
                          backgroundColor: hour >= 9 && hour < 17 ? "rgba(var(--primary), 0.05)" : "transparent",
                        }}
                      >
                        {/* Events for this hour and day */}
                        {getEventsForDayAndHour(day, hour).map((event) => {
                          const position = calculateEventPosition(event)

                          return (
                            <TooltipProvider key={event.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`absolute ${event.color} text-white rounded p-1 left-1 right-1 overflow-hidden cursor-pointer hover:opacity-90 z-10`}
                                    style={{
                                      top: position.top,
                                      height: position.height,
                                    }}
                                    onClick={() => handleEventClick(event)}
                                  >
                                    <div className="text-xs font-medium truncate">{event.title}</div>
                                    {Number.parseInt(position.height) > 40 && (
                                      <div className="text-xs opacity-80 truncate">{event.startTime}</div>
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

                    {/* Current time indicator */}
                    {isSameDay(day, new Date()) && (
                      <div
                        className="absolute left-0 right-0 border-t border-red-500 z-20"
                        style={{
                          top: `${(currentTime.getHours() - 8) * 60 + currentTime.getMinutes()}px`,
                          display: currentTime.getHours() >= 8 && currentTime.getHours() < 20 ? "block" : "none",
                        }}
                      >
                        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="absolute -top-5 -left-1 text-xs font-medium text-red-500">
                          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
