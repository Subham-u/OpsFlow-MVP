"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTimeTracking } from "@/contexts/time-tracking-context"
import { UserCheck, UserX, MapPin, Coffee, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function IntegratedAttendanceWidget() {
  const { todayAttendance, clockIn, clockOut, startBreak, endBreak } = useTimeTracking()
  const [location, setLocation] = useState("Office")
  const [isRemote, setIsRemote] = useState(false)

  // Check if user is on break
  const isOnBreak =
    todayAttendance?.breaks &&
    todayAttendance.breaks.length > 0 &&
    !todayAttendance.breaks[todayAttendance.breaks.length - 1].endTime

  const handleClockIn = () => {
    clockIn(location, isRemote)
  }

  const handleClockOut = () => {
    clockOut(location)
  }

  const handleBreak = () => {
    if (isOnBreak) {
      endBreak()
    } else {
      startBreak()
    }
  }

  // Format time for display
  const formatTime = (timeString: string | null) => {
    if (!timeString) return "--:--"
    return timeString
  }

  // Calculate working hours
  const calculateWorkingHours = () => {
    if (!todayAttendance || !todayAttendance.clockInTime) return "0h 0m"

    const endTime = todayAttendance.clockOutTime ? new Date(`2000-01-01T${todayAttendance.clockOutTime}`) : new Date()

    const startTime = new Date(`2000-01-01T${todayAttendance.clockInTime}`)

    // Calculate total break time
    let totalBreakMinutes = 0
    if (todayAttendance.breaks) {
      todayAttendance.breaks.forEach((breakPeriod) => {
        if (breakPeriod.duration) {
          totalBreakMinutes += breakPeriod.duration
        } else if (breakPeriod.startTime && !breakPeriod.endTime) {
          // Ongoing break
          const breakStart = new Date(`2000-01-01T${breakPeriod.startTime}`)
          totalBreakMinutes += Math.round((new Date().getTime() - breakStart.getTime()) / (1000 * 60))
        }
      })
    }

    // Calculate total working time in minutes
    const totalMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) - totalBreakMinutes

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Attendance</span>
          {todayAttendance && (
            <Badge
              variant={todayAttendance.clockInTime ? "success" : "secondary"}
              className={todayAttendance.clockInTime ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {todayAttendance.clockInTime
                ? isOnBreak
                  ? "On Break"
                  : todayAttendance.clockOutTime
                    ? "Clocked Out"
                    : "Clocked In"
                : "Not Clocked In"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Today's Hours:</span>
          </div>
          <span className="font-medium">{calculateWorkingHours()}</span>
        </div>

        {todayAttendance && todayAttendance.clockInTime && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Clock In</span>
              <span className="font-medium">{formatTime(todayAttendance.clockInTime)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Clock Out</span>
              <span className="font-medium">{formatTime(todayAttendance.clockOutTime)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Location:</span>
          </div>
          <Select value={location} onValueChange={setLocation} disabled={todayAttendance?.clockInTime !== null}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
              <SelectItem value="Field">Field</SelectItem>
              <SelectItem value="Client Site">Client Site</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 mt-1">
            <input
              type="checkbox"
              id="remote-work"
              checked={isRemote}
              onChange={() => setIsRemote(!isRemote)}
              disabled={todayAttendance?.clockInTime !== null}
              className="rounded border-gray-300"
            />
            <label htmlFor="remote-work" className="text-sm">
              Remote work
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {!todayAttendance?.clockInTime ? (
            <Button className="w-full" onClick={handleClockIn}>
              <UserCheck className="mr-2 h-4 w-4" />
              Clock In
            </Button>
          ) : (
            <>
              <Button
                variant={isOnBreak ? "default" : "outline"}
                className="w-full"
                onClick={handleBreak}
                disabled={todayAttendance.clockOutTime !== null}
              >
                <Coffee className="mr-2 h-4 w-4" />
                {isOnBreak ? "End Break" : "Start Break"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleClockOut}
                disabled={todayAttendance.clockOutTime !== null}
              >
                <UserX className="mr-2 h-4 w-4" />
                Clock Out
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
