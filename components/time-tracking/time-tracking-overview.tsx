"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Clock,
  Pause,
  Play,
  Calendar,
  BarChart,
  LineChart,
  DollarSign,
  Users,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pie as PieComponent,
  PieChart as PieChartComponent,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip as ChartTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"

// Sample data for charts
const weeklyData = [
  { name: "Mon", hours: 5.5 },
  { name: "Tue", hours: 7.2 },
  { name: "Wed", hours: 6.8 },
  { name: "Thu", hours: 8.1 },
  { name: "Fri", hours: 4.5 },
  { name: "Sat", hours: 2.0 },
  { name: "Sun", hours: 0.5 },
]

const monthlyData = [
  { name: "Week 1", hours: 32.5 },
  { name: "Week 2", hours: 38.2 },
  { name: "Week 3", hours: 36.8 },
  { name: "Week 4", hours: 34.1 },
]

const projectData = [
  { name: "Website Redesign", value: 35, color: "#3b82f6" },
  { name: "Mobile App", value: 25, color: "#8b5cf6" },
  { name: "Marketing Campaign", value: 20, color: "#10b981" },
  { name: "Data Migration", value: 15, color: "#f97316" },
  { name: "Internal", value: 5, color: "#6b7280" },
]

const taskData = [
  { name: "Development", value: 40, color: "#3b82f6" },
  { name: "Design", value: 20, color: "#8b5cf6" },
  { name: "Meetings", value: 15, color: "#10b981" },
  { name: "Research", value: 15, color: "#f97316" },
  { name: "Documentation", value: 10, color: "#6b7280" },
]

export function TimeTrackingOverview() {
  const { toast } = useToast()
  const [isTracking, setIsTracking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timer, setTimer] = useState("00:00:00")
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [timeRange, setTimeRange] = useState("week")
  const [chartType, setChartType] = useState("bar")
  const [activeTab, setActiveTab] = useState("timer")
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all")
  const [selectedTeamMember, setSelectedTeamMember] = useState("all")

  // Mock projects data
  const projects = [
    {
      id: "1",
      name: "Website Redesign",
      color: "#3b82f6",
      tasks: [
        { id: "1", name: "Design Homepage" },
        { id: "2", name: "Implement Authentication" },
        { id: "3", name: "Responsive Layouts" },
      ],
    },
    {
      id: "2",
      name: "Mobile App Development",
      color: "#8b5cf6",
      tasks: [
        { id: "4", name: "API Integration" },
        { id: "5", name: "UI Components" },
        { id: "6", name: "Testing" },
      ],
    },
    {
      id: "3",
      name: "Marketing Campaign",
      color: "#10b981",
      tasks: [
        { id: "7", name: "Content Creation" },
        { id: "8", name: "Social Media Posts" },
        { id: "9", name: "Analytics Review" },
      ],
    },
    {
      id: "4",
      name: "Product Launch",
      color: "#f97316",
      tasks: [
        { id: "10", name: "Market Research" },
        { id: "11", name: "Competitor Analysis" },
        { id: "12", name: "Launch Strategy" },
      ],
    },
  ]

  // Mock time entries
  const timeEntries = [
    {
      id: "1",
      project: "Website Redesign",
      task: "Design Homepage",
      startTime: "09:00",
      endTime: "11:30",
      duration: 9000, // 2.5 hours in seconds
      date: "2023-08-01",
      notes: "Completed initial wireframes",
      tags: ["design", "wireframes"],
      color: "#3b82f6",
    },
    {
      id: "2",
      project: "Mobile App Development",
      task: "API Integration",
      startTime: "13:00",
      endTime: "15:45",
      duration: 9900, // 2.75 hours in seconds
      date: "2023-08-01",
      notes: "Connected user authentication endpoints",
      tags: ["api", "backend"],
      color: "#8b5cf6",
    },
    {
      id: "3",
      project: "Marketing Campaign",
      task: "Content Creation",
      startTime: "10:15",
      endTime: "12:30",
      duration: 8100, // 2.25 hours in seconds
      date: "2023-08-02",
      notes: "Drafted social media posts",
      tags: ["content", "social"],
      color: "#10b981",
    },
    {
      id: "4",
      project: "Website Redesign",
      task: "Team Meeting",
      startTime: "14:00",
      endTime: "15:00",
      duration: 3600, // 1 hour in seconds
      date: "2023-08-02",
      notes: "Discussed design feedback",
      tags: ["meeting", "feedback"],
      color: "#3b82f6",
    },
    {
      id: "5",
      project: "Mobile App Development",
      task: "Bug Fixing",
      startTime: "09:30",
      endTime: "12:00",
      duration: 9000, // 2.5 hours in seconds
      date: "2023-08-03",
      notes: "Fixed login screen issues",
      tags: ["bugs", "frontend"],
      color: "#8b5cf6",
    },
  ]

  // Initialize data
  useEffect(() => {
    // Set default project and task if available
    if (projects.length > 0) {
      setSelectedProject(projects[0].id)
      if (projects[0].tasks.length > 0) {
        setSelectedTask(projects[0].tasks[0].id)
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [])

  // Regular timer functionality
  const toggleTracking = () => {
    if (isTracking && !isPaused) {
      // Pause timer
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
      setIsPaused(true)

      toast({
        title: "Timer paused",
        description: "Your time tracking has been paused",
      })
    } else if (isTracking && isPaused) {
      // Resume timer
      const interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          const hours = Math.floor(newSeconds / 3600)
          const minutes = Math.floor((newSeconds % 3600) / 60)
          const secs = newSeconds % 60

          setTimer(
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
          )

          return newSeconds
        })
      }, 1000)

      setTimerInterval(interval)
      setIsPaused(false)

      toast({
        title: "Timer resumed",
        description: "Your time tracking has been resumed",
      })
    } else {
      // Start timer
      if (!selectedProject || !selectedTask) {
        toast({
          title: "Error",
          description: "Please select a project and task before starting the timer",
          variant: "destructive",
        })
        return
      }

      setSeconds(0)
      setTimer("00:00:00")

      const interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1
          const hours = Math.floor(newSeconds / 3600)
          const minutes = Math.floor((newSeconds % 3600) / 60)
          const secs = newSeconds % 60

          setTimer(
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
          )

          return newSeconds
        })
      }, 1000)

      setTimerInterval(interval)
      setIsTracking(true)
      setIsPaused(false)

      toast({
        title: "Timer started",
        description: "Your time tracking has started",
      })
    }
  }

  // Stop tracking and save time entry
  const stopTracking = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }

    if (seconds > 0) {
      const project = projects.find((p) => p.id === selectedProject)
      const task = project?.tasks.find((t) => t.id === selectedTask)

      if (project && task) {
        toast({
          title: "Time entry saved",
          description: `Tracked ${formatDuration(seconds)} for ${task.name}`,
        })
      }
    }

    setIsTracking(false)
    setIsPaused(false)
    setSeconds(0)
    setTimer("00:00:00")
    setNotes("")
    setTags([])
  }

  // Format seconds to HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours > 0 ? hours + "h " : ""}${minutes}m ${secs}s`
  }

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  // Calculate time distribution data
  const timeDistributionData = projectData.map((project) => ({
    name: project.name,
    value: project.value,
    color: project.color,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Time Tracking</h2>
          <p className="text-muted-foreground">Track your time and boost productivity</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />

          <Select value={selectedProjectFilter} onValueChange={setSelectedProjectFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">164.5h</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </span>{" "}
              vs previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125.0h</div>
            <div className="text-xs text-muted-foreground mt-1">
              76% billable ratio
              <div className="h-1.5 w-full bg-muted mt-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "76%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2
              </span>{" "}
              new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500 inline-flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -5%
              </span>{" "}
              vs target
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Timer Tab */}
        <TabsContent value="timer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Time Tracker</CardTitle>
                <CardDescription>Track time for your projects and tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-5xl font-bold font-mono">{timer}</div>
                    <div className="flex gap-2">
                      <Button className="w-32" onClick={toggleTracking} disabled={!selectedProject || !selectedTask}>
                        {isTracking ? (
                          isPaused ? (
                            <>
                              <Play className="mr-2 h-4 w-4" /> Resume
                            </>
                          ) : (
                            <>
                              <Pause className="mr-2 h-4 w-4" /> Pause
                            </>
                          )
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" /> Start Timer
                          </>
                        )}
                      </Button>
                      {isTracking && (
                        <Button variant="outline" className="w-32" onClick={stopTracking}>
                          <Clock className="mr-2 h-4 w-4" /> Stop & Save
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">Project</Label>
                      <Select value={selectedProject} onValueChange={setSelectedProject} disabled={isTracking}>
                        <SelectTrigger id="project" className="w-full">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: project.color }}
                                ></div>
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task">Task</Label>
                      <Select
                        value={selectedTask}
                        onValueChange={setSelectedTask}
                        disabled={!selectedProject || isTracking}
                      >
                        <SelectTrigger id="task" className="w-full">
                          <SelectValue placeholder="Select task" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects
                            .find((p) => p.id === selectedProject)
                            ?.tasks.map((task) => (
                              <SelectItem key={task.id} value={task.id}>
                                {task.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      placeholder="Add notes about what you're working on"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 rounded-full"
                            onClick={() => removeTag(tag)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInput}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest time entries</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                <div className="space-y-4">
                  {timeEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3 rounded-lg border p-3">
                      <div
                        className="w-2 h-full min-h-[40px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{entry.task}</h3>
                          <span className="text-sm font-mono">{formatDuration(entry.duration)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.project}</p>
                        {entry.notes && <p className="text-xs text-muted-foreground mt-1">{entry.notes}</p>}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(entry.date).toLocaleDateString()}</span>
                          <Clock className="h-3 w-3 ml-2 mr-1" />
                          <span>
                            {entry.startTime} - {entry.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Time Entries
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Time Distribution</CardTitle>
                  <CardDescription>Hours by project</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange} defaultValue="week">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartComponent>
                    <PieComponent
                      data={timeDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {timeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </PieComponent>
                    <ChartTooltip formatter={(value) => `${value}h`} />
                    <Legend />
                  </PieChartComponent>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Daily Hours</CardTitle>
                  <CardDescription>Hours tracked per day</CardDescription>
                </div>
                <div className="flex border rounded-md">
                  <Button
                    variant={chartType === "bar" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-l-md"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === "line" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-r-md"
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chartType === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" name="Hours" fill="#3b82f6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="hours" name="Hours" stroke="#3b82f6" fill="#93c5fd" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Hours</CardTitle>
                <CardDescription>This {timeRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{timeRange === "week" ? "34.6" : "141.6"}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {timeRange === "week" ? "5.2" : "12.4"} hours more than last {timeRange}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Billable Hours</CardTitle>
                <CardDescription>This {timeRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{timeRange === "week" ? "28.2" : "112.5"}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {timeRange === "week" ? "82%" : "79%"} of total hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Productivity Score</CardTitle>
                <CardDescription>Based on focus time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">87%</div>
                <p className="text-sm text-muted-foreground mt-2">5% increase from last {timeRange}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>Hours tracked over time</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-md">
                  <Button
                    variant={chartType === "bar" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-l-md"
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === "line" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8 rounded-r-md"
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {chartType === "bar" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={timeRange === "week" ? weeklyData : monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#3b82f6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeRange === "week" ? weeklyData : monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="#93c5fd" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Distribution</CardTitle>
                <CardDescription>Time spent per project</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartComponent>
                    <PieComponent
                      data={projectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </PieComponent>
                    <Tooltip />
                    <Legend />
                  </PieChartComponent>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Time spent per task type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartComponent>
                    <PieComponent
                      data={taskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {taskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </PieComponent>
                    <Tooltip />
                    <Legend />
                  </PieChartComponent>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Time Tracking</CardTitle>
              <CardDescription>Monitor your team's time and productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    name: "Alex Johnson",
                    role: "Project Manager",
                    hours: 32,
                    tasks: 5,
                    avatar: "/placeholder.svg?height=40&width=40",
                    initials: "AJ",
                  },
                  {
                    name: "Beth Smith",
                    role: "Designer",
                    hours: 28,
                    tasks: 4,
                    avatar: "/placeholder.svg?height=40&width=40",
                    initials: "BS",
                  },
                  {
                    name: "Carl Davis",
                    role: "Developer",
                    hours: 36,
                    tasks: 6,
                    avatar: "/placeholder.svg?height=40&width=40",
                    initials: "CD",
                  },
                  {
                    name: "Dana Wilson",
                    role: "Content Writer",
                    hours: 24,
                    tasks: 3,
                    avatar: "/placeholder.svg?height=40&width=40",
                    initials: "DW",
                  },
                  {
                    name: "Eric Brown",
                    role: "Marketing Specialist",
                    hours: 30,
                    tasks: 4,
                    avatar: "/placeholder.svg?height=40&width=40",
                    initials: "EB",
                  },
                ].map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium">{member.hours}h</div>
                      <div className="text-sm text-muted-foreground">{member.tasks} tasks</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Team Dashboard
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Workload</CardTitle>
                <CardDescription>Current workload distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Alex Johnson", hours: 32, capacity: 40 },
                    { name: "Beth Smith", hours: 28, capacity: 40 },
                    { name: "Carl Davis", hours: 36, capacity: 40 },
                    { name: "Dana Wilson", hours: 24, capacity: 32 },
                    { name: "Eric Brown", hours: 30, capacity: 40 },
                  ].map((member) => (
                    <div key={member.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{member.name}</span>
                        <span>
                          {member.hours}h / {member.capacity}h
                        </span>
                      </div>
                      <Progress value={(member.hours / member.capacity) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Allocation</CardTitle>
                <CardDescription>Team members per project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                        <span className="font-medium">{project.name}</span>
                      </div>
                      <div className="flex -space-x-2">
                        {[...Array(Math.floor(Math.random() * 3) + 2)].map((_, i) => (
                          <Avatar key={i} className="border-2 border-background">
                            <AvatarFallback>
                              {["AJ", "BS", "CD", "DW", "EB"][Math.floor(Math.random() * 5)]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs">+2</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TimeTrackingOverview
