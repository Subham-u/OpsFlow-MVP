"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"

// Types
type TimeEntry = {
  id: string
  project: string
  task: string
  description: string
  startTime: string
  endTime: string | null
  duration: number | null
  billable: boolean
  attendanceId?: string
}

type Break = {
  id: string
  startTime: string
  endTime: string | null
  duration: number | null
  reason?: string
}

type AttendanceRecord = {
  id: string
  date: string
  clockInTime: string | null
  clockOutTime: string | null
  location: string
  isRemote: boolean
  breaks: Break[]
  totalWorkingHours: number | null
  timeEntries: string[] // References to time entry IDs
  projectId?: string // Associate attendance with a project
}

type Timer = {
  isRunning: boolean
  startTime: number | null
  pausedTime: number | null
  elapsedSeconds: number
  project: string | null
  task: string | null
  description: string | null
}

type TimeTrackingContextType = {
  timeEntries: TimeEntry[]
  attendanceRecords: AttendanceRecord[]
  todayAttendance: AttendanceRecord | null
  activeTimer: Timer

  // Time tracking methods
  startTimer: (project: string, task: string, description: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  addTimeEntry: (entry: Omit<TimeEntry, "id">) => void

  // Attendance methods
  clockIn: (location: string, isRemote: boolean, projectId?: string) => void
  clockOut: (location: string) => void
  startBreak: (reason?: string) => void
  endBreak: () => void

  // Shared methods
  initializeTimeTracking: () => void
}

// Create context
const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined)

// Provider component
export function TimeTrackingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const { toast } = useToast()

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [activeTimer, setActiveTimer] = useState<Timer>({
    isRunning: false,
    startTime: null,
    pausedTime: null,
    elapsedSeconds: 0,
    project: null,
    task: null,
    description: null,
  })

  // Load data from localStorage on mount
  const initializeTimeTracking = useCallback(() => {
    try {
      // Load time entries
      const savedEntries = localStorage.getItem("timeEntries")
      if (savedEntries) {
        setTimeEntries(JSON.parse(savedEntries))
      }

      // Load attendance records
      const savedAttendance = localStorage.getItem("attendanceRecords")
      if (savedAttendance) {
        setAttendanceRecords(JSON.parse(savedAttendance))
      }

      // Set today's attendance
      const today = new Date().toISOString().split("T")[0]
      const savedTodayAttendance = localStorage.getItem(`attendance_${today}`)

      if (savedTodayAttendance) {
        setTodayAttendance(JSON.parse(savedTodayAttendance))
      } else {
        // Create a new attendance record for today
        const newAttendance: AttendanceRecord = {
          id: `attendance_${today}_${Date.now()}`,
          date: today,
          clockInTime: null,
          clockOutTime: null,
          location: "",
          isRemote: false,
          breaks: [],
          totalWorkingHours: null,
          timeEntries: [],
        }
        setTodayAttendance(newAttendance)
        localStorage.setItem(`attendance_${today}`, JSON.stringify(newAttendance))
      }

      // Load active timer
      const savedTimer = localStorage.getItem("activeTimer")
      if (savedTimer) {
        const parsedTimer = JSON.parse(savedTimer)
        setActiveTimer(parsedTimer)

        // If timer was running when the page was closed, update elapsed time
        if (parsedTimer.isRunning && parsedTimer.startTime) {
          const now = Date.now()
          const additionalSeconds = Math.floor((now - parsedTimer.startTime) / 1000)
          setActiveTimer((prev) => ({
            ...prev,
            elapsedSeconds: prev.elapsedSeconds + additionalSeconds,
            startTime: now,
          }))
        }
      }
    } catch (error) {
      console.error("Error initializing time tracking data:", error)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem("timeEntries", JSON.stringify(timeEntries))
    }
  }, [timeEntries])

  useEffect(() => {
    if (attendanceRecords.length > 0) {
      localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords))
    }
  }, [attendanceRecords])

  useEffect(() => {
    if (todayAttendance) {
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem(`attendance_${today}`, JSON.stringify(todayAttendance))
    }
  }, [todayAttendance])

  useEffect(() => {
    localStorage.setItem("activeTimer", JSON.stringify(activeTimer))
  }, [activeTimer])

  // Update timer every second when running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTimer.isRunning])

  // Time tracking methods
  const startTimer = useCallback((project: string, task: string, description: string) => {
    const now = Date.now()

    setActiveTimer({
      isRunning: true,
      startTime: now,
      pausedTime: null,
      elapsedSeconds: 0,
      project,
      task,
      description,
    })
  }, [])

  const pauseTimer = useCallback(() => {
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: false,
      pausedTime: Date.now(),
    }))
  }, [])

  const resumeTimer = useCallback(() => {
    setActiveTimer((prev) => ({
      ...prev,
      isRunning: true,
      startTime: Date.now(),
      pausedTime: null,
    }))
  }, [])

  const stopTimer = useCallback(() => {
    if (!activeTimer.project || !activeTimer.task) return

    const now = new Date()
    const startTime = new Date(now.getTime() - activeTimer.elapsedSeconds * 1000)

    // Create a new time entry
    const newEntry: TimeEntry = {
      id: `time_${Date.now()}`,
      project: activeTimer.project,
      task: activeTimer.task,
      description: activeTimer.description || "",
      startTime: startTime.toLocaleTimeString("en-US", { hour12: false }),
      endTime: now.toLocaleTimeString("en-US", { hour12: false }),
      duration: activeTimer.elapsedSeconds,
      billable: true,
      attendanceId: todayAttendance?.id,
    }

    setTimeEntries((prev) => [...prev, newEntry])

    // Update today's attendance to reference this time entry
    if (todayAttendance) {
      setTodayAttendance((prev) => {
        if (!prev) return null
        return {
          ...prev,
          timeEntries: [...prev.timeEntries, newEntry.id],
        }
      })
    }

    // Reset the timer
    setActiveTimer({
      isRunning: false,
      startTime: null,
      pausedTime: null,
      elapsedSeconds: 0,
      project: null,
      task: null,
      description: null,
    })
  }, [activeTimer, todayAttendance])

  const addTimeEntry = useCallback(
    (entry: Omit<TimeEntry, "id">) => {
      const newEntry: TimeEntry = {
        ...entry,
        id: `time_${Date.now()}`,
      }

      setTimeEntries((prev) => [...prev, newEntry])

      // Update today's attendance to reference this time entry
      if (todayAttendance) {
        setTodayAttendance((prev) => {
          if (!prev) return null
          return {
            ...prev,
            timeEntries: [...prev.timeEntries, newEntry.id],
          }
        })
      }
    },
    [todayAttendance],
  )

  // Attendance methods
  const clockIn = useCallback((location: string, isRemote: boolean, projectId?: string) => {
    const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false })
    const today = new Date().toISOString().split("T")[0]

    setTodayAttendance((prev) => {
      if (!prev) return null
      return {
        ...prev,
        clockInTime: currentTime,
        location,
        isRemote,
        projectId,
      }
    })

    // Create a new attendance record for today
    const newAttendance: AttendanceRecord = {
      id: `attendance_${today}_${Date.now()}`,
      date: today,
      clockInTime: currentTime,
      clockOutTime: null,
      location: location,
      isRemote: isRemote,
      breaks: [],
      totalWorkingHours: null,
      timeEntries: [],
      projectId: projectId,
    }
    setAttendanceRecords((prev) => [...prev, newAttendance])
  }, [])

  const clockOut = useCallback(
    (location: string) => {
      const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false })

      // If timer is running, stop it
      if (activeTimer.isRunning) {
        stopTimer()
      }

      setTodayAttendance((prev) => {
        if (!prev) return null

        // Calculate total working hours
        let totalHours = 0
        if (prev.clockInTime) {
          const startTime = new Date(`2000-01-01T${prev.clockInTime}`)
          const endTime = new Date(`2000-01-01T${currentTime}`)

          // Calculate total break time
          let totalBreakMinutes = 0
          prev.breaks.forEach((breakPeriod) => {
            if (breakPeriod.duration) {
              totalBreakMinutes += breakPeriod.duration
            }
          })

          // Calculate total working time in hours
          totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
          totalHours -= totalBreakMinutes / 60
        }

        return {
          ...prev,
          clockOutTime: currentTime,
          totalWorkingHours: totalHours,
        }
      })
    },
    [activeTimer.isRunning, stopTimer],
  )

  const startBreak = useCallback(
    (reason?: string) => {
      const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false })

      // If timer is running, pause it
      if (activeTimer.isRunning) {
        pauseTimer()
      }

      setTodayAttendance((prev) => {
        if (!prev) return null

        const newBreak: Break = {
          id: `break_${Date.now()}`,
          startTime: currentTime,
          endTime: null,
          duration: null,
          reason,
        }

        return {
          ...prev,
          breaks: [...prev.breaks, newBreak],
        }
      })
    },
    [activeTimer.isRunning, pauseTimer],
  )

  const endBreak = useCallback(() => {
    const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false })

    setTodayAttendance((prev) => {
      if (!prev || prev.breaks.length === 0) return prev

      const updatedBreaks = [...prev.breaks]
      const lastBreak = updatedBreaks[updatedBreaks.length - 1]

      if (lastBreak.endTime === null) {
        // Calculate duration in minutes
        const startTime = new Date(`2000-01-01T${lastBreak.startTime}`)
        const endTime = new Date(`2000-01-01T${currentTime}`)
        const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

        updatedBreaks[updatedBreaks.length - 1] = {
          ...lastBreak,
          endTime: currentTime,
          duration: durationMinutes,
        }
      }

      return {
        ...prev,
        breaks: updatedBreaks,
      }
    })
  }, [])

  const contextValue: TimeTrackingContextType = {
    timeEntries,
    attendanceRecords,
    todayAttendance,
    activeTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    addTimeEntry,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    initializeTimeTracking,
  }

  return <TimeTrackingContext.Provider value={contextValue}>{children}</TimeTrackingContext.Provider>
}

// Custom hook to use the context
export function useTimeTracking() {
  const context = useContext(TimeTrackingContext)
  if (context === undefined) {
    throw new Error("useTimeTracking must be used within a TimeTrackingProvider")
  }
  return context
}
