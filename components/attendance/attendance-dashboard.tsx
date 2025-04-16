"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClockInOut } from "@/components/attendance/clock-in-out"
import { AttendanceStats } from "@/components/attendance/attendance-stats"
import { LeaveManagement } from "@/components/attendance/leave-management"
import { TeamAttendance } from "@/components/attendance/team-attendance"
import { AttendanceCalendar } from "@/components/attendance/attendance-calendar"
import { useToast } from "@/hooks/use-toast"
import { UserCheck, UserX, Clock, Calendar, MapPin, AlertTriangle, Zap, Coffee, Briefcase } from "lucide-react"

export function AttendanceDashboard() {
  const { toast } = useToast()
  const [currentTab, setCurrentTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceStreak, setAttendanceStreak] = useState(0)
  const [attendanceRate, setAttendanceRate] = useState(0)
  const [punchStatus, setPunchStatus] = useState<"in" | "out" | null>(null)
  const [lastPunchTime, setLastPunchTime] = useState<string | null>(null)
  const [workingHours, setWorkingHours] = useState<number>(0)
  const [attendanceAchievements, setAttendanceAchievements] = useState<string[]>([])

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setAttendanceStreak(14)
      setAttendanceRate(96)
      setPunchStatus("in")
      setLastPunchTime("08:45 AM")
      setWorkingHours(7.5)
      setAttendanceAchievements([
        "Perfect Attendance - April 2023",
        "Early Bird - 15 days streak",
        "Overtime Champion - March 2023",
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle clock in/out
  const handleClockInOut = (action: "in" | "out", location: string) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (action === "in") {
      setPunchStatus("in")
      setLastPunchTime(timeString)
      toast({
        title: "Clocked In Successfully",
        description: `You clocked in at ${timeString} from ${location}`,
      })
    } else {
      setPunchStatus("out")
      setLastPunchTime(timeString)
      toast({
        title: "Clocked Out Successfully",
        description: `You clocked out at ${timeString} from ${location}`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Clock In/Out and Status */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Attendance Status</CardTitle>
              <CardDescription>Your current attendance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div
                  className={`rounded-full p-6 ${punchStatus === "in" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {punchStatus === "in" ? <UserCheck className="h-12 w-12" /> : <UserX className="h-12 w-12" />}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{punchStatus === "in" ? "Clocked In" : "Clocked Out"}</h3>
                  {lastPunchTime && <p className="text-muted-foreground">Last action at {lastPunchTime}</p>}
                </div>
                <Badge variant={punchStatus === "in" ? "success" : "secondary"} className="px-3 py-1">
                  {punchStatus === "in" ? "Working" : "Not Working"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <ClockInOut onClockInOut={handleClockInOut} currentStatus={punchStatus} />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Attendance Streak</CardTitle>
                <CardDescription>Your consecutive attendance days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{attendanceStreak} days</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Impressive!
                  </Badge>
                </div>
                <Progress value={attendanceStreak} max={20} className="h-2 mt-4" />
                <p className="text-xs text-muted-foreground mt-2">6 more days to beat your personal record</p>
              </CardContent>
            </Card>

            {/* Compact Time Tracking Widget */}
            <Card className="h-auto">
              <CardHeader className="pb-2 space-y-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Time Tracking</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => (window.location.href = "/time-tracking")}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CompactTimeTrackingWidget />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right column - Tabs with different views */}
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Attendance Dashboard</CardTitle>
              <CardDescription>Track and manage your attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="leave">Leave</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Clock className="h-8 w-8 text-primary mb-2" />
                          <h3 className="font-medium">Working Hours</h3>
                          <p className="text-2xl font-bold">{workingHours}h</p>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Calendar className="h-8 w-8 text-primary mb-2" />
                          <h3 className="font-medium">Attendance Rate</h3>
                          <p className="text-2xl font-bold">{attendanceRate}%</p>
                          <p className="text-xs text-muted-foreground">This Month</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                          <Coffee className="h-8 w-8 text-primary mb-2" />
                          <h3 className="font-medium">Break Time</h3>
                          <p className="text-2xl font-bold">45m</p>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <AttendanceStats />

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-2 border-b">
                          <div className="bg-green-100 p-2 rounded-full">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Clock In</p>
                            <p className="text-sm text-muted-foreground">Today, 08:45 AM</p>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">Office</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-2 border-b">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Coffee className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Break Start</p>
                            <p className="text-sm text-muted-foreground">Today, 12:00 PM</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground">30 min</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-2 border-b">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Break End</p>
                            <p className="text-sm text-muted-foreground">Today, 12:30 PM</p>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">Office</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-2">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Late Arrival</p>
                            <p className="text-sm text-muted-foreground">Yesterday, 09:15 AM</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground">15 min late</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="calendar">
                  <AttendanceCalendar />
                </TabsContent>

                <TabsContent value="team">
                  <TeamAttendance />
                </TabsContent>

                <TabsContent value="leave">
                  <LeaveManagement />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// New compact time tracking widget component
function CompactTimeTrackingWidget() {
  const [isTracking, setIsTracking] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [currentTask, setCurrentTask] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [intervalId])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${hrs}h ${mins}m`
  }

  const toggleTimer = () => {
    if (isTracking) {
      if (intervalId) clearInterval(intervalId)
      setIntervalId(null)
      setIsTracking(false)
    } else {
      setCurrentTask("Website Development")
      const id = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
      setIntervalId(id)
      setIsTracking(true)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-mono text-lg font-bold">{formatTime(elapsed)}</div>
        <Badge variant={isTracking ? "success" : "outline"} className={isTracking ? "bg-green-100 text-green-800" : ""}>
          {isTracking ? "Active" : "Inactive"}
        </Badge>
      </div>

      {currentTask && <div className="text-xs text-muted-foreground truncate">{currentTask}</div>}

      <div className="flex gap-2">
        <Button size="sm" variant={isTracking ? "destructive" : "default"} className="w-full" onClick={toggleTimer}>
          {isTracking ? "Stop" : "Start"}
        </Button>
      </div>
    </div>
  )
}
