"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Clock,
  Search,
  Download,
  Settings,
  BarChart2,
  Calendar,
  Timer,
  Users,
  FileText,
  DollarSign,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTimeTracking } from "@/contexts/time-tracking-context"
import { NewTimeEntryDialog } from "@/components/time-tracking/new-time-entry-dialog"

export function IntegratedTimeHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeView, setActiveView] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { todayAttendance } = useTimeTracking()

  // Initialize active view based on pathname
  useState(() => {
    if (pathname) {
      if (pathname === "/time-tracking") {
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
      router.push("/time-tracking")
    } else {
      router.push(`/time-tracking/${view}`)
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Time Tracking</h1>

          {/* Show attendance status badge */}
          {todayAttendance && todayAttendance.clockInTime && (
            <div className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Clocked In
            </div>
          )}
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search time entries..."
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
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NewTimeEntryDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
      </div>

      <div className="px-4 py-2 overflow-x-auto">
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
            variant={activeView === "entries" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("entries")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Entries
          </Button>
          <Button
            variant={activeView === "calendar" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={activeView === "pomodoro" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("pomodoro")}
          >
            <Timer className="h-4 w-4 mr-2" />
            Pomodoro
          </Button>
          <Button
            variant={activeView === "assignments" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("assignments")}
          >
            <Users className="h-4 w-4 mr-2" />
            Assignments
          </Button>
          <Button
            variant={activeView === "reports" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("reports")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button
            variant={activeView === "billable" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("billable")}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Billable Hours
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
