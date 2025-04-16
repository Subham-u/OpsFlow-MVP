"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { Download, CalendarIcon, Filter, PieChart, FileText, Share2, Mail, Printer, FileDown } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  LineChart,
  Line,
} from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import the date utilities
import { formatDurationFromMinutes } from "@/lib/date-utils"

// Mock data for time entries
const timeEntries = [
  {
    id: "1",
    project: "Website Redesign",
    task: "Homepage Layout",
    date: "2023-09-15",
    startTime: "09:00",
    endTime: "11:30",
    duration: 150, // in minutes
    user: "John Doe",
    billable: true,
    tags: ["design", "frontend"],
    notes: "Completed initial wireframes for homepage",
  },
  {
    id: "2",
    project: "Mobile App Development",
    task: "User Authentication",
    date: "2023-09-15",
    startTime: "13:00",
    endTime: "16:45",
    duration: 225, // in minutes
    user: "Jane Smith",
    billable: true,
    tags: ["development", "backend"],
    notes: "Implemented OAuth flow",
  },
  {
    id: "3",
    project: "Marketing Campaign",
    task: "Social Media Graphics",
    date: "2023-09-16",
    startTime: "10:15",
    endTime: "12:30",
    duration: 135, // in minutes
    user: "John Doe",
    billable: false,
    tags: ["design", "marketing"],
    notes: "Created Instagram and Twitter graphics",
  },
  {
    id: "4",
    project: "Website Redesign",
    task: "Contact Form",
    date: "2023-09-16",
    startTime: "14:00",
    endTime: "15:20",
    duration: 80, // in minutes
    user: "John Doe",
    billable: true,
    tags: ["development", "frontend"],
    notes: "Implemented form validation",
  },
  {
    id: "5",
    project: "Database Migration",
    task: "Schema Design",
    date: "2023-09-17",
    startTime: "09:30",
    endTime: "12:45",
    duration: 195, // in minutes
    user: "Alex Johnson",
    billable: true,
    tags: ["database", "backend"],
    notes: "Finalized database schema",
  },
  {
    id: "6",
    project: "Mobile App Development",
    task: "UI Components",
    date: "2023-09-17",
    startTime: "14:00",
    endTime: "17:30",
    duration: 210, // in minutes
    user: "Jane Smith",
    billable: true,
    tags: ["design", "frontend"],
    notes: "Created reusable UI components",
  },
  {
    id: "7",
    project: "Marketing Campaign",
    task: "Email Template",
    date: "2023-09-18",
    startTime: "10:00",
    endTime: "13:15",
    duration: 195, // in minutes
    user: "Beth Wilson",
    billable: true,
    tags: ["design", "email"],
    notes: "Designed responsive email template",
  },
  {
    id: "8",
    project: "Website Redesign",
    task: "Navigation Menu",
    date: "2023-09-18",
    startTime: "14:30",
    endTime: "16:45",
    duration: 135, // in minutes
    user: "John Doe",
    billable: true,
    tags: ["development", "frontend"],
    notes: "Implemented responsive navigation",
  },
  {
    id: "9",
    project: "Database Migration",
    task: "Data Transfer",
    date: "2023-09-19",
    startTime: "09:00",
    endTime: "12:30",
    duration: 210, // in minutes
    user: "Alex Johnson",
    billable: true,
    tags: ["database", "backend"],
    notes: "Migrated user data to new schema",
  },
  {
    id: "10",
    project: "Mobile App Development",
    task: "API Integration",
    date: "2023-09-19",
    startTime: "13:30",
    endTime: "17:00",
    duration: 210, // in minutes
    user: "Jane Smith",
    billable: true,
    tags: ["development", "backend"],
    notes: "Connected app to backend APIs",
  },
]

// Mock data for projects
const projects = [
  { id: "1", name: "Website Redesign", color: "#3b82f6" },
  { id: "2", name: "Mobile App Development", color: "#8b5cf6" },
  { id: "3", name: "Marketing Campaign", color: "#10b981" },
  { id: "4", name: "Database Migration", color: "#f97316" },
]

// Mock data for team members
const teamMembers = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alex Johnson" },
  { id: "4", name: "Beth Wilson" },
]

export function TimeReports() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [billableOnly, setBillableOnly] = useState<boolean>(false)
  const [groupBy, setGroupBy] = useState<"project" | "user" | "date" | "task">("project")
  const [reportView, setReportView] = useState<"summary" | "detailed" | "chart" | "export">("summary")

  // Filter time entries based on selected filters
  const filteredEntries = timeEntries.filter((entry) => {
    const entryDate = new Date(entry.date)

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      if (!isWithinInterval(entryDate, { start: dateRange.from, end: dateRange.to })) {
        return false
      }
    }

    // Filter by projects
    if (selectedProjects.length > 0 && !selectedProjects.includes(entry.project)) {
      return false
    }

    // Filter by users
    if (selectedUsers.length > 0 && !selectedUsers.includes(entry.user)) {
      return false
    }

    // Filter by tags
    if (selectedTags.length > 0 && !entry.tags.some((tag) => selectedTags.includes(tag))) {
      return false
    }

    // Filter by billable status
    if (billableOnly && !entry.billable) {
      return false
    }

    return true
  })

  // Calculate total hours
  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60

  // Calculate billable hours
  const billableHours =
    filteredEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.duration, 0) / 60

  // Group entries by selected grouping
  const groupedEntries = filteredEntries.reduce(
    (groups, entry) => {
      const key = entry[groupBy]
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(entry)
      return groups
    },
    {} as Record<string, typeof timeEntries>,
  )

  // Prepare data for charts
  const projectChartData = Object.entries(
    filteredEntries.reduce(
      (acc, entry) => {
        if (!acc[entry.project]) {
          acc[entry.project] = 0
        }
        acc[entry.project] += entry.duration / 60
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, hours]) => ({ name, hours }))

  const userChartData = Object.entries(
    filteredEntries.reduce(
      (acc, entry) => {
        if (!acc[entry.user]) {
          acc[entry.user] = 0
        }
        acc[entry.user] += entry.duration / 60
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([name, hours]) => ({ name, hours }))

  const dailyChartData = Object.entries(
    filteredEntries.reduce(
      (acc, entry) => {
        if (!acc[entry.date]) {
          acc[entry.date] = 0
        }
        acc[entry.date] += entry.duration / 60
        return acc
      },
      {} as Record<string, number>,
    ),
  )
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, hours]) => ({ date: format(new Date(date), "MMM dd"), hours }))

  // Get unique tags
  const uniqueTags = Array.from(new Set(timeEntries.flatMap((entry) => entry.tags)))

  // Handle preset date ranges
  const handlePresetRange = (preset: string) => {
    const today = new Date()

    switch (preset) {
      case "today":
        setDateRange({ from: today, to: today })
        break
      case "yesterday":
        const yesterday = subDays(today, 1)
        setDateRange({ from: yesterday, to: yesterday })
        break
      case "thisWeek":
        setDateRange({
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        })
        break
      case "lastWeek":
        const lastWeekStart = subDays(startOfWeek(today, { weekStartsOn: 1 }), 7)
        const lastWeekEnd = subDays(endOfWeek(today, { weekStartsOn: 1 }), 7)
        setDateRange({ from: lastWeekStart, to: lastWeekEnd })
        break
      case "thisMonth":
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today),
        })
        break
      case "last7Days":
        setDateRange({
          from: subDays(today, 6),
          to: today,
        })
        break
      case "last30Days":
        setDateRange({
          from: subDays(today, 29),
          to: today,
        })
        break
      default:
        break
    }
  }

  // Format duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Render summary report
  const renderSummaryReport = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours.toFixed(2)}h</div>
              <p className="text-xs text-muted-foreground mt-1">{filteredEntries.length} time entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billableHours.toFixed(2)}h</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((billableHours / totalHours) * 100).toFixed(0)}% of total time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(totalHours / (dailyChartData.length || 1)).toFixed(2)}h</div>
              <p className="text-xs text-muted-foreground mt-1">Across {dailyChartData.length} days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Time by Project</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
                  <Legend />
                  <Bar dataKey="hours" fill="#3b82f6" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time by User</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Time Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
                <Legend />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" name="Hours" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render detailed report
  const renderDetailedReport = () => {
    return (
      <div className="space-y-6">
        {Object.entries(groupedEntries).map(([groupName, entries]) => (
          <Card key={groupName} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle>{groupName}</CardTitle>
                <Badge variant="outline">
                  {(entries.reduce((sum, entry) => sum + entry.duration, 0) / 60).toFixed(2)}h
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {groupBy !== "date" && <TableHead>Date</TableHead>}
                    {groupBy !== "project" && <TableHead>Project</TableHead>}
                    {groupBy !== "task" && <TableHead>Task</TableHead>}
                    {groupBy !== "user" && <TableHead>User</TableHead>}
                    <TableHead>Duration</TableHead>
                    <TableHead>Billable</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      {groupBy !== "date" && <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>}
                      {groupBy !== "project" && <TableCell>{entry.project}</TableCell>}
                      {groupBy !== "task" && <TableCell>{entry.task}</TableCell>}
                      {groupBy !== "user" && <TableCell>{entry.user}</TableCell>}
                      <TableCell>{formatDurationFromMinutes(entry.duration)}</TableCell>
                      <TableCell>
                        {entry.billable ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          >
                            Billable
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          >
                            Non-billable
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render chart report
  const renderChartReport = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution by Project</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
                <Legend />
                <Bar dataKey="hours" fill="#3b82f6" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution by User</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Time Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#3b82f6" name="Hours" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Billable vs. Non-billable Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Billable", value: billableHours },
                    { name: "Non-billable", value: totalHours - billableHours },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f97316" />
                </Pie>
                <Tooltip formatter={(value) => [`${value}h`, "Hours"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render export options
  const renderExportOptions = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Choose a format to export your time tracking data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <FileDown className="h-8 w-8 mb-2" />
                <span className="font-medium">CSV Export</span>
                <span className="text-xs text-muted-foreground mt-1">Raw data in spreadsheet format</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 mb-2" />
                <span className="font-medium">PDF Report</span>
                <span className="text-xs text-muted-foreground mt-1">Formatted report with charts</span>
              </Button>

              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center">
                <Share2 className="h-8 w-8 mb-2" />
                <span className="font-medium">Share Report</span>
                <span className="text-xs text-muted-foreground mt-1">Generate shareable link</span>
              </Button>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Delivery Options</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-delivery" className="rounded border-gray-300" />
                  <div className="flex-1">
                    <label htmlFor="email-delivery" className="font-medium cursor-pointer">
                      Email Delivery
                    </label>
                    <p className="text-sm text-muted-foreground">Send the report to specified email addresses</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="schedule-report" className="rounded border-gray-300" />
                  <div className="flex-1">
                    <label htmlFor="schedule-report" className="font-medium cursor-pointer">
                      Schedule Report
                    </label>
                    <p className="text-sm text-muted-foreground">Set up recurring report delivery</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Include in Report</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-summary" className="rounded border-gray-300" checked />
                  <label htmlFor="include-summary" className="text-sm cursor-pointer">
                    Summary Statistics
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-charts" className="rounded border-gray-300" checked />
                  <label htmlFor="include-charts" className="text-sm cursor-pointer">
                    Charts & Graphs
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-details" className="rounded border-gray-300" checked />
                  <label htmlFor="include-details" className="text-sm cursor-pointer">
                    Detailed Time Entries
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-notes" className="rounded border-gray-300" checked />
                  <label htmlFor="include-notes" className="text-sm cursor-pointer">
                    Notes & Comments
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Preview Report</Button>
            <Button>Generate Report</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Time Reports</h2>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileDown className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Mail className="h-4 w-4 mr-2" />
                Email Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={dateRange} onSelect={setDateRange as any} initialFocus />
                  <div className="grid grid-cols-2 gap-2 p-3 border-t">
                    <Button variant="outline" size="sm" onClick={() => handlePresetRange("today")}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePresetRange("yesterday")}>
                      Yesterday
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePresetRange("thisWeek")}>
                      This Week
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePresetRange("lastWeek")}>
                      Last Week
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePresetRange("thisMonth")}>
                      This Month
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePresetRange("last30Days")}>
                      Last 30 Days
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedProjects.length > 0 || selectedUsers.length > 0 || selectedTags.length > 0 || billableOnly
                      ? "Filters Applied"
                      : "Add Filters"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px]">
                  <div className="p-2">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs font-medium">Projects</Label>
                        <div className="mt-1 space-y-1">
                          {projects.map((project) => (
                            <div key={project.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`project-${project.id}`}
                                checked={selectedProjects.includes(project.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProjects([...selectedProjects, project.name])
                                  } else {
                                    setSelectedProjects(selectedProjects.filter((p) => p !== project.name))
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`project-${project.id}`} className="text-sm cursor-pointer">
                                {project.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium">Team Members</Label>
                        <div className="mt-1 space-y-1">
                          {teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`member-${member.id}`}
                                checked={selectedUsers.includes(member.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, member.name])
                                  } else {
                                    setSelectedUsers(selectedUsers.filter((u) => u !== member.name))
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`member-${member.id}`} className="text-sm cursor-pointer">
                                {member.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium">Tags</Label>
                        <div className="mt-1 space-y-1">
                          {uniqueTags.map((tag) => (
                            <div key={tag} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`tag-${tag}`}
                                checked={selectedTags.includes(tag)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTags([...selectedTags, tag])
                                  } else {
                                    setSelectedTags(selectedTags.filter((t) => t !== tag))
                                  }
                                }}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                                {tag}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="billable-only"
                          checked={billableOnly}
                          onChange={(e) => setBillableOnly(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="billable-only" className="text-sm cursor-pointer">
                          Billable time only
                        </label>
                      </div>

                      <div className="flex justify-between pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProjects([])
                            setSelectedUsers([])
                            setSelectedTags([])
                            setBillableOnly(false)
                          }}
                        >
                          Clear All
                        </Button>
                        <Button size="sm">Apply Filters</Button>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Group & View</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="group-by" className="text-xs">
                Group By
              </Label>
              <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
                <SelectTrigger id="group-by">
                  <SelectValue placeholder="Group by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="report-view" className="text-xs">
                View Type
              </Label>
              <Select value={reportView} onValueChange={(value: any) => setReportView(value)}>
                <SelectTrigger id="report-view">
                  <SelectValue placeholder="View as..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="chart">Charts</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        {selectedProjects.length > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            Projects: {selectedProjects.length}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 rounded-full"
              onClick={() => setSelectedProjects([])}
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
        )}

        {selectedUsers.length > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            Users: {selectedUsers.length}
            <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full" onClick={() => setSelectedUsers([])}>
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
        )}

        {selectedTags.length > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            Tags: {selectedTags.length}
            <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full" onClick={() => setSelectedTags([])}>
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
        )}

        {billableOnly && (
          <Badge variant="outline" className="flex items-center gap-1">
            Billable Only
            <Button variant="ghost" size="icon" className="h-4 w-4 rounded-full" onClick={() => setBillableOnly(false)}>
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
        )}
      </div>

      <Tabs defaultValue="summary" value={reportView} onValueChange={(value: any) => setReportView(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
          <TabsTrigger value="chart">Charts</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          {renderSummaryReport()}
        </TabsContent>

        <TabsContent value="detailed" className="mt-4">
          {renderDetailedReport()}
        </TabsContent>

        <TabsContent value="chart" className="mt-4">
          {renderChartReport()}
        </TabsContent>

        <TabsContent value="export" className="mt-4">
          {renderExportOptions()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
