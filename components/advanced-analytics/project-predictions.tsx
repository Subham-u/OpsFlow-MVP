"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "@/components/ui/chart"
import { Download, HelpCircle, Info, RefreshCw, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

// Sample data
const projectCompletionData = [
  { month: "Jan", actual: 30, predicted: 32, lower: 28, upper: 36 },
  { month: "Feb", actual: 45, predicted: 44, lower: 40, upper: 48 },
  { month: "Mar", actual: 60, predicted: 58, lower: 54, upper: 62 },
  { month: "Apr", actual: 70, predicted: 72, lower: 68, upper: 76 },
  { month: "May", actual: 85, predicted: 86, lower: 82, upper: 90 },
  { month: "Jun", actual: null, predicted: 95, lower: 91, upper: 99 },
  { month: "Jul", actual: null, predicted: 100, lower: 96, upper: 100 },
]

const resourceForecastData = [
  { month: "Jan", development: 45, design: 30, qa: 15, management: 10 },
  { month: "Feb", development: 50, design: 35, qa: 20, management: 10 },
  { month: "Mar", development: 60, design: 40, qa: 25, management: 15 },
  { month: "Apr", development: 70, design: 45, qa: 30, management: 15 },
  { month: "May", development: 65, design: 40, qa: 35, management: 15 },
  { month: "Jun", development: 60, design: 35, qa: 30, management: 15 },
  { month: "Jul", development: 55, design: 30, qa: 25, management: 15 },
]

const budgetForecastData = [
  { month: "Jan", actual: 25000, predicted: 26000, lower: 24000, upper: 28000 },
  { month: "Feb", actual: 35000, predicted: 34000, lower: 32000, upper: 36000 },
  { month: "Mar", actual: 40000, predicted: 42000, lower: 39000, upper: 45000 },
  { month: "Apr", actual: 45000, predicted: 46000, lower: 43000, upper: 49000 },
  { month: "May", actual: 50000, predicted: 51000, lower: 48000, upper: 54000 },
  { month: "Jun", actual: null, predicted: 55000, lower: 52000, upper: 58000 },
  { month: "Jul", actual: null, predicted: 60000, lower: 57000, upper: 63000 },
]

export function ProjectPredictions() {
  const [confidenceLevel, setConfidenceLevel] = useState(80)
  const [selectedProject, setSelectedProject] = useState("all")

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Predictions</h2>
          <p className="text-muted-foreground">AI-powered forecasts and predictions for project outcomes</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="project-a">Project A</SelectItem>
              <SelectItem value="project-b">Project B</SelectItem>
              <SelectItem value="project-c">Project C</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <Slider
              value={[confidenceLevel]}
              min={50}
              max={99}
              step={1}
              onValueChange={(value) => setConfidenceLevel(value[0])}
              className="w-[100px]"
            />
            <span className="text-sm font-medium">{confidenceLevel}%</span>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Project Completion</CardTitle>
              <Badge variant="outline" className="font-normal">
                Prediction
              </Badge>
            </div>
            <CardDescription>Predicted completion timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Expected by July 15, 2025</p>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="font-medium text-green-500">On track</span>
              <span className="ml-1 text-muted-foreground">(2 days ahead of schedule)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Budget Forecast</CardTitle>
              <Badge variant="outline" className="font-normal">
                Prediction
              </Badge>
            </div>
            <CardDescription>Predicted budget utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$60,000</div>
            <p className="text-xs text-muted-foreground">Total projected cost</p>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="mr-1 h-4 w-4 text-amber-500" />
              <span className="font-medium text-amber-500">Caution</span>
              <span className="ml-1 text-muted-foreground">(5% over initial budget)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Resource Needs</CardTitle>
              <Badge variant="outline" className="font-normal">
                Prediction
              </Badge>
            </div>
            <CardDescription>Predicted resource requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">-15%</div>
            <p className="text-xs text-muted-foreground">Resource reduction trend</p>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="mr-1 h-4 w-4 text-green-500" />
              <span className="font-medium text-green-500">Optimizing</span>
              <span className="ml-1 text-muted-foreground">(Resource efficiency improving)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Completion Forecast</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <CardDescription className="flex items-center">
            Project completion trajectory with confidence intervals
            <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectCompletionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="upper"
                  stackId="1"
                  stroke="transparent"
                  fill="#60a5fa"
                  fillOpacity={0.2}
                  name="Upper Bound"
                />
                <Area
                  type="monotone"
                  dataKey="lower"
                  stackId="2"
                  stroke="transparent"
                  fill="#60a5fa"
                  fillOpacity={0.2}
                  name="Lower Bound"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  name="Predicted"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                  name="Actual"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="mr-2 h-4 w-4" />
            Shaded area represents the {confidenceLevel}% confidence interval for predictions
          </div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resource Forecast</CardTitle>
            <CardDescription>Predicted resource allocation over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="development" stackId="a" fill="#60a5fa" name="Development" />
                  <Bar dataKey="design" stackId="a" fill="#4ade80" name="Design" />
                  <Bar dataKey="qa" stackId="a" fill="#f59e0b" name="QA" />
                  <Bar dataKey="management" stackId="a" fill="#8884d8" name="Management" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Forecast</CardTitle>
            <CardDescription>Predicted budget utilization over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={budgetForecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stackId="1"
                    stroke="transparent"
                    fill="#f87171"
                    fillOpacity={0.2}
                    name="Upper Bound"
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stackId="2"
                    stroke="transparent"
                    fill="#f87171"
                    fillOpacity={0.2}
                    name="Lower Bound"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#f87171"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                    name="Predicted"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                    name="Actual"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
