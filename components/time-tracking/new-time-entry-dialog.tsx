"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Play, Pause, Square } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { useTimeTracking } from "@/contexts/time-tracking-context"

interface NewTimeEntryDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTimeEntryDialog({ isOpen, onOpenChange }: NewTimeEntryDialogProps) {
  const { activeTimer, startTimer, pauseTimer, resumeTimer, stopTimer, addTimeEntry, todayAttendance } =
    useTimeTracking()

  const [activeTab, setActiveTab] = useState("manual")

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

  // Timer state
  const [timerProject, setTimerProject] = useState("")
  const [timerTask, setTimerTask] = useState("")
  const [timerDescription, setTimerDescription] = useState("")

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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

  const handleStartTimer = () => {
    if (!timerProject || !timerTask) {
      return
    }

    startTimer(timerProject, timerTask, timerDescription)
  }

  const handleStopTimer = () => {
    stopTimer()

    // Close dialog after stopping timer
    onOpenChange(false)
  }

  const handleSubmit = () => {
    // Validate required fields
    if (
      !newEntry.project ||
      !newEntry.task ||
      (!isManualDuration && (!newEntry.startTime || !newEntry.endTime)) ||
      (isManualDuration && !newEntry.duration)
    ) {
      return
    }

    // Convert duration string to seconds
    let durationInSeconds = 0
    if (isManualDuration && newEntry.duration) {
      const [hours, minutes] = newEntry.duration.split(":").map(Number)
      durationInSeconds = hours * 3600 + minutes * 60
    } else {
      // Calculate from start and end time
      const start = new Date(`2000-01-01T${newEntry.startTime}`)
      const end = new Date(`2000-01-01T${newEntry.endTime}`)
      durationInSeconds = (end.getTime() - start.getTime()) / 1000
    }

    // Create time entry
    addTimeEntry({
      project: newEntry.project,
      task: newEntry.task,
      description: newEntry.description,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration: durationInSeconds,
      date: newEntry.date,
      tags: newEntry.tags,
      billable: newEntry.billable,
      status: "pending",
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
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              <div className="text-5xl font-mono font-bold mb-4">{formatTime(activeTimer.elapsedSeconds)}</div>
              <div className="flex justify-center gap-2">
                {!activeTimer.isRunning ? (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleStartTimer}
                    disabled={activeTimer.isRunning || !timerProject || !timerTask}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Timer
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="lg" onClick={activeTimer.isRunning ? pauseTimer : resumeTimer}>
                      {activeTimer.isRunning ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </>
                      )}
                    </Button>
                    <Button variant="destructive" size="lg" onClick={handleStopTimer}>
                      <Square className="mr-2 h-4 w-4" />
                      Stop & Save
                    </Button>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {activeTimer.isRunning
                  ? "Timer is running. Stop when you're finished with this task."
                  : "Start the timer and it will automatically track your time. You can pause and resume as needed."}
              </p>

              {/* Show attendance status */}
              {!todayAttendance?.clockInTime && (
                <div className="mt-4 p-2 bg-amber-50 text-amber-800 rounded-md text-sm">
                  Starting a timer will automatically clock you in for attendance.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timer-project">
                  Project <span className="text-red-500">*</span>
                </Label>
                <Select value={timerProject} onValueChange={setTimerProject} disabled={activeTimer.isRunning}>
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
                <Select value={timerTask} onValueChange={setTimerTask} disabled={activeTimer.isRunning}>
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
                disabled={activeTimer.isRunning}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === "manual" && <Button onClick={handleSubmit}>Save Entry</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
