"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { CalendarIcon, Clock, FileText, Plus, AlertCircle, CalendarDays } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function LeaveManagement() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [leaveType, setLeaveType] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reason, setReason] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  // Sample leave data
  const leaveRequests = [
    {
      id: "1",
      type: "Vacation",
      startDate: new Date(2023, 5, 15),
      endDate: new Date(2023, 5, 20),
      days: 6,
      status: "approved",
      reason: "Annual family vacation",
      approvedBy: "Alex Johnson",
      approvedOn: new Date(2023, 4, 25),
    },
    {
      id: "2",
      type: "Sick Leave",
      startDate: new Date(2023, 4, 5),
      endDate: new Date(2023, 4, 5),
      days: 1,
      status: "approved",
      reason: "Doctor's appointment",
      approvedBy: "Alex Johnson",
      approvedOn: new Date(2023, 4, 4),
    },
    {
      id: "3",
      type: "Personal Leave",
      startDate: new Date(2023, 6, 10),
      endDate: new Date(2023, 6, 10),
      days: 1,
      status: "pending",
      reason: "Family event",
      approvedBy: null,
      approvedOn: null,
    },
    {
      id: "4",
      type: "Work From Home",
      startDate: new Date(2023, 5, 8),
      endDate: new Date(2023, 5, 8),
      days: 1,
      status: "pending",
      reason: "Home repairs",
      approvedBy: null,
      approvedOn: null,
    },
    {
      id: "5",
      type: "Vacation",
      startDate: new Date(2023, 3, 10),
      endDate: new Date(2023, 3, 14),
      days: 5,
      status: "rejected",
      reason: "Personal trip",
      approvedBy: "Alex Johnson",
      approvedOn: new Date(2023, 3, 2),
    },
  ]

  // Filter leave requests based on active tab
  const filteredLeaveRequests = leaveRequests.filter((request) => {
    const today = new Date()

    if (activeTab === "upcoming") {
      return request.startDate >= today && (request.status === "approved" || request.status === "pending")
    } else if (activeTab === "past") {
      return request.endDate < today || request.status === "rejected"
    } else if (activeTab === "pending") {
      return request.status === "pending"
    }

    return true
  })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Format date range
  const formatDateRange = (startDate: Date, endDate: Date) => {
    if (startDate.toDateString() === endDate.toDateString()) {
      return format(startDate, "MMMM d, yyyy")
    }
    return `${format(startDate, "MMMM d")} - ${format(endDate, "MMMM d, yyyy")}`
  }

  // Handle leave request submission
  const handleSubmitLeaveRequest = () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval",
    })

    // Reset form and close dialog
    setLeaveType("")
    setStartDate(undefined)
    setEndDate(undefined)
    setReason("")
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Leave Management</h3>
          <p className="text-sm text-muted-foreground">Request and manage your time off</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Leave</DialogTitle>
              <DialogDescription>Submit a new leave request for approval.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="leave-type">Leave Type</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                    <SelectItem value="wfh">Work From Home</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for leave"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label>Supporting Documents (Optional)</Label>
                <Input type="file" />
                <p className="text-xs text-muted-foreground">
                  Upload any supporting documents (e.g., medical certificate)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitLeaveRequest}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Leave Balance</CardTitle>
          <CardDescription>Your current leave balance for the year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="bg-blue-100 p-2 rounded-full mb-2">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium">Vacation</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-muted-foreground">/ 20</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="bg-red-100 p-2 rounded-full mb-2">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-sm font-medium">Sick Leave</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">9</p>
                  <p className="text-sm text-muted-foreground">/ 10</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="bg-amber-100 p-2 rounded-full mb-2">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium">Personal</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">/ 5</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="bg-green-100 p-2 rounded-full mb-2">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Work From Home</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">/ 12</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>Manage your leave requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4">
              {filteredLeaveRequests.length > 0 ? (
                filteredLeaveRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{request.type}</h4>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDateRange(request.startDate, request.endDate)} ({request.days}{" "}
                            {request.days > 1 ? "days" : "day"})
                          </p>
                          <p className="text-sm mt-1">{request.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500"
                              onClick={() => {
                                toast({
                                  title: "Leave Request Cancelled",
                                  description: "Your leave request has been cancelled",
                                })
                              }}
                            >
                              Cancel Request
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Leave Details",
                                description: "Viewing leave request details",
                              })
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No upcoming leave requests</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="pending" className="space-y-4">
              {filteredLeaveRequests.length > 0 ? (
                filteredLeaveRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{request.type}</h4>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDateRange(request.startDate, request.endDate)} ({request.days}{" "}
                            {request.days > 1 ? "days" : "day"})
                          </p>
                          <p className="text-sm mt-1">{request.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => {
                              toast({
                                title: "Leave Request Cancelled",
                                description: "Your leave request has been cancelled",
                              })
                            }}
                          >
                            Cancel Request
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Leave Details",
                                description: "Viewing leave request details",
                              })
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No pending leave requests</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-4">
              {filteredLeaveRequests.length > 0 ? (
                filteredLeaveRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{request.type}</h4>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDateRange(request.startDate, request.endDate)} ({request.days}{" "}
                            {request.days > 1 ? "days" : "day"})
                          </p>
                          <p className="text-sm mt-1">{request.reason}</p>
                        </div>
                        <div>
                          {request.status === "approved" && request.approvedBy && (
                            <p className="text-sm text-muted-foreground text-right">
                              Approved by {request.approvedBy}
                              <br />
                              {request.approvedOn && format(request.approvedOn, "MMMM d, yyyy")}
                            </p>
                          )}
                          {request.status === "rejected" && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Leave Request Resubmitted",
                                    description: "Your leave request has been resubmitted",
                                  })
                                }}
                              >
                                Resubmit
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No past leave requests</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
