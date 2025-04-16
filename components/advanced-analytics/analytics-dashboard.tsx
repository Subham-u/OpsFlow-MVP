"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Download, Filter, Maximize2, MoreHorizontal, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useState } from "react"

// Sample data
const projectData = [
  { name: "Project A", completed: 65, inProgress: 25, notStarted: 10 },
  { name: "Project B", completed: 45, inProgress: 45, notStarted: 10 },
  { name: "Project C", completed: 30, inProgress: 50, notStarted: 20 },
  { name: "Project D", completed: 80, inProgress: 15, notStarted: 5 },
  { name: "Project E", completed: 20, inProgress: 70, notStarted: 10 },
]

const teamPerformanceData = [
  { name: "Jan", productivity: 78, efficiency: 65, quality: 82 },
  { name: "Feb", productivity: 82, efficiency: 68, quality: 85 },
  { name: "Mar", productivity: 80, efficiency: 72, quality: 83 },
  { name: "Apr", productivity: 85, efficiency: 75, quality: 87 },
  { name: "May", productivity: 88, efficiency: 80, quality: 90 },
  { name: "Jun", productivity: 92, efficiency: 83, quality: 92 },
]

const resourceAllocationData = [
  { name: "Development", value: 40 },
  { name: "Design", value: 25 },
  { name: "Marketing", value: 15 },
  { name: "QA", value: 12 },
  { name: "Management", value: 8 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  })

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive view of your project metrics and team performance</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Status breakdown across projects</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Expand
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#4ade80" name="Completed" />
                <Bar dataKey="inProgress" stackId="a" fill="#60a5fa" name="In Progress" />
                <Bar dataKey="notStarted" stackId="a" fill="#f87171" name="Not Started" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Productivity, efficiency, and quality metrics</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Expand
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#4ade80"
                  activeDot={{ r: 8 }}
                  name="Productivity"
                />
                <Line type="monotone" dataKey="efficiency" stroke="#60a5fa" name="Efficiency" />
                <Line type="monotone" dataKey="quality" stroke="#8884d8" name="Quality" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Resource Allocation</CardTitle>
              <CardDescription>Distribution of resources across departments</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Expand
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={resourceAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {resourceAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Track key performance indicators over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="productivity">
              <TabsList className="mb-4">
                <TabsTrigger value="productivity">Productivity</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="productivity" className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="productivity"
                      stroke="#4ade80"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Productivity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="budget" className="h-[400px]">
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Budget analysis data will be displayed here</p>
                </div>
              </TabsContent>
              <TabsContent value="quality" className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={teamPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Quality"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="timeline" className="h-[400px]">
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Timeline analysis data will be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
