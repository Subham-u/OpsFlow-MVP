"use client"

import { useState } from "react"
import { BarChart2, Download, Filter, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function AnalyticsHeader() {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [activeView, setActiveView] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize active view based on pathname
  useState(() => {
    if (pathname) {
      if (pathname === "/analytics") {
        setActiveView("overview")
      } else {
        const segments = pathname.split("/")
        const lastSegment = segments[segments.length - 1]
        if (lastSegment) {
          setActiveView(lastSegment)
        }
      }
    }
  })

  const navigateToView = (view: string) => {
    setActiveView(view)

    // Navigate to the appropriate route
    if (view === "overview") {
      router.push("/analytics")
    } else {
      router.push(`/analytics/${view}`)
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Analytics</h1>
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
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-4">
          <Button
            variant={activeView === "overview" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("overview")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeView === "projects" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("projects")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Projects
          </Button>
          <Button
            variant={activeView === "team" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("team")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Team
          </Button>
          <Button
            variant={activeView === "financial" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("financial")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Financial
          </Button>
          <Button
            variant={activeView === "settings" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </header>
  )
}
