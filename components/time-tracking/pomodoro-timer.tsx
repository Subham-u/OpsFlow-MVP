"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, SkipForward, Settings, Volume2, Coffee } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

interface PomodoroSettings {
  pomodoro: number
  shortBreak: number
  longBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  longBreakInterval: number
  alarmSound: string
  alarmVolume: number
}

export function PomodoroTimer() {
  const { toast } = useToast()
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>("pomodoroSettings", {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: true,
    autoStartPomodoros: true,
    longBreakInterval: 4,
    alarmSound: "bell",
    alarmVolume: 50,
  })

  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [currentTask, setCurrentTask] = useState("")
  const [project, setProject] = useState("")

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/sounds/bell.mp3")
    audioRef.current.volume = settings.alarmVolume / 100

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update volume when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.alarmVolume / 100
    }
  }, [settings.alarmVolume])

  // Update timer when mode changes
  useEffect(() => {
    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60)
        break
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60)
        break
      case "longBreak":
        setTimeLeft(settings.longBreak * 60)
        break
    }

    // Stop the timer when changing modes
    setIsRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [mode, settings])

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed
            clearInterval(timerRef.current!)
            timerRef.current = null
            setIsRunning(false)

            // Play sound
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play()
            }

            // Show notification
            const modeText = mode === "pomodoro" ? "Work session" : "Break"
            toast({
              title: `${modeText} completed!`,
              description:
                mode === "pomodoro" ? "Time for a break. Take a moment to relax." : "Time to get back to work!",
            })

            // Handle pomodoro completion
            if (mode === "pomodoro") {
              const newCompletedCount = completedPomodoros + 1
              setCompletedPomodoros(newCompletedCount)

              // Determine next break type
              const isLongBreakDue = newCompletedCount % settings.longBreakInterval === 0
              const nextMode = isLongBreakDue ? "longBreak" : "shortBreak"

              // Auto start break if enabled
              if (settings.autoStartBreaks) {
                setTimeout(() => {
                  setMode(nextMode)
                  setIsRunning(true)
                }, 1000)
              } else {
                setMode(nextMode)
              }
            } else {
              // Auto start next pomodoro if enabled
              if (settings.autoStartPomodoros) {
                setTimeout(() => {
                  setMode("pomodoro")
                  setIsRunning(true)
                }, 1000)
              } else {
                setMode("pomodoro")
              }
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning, mode, completedPomodoros, settings, toast])

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const calculateProgress = () => {
    let totalSeconds
    switch (mode) {
      case "pomodoro":
        totalSeconds = settings.pomodoro * 60
        break
      case "shortBreak":
        totalSeconds = settings.shortBreak * 60
        break
      case "longBreak":
        totalSeconds = settings.longBreak * 60
        break
    }

    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  // Handle settings changes
  const updateSettings = (key: keyof PomodoroSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    switch (mode) {
      case "pomodoro":
        setTimeLeft(settings.pomodoro * 60)
        break
      case "shortBreak":
        setTimeLeft(settings.shortBreak * 60)
        break
      case "longBreak":
        setTimeLeft(settings.longBreak * 60)
        break
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pomodoro Timer</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription>Stay focused and productive with timed work sessions</CardDescription>
        </CardHeader>

        {showSettings ? (
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Timer Settings (minutes)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pomodoro">Pomodoro</Label>
                    <Input
                      id="pomodoro"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.pomodoro}
                      onChange={(e) => updateSettings("pomodoro", Number.parseInt(e.target.value) || 25)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortBreak">Short Break</Label>
                    <Input
                      id="shortBreak"
                      type="number"
                      min="1"
                      max="30"
                      value={settings.shortBreak}
                      onChange={(e) => updateSettings("shortBreak", Number.parseInt(e.target.value) || 5)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longBreak">Long Break</Label>
                    <Input
                      id="longBreak"
                      type="number"
                      min="1"
                      max="60"
                      value={settings.longBreak}
                      onChange={(e) => updateSettings("longBreak", Number.parseInt(e.target.value) || 15)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Auto Start</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStartBreaks">Auto start breaks</Label>
                    <Switch
                      id="autoStartBreaks"
                      checked={settings.autoStartBreaks}
                      onCheckedChange={(checked) => updateSettings("autoStartBreaks", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoStartPomodoros">Auto start pomodoros</Label>
                    <Switch
                      id="autoStartPomodoros"
                      checked={settings.autoStartPomodoros}
                      onCheckedChange={(checked) => updateSettings("autoStartPomodoros", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longBreakInterval">Long Break Interval</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="longBreakInterval"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.longBreakInterval}
                    onChange={(e) => updateSettings("longBreakInterval", Number.parseInt(e.target.value) || 4)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">pomodoros</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  <Label>Alarm Volume</Label>
                </div>
                <Slider
                  value={[settings.alarmVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => updateSettings("alarmVolume", value[0])}
                />
              </div>

              <Button onClick={() => setShowSettings(false)} className="w-full">
                Save Settings
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent>
              <Tabs value={mode} onValueChange={(value) => setMode(value as TimerMode)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                  <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
                  <TabsTrigger value="longBreak">Long Break</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mt-6 flex flex-col items-center">
                <div
                  className="relative w-48 h-48 rounded-full flex items-center justify-center border-8 border-primary/20"
                  style={{
                    background: `conic-gradient(var(--primary) ${calculateProgress()}%, transparent 0%)`,
                  }}
                >
                  <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center">
                    <span className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button
                    variant={isRunning ? "outline" : "default"}
                    size="lg"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg" onClick={resetTimer}>
                    <SkipForward className="mr-2 h-4 w-4" />
                    Skip
                  </Button>
                </div>

                <div className="mt-6 w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-task">Current Task</Label>
                    <Input
                      id="current-task"
                      placeholder="What are you working on?"
                      value={currentTask}
                      onChange={(e) => setCurrentTask(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Select value={project} onValueChange={setProject}>
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website-redesign">Website Redesign</SelectItem>
                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                        <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
                        <SelectItem value="data-migration">Data Migration</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coffee className="h-4 w-4" />
                <span>
                  {completedPomodoros} pomodoro{completedPomodoros !== 1 ? "s" : ""} completed today
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Next long break in {settings.longBreakInterval - (completedPomodoros % settings.longBreakInterval)}{" "}
                pomodoro
                {settings.longBreakInterval - (completedPomodoros % settings.longBreakInterval) !== 1 ? "s" : ""}
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
