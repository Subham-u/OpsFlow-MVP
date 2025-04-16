"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export function TimeCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedView, setSelectedView] = useState("month")

  // Mock time entries data
  const timeEntries = [
    { id: 1, date: "2023-09-04", project: "Website Redesign", duration: "3h 20m", color: "bg-blue-500" },
    { id: 2, date: "2023-09-05", project: "Mobile App", duration: "2h 45m", color: "bg-green-500" },
    { id: 3, date: "2023-09-07", project: "Marketing Campaign", duration: "1h 30m", color: "bg-purple-500" },
    { id: 4, date: "2023-09-11", project: "Website Redesign", duration: "4h 15m", color: "bg-blue-500" },
    { id: 5, date: "2023-09-12", project: "Database Migration", duration: "5h 00m", color: "bg-yellow-500" },
    { id: 6, date: "2023-09-14", project: "Mobile App", duration: "3h 10m", color: "bg-green-500" },
    { id: 7, date: "2023-09-18", project: "Website Redesign", duration: "2h 30m", color: "bg-blue-500" },
    { id: 8, date: "2023-09-19", project: "Marketing Campaign", duration: "4h 45m", color: "bg-purple-500" },
    { id: 9, date: "2023-09-21", project: "Database Migration", duration: "1h 50m", color: "bg-yellow-500" },
    { id: 10, date: "2023-09-25", project: "Mobile App", duration: "3h 25m", color: "bg-green-500" },
    { id: 11, date: "2023-09-26", project: "Website Redesign", duration: "2h 15m", color: "bg-blue-500" },
    { id: 12, date: "2023-09-28", project: "Marketing Campaign", duration: "3h 40m", color: "bg-purple-500" },
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getEntriesForDate = (year: number, month: number, day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return timeEntries.filter((entry) => entry.date === dateString)
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Add weekday headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="text-center font-medium py-2 border-b">
          {weekdays[i]}
        </div>,
      )
    }

    // Add blank spaces for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-transparent min-h-[120px]"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = new Date().toDateString() === date.toDateString()
      const entries = getEntriesForDate(year, month, day)

      days.push(
        <div key={`day-${day}`} className={`p-2 border min-h-[120px] ${isToday ? "bg-muted" : ""}`}>
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm ${isToday ? "font-bold" : ""}`}>{day}</span>
            {entries.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {entries
                  .reduce((total, entry) => {
                    const [hours, minutes] = entry.duration.split("h ")
                    return total + Number.parseInt(hours) + Number.parseInt(minutes) / 60
                  }, 0)
                  .toFixed(1)}
                h
              </span>
            )}
          </div>
          <div className="space-y-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`text-xs p-1 rounded ${entry.color} text-white truncate`}
                title={`${entry.project} (${entry.duration})`}
              >
                {entry.project} ({entry.duration})
              </div>
            ))}
            {entries.length === 0 && (
              <Button variant="ghost" size="sm" className="w-full h-6 text-xs justify-start p-1">
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            )}
          </div>
        </div>,
      )
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">{formatMonth(currentMonth)}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Time
          </Button>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle>Time Calendar</CardTitle>
        </CardHeader>
        <CardContent>{renderCalendar()}</CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Badge className="bg-blue-500">Website Redesign</Badge>
        <Badge className="bg-green-500">Mobile App</Badge>
        <Badge className="bg-purple-500">Marketing Campaign</Badge>
        <Badge className="bg-yellow-500">Database Migration</Badge>
      </div>
    </div>
  )
}
