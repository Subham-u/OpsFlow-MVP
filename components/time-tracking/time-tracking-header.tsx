"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  Search,
  Plus,
  Download,
  Settings,
  BarChart2,
  Calendar,
  Timer,
  Users,
  FileText,
  DollarSign,
  Play,
  Pause,
  Square,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function TimeTrackingHeader() {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [activeView, setActiveView] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    project: "",
    task: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    duration: "",
    billable: false,
    tags: [] as string[],
  })
  const [isManualDuration, setIsManualDuration] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [activeTab, setActiveTab] = useState("manual")

  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerProject, setTimerProject] = useState("")
  const [timerTask, setTimerTask] = useState("")
  const [timerDescription, setTimerDescription] = useState("")
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize active view based on pathname
  useEffect(() => {
    if (pathname) {
      if (pathname === "/time-tracking") {
        setActiveView("overview")
      } else {
        const segments = pathname.split("/")
        const lastSegment = segments[segments.length - 1]
        if (lastSegment) {
          setActiveView(lastSegment)
        }
      }
    }
  }, [pathname])

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTimer = () => {
    if (!timerProject || !timerTask) {
      toast({
        title: "Missing information",
        description: "Please select a project and task before starting the timer",
        variant: "destructive",
      })
      return
    }

    setIsTimerRunning(true)
    toast({
      title: "Timer started",
      description: "Your time tracking has begun",
    })
  }

  const handleStopTimer = () => {
    setIsTimerRunning(false)

    // Convert timer seconds to hours and minutes for the duration
    const hours = Math.floor(timerSeconds / 3600)
    const minutes = Math.floor((timerSeconds % 3600) / 60)
    const duration = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

    // Set the entry details from timer
    setNewEntry({
      ...newEntry,
      project: timerProject,
      task: timerTask,
      description: timerDescription,
      duration: duration,
    })

    // Switch to manual tab to review before saving
    setActiveTab("manual")
    setIsManualDuration(true)

    // Reset timer
    setTimerSeconds(0)

    toast({
      title: "Timer stopped",
      description: "Please review and save your time entry",
    })
  }

  const handleResetTimer = () => {
    setIsTimerRunning(false)
    setTimerSeconds(0)
    toast({
      title: "Timer reset",
      description: "Timer has been reset to zero",
    })
  }

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setNewEntry((prev) => ({ ...prev, [field]: value }))

    // Calculate duration if both start and end times are set
    if (field === "startTime" || field === "endTime") {
      if (newEntry.startTime && typeof value === "string" && field === "endTime") {
        const start = new Date(`2000-01-01T${newEntry.startTime}`)
        const end = new Date(`2000-01-01T${value}`)
        if (end > start) {
          const durationMs = end.getTime() - start.getTime()
          const hours = Math.floor(durationMs / (1000 * 60 * 60))
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
          setNewEntry((prev) => ({
            ...prev,
            duration: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
          }))
        }
      }
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !newEntry.tags.includes(tagInput.trim())) {
      setNewEntry({
        ...newEntry,
        tags: [...newEntry.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter((t) => t !== tag),
    })
  }

  const handleSubmit = () => {
    // Validate required fields
    if (
      !newEntry.project ||
      !newEntry.task ||
      (!isManualDuration && (!newEntry.startTime || !newEntry.endTime)) ||
      (isManualDuration && !newEntry.duration)
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Here you would typically save the time entry to your database
    console.log("Saving time entry:", newEntry)

    // Show success message
    toast({
      title: "Time entry added",
      description: "Your time entry has been successfully saved",
    })

    // Reset form and close dialog
    setNewEntry({
      project: "",
      task: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      duration: "",
      billable: false,
      tags: [],
    })
    setIsManualDuration(false)
    setIsDialogOpen(false)
  }

  const navigateToView = (view: string) => {
    setActiveView(view)

    // Navigate to the appropriate route
    if (view === "overview") {
      router.push("/time-tracking")
    } else {
      router.push(`/time-tracking/${view}`)
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Time Tracking</h1>
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search time entries..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Export started",
                    description: "Your time entries are being exported as CSV",
                  })
                }}
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Export started",
                    description: "Your time entries are being exported as PDF",
                  })
                }}
              >
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Export started",
                    description: "Your time entries are being exported as Excel",
                  })
                }}
              >
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Time Entry</DialogTitle>
                <DialogDescription>Record time spent on a project or task</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="timer">Timer</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">
                        Project <span className="text-red-500">*</span>
                      </Label>
                      <Select value={newEntry.project} onValueChange={(value) => handleInputChange("project", value)}>
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

                    <div className="space-y-2">
                      <Label htmlFor="task">
                        Task <span className="text-red-500">*</span>
                      </Label>
                      <Select value={newEntry.task} onValueChange={(value) => handleInputChange("task", value)}>
                        <SelectTrigger id="task">
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="documentation">Documentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What did you work on?"
                      value={newEntry.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEntry.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 flex items-end">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="manual-duration"
                          checked={isManualDuration}
                          onChange={() => setIsManualDuration(!isManualDuration)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="manual-duration">Enter duration manually</Label>
                      </div>
                    </div>
                  </div>

                  {isManualDuration ? (
                    <div className="space-y-2">
                      <Label htmlFor="duration">
                        Duration (hh:mm) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="duration"
                        type="text"
                        placeholder="00:00"
                        value={newEntry.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">
                          Start Time <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={newEntry.startTime}
                          onChange={(e) => handleInputChange("startTime", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end-time">
                          End Time <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={newEntry.endTime}
                          onChange={(e) => handleInputChange("endTime", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {!isManualDuration && newEntry.duration && (
                    <div className="text-sm text-muted-foreground">
                      Calculated duration: <span className="font-medium">{newEntry.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="billable"
                      checked={newEntry.billable as boolean}
                      onChange={(e) => handleInputChange("billable", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="billable">Billable time</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newEntry.tags.map((tag) => (
                        <div key={tag} className="bg-muted text-sm px-2 py-1 rounded-full flex items-center">
                          {tag}
                          <button
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Add tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timer" className="space-y-4 pt-4">
                  <div className="text-center py-8">
                    <div className="text-5xl font-mono font-bold mb-4">{formatTime(timerSeconds)}</div>
                    <div className="flex justify-center gap-2">
                      {!isTimerRunning ? (
                        <Button variant="default" size="lg" onClick={handleStartTimer} disabled={isTimerRunning}>
                          <Play className="mr-2 h-4 w-4" />
                          Start Timer
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" size="lg" onClick={handleStopTimer}>
                            <Pause className="mr-2 h-4 w-4" />
                            Stop
                          </Button>
                          <Button variant="destructive" size="lg" onClick={handleResetTimer}>
                            <Square className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {isTimerRunning
                        ? "Timer is running. Stop when you're finished with this task."
                        : "Start the timer and it will automatically track your time. You can pause and resume as needed."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timer-project">
                        Project <span className="text-red-500">*</span>
                      </Label>
                      <Select value={timerProject} onValueChange={setTimerProject} disabled={isTimerRunning}>
                        <SelectTrigger id="timer-project">
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

                    <div className="space-y-2">
                      <Label htmlFor="timer-task">
                        Task <span className="text-red-500">*</span>
                      </Label>
                      <Select value={timerTask} onValueChange={setTimerTask} disabled={isTimerRunning}>
                        <SelectTrigger id="timer-task">
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="testing">Testing</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="documentation">Documentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timer-description">Description</Label>
                    <Textarea
                      id="timer-description"
                      placeholder="What are you working on?"
                      value={timerDescription}
                      onChange={(e) => setTimerDescription(e.target.value)}
                      disabled={isTimerRunning}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save Entry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-4">
          <Button
            variant={activeView === "overview" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("overview")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeView === "entries" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("entries")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Entries
          </Button>
          <Button
            variant={activeView === "calendar" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={activeView === "pomodoro" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("pomodoro")}
          >
            <Timer className="h-4 w-4 mr-2" />
            Pomodoro
          </Button>
          <Button
            variant={activeView === "assignments" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("assignments")}
          >
            <Users className="h-4 w-4 mr-2" />
            Assignments
          </Button>
          <Button
            variant={activeView === "reports" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("reports")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button
            variant={activeView === "billable" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("billable")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Billable Hours
          </Button>
          <Button
            variant={activeView === "settings" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </header>
  )
}
