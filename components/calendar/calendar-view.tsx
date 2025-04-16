"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MonthView } from "@/components/calendar/views/month-view"
import { AgendaView } from "@/components/calendar/views/agenda-view"
import { TimelineView } from "@/components/calendar/views/timeline-view"
import { TeamView } from "@/components/calendar/views/team-view"
import { DayView } from "@/components/calendar/views/day-view"
import { WeekView } from "@/components/calendar/views/week-view"
import { addMonths, subMonths, format as dateFormat } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, List, CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTimeTracking } from "@/contexts/time-tracking-context"
import { formatTime } from "@/lib/date-utils"

export function CalendarView() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [keyboardShortcutsVisible, setKeyboardShortcutsVisible] = useState(false)
  const { attendanceRecords, timeEntries } = useTimeTracking()

  // Use media query to detect mobile screens
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Set default view based on screen size
  useEffect(() => {
    if (isMobile) {
      setView("agenda") // Use agenda view on mobile by default
    }
  }, [isMobile])

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Create array of day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Sample events data with enhanced properties
  const sampleEvents = [
    {
      id: "1",
      title: "Team Meeting",
      description: "Weekly team sync to discuss project progress",
      date: new Date(currentYear, currentMonth, 5),
      startTime: "10:00",
      endTime: "11:00",
      project: "Website Redesign",
      category: "meeting",
      color: "bg-blue-500",
      location: "Conference Room A",
      isRecurring: true,
      recurringPattern: "weekly",
      attendees: ["1", "2", "3"],
      type: "project",
    },
    {
      id: "2",
      title: "Client Presentation",
      description: "Present the new marketing campaign to the client",
      date: new Date(currentYear, currentMonth, 12),
      startTime: "14:00",
      endTime: "15:30",
      project: "Marketing Campaign",
      category: "presentation",
      color: "bg-green-500",
      location: "Main Boardroom",
      isRecurring: false,
      attendees: ["1", "4", "5"],
      type: "project",
    },
    {
      id: "3",
      title: "Project Deadline",
      description: "Final delivery of the mobile app development project",
      date: new Date(currentYear, currentMonth, 15),
      isAllDay: true,
      project: "Mobile App Development",
      category: "deadline",
      color: "bg-red-500",
      isRecurring: false,
      attendees: ["2", "3", "5"],
      type: "project",
    },
    {
      id: "4",
      title: "Design Review",
      description: "Review the latest design iterations for the website",
      date: new Date(currentYear, currentMonth, 18),
      startTime: "11:00",
      endTime: "12:00",
      project: "Website Redesign",
      category: "meeting",
      color: "bg-blue-500",
      location: "Design Lab",
      isRecurring: false,
      attendees: ["1", "3", "4"],
      type: "project",
    },
    {
      id: "5",
      title: "Sprint Planning",
      description: "Plan the next sprint for the mobile app development",
      date: new Date(currentYear, currentMonth, 22),
      startTime: "09:30",
      endTime: "11:00",
      project: "Mobile App Development",
      category: "meeting",
      color: "bg-purple-500",
      location: "Agile Room",
      isRecurring: true,
      recurringPattern: "biweekly",
      attendees: ["2", "3", "5"],
      type: "project",
    },
    {
      id: "6",
      title: "Brand Strategy Workshop",
      description: "Full-day workshop to define the brand strategy",
      date: new Date(currentYear, currentMonth, 8),
      isAllDay: true,
      project: "Brand Refresh",
      category: "workshop",
      color: "bg-amber-500",
      location: "Innovation Center",
      isRecurring: false,
      attendees: ["1", "2", "4", "5"],
      type: "project",
    },
    {
      id: "7",
      title: "E-commerce Launch",
      description: "Official launch of the new e-commerce platform",
      date: new Date(currentYear, currentMonth, 25),
      isAllDay: true,
      project: "E-commerce Platform",
      category: "milestone",
      color: "bg-emerald-500",
      isRecurring: false,
      attendees: ["1", "2", "3", "4", "5"],
      type: "project",
    },
    {
      id: "8",
      title: "User Testing",
      description: "Conduct user testing sessions for the mobile app",
      startDate: new Date(currentYear, currentMonth, 10),
      endDate: new Date(currentYear, currentMonth, 12),
      isMultiDay: true,
      startTime: "09:00",
      endTime: "17:00",
      project: "Mobile App Development",
      category: "workshop",
      color: "bg-indigo-500",
      location: "User Lab",
      isRecurring: false,
      attendees: ["2", "3", "4"],
      type: "project",
    },
    {
      id: "9",
      title: "Marketing Strategy",
      description: "Develop the Q3 marketing strategy",
      date: new Date(currentYear, currentMonth, 20),
      startTime: "13:00",
      endTime: "15:00",
      project: "Marketing Campaign",
      category: "meeting",
      color: "bg-green-500",
      location: "Marketing Department",
      isRecurring: false,
      attendees: ["1", "4", "5"],
      type: "project",
    },
    {
      id: "10",
      title: "Code Review",
      description: "Review the codebase for the website redesign",
      date: new Date(currentYear, currentMonth, 7),
      startTime: "14:00",
      endTime: "16:00",
      project: "Website Redesign",
      category: "meeting",
      color: "bg-blue-500",
      location: "Development Room",
      isRecurring: true,
      recurringPattern: "weekly",
      attendees: ["2", "3"],
      type: "project",
    },
  ]

  // Convert attendance records to calendar events
  const convertAttendanceToEvents = () => {
    const attendanceEvents: any[] = []

    attendanceRecords.forEach((record) => {
      const recordDate = new Date(record.date)

      // Skip if not in current month/year
      if (recordDate.getMonth() !== currentMonth || recordDate.getFullYear() !== currentYear) {
        return
      }

      // Clock-in event
      if (record.clockInTime) {
        attendanceEvents.push({
          id: `clockin_${record.id}`,
          title: "Clock In",
          description: `Clocked in at ${record.location}${record.isRemote ? " (Remote)" : ""}`,
          date: recordDate,
          startTime: record.clockInTime,
          endTime: record.clockInTime,
          category: "attendance",
          color: "bg-emerald-500",
          location: record.location,
          type: "attendance",
          attendanceType: "clockIn",
        })
      }

      // Clock-out event
      if (record.clockOutTime) {
        attendanceEvents.push({
          id: `clockout_${record.id}`,
          title: "Clock Out",
          description: `Total work time: ${record.totalWorkingHours?.toFixed(2)} hours`,
          date: recordDate,
          startTime: record.clockOutTime,
          endTime: record.clockOutTime,
          category: "attendance",
          color: "bg-slate-500",
          location: record.location,
          type: "attendance",
          attendanceType: "clockOut",
        })
      }

      // Break events
      record.breaks.forEach((breakItem, index) => {
        // Break start
        attendanceEvents.push({
          id: `break_start_${breakItem.id}`,
          title: "Break Started",
          description: breakItem.reason || "Break started",
          date: recordDate,
          startTime: breakItem.startTime,
          endTime: breakItem.startTime,
          category: "attendance",
          color: "bg-amber-500",
          type: "attendance",
          attendanceType: "breakStart",
        })

        // Break end
        if (breakItem.endTime) {
          attendanceEvents.push({
            id: `break_end_${breakItem.id}`,
            title: "Break Ended",
            description: `Break duration: ${breakItem.duration} minutes`,
            date: recordDate,
            startTime: breakItem.endTime,
            endTime: breakItem.endTime,
            category: "attendance",
            color: "bg-amber-500",
            type: "attendance",
            attendanceType: "breakEnd",
          })
        }
      })
    })

    return attendanceEvents
  }

  // Convert time entries to calendar events
  const convertTimeEntriesToEvents = () => {
    return timeEntries
      .map((entry) => {
        // Extract date from the entry
        const entryDate = entry.attendanceId
          ? attendanceRecords.find((record) => record.id === entry.attendanceId)?.date
          : new Date().toISOString().split("T")[0]

        if (!entryDate) return null

        const date = new Date(entryDate)

        // Skip if not in current month/year
        if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
          return null
        }

        return {
          id: `time_${entry.id}`,
          title: `${entry.project}: ${entry.task}`,
          description: entry.description,
          date: date,
          startTime: entry.startTime,
          endTime: entry.endTime || entry.startTime,
          project: entry.project,
          category: "time-entry",
          color: "bg-violet-500",
          type: "time-entry",
          duration: entry.duration,
          billable: entry.billable,
        }
      })
      .filter(Boolean) as any[]
  }

  // Function to get events for a specific day
  const getEventsForDay = (day: number) => {
    return events.filter((event) => {
      if (event.isMultiDay && event.startDate && event.endDate) {
        const eventStartDate = new Date(event.startDate)
        const eventEndDate = new Date(event.endDate)
        const currentDayDate = new Date(currentYear, currentMonth, day)
        return currentDayDate >= eventStartDate && currentDayDate <= eventEndDate
      }

      return (
        event.date &&
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
      )
    })
  }

  // Function to build calendar days
  const buildCalendarDays = () => {
    const days: (number | null)[] = []

    // Get first day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const startingDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Get number of days in the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    setCalendarDays(days)
  }

  // Load events from sample data and attendance records
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      const attendanceEvents = convertAttendanceToEvents()
      const timeEntryEvents = convertTimeEntriesToEvents()
      setEvents([...sampleEvents, ...attendanceEvents, ...timeEntryEvents])
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentMonth, currentYear, attendanceRecords, timeEntries])

  // Update calendar when current date changes
  useEffect(() => {
    buildCalendarDays()
  }, [currentDate])

  const handleEventClick = (event: any) => {
    let description = event.description || `Project: ${event.project}`

    // Add additional details based on event type
    if (event.type === "attendance") {
      if (event.attendanceType === "clockIn") {
        description = `Clocked in at ${formatTime(event.startTime)} - ${event.location}${event.isRemote ? " (Remote)" : ""}`
      } else if (event.attendanceType === "clockOut") {
        description = `Clocked out at ${formatTime(event.startTime)}`
      } else if (event.attendanceType === "breakStart") {
        description = `Break started at ${formatTime(event.startTime)}${event.reason ? ` - ${event.reason}` : ""}`
      } else if (event.attendanceType === "breakEnd") {
        description = `Break ended at ${formatTime(event.startTime)}`
      }
    } else if (event.type === "time-entry") {
      const durationHours = event.duration ? Math.floor(event.duration / 3600) : 0
      const durationMinutes = event.duration ? Math.floor((event.duration % 3600) / 60) : 0
      const durationStr = `${durationHours}h ${durationMinutes}m`

      description = `${event.description || "No description"}\nDuration: ${durationStr}${event.billable ? " (Billable)" : ""}`
    }

    toast({
      title: event.title,
      description: description,
    })
  }

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case "ArrowLeft":
          if (e.ctrlKey || e.metaKey) {
            setCurrentDate((prevDate) => subMonths(prevDate, 1))
          }
          break
        case "ArrowRight":
          if (e.ctrlKey || e.metaKey) {
            setCurrentDate((prevDate) => addMonths(prevDate, 1))
          }
          break
        case "t":
          if (e.ctrlKey || e.metaKey) {
            setCurrentDate(new Date())
          }
          break
        case "?":
          setKeyboardShortcutsVisible(true)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Add the keyboard shortcuts dialog
  const KeyboardShortcutsDialog = () => (
    <Dialog open={keyboardShortcutsVisible} onOpenChange={setKeyboardShortcutsVisible}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Use these keyboard shortcuts to navigate the calendar more efficiently.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
            </div>
            <span>Previous month</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
            </div>
            <span>Next month</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">T</kbd>
            </div>
            <span>Today</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd>
            </div>
            <span>Show keyboard shortcuts</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setKeyboardShortcutsVisible(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-4">
      {/* Mobile-optimized header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="mx-2 text-center min-w-[120px]">
            <span className="font-medium">{dateFormat(currentDate, "MMMM yyyy")}</span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="ml-2" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>

        <div className="flex items-center">
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full">
              <TabsTrigger value="month" className="px-2 sm:px-3">
                <CalendarIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Month</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="px-2 sm:px-3">
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Week</span>
              </TabsTrigger>
              <TabsTrigger value="day" className="px-2 sm:px-3">
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Day</span>
              </TabsTrigger>
              <TabsTrigger value="agenda" className="px-2 sm:px-3">
                <List className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Agenda</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="hidden sm:flex px-2 sm:px-3">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="hidden sm:flex px-2 sm:px-3">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Team</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Event type filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Event Types:</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs">Project</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs">Clock In</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-slate-500"></div>
          <span className="text-xs">Clock Out</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs">Breaks</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
          <span className="text-xs">Time Entries</span>
        </div>
      </div>

      {/* Responsive layout for calendar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-4 col-span-1">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h2>
            </div>

            {/* Render the appropriate view */}
            {view === "month" && (
              <MonthView
                currentDate={currentDate}
                calendarDays={calendarDays}
                dayNames={dayNames}
                getEventsForDay={getEventsForDay}
                handleEventClick={handleEventClick}
                isLoading={isLoading}
              />
            )}

            {view === "agenda" && (
              <AgendaView
                currentDate={currentDate}
                events={events}
                handleEventClick={handleEventClick}
                isLoading={isLoading}
              />
            )}

            {view === "timeline" && (
              <TimelineView
                currentDate={currentDate}
                events={events}
                handleEventClick={handleEventClick}
                isLoading={isLoading}
              />
            )}

            {view === "team" && (
              <TeamView
                currentDate={currentDate}
                events={events}
                handleEventClick={handleEventClick}
                isLoading={isLoading}
              />
            )}

            {view === "day" && (
              <DayView
                currentDate={currentDate}
                events={events}
                handleEventClick={handleEventClick}
                isLoading={isLoading}
              />
            )}

            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                events={events}
                handleEventClick={handleEventClick}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <KeyboardShortcutsDialog />
    </div>
  )
}
