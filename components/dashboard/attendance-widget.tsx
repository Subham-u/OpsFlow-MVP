"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Coffee, LogIn, LogOut } from "lucide-react"
import { useTimeTracking } from "@/contexts/time-tracking-context"
import { useState, useEffect } from "react"
import { formatDuration } from "@/lib/date-utils"
import Link from "next/link"

export function AttendanceWidget() {
  const { todayAttendance, clockIn, clockOut, startBreak, endBreak } = useTimeTracking()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [workDuration, setWorkDuration] = useState(0)
  const [isOnBreak, setIsOnBreak] = useState(false)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate work duration
  useEffect(() => {
    if (!todayAttendance || !todayAttendance.clockInTime) return

    const clockInTime = new Date(`2000-01-01T${todayAttendance.clockInTime}`)
    let endTime = todayAttendance.clockOutTime ? new Date(`2000-01-01T${todayAttendance.clockOutTime}`) : currentTime

    // Convert to same date for calculation
    if (!todayAttendance.clockOutTime) {
      endTime = new Date(
        `2000-01-01T${endTime.getHours().toString().padStart(2, "0")}:${endTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${endTime.getSeconds().toString().padStart(2, "0")}`,
      )
    }

    // Calculate total break time
    let totalBreakSeconds = 0
    todayAttendance.breaks.forEach((breakItem) => {
      if (breakItem.duration) {
        totalBreakSeconds += breakItem.duration * 60 // Convert minutes to seconds
      } else if (breakItem.startTime && !breakItem.endTime) {
        // Ongoing break
        const breakStart = new Date(`2000-01-01T${breakItem.startTime}`)
        const breakEnd = new Date(
          `2000-01-01T${currentTime.getHours().toString().padStart(2, "0")}:${currentTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}:${currentTime.getSeconds().toString().padStart(2, "0")}`,
        )
        totalBreakSeconds += (breakEnd.getTime() - breakStart.getTime()) / 1000
        setIsOnBreak(true)
      }
    })

    // Calculate work duration in seconds
    const totalSeconds = (endTime.getTime() - clockInTime.getTime()) / 1000
    setWorkDuration(Math.max(0, totalSeconds - totalBreakSeconds))
  }, [todayAttendance, currentTime])

  // Check if on break
  useEffect(() => {
    if (!todayAttendance) return

    const onBreak =
      todayAttendance.breaks.length > 0 && todayAttendance.breaks[todayAttendance.breaks.length - 1].endTime === null
    setIsOnBreak(onBreak)
  }, [todayAttendance])

  // Get attendance status
  const getAttendanceStatus = () => {
    if (!todayAttendance) return "Not Initialized"
    if (todayAttendance.clockOutTime) return "Clocked Out"
    if (isOnBreak) return "On Break"
    if (todayAttendance.clockInTime) return "Clocked In"
    return "Not Clocked In"
  }

  // Get status color
  const getStatusColor = () => {
    const status = getAttendanceStatus()
    switch (status) {
      case "Clocked In":
        return "bg-green-500"
      case "On Break":
        return "bg-yellow-500"
      case "Clocked Out":
        return "bg-gray-500"
      default:
        return "bg-red-500"
    }
  }

  // Handle clock in
  const handleClockIn = () => {
    clockIn("Office", false)
  }

  // Handle clock out
  const handleClockOut = () => {
    clockOut("Office")
  }

  // Handle break
  const handleBreak = () => {
    if (isOnBreak) {
      endBreak()
    } else {
      startBreak("Lunch break")
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Attendance</CardTitle>
          <Badge variant="outline" className={`${getStatusColor()} text-white`}>
            {getAttendanceStatus()}
          </Badge>
        </div>
        <CardDescription>Your attendance for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Clock In</p>
              <p className="text-sm font-medium">{todayAttendance?.clockInTime || "Not clocked in"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Clock Out</p>
              <p className="text-sm font-medium">{todayAttendance?.clockOutTime || "Not clocked out"}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Working Time</p>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm font-medium">{formatDuration(Math.floor(workDuration))}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Breaks</p>
            <p className="text-sm font-medium">
              {todayAttendance?.breaks.length || 0} break
              {(todayAttendance?.breaks.length || 0) !== 1 ? "s" : ""} today
            </p>
          </div>

          {/* Attendance streak */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Attendance Streak</p>
            <div className="flex items-center">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: "85%" }}></div>
              </div>
              <span className="text-xs ml-2">17 days</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          {!todayAttendance?.clockInTime ? (
            <Button onClick={handleClockIn} className="w-full" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Clock In
            </Button>
          ) : todayAttendance?.clockOutTime ? (
            <Button disabled className="w-full" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Clocked Out
            </Button>
          ) : (
            <Button onClick={handleClockOut} variant="outline" className="w-full" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Clock Out
            </Button>
          )}

          {todayAttendance?.clockInTime && !todayAttendance?.clockOutTime ? (
            <Button onClick={handleBreak} variant={isOnBreak ? "default" : "outline"} className="w-full" size="sm">
              <Coffee className="h-4 w-4 mr-2" />
              {isOnBreak ? "End Break" : "Take Break"}
            </Button>
          ) : (
            <Button disabled variant="outline" className="w-full" size="sm">
              <Coffee className="h-4 w-4 mr-2" />
              Take Break
            </Button>
          )}
        </div>
        <Button variant="link" asChild className="w-full">
          <Link href="/attendance">View Attendance Dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
