"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Plus, Trash2, FileText, Bell, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

// Report schedule interface
interface ReportSchedule {
  id: string
  name: string
  reportType: string
  frequency: string
  recipients: string[]
  lastRun: string | null
  nextRun: string
  status: "active" | "paused"
}

// Sample report schedules
const sampleSchedules: ReportSchedule[] = [
  {
    id: "sched-1",
    name: "Weekly Project Status",
    reportType: "Project Performance",
    frequency: "weekly",
    recipients: ["team@example.com", "management@example.com"],
    lastRun: "2023-04-01T09:00:00",
    nextRun: "2023-04-08T09:00:00",
    status: "active",
  },
  {
    id: "sched-2",
    name: "Monthly Budget Report",
    reportType: "Budget Analysis",
    frequency: "monthly",
    recipients: ["finance@example.com"],
    lastRun: "2023-03-31T10:00:00",
    nextRun: "2023-04-30T10:00:00",
    status: "active",
  },
  {
    id: "sched-3",
    name: "Daily Task Summary",
    reportType: "Task Overview",
    frequency: "daily",
    recipients: ["team-leads@example.com"],
    lastRun: "2023-04-04T17:00:00",
    nextRun: "2023-04-05T17:00:00",
    status: "paused",
  },
]

// Report types
const reportTypes = [
  "Project Performance",
  "Team Productivity",
  "Budget Analysis",
  "Resource Allocation",
  "Task Overview",
  "Time Tracking Summary",
  "Custom Report",
]

// Frequency options
const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
]

// Delivery methods
const deliveryMethods = [
  { id: "email", name: "Email", icon: <Mail className="h-4 w-4" /> },
  { id: "slack", name: "Slack", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "dashboard", name: "Dashboard", icon: <FileText className="h-4 w-4" /> },
  { id: "notification", name: "Notification", icon: <Bell className="h-4 w-4" /> },
  { id: "download", name: "Auto Download", icon: <Download className="h-4 w-4" /> },
]

export function ReportScheduler() {
  const [schedules, setSchedules] = useState<ReportSchedule[]>(sampleSchedules)
  const [activeTab, setActiveTab] = useState("schedules")
  const [selectedSchedule, setSelectedSchedule] = useState<ReportSchedule | null>(null)
  const { toast } = useToast()

  // New schedule form state
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    reportType: "",
    frequency: "weekly",
    recipients: "",
    deliveryMethods: ["email"],
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSchedule({ ...newSchedule, [name]: value })
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewSchedule({ ...newSchedule, [name]: value })
  }

  // Toggle delivery method
  const toggleDeliveryMethod = (methodId: string) => {
    setNewSchedule((prev) => {
      const methods = [...prev.deliveryMethods]
      if (methods.includes(methodId)) {
        return { ...prev, deliveryMethods: methods.filter((m) => m !== methodId) }
      } else {
        return { ...prev, deliveryMethods: [...methods, methodId] }
      }
    })
  }

  // Create new schedule
  const createSchedule = () => {
    // Validate form
    if (!newSchedule.name || !newSchedule.reportType || !newSchedule.frequency || !newSchedule.recipients) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create new schedule object
    const now = new Date()
    const nextRun = new Date()

    // Set next run date based on frequency
    switch (newSchedule.frequency) {
      case "daily":
        nextRun.setDate(now.getDate() + 1)
        break
      case "weekly":
        nextRun.setDate(now.getDate() + 7)
        break
      case "biweekly":
        nextRun.setDate(now.getDate() + 14)
        break
      case "monthly":
        nextRun.setMonth(now.getMonth() + 1)
        break
      case "quarterly":
        nextRun.setMonth(now.getMonth() + 3)
        break
    }

    const schedule: ReportSchedule = {
      id: `sched-${Date.now()}`,
      name: newSchedule.name,
      reportType: newSchedule.reportType,
      frequency: newSchedule.frequency,
      recipients: newSchedule.recipients.split(",").map((r) => r.trim()),
      lastRun: null,
      nextRun: nextRun.toISOString(),
      status: "active",
    }

    // Add to schedules
    setSchedules([...schedules, schedule])

    // Reset form
    setNewSchedule({
      name: "",
      reportType: "",
      frequency: "weekly",
      recipients: "",
      deliveryMethods: ["email"],
    })

    // Show success message
    toast({
      title: "Schedule Created",
      description: "Your report schedule has been created successfully.",
    })

    // Switch to schedules tab
    setActiveTab("schedules")
  }

  // Toggle schedule status
  const toggleScheduleStatus = (id: string) => {
    setSchedules(
      schedules.map((schedule) => {
        if (schedule.id === id) {
          return {
            ...schedule,
            status: schedule.status === "active" ? "paused" : "active",
          }
        }
        return schedule
      }),
    )

    toast({
      title: "Status Updated",
      description: "The schedule status has been updated.",
    })
  }

  // Delete schedule
  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))

    toast({
      title: "Schedule Deleted",
      description: "The report schedule has been deleted.",
    })
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Run report now
  const runReportNow = (id: string) => {
    // In a real app, this would trigger the report generation
    toast({
      title: "Report Triggered",
      description: "The report is being generated and will be delivered shortly.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Report Scheduler</h2>
          <p className="text-muted-foreground">Schedule automated reports to be delivered to your team</p>
        </div>
        <Button onClick={() => setActiveTab("create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Schedule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="schedules">Active Schedules</TabsTrigger>
          <TabsTrigger value="create">Create Schedule</TabsTrigger>
          <TabsTrigger value="history">Delivery History</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage your automated report schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">{schedule.name}</TableCell>
                      <TableCell>{schedule.reportType}</TableCell>
                      <TableCell className="capitalize">{schedule.frequency}</TableCell>
                      <TableCell>
                        {schedule.recipients.length > 1
                          ? `${schedule.recipients[0]} +${schedule.recipients.length - 1} more`
                          : schedule.recipients[0]}
                      </TableCell>
                      <TableCell>{formatDate(schedule.lastRun)}</TableCell>
                      <TableCell>{formatDate(schedule.nextRun)}</TableCell>
                      <TableCell>
                        <Badge variant={schedule.status === "active" ? "default" : "secondary"}>
                          {schedule.status === "active" ? "Active" : "Paused"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toggleScheduleStatus(schedule.id)}>
                            {schedule.status === "active" ? "Pause" : "Activate"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => runReportNow(schedule.id)}>
                            Run Now
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSchedule(schedule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Schedule</CardTitle>
              <CardDescription>Set up a new automated report schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Schedule Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Weekly Project Status"
                      value={newSchedule.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select
                      value={newSchedule.reportType}
                      onValueChange={(value) => handleSelectChange("reportType", value)}
                    >
                      <SelectTrigger id="reportType">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={newSchedule.frequency}
                      onValueChange={(value) => handleSelectChange("frequency", value)}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Recipients</Label>
                    <Input
                      id="recipients"
                      name="recipients"
                      placeholder="email@example.com, team@example.com"
                      value={newSchedule.recipients}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Methods</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {deliveryMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer ${
                          newSchedule.deliveryMethods.includes(method.id)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-accent"
                        }`}
                        onClick={() => toggleDeliveryMethod(method.id)}
                      >
                        {method.icon}
                        <span className="mt-1 text-xs">{method.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Advanced Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-attachments" />
                      <label
                        htmlFor="include-attachments"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include attachments (PDF, Excel)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-errors" defaultChecked />
                      <label
                        htmlFor="notify-errors"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Notify on errors
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-summary" defaultChecked />
                      <label
                        htmlFor="include-summary"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include executive summary
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("schedules")}>
                Cancel
              </Button>
              <Button onClick={createSchedule}>Create Schedule</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>View past report deliveries and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Delivery history would be displayed here</p>
                <p className="text-sm mt-2">In a real implementation, this would show a log of all report deliveries</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportScheduler
