"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

export function ProjectPerformance() {
  const data = [
    {
      name: "Website Redesign",
      completed: 18,
      inProgress: 6,
      overdue: 0,
    },
    {
      name: "Mobile App",
      completed: 16,
      inProgress: 14,
      overdue: 6,
    },
    {
      name: "Marketing",
      completed: 16,
      inProgress: 2,
      overdue: 0,
    },
    {
      name: "Product Launch",
      completed: 12,
      inProgress: 24,
      overdue: 6,
    },
    {
      name: "Customer Research",
      completed: 9,
      inProgress: 6,
      overdue: 0,
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Project Performance</CardTitle>
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
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#22c55e" name="Completed" />
              <Bar dataKey="inProgress" stackId="a" fill="#f97316" name="In Progress" />
              <Bar dataKey="overdue" stackId="a" fill="#ef4444" name="Overdue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
