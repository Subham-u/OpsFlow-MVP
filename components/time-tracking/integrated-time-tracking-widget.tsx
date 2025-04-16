"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTimeTracking } from "@/contexts/time-tracking-context"
import { Play, Pause, Square, ArrowRight, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function IntegratedTimeTrackingWidget() {
  const router = useRouter()
  const { activeTimer, startTimer, pauseTimer, resumeTimer, stopTimer, todayAttendance } = useTimeTracking()

  const [project, setProject] = useState("")
  const [task, setTask] = useState("")

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const handleStartTimer = () => {
    if (!project || !task) return
    startTimer(project, task, "")
  }

  const handleStopTimer = () => {
    stopTimer()
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Time Tracking</CardTitle>
          <Badge
            variant={activeTimer.isRunning ? "success" : "outline"}
            className={activeTimer.isRunning ? "bg-green-100 text-green-800" : ""}
          >
            {activeTimer.isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xl font-bold">{formatTime(activeTimer.elapsedSeconds)}</div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>

        {activeTimer.project && (
          <div className="text-xs text-muted-foreground truncate">
            {activeTimer.project} - {activeTimer.task}
          </div>
        )}

        {!activeTimer.isRunning && !activeTimer.project ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website-redesign">Website Redesign</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
                  <SelectItem value="data-migration">Data Migration</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={task} onValueChange={setTask}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              size="sm"
              className="w-full"
              onClick={handleStartTimer}
              disabled={!project || !task || !todayAttendance?.clockInTime}
            >
              <Play className="mr-1 h-3 w-3" />
              Start
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={activeTimer.isRunning ? "outline" : "default"}
              onClick={activeTimer.isRunning ? pauseTimer : resumeTimer}
              className="flex-1"
            >
              {activeTimer.isRunning ? (
                <>
                  <Pause className="mr-1 h-3 w-3" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-1 h-3 w-3" />
                  Resume
                </>
              )}
            </Button>

            <Button size="sm" variant="destructive" onClick={handleStopTimer} className="flex-1">
              <Square className="mr-1 h-3 w-3" />
              Stop
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs py-0 h-6"
          onClick={() => router.push("/time-tracking")}
        >
          View All
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  )
}
