"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  LineChartIcon,
  PieChartIcon,
  Share2,
  Download,
  Settings,
  Maximize2,
  Filter,
  RefreshCw,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChartTooltip } from "@/components/ui/chart"

// Sample data for charts
const projectData = [
  { name: "Jan", completed: 45, inProgress: 30, planned: 15 },
  { name: "Feb", completed: 50, inProgress: 25, planned: 20 },
  { name: "Mar", completed: 35, inProgress: 40, planned: 25 },
  { name: "Apr", completed: 60, inProgress: 20, planned: 15 },
  { name: "May", completed: 75, inProgress: 15, planned: 10 },
  { name: "Jun", completed: 65, inProgress: 25, planned: 15 },
]

const teamData = [
  { name: "Week 1", productivity: 78, engagement: 65, satisfaction: 72 },
  { name: "Week 2", productivity: 82, engagement: 68, satisfaction: 75 },
  { name: "Week 3", productivity: 79, engagement: 70, satisfaction: 78 },
  { name: "Week 4", productivity: 85, engagement: 75, satisfaction: 80 },
  { name: "Week 5", productivity: 88, engagement: 78, satisfaction: 83 },
  { name: "Week 6", productivity: 90, engagement: 82, satisfaction: 85 },
]

const taskDistributionData = [
  { name: "Development", value: 45 },
  { name: "Design", value: 20 },
  { name: "Research", value: 15 },
  { name: "Testing", value: 12 },
  { name: "Documentation", value: 8 },
]

const budgetData = [
  { name: "Jan", actual: 12000, planned: 10000 },
  { name: "Feb", actual: 11500, planned: 12000 },
  { name: "Mar", actual: 13500, planned: 13000 },
  { name: "Apr", actual: 14800, planned: 14000 },
  { name: "May", actual: 15200, planned: 15000 },
  { name: "Jun", actual: 16500, planned: 16000 },
]

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// Chart types
type ChartType = "bar" | "line" | "pie" | "area"

export function DataVisualization() {
  const [activeTab, setActiveTab] = useState("projects")
  const [chartType, setChartType] = useState<ChartType>("bar")
  const { toast } = useToast()

  // Export chart
  const exportChart = () => {
    toast({
      title: "Chart Exported",
      description: "Your chart has been exported as an image.",
    })
  }

  // Share chart
  const shareChart = () => {
    toast({
      title: "Share Options",
      description: "Sharing options have been opened.",
    })
  }

  // Refresh data
  const refreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Chart data has been refreshed.",
    })
  }

  // Render chart based on type
  const renderChart = (data: any[], type: ChartType) => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsBarChart
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
              <ChartTooltip />
              <Legend />
              {Object.keys(data[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart
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
              <ChartTooltip />
              <Legend />
              {Object.keys(data[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={COLORS[index % COLORS.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
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
              <ChartTooltip />
              <Legend />
              {Object.keys(data[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  // Get data based on active tab
  const getActiveData = () => {
    switch (activeTab) {
      case "projects":
        return projectData
      case "team":
        return teamData
      case "tasks":
        return taskDistributionData
      case "budget":
        return budgetData
      default:
        return projectData
    }
  }

  // Get chart title based on active tab
  const getChartTitle = () => {
    switch (activeTab) {
      case "projects":
        return "Project Progress Over Time"
      case "team":
        return "Team Performance Metrics"
      case "tasks":
        return "Task Distribution by Category"
      case "budget":
        return "Budget vs. Actual Spending"
      default:
        return "Chart"
    }
  }

  // Get available chart types based on active tab
  const getAvailableChartTypes = (): ChartType[] => {
    switch (activeTab) {
      case "projects":
        return ["bar", "line", "area"]
      case "team":
        return ["line", "bar", "area"]
      case "tasks":
        return ["pie", "bar"]
      case "budget":
        return ["bar", "line", "area"]
      default:
        return ["bar", "line", "pie", "area"]
    }
  }

  // Get chart type icon
  const getChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case "bar":
        return <BarChart className="h-4 w-4" />
      case "line":
        return <LineChartIcon className="h-4 w-4" />
      case "pie":
        return <PieChartIcon className="h-4 w-4" />
      case "area":
        return <AreaChart className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Visualization</h2>
          <p className="text-muted-foreground">Interactive charts and visualizations for project analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportChart}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={shareChart}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{getChartTitle()}</CardTitle>
                <CardDescription>
                  {activeTab === "projects" && "Visualize project progress over time"}
                  {activeTab === "team" && "Track team performance metrics"}
                  {activeTab === "tasks" && "View task distribution by category"}
                  {activeTab === "budget" && "Compare budget vs. actual spending"}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                    <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                    <DropdownMenuItem>Last 3 months</DropdownMenuItem>
                    <DropdownMenuItem>Last 6 months</DropdownMenuItem>
                    <DropdownMenuItem>Custom range...</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {getChartTypeIcon(chartType)}
                      <span className="ml-2 capitalize">{chartType} Chart</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {getAvailableChartTypes().map((type) => (
                      <DropdownMenuItem key={type} onClick={() => setChartType(type)} className="flex items-center">
                        {getChartTypeIcon(type)}
                        <span className="ml-2 capitalize">{type} Chart</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {renderChart(
                activeTab === "tasks" ? taskDistributionData : getActiveData(),
                activeTab === "tasks" && chartType !== "pie" ? "pie" : chartType,
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-xs text-muted-foreground">Data last updated: April 5, 2023</div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Interactive</Badge>
                <Badge variant="outline">Real-time</Badge>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Automatically generated insights from the data</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {activeTab === "projects" && (
                      <>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Project Completion Trend</h4>
                          <p className="text-sm text-muted-foreground">
                            Project completion rate has increased by 30% over the last 6 months.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">In-Progress Work</h4>
                          <p className="text-sm text-muted-foreground">
                            The amount of in-progress work has decreased, indicating improved throughput.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Planning Efficiency</h4>
                          <p className="text-sm text-muted-foreground">
                            Planned work has become more consistent, suggesting better planning processes.
                          </p>
                        </div>
                      </>
                    )}

                    {activeTab === "team" && (
                      <>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Productivity Increase</h4>
                          <p className="text-sm text-muted-foreground">
                            Team productivity has shown a steady increase of 12% over the last 6 weeks.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Engagement Correlation</h4>
                          <p className="text-sm text-muted-foreground">
                            There's a strong correlation between team engagement and productivity metrics.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Satisfaction Trend</h4>
                          <p className="text-sm text-muted-foreground">
                            Team satisfaction has improved by 13 points, potentially due to recent process changes.
                          </p>
                        </div>
                      </>
                    )}

                    {activeTab === "tasks" && (
                      <>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Development Focus</h4>
                          <p className="text-sm text-muted-foreground">
                            Development tasks make up 45% of all work, indicating a strong technical focus.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Design-Development Ratio</h4>
                          <p className="text-sm text-muted-foreground">
                            The ratio of design to development tasks (1:2.25) suggests a balanced approach.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Documentation Gap</h4>
                          <p className="text-sm text-muted-foreground">
                            Documentation tasks are only 8% of the total, which may indicate a potential gap.
                          </p>
                        </div>
                      </>
                    )}

                    {activeTab === "budget" && (
                      <>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Budget Adherence</h4>
                          <p className="text-sm text-muted-foreground">
                            Actual spending has remained within 5% of planned budget for most months.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Spending Trend</h4>
                          <p className="text-sm text-muted-foreground">
                            There's a consistent upward trend in both planned and actual spending.
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">February Anomaly</h4>
                          <p className="text-sm text-muted-foreground">
                            February shows under-spending compared to budget, which may warrant investigation.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Details</CardTitle>
                <CardDescription>Raw data and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium p-2">Period</th>
                        {Object.keys(getActiveData()[0])
                          .filter((key) => key !== "name")
                          .map((key) => (
                            <th key={key} className="text-left font-medium p-2 capitalize">
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getActiveData().map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.name}</td>
                          {Object.keys(item)
                            .filter((key) => key !== "name")
                            .map((key) => (
                              <td key={key} className="p-2">
                                {item[key as keyof typeof item]}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={exportChart}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DataVisualization
