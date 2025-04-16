"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"

interface ChartData {
  name: string
  [key: string]: string | number
}

interface ChartProps {
  title: string
  description?: string
  data: ChartData[]
  type?: "line" | "bar" | "area" | "pie"
  categories: Array<{
    name: string
    key: string
    color: string
  }>
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  allowDownload?: boolean
  allowTypeChange?: boolean
  className?: string
}

export function InteractiveChart({
  title,
  description,
  data,
  type = "line",
  categories,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  allowDownload = true,
  allowTypeChange = true,
  className,
}: ChartProps) {
  const [chartType, setChartType] = useState(type)

  const handleDownload = () => {
    // Implementation for downloading chart data
    console.log("Downloading chart data")
  }

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />}
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              {showTooltip && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-md)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                />
              )}
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              )}
              {categories.map((category) => (
                <Line
                  key={category.key}
                  type="monotone"
                  dataKey={category.key}
                  stroke={category.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  name={category.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />}
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              {showTooltip && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-md)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                />
              )}
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              )}
              {categories.map((category) => (
                <Bar
                  key={category.key}
                  dataKey={category.key}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                  name={category.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />}
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              {showTooltip && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-md)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                />
              )}
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              )}
              {categories.map((category) => (
                <Area
                  key={category.key}
                  type="monotone"
                  dataKey={category.key}
                  stroke={category.color}
                  fill={category.color}
                  fillOpacity={0.2}
                  name={category.name}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories.map((category) => ({
                  name: category.name,
                  value: data.reduce((sum, item) => sum + (Number(item[category.key]) || 0), 0),
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categories.map((category, index) => (
                  <Cell key={`cell-${index}`} fill={category.color} />
                ))}
              </Pie>
              {showTooltip && (
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-md)",
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                />
              )}
              {showLegend && (
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {allowTypeChange && (
            <Tabs value={chartType} onValueChange={setChartType} className="h-8">
              <TabsList className="h-8 p-1">
                <TabsTrigger value="line" className="h-6 px-2 text-xs">
                  Line
                </TabsTrigger>
                <TabsTrigger value="bar" className="h-6 px-2 text-xs">
                  Bar
                </TabsTrigger>
                <TabsTrigger value="area" className="h-6 px-2 text-xs">
                  Area
                </TabsTrigger>
                <TabsTrigger value="pie" className="h-6 px-2 text-xs">
                  Pie
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Refresh</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              {allowDownload && (
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}
