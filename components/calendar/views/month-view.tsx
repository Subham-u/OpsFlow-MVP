"use client"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { useToast } from "@/hooks/use-toast"

interface MonthViewProps {
  currentDate: Date
  calendarDays: (number | null)[]
  dayNames: string[]
  getEventsForDay: (day: number) => any[]
  handleEventClick: (event: any) => void
  isLoading: boolean
}

export function MonthView({
  currentDate,
  calendarDays,
  dayNames,
  getEventsForDay,
  handleEventClick,
  isLoading,
}: MonthViewProps) {
  const { toast } = useToast()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const today = new Date()

  // Function to handle right-click context menu actions
  const handleContextMenuAction = (action: string, day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    switch (action) {
      case "add-event":
        toast({
          title: "Add Event",
          description: `Creating new event on ${formattedDate}`,
        })
        break
      case "add-task":
        toast({
          title: "Add Task",
          description: `Creating new task on ${formattedDate}`,
        })
        break
      case "view-day":
        toast({
          title: "View Day",
          description: `Viewing details for ${formattedDate}`,
        })
        break
    }
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Day names */}
      {dayNames.map((day) => (
        <div key={day} className="text-center font-medium p-2">
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {isLoading
        ? // Loading skeleton
          Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="min-h-[120px] border rounded-md p-2">
              <Skeleton className="h-5 w-5 rounded-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))
        : // Actual calendar days
          calendarDays.map((day, index) => (
            <ContextMenu key={index}>
              <ContextMenuTrigger asChild>
                <div
                  className={`min-h-[120px] border rounded-md p-2 ${day === null ? "bg-muted/50" : ""} ${
                    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
                      ? "bg-primary/10 border-primary"
                      : ""
                  } hover:bg-muted/30 transition-colors`}
                >
                  {day !== null && (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">{day}</div>
                        {day === today.getDate() &&
                          currentMonth === today.getMonth() &&
                          currentYear === today.getFullYear() && (
                            <Badge variant="outline" className="bg-primary text-primary-foreground text-xs">
                              Today
                            </Badge>
                          )}
                      </div>
                      <div className="mt-1 space-y-1">
                        {getEventsForDay(day).map((event) => (
                          <TooltipProvider key={event.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-90 flex items-center group`}
                                  onClick={() => handleEventClick(event)}
                                >
                                  {event.isAllDay ? (
                                    <span className="font-medium">All day: </span>
                                  ) : (
                                    <span className="mr-1">{event.startTime}</span>
                                  )}
                                  <span className="truncate">{event.title}</span>
                                  <span className="ml-auto opacity-0 group-hover:opacity-100">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M12 20h9"></path>
                                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                  </span>
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
                      </div>
                    </>
                  )}
                </div>
              </ContextMenuTrigger>
              {day !== null && (
                <ContextMenuContent className="w-64">
                  <ContextMenuItem onClick={() => handleContextMenuAction("add-event", day)}>
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"></path>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <line x1="19" y1="15" x2="19" y2="21"></line>
                      <line x1="16" y1="18" x2="22" y2="18"></line>
                    </svg>
                    Add Event
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleContextMenuAction("add-task", day)}>
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    Add Task
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => handleContextMenuAction("view-day", day)}>
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    View Day
                  </ContextMenuItem>
                </ContextMenuContent>
              )}
            </ContextMenu>
          ))}
    </div>
  )
}
