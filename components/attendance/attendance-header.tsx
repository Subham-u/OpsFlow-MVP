"use client"

import { useState } from "react"
import { Search, UserCheck, Calendar, BarChart2, FileText, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function AttendanceHeader() {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [activeView, setActiveView] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize active view based on pathname
  useState(() => {
    if (pathname) {
      if (pathname === "/attendance") {
        setActiveView("dashboard")
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
    if (view === "dashboard") {
      router.push("/attendance")
    } else {
      router.push(`/attendance/${view}`)
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Attendance</h1>
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search attendance records..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              toast({
                title: "Attendance report exported",
                description: "The attendance report has been exported to CSV",
              })
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export Report
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
            <UserCheck className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeView === "team" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("team")}
          >
            <Users className="h-4 w-4 mr-2" />
            Team Attendance
          </Button>
          <Button
            variant={activeView === "calendar" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button
            variant={activeView === "reports" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("reports")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Reports
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
