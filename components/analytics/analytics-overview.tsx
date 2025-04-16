"use client"

import { ArrowUpRight, Clock, FileCheck, Target, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsOverview() {
  const stats = [
    {
      title: "Total Projects",
      value: "24",
      change: "+4",
      icon: FileCheck,
      color: "text-blue-500",
    },
    {
      title: "Completed Tasks",
      value: "842",
      change: "+128",
      icon: Target,
      color: "text-green-500",
    },
    {
      title: "Team Productivity",
      value: "87%",
      change: "+12%",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Hours Logged",
      value: "1,284",
      change: "+342",
      icon: Clock,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">{stat.change}</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
