"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, UserX, Clock, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

// Import the date utilities
import { formatDate } from "@/lib/date-utils"
import { LONG_DATE } from "@/lib/constants"

export function AttendanceCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())

  // Sample attendance data
  const attendanceData = [
    { date: new Date(2023, 4, 1), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 2), status: "present", clockIn: "08:50 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 3), status: "present", clockIn: "08:55 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 4), status: "late", clockIn: "09:15 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 5), status: "absent", clockIn: "-", clockOut: "-" },
    { date: new Date(2023, 4, 8), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 9), status: "present", clockIn: "08:50 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 10), status: "present", clockIn: "08:55 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 11), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 12), status: "present", clockIn: "08:50 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 15), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 16), status: "late", clockIn: "09:20 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 17), status: "present", clockIn: "08:55 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 18), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 19), status: "present", clockIn: "08:50 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 22), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 23), status: "present", clockIn: "08:50 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 24), status: "absent", clockIn: "-", clockOut: "-" },
    { date: new Date(2023, 4, 25), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 26), status: "present", clockIn: "08:50 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 29), status: "present", clockIn: "08:45 AM", clockOut: "05:30 PM" },
    { date: new Date(2023, 4, 30), status: "present", clockIn: "08:50 AM", clockOut: "05:45 PM" },
    { date: new Date(2023, 4, 31), status: "present", clockIn: "08:55 AM", clockOut: "05:30 PM" },
  ]

  // Get attendance for selected date
  const getAttendanceForDate = (date: Date | undefined) => {
    if (!date) return null

    return attendanceData.find(
      (item) =>
        item.date.getDate() === date.getDate() &&
        item.date.getMonth() === date.getMonth() &&
        item.date.getFullYear() === date.getFullYear(),
    )
  }

  // Get status color for calendar day
  const getDayColor = (day: Date) => {
    const attendance = attendanceData.find(
      (item) =>
        item.date.getDate() === day.getDate() &&
        item.date.getMonth() === day.getMonth() &&
        item.date.getFullYear() === day.getFullYear(),
    )

    if (!attendance) return ""

    switch (attendance.status) {
      case "present":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "late":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "absent":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return ""
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <UserCheck className="h-5 w-5 text-green-500" />
      case "late":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "absent":
        return <UserX className="h-5 w-5 text-red-500" />
      default:
        return <UserX className="h-5 w-5 text-gray-500" />
    }
  }

  // Navigate to previous month
  const previousMonth = () => {
    const newDate = new Date(year, month - 1, 1)
    setYear(newDate.getFullYear())
    setMonth(newDate.getMonth())
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(year, month + 1, 1)
    setYear(newDate.getFullYear())
    setMonth(newDate.getMonth())
  }

  // Format date
  // Use the imported formatDate utility with the LONG_DATE format instead of the local function

  // Format date
  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  // }

  // Get selected attendance
  const selectedAttendance = getAttendanceForDate(date)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>View your attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={new Date(year, month)}
                onMonthChange={(date) => {
                  setYear(date.getFullYear())
                  setMonth(date.getMonth())
                }}
                className="rounded-md border"
                modifiers={{
                  present: (date) => {
                    const attendance = attendanceData.find(
                      (item) =>
                        item.date.getDate() === date.getDate() &&
                        item.date.getMonth() === date.getMonth() &&
                        item.date.getFullYear() === date.getFullYear() &&
                        item.status === "present",
                    )
                    return !!attendance
                  },
                  late: (date) => {
                    const attendance = attendanceData.find(
                      (item) =>
                        item.date.getDate() === date.getDate() &&
                        item.date.getMonth() === date.getMonth() &&
                        item.date.getFullYear() === date.getFullYear() &&
                        item.status === "late",
                    )
                    return !!attendance
                  },
                  absent: (date) => {
                    const attendance = attendanceData.find(
                      (item) =>
                        item.date.getDate() === date.getDate() &&
                        item.date.getMonth() === date.getMonth() &&
                        item.date.getFullYear() === date.getFullYear() &&
                        item.status === "absent",
                    )
                    return !!attendance
                  },
                }}
                modifiersClassNames={{
                  present: "bg-green-100 text-green-800 hover:bg-green-200",
                  late: "bg-amber-100 text-amber-800 hover:bg-amber-200",
                  absent: "bg-red-100 text-red-800 hover:bg-red-200",
                }}
              />
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Late</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Absent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Selected Date</CardTitle>
              <CardDescription>{date ? formatDate(date, LONG_DATE) : "No date selected"}</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAttendance ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedAttendance.status)}
                      <span className="font-medium capitalize">{selectedAttendance.status}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        selectedAttendance.status === "present"
                          ? "bg-green-100 text-green-800"
                          : selectedAttendance.status === "late"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedAttendance.status === "present"
                        ? "On Time"
                        : selectedAttendance.status === "late"
                          ? "Late"
                          : "Absent"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-md">
                      <p className="text-sm text-muted-foreground">Clock In</p>
                      <p className="font-medium">{selectedAttendance.clockIn}</p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <p className="text-sm text-muted-foreground">Clock Out</p>
                      <p className="font-medium">{selectedAttendance.clockOut}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium mb-2">Working Hours</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-medium">{selectedAttendance.status === "absent" ? "0h" : "8h"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Select a date to view attendance details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
          <CardDescription>
            Attendance summary for{" "}
            {new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <UserCheck className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium">Present Days</p>
                    <p className="text-2xl font-bold">19</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Clock className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-sm font-medium">Late Days</p>
                    <p className="text-2xl font-bold">2</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <UserX className="h-8 w-8 text-red-500 mb-2" />
                    <p className="text-sm font-medium">Absent Days</p>
                    <p className="text-2xl font-bold">2</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <CalendarIcon className="h-8 w-8 text-blue-500 mb-2" />
                    <p className="text-sm font-medium">Working Days</p>
                    <p className="text-2xl font-bold">23</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Clock In</th>
                      <th className="p-2 text-left">Clock Out</th>
                      <th className="p-2 text-left">Working Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{item.date.toLocaleDateString()}</td>
                        <td className="p-2">
                          <Badge
                            variant="outline"
                            className={
                              item.status === "present"
                                ? "bg-green-100 text-green-800"
                                : item.status === "late"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-2">{item.clockIn}</td>
                        <td className="p-2">{item.clockOut}</td>
                        <td className="p-2">{item.status === "absent" ? "0h" : "8h"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="trends">
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Attendance trend visualization would appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
