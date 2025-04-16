"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

export function TeamPerformance() {
  const data = [
    {
      name: "Alex J.",
      tasks: 24,
      hours: 38,
    },
    {
      name: "Beth S.",
      tasks: 18,
      hours: 32,
    },
    {
      name: "Carl D.",
      tasks: 16,
      hours: 28,
    },
    {
      name: "Dana W.",
      tasks: 22,
      hours: 36,
    },
    {
      name: "Eric B.",
      tasks: 14,
      hours: 26,
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="tasks" fill="#8884d8" name="Tasks Completed" />
              <Bar yAxisId="right" dataKey="hours" fill="#82ca9d" name="Hours Logged" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
