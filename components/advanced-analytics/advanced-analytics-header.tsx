"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart2, Download, FileText, Search, PieChart, Calendar, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export function AdvancedAnalyticsHeader() {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [activeView, setActiveView] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize active view based on pathname
  useEffect(() => {
    if (pathname) {
      if (pathname === "/advanced-analytics") {
        setActiveView("dashboard")
      } else {
        const segments = pathname.split("/")
        const lastSegment = segments[segments.length - 1]
        if (lastSegment) {
          setActiveView(lastSegment)
        }
      }
    }
  }, [pathname])

  const navigateToView = (view: string) => {
    setActiveView(view)

    // Navigate to the appropriate route
    if (view === "dashboard") {
      router.push("/advanced-analytics")
    } else {
      router.push(`/advanced-analytics/${view}`)
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Advanced Analytics</h1>
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search analytics..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Export started",
                    description: "Your analytics are being exported as CSV",
                  })
                }}
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Export started",
                    description: "Your analytics are being exported as PDF",
                  })
                }}
              >
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Export started",
                    description: "Your analytics are being exported as Excel",
                  })
                }}
              >
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-4">
          <Button
            variant={activeView === "dashboard" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("dashboard")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeView === "custom-reports" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("custom-reports")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Custom Reports
          </Button>
          <Button
            variant={activeView === "visualizations" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("visualizations")}
          >
            <PieChart className="h-4 w-4 mr-2" />
            Visualizations
          </Button>
          <Button
            variant={activeView === "scheduled-reports" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("scheduled-reports")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Reports
          </Button>
          <Button
            variant={activeView === "what-if" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("what-if")}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            What-If Analysis
          </Button>
        </div>
      </div>
    </header>
  )
}
