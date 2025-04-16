"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart"

export function AttendanceStats() {
  // Sample data for charts
  const weeklyData = [
    { day: "Mon", hours: 8.5, expected: 8, onTime: true },
    { day: "Tue", hours: 8.2, expected: 8, onTime: true },
    { day: "Wed", hours: 7.8, expected: 8, onTime: false },
    { day: "Thu", hours: 8.7, expected: 8, onTime: true },
    { day: "Fri", hours: 8.0, expected: 8, onTime: true },
  ]

  const monthlyData = [
    { week: "Week 1", attendance: 100, punctuality: 90 },
    { week: "Week 2", attendance: 95, punctuality: 85 },
    { week: "Week 3", attendance: 98, punctuality: 92 },
    { week: "Week 4", attendance: 100, punctuality: 95 },
  ]

  const yearlyData = [
    { month: "Jan", attendance: 98, punctuality: 95 },
    { month: "Feb", attendance: 96, punctuality: 90 },
    { month: "Mar", attendance: 97, punctuality: 92 },
    { month: "Apr", attendance: 99, punctuality: 94 },
    { month: "May", attendance: 100, punctuality: 96 },
    { month: "Jun", attendance: 98, punctuality: 93 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Statistics</CardTitle>
        <CardDescription>View your attendance patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hours" fill="#8884d8" name="Hours Worked" />
                <Bar dataKey="expected" fill="#82ca9d" name="Expected Hours" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="monthly" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#8884d8" name="Attendance %" />
                <Line type="monotone" dataKey="punctuality" stroke="#82ca9d" name="Punctuality %" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="yearly" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#8884d8" name="Attendance %" />
                <Line type="monotone" dataKey="punctuality" stroke="#82ca9d" name="Punctuality %" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
