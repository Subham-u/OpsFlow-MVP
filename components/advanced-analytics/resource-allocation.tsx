"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Maximize2,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data
const departmentAllocationData = [
  { name: "Development", value: 40 },
  { name: "Design", value: 25 },
  { name: "Marketing", value: 15 },
  { name: "QA", value: 12 },
  { name: "Management", value: 8 },
]

const teamMemberAllocationData = [
  { name: "John", project: "Project A", hours: 35, utilization: 87.5 },
  { name: "Beth", project: "Project B", hours: 40, utilization: 100 },
  { name: "Carl", project: "Project A", hours: 20, utilization: 50 },
  { name: "Dana", project: "Project C", hours: 30, utilization: 75 },
]

export function ResourceAllocation() {
  const [timeframe, setTimeframe] = useState("current")
  const [viewMode, setViewMode] = useState("department")

  // Mock data for resource allocation by department
  const departmentAllocationDataOriginal = [
    { name: "Development", value: 42, color: "#3b82f6" },
    { name: "Design", value: 28, color: "#8b5cf6" },
    { name: "Marketing", value: 15, color: "#ec4899" },
    { name: "QA", value: 10, color: "#f97316" },
    { name: "Management", value: 5, color: "#10b981" },
  ]

  // Mock data for resource allocation by project
  const projectAllocationData = [
    { name: "Website Redesign", value: 35, color: "#3b82f6" },
    { name: "Mobile App", value: 25, color: "#8b5cf6" },
    { name: "Marketing Campaign", value: 20, color: "#ec4899" },
    { name: "Database Migration", value: 15, color: "#f97316" },
    { name: "Internal Tools", value: 5, color: "#10b981" },
  ]

  // Mock data for resource utilization
  const utilizationData = [
    { name: "Development", billable: 85, nonBillable: 10, idle: 5 },
    { name: "Design", billable: 75, nonBillable: 15, idle: 10 },
    { name: "Marketing", billable: 70, nonBillable: 20, idle: 10 },
    { name: "QA", billable: 80, nonBillable: 15, idle: 5 },
    { name: "Management", billable: 60, nonBillable: 35, idle: 5 },
  ]

  // Mock data for team members
  const teamMembers = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Senior Developer",
      department: "Development",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
      allocation: 100,
      projects: [
        { name: "Website Redesign", allocation: 70 },
        { name: "Internal Tools", allocation: 30 },
      ],
      utilization: 92,
      availability: "Fully Allocated",
    },
    {
      id: "2",
      name: "Beth Smith",
      role: "UI Designer",
      department: "Design",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "BS",
      allocation: 90,
      projects: [
        { name: "Website Redesign", allocation: 50 },
        { name: "Mobile App", allocation: 40 },
      ],
      utilization: 85,
      availability: "Available: 10%",
    },
    {
      id: "3",
      name: "Carl Davis",
      role: "Backend Developer",
      department: "Development",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "CD",
      allocation: 100,
      projects: [
        { name: "Mobile App", allocation: 60 },
        { name: "Database Migration", allocation: 40 },
      ],
      utilization: 95,
      availability: "Fully Allocated",
    },
    {
      id: "4",
      name: "Dana Wilson",
      role: "Marketing Specialist",
      department: "Marketing",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DW",
      allocation: 80,
      projects: [{ name: "Marketing Campaign", allocation: 80 }],
      utilization: 75,
      availability: "Available: 20%",
    },
    {
      id: "5",
      name: "Eric Brown",
      role: "QA Engineer",
      department: "QA",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EB",
      allocation: 90,
      projects: [
        { name: "Website Redesign", allocation: 40 },
        { name: "Mobile App", allocation: 50 },
      ],
      utilization: 88,
      availability: "Available: 10%",
    },
  ]

  // Mock data for capacity planning
  const capacityPlanningData = [
    { month: "Jul", development: 95, design: 90, marketing: 80, qa: 90, management: 85 },
    { month: "Aug", development: 110, design: 85, marketing: 90, qa: 95, management: 85 },
    { month: "Sep", development: 120, design: 75, marketing: 100, qa: 100, management: 85 },
    { month: "Oct", development: 100, design: 70, marketing: 110, qa: 90, management: 85 },
    { month: "Nov", development: 90, design: 80, marketing: 90, qa: 85, management: 85 },
    { month: "Dec", development: 85, design: 85, marketing: 80, qa: 80, management: 85 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Resource Allocation</h2>
          <p className="text-muted-foreground">Analyze and optimize your team's resource allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="q3">Q3 2023</TabsTrigger>
              <TabsTrigger value="q4">Q4 2023</TabsTrigger>
              <TabsTrigger value="2024">2024</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Resource Allocation Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>
                  Distribution of resources across {viewMode === "department" ? "departments" : "projects"}
                </CardDescription>
              </div>
              <Tabs defaultValue={viewMode} onValueChange={setViewMode}>
                <TabsList>
                  <TabsTrigger value="department">By Department</TabsTrigger>
                  <TabsTrigger value="project">By Project</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={viewMode === "department" ? departmentAllocationData : projectAllocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {(viewMode === "department" ? departmentAllocationData : projectAllocationData).map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ),
                    )}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                <span>
                  Development team is <strong>over-allocated</strong> by 5%
                </span>
              </div>
              <Button variant="link" size="sm" className="text-primary">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resource Utilization</CardTitle>
                <CardDescription>Billable vs. non-billable time by department</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={utilizationData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="billable" stackId="a" fill="#22c55e" name="Billable" />
                  <Bar dataKey="nonBillable" stackId="a" fill="#f97316" name="Non-Billable" />
                  <Bar dataKey="idle" stackId="a" fill="#ef4444" name="Idle" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>
                  Overall utilization rate: <strong>82%</strong>
                </span>
              </div>
              <Button variant="link" size="sm" className="text-primary">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Allocation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Allocation</CardTitle>
              <CardDescription>Current allocation of team members across projects</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Optimize Allocation
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Team Member</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Project Allocation</TableHead>
                  <TableHead className="text-center">Utilization</TableHead>
                  <TableHead className="text-center">Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {member.projects.map((project, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{project.name}</span>
                              <span>{project.allocation}%</span>
                            </div>
                            <Progress value={project.allocation} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{member.utilization}%</span>
                        <Progress
                          value={member.utilization}
                          className="h-2 w-16 mt-1"
                          indicatorClassName={
                            member.utilization >= 90
                              ? "bg-green-500"
                              : member.utilization >= 75
                                ? "bg-blue-500"
                                : "bg-amber-500"
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={member.allocation === 100 ? "outline" : "default"}
                        className={member.allocation === 100 ? "border-red-500 text-red-500" : "bg-green-500"}
                      >
                        {member.availability}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Reassign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Planning */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Capacity Planning</CardTitle>
              <CardDescription>6-month forecast of team capacity vs. demand</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityPlanningData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 150]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="development" fill="#3b82f6" name="Development" />
                <Bar dataKey="design" fill="#8b5cf6" name="Design" />
                <Bar dataKey="marketing" fill="#ec4899" name="Marketing" />
                <Bar dataKey="qa" fill="#f97316" name="QA" />
                <Bar dataKey="management" fill="#10b981" name="Management" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Critical Overallocation</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Development team will be overallocated by 20% in September. Consider hiring contractors or adjusting
                project timelines.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Potential Resource Gap</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Design team capacity will drop to 70% in October due to planned vacations and training.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Hiring Recommendation</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on the forecast, consider hiring 2 additional developers by August to meet upcoming demand.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Optimization Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle>Resource Optimization Recommendations</CardTitle>
          <CardDescription>AI-powered suggestions to improve resource allocation and utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="font-medium">Rebalance Development Team</h3>
                </div>
                <Badge className="bg-blue-500">High Impact</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Shift Alex Johnson (30%) and Carl Davis (20%) from their current projects to the Database Migration
                project to address the upcoming resource gap in September.
              </p>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm">
                  Apply Recommendation
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="font-medium">Improve Utilization</h3>
                </div>
                <Badge className="bg-green-500">Medium Impact</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Dana Wilson has 20% availability. Assign her to the Website Redesign project to support content creation
                and improve overall utilization.
              </p>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm">
                  Apply Recommendation
                </Button>
              </div>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/50 p-2">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <h3 className="font-medium">Strategic Hiring</h3>
                </div>
                <Badge className="bg-amber-500">Long-term</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Based on the 6-month forecast, initiate hiring for 2 developers and 1 designer to address the consistent
                capacity gaps starting in Q4.
              </p>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm">
                  View Hiring Plan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
