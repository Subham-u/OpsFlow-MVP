"use client"

import type React from "react"

import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  FileWarning,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart,
  Calendar,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type StatPeriod = "day" | "week" | "month" | "quarter"

type Stat = {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
  percentage: number
  icon: React.ElementType
  color: string
}

export function DashboardStats() {
  const { toast } = useToast()
  const [period, setPeriod] = useState<StatPeriod>("week")
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null)
  const [isExportOpen, setIsExportOpen] = useState(false)

  // Stats data for different time periods
  const statsByPeriod: Record<StatPeriod, Stat[]> = {
    day: [
      {
        title: "Active Projects",
        value: "8",
        change: "+1",
        trend: "up",
        percentage: 14.3,
        icon: FileWarning,
        color: "text-blue-500",
      },
      {
        title: "Team Members",
        value: "24",
        change: "0",
        trend: "neutral",
        percentage: 0,
        icon: Users,
        color: "text-indigo-500",
      },
      {
        title: "Completed Tasks",
        value: "12",
        change: "+5",
        trend: "up",
        percentage: 71.4,
        icon: CheckCircle2,
        color: "text-green-500",
      },
      {
        title: "Hours Logged",
        value: "32",
        change: "-4",
        trend: "down",
        percentage: 11.1,
        icon: Clock,
        color: "text-orange-500",
      },
    ],
    week: [
      {
        title: "Active Projects",
        value: "12",
        change: "+2",
        trend: "up",
        percentage: 20,
        icon: FileWarning,
        color: "text-blue-500",
      },
      {
        title: "Team Members",
        value: "24",
        change: "+3",
        trend: "up",
        percentage: 14.3,
        icon: Users,
        color: "text-indigo-500",
      },
      {
        title: "Completed Tasks",
        value: "128",
        change: "+28",
        trend: "up",
        percentage: 28,
        icon: CheckCircle2,
        color: "text-green-500",
      },
      {
        title: "Hours Logged",
        value: "284",
        change: "+12",
        trend: "up",
        percentage: 4.4,
        icon: Clock,
        color: "text-orange-500",
      },
    ],
    month: [
      {
        title: "Active Projects",
        value: "15",
        change: "+5",
        trend: "up",
        percentage: 50,
        icon: FileWarning,
        color: "text-blue-500",
      },
      {
        title: "Team Members",
        value: "28",
        change: "+6",
        trend: "up",
        percentage: 27.3,
        icon: Users,
        color: "text-indigo-500",
      },
      {
        title: "Completed Tasks",
        value: "342",
        change: "+86",
        trend: "up",
        percentage: 33.6,
        icon: CheckCircle2,
        color: "text-green-500",
      },
      {
        title: "Hours Logged",
        value: "876",
        change: "+124",
        trend: "up",
        percentage: 16.5,
        icon: Clock,
        color: "text-orange-500",
      },
    ],
    quarter: [
      {
        title: "Active Projects",
        value: "24",
        change: "+8",
        trend: "up",
        percentage: 50,
        icon: FileWarning,
        color: "text-blue-500",
      },
      {
        title: "Team Members",
        value: "32",
        change: "+8",
        trend: "up",
        percentage: 33.3,
        icon: Users,
        color: "text-indigo-500",
      },
      {
        title: "Completed Tasks",
        value: "1024",
        change: "+256",
        trend: "up",
        percentage: 33.3,
        icon: CheckCircle2,
        color: "text-green-500",
      },
      {
        title: "Hours Logged",
        value: "2450",
        change: "+350",
        trend: "up",
        percentage: 16.7,
        icon: Clock,
        color: "text-orange-500",
      },
    ],
  }

  const stats = statsByPeriod[period]

  const handleStatClick = (stat: Stat) => {
    setSelectedStat(stat)
    setIsDetailsOpen(true)
  }

  const exportStats = (format: string) => {
    toast({
      title: "Statistics exported",
      description: `Your stats have been exported in ${format} format`,
    })
    setIsExportOpen(false)
  }

  const getTrendIcon = (trend: Stat["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const getTrendColor = (trend: Stat["trend"]) => {
    switch (trend) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4 overflow-visible">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Statistics Overview</h2>
        <div className="flex items-center gap-2">
          <Tabs value={period} onValueChange={(value) => setPeriod(value as StatPeriod)} className="mr-2">
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}>
            <BarChart className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Fix the stats cards to prevent overflow and improve responsiveness */}
      {/* Update the stats cards to handle long text better */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 overflow-visible">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="hover:shadow-md transition-shadow cursor-pointer overflow-visible"
            onClick={() => handleStatClick(stat)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium truncate">{stat.title}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center bg-opacity-20 ${stat.color.replace("text-", "bg-")} shrink-0`}
                    >
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click for details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {getTrendIcon(stat.trend)}
                <span className={`ml-1 ${getTrendColor(stat.trend)}`}>{stat.change}</span>
                <span className="ml-1 text-muted-foreground truncate">from last {period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stat Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedStat && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <selectedStat.icon className={`h-5 w-5 ${selectedStat.color}`} />
                  {selectedStat.title} Details
                </DialogTitle>
                <DialogDescription>Detailed statistics for the current {period}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Current Value</Label>
                    <p className="text-2xl font-bold">{selectedStat.value}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Change</Label>
                    <p className={`text-2xl font-bold flex items-center ${getTrendColor(selectedStat.trend)}`}>
                      {selectedStat.change}
                      <span className="text-sm ml-1">({selectedStat.percentage}%)</span>
                    </p>
                  </div>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Historical Data</h4>
                    <Select defaultValue="7days">
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="year">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="h-40 flex items-center justify-center border rounded bg-card">
                    <p className="text-muted-foreground">Historical chart would appear here</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Related Metrics</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span>Productivity Rate</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        <span>Time Distribution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Team Performance</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedStat.trend === "up"
                        ? `Your ${selectedStat.title.toLowerCase()} have increased by ${selectedStat.percentage}% compared to last ${period}.`
                        : selectedStat.trend === "down"
                          ? `Your ${selectedStat.title.toLowerCase()} have decreased by ${selectedStat.percentage}% compared to last ${period}.`
                          : `Your ${selectedStat.title.toLowerCase()} have remained stable compared to last ${period}.`}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailsOpen(false)
                    setIsExportOpen(true)
                  }}
                >
                  Export Data
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Statistics</DialogTitle>
            <DialogDescription>Choose a format to export your statistics data.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => exportStats("PDF")}>
                  PDF Document
                </Button>
                <Button variant="outline" onClick={() => exportStats("Excel")}>
                  Excel Spreadsheet
                </Button>
                <Button variant="outline" onClick={() => exportStats("CSV")}>
                  CSV File
                </Button>
                <Button variant="outline" onClick={() => exportStats("JSON")}>
                  JSON Data
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Data to Include</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="current-period" defaultChecked />
                  <label htmlFor="current-period" className="text-sm">
                    Current period data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="historical" defaultChecked />
                  <label htmlFor="historical" className="text-sm">
                    Historical data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="charts" defaultChecked />
                  <label htmlFor="charts" className="text-sm">
                    Include charts and visualizations
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="insights" defaultChecked />
                  <label htmlFor="insights" className="text-sm">
                    Include AI-generated insights
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => exportStats("PDF")}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
