"use client"

import { useState, useEffect } from "react"
import { Filter, Plus, Search, Settings, FolderKanban, List, Calendar, Clock, Grid, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

export function ProjectsHeader() {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [activeView, setActiveView] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectStatus, setProjectStatus] = useState("planning")
  const [projectDueDate, setProjectDueDate] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewMode, setViewMode<"list" | "grid" | "calendar">] = useState("grid")

  // Initialize active view based on pathname
  useEffect(() => {
    if (pathname) {
      if (pathname === "/projects") {
        setActiveView("all")
      } else {
        const segments = pathname.split("/")
        const lastSegment = segments[segments.length - 1]
        if (lastSegment && !lastSegment.includes("[")) {
          setActiveView(lastSegment)
        }
      }
    }
  }, [pathname])

  const navigateToView = (view: string) => {
    setActiveView(view)

    // Navigate to the appropriate route
    if (view === "all") {
      router.push("/projects")
    } else {
      router.push(`/projects/${view}`)
    }
  }

  const handleCreateProject = () => {
    // Validate form
    if (!projectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    if (!projectDueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would save the project to the database
    toast({
      title: "Success",
      description: "Project created successfully",
    })

    // Reset form and close dialog
    setProjectName("")
    setProjectDescription("")
    setProjectStatus("planning")
    setProjectDueDate("")
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Projects</h1>
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Projects</h4>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Status</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-all"
                        checked={filterStatus === "all"}
                        onCheckedChange={() => setFilterStatus("all")}
                      />
                      <label htmlFor="status-all" className="text-sm">
                        All
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-in-progress"
                        checked={filterStatus === "In Progress"}
                        onCheckedChange={() => setFilterStatus("In Progress")}
                      />
                      <label htmlFor="status-in-progress" className="text-sm">
                        In Progress
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-completed"
                        checked={filterStatus === "Completed"}
                        onCheckedChange={() => setFilterStatus("Completed")}
                      />
                      <label htmlFor="status-completed" className="text-sm">
                        Completed
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="status-on-hold"
                        checked={filterStatus === "On Hold"}
                        onCheckedChange={() => setFilterStatus("On Hold")}
                      />
                      <label htmlFor="status-on-hold" className="text-sm">
                        On Hold
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Due Date</h5>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This week</SelectItem>
                      <SelectItem value="this-month">This month</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Fill in the details to create a new project.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Enter project description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-status">Status</Label>
                    <Select value={projectStatus} onValueChange={setProjectStatus}>
                      <SelectTrigger id="project-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-due-date">Due Date</Label>
                    <Input
                      id="project-due-date"
                      type="date"
                      value={projectDueDate}
                      onChange={(e) => setProjectDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-4">
          <Button
            variant={activeView === "all" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("all")}
          >
            <List className="h-4 w-4 mr-2" />
            All Projects
          </Button>
          <Button
            variant={activeView === "active" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("active")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Active
          </Button>
          <Button
            variant={activeView === "completed" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("completed")}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Completed
          </Button>
          <Button
            variant={activeView === "timeline" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("timeline")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
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
    </motion.header>
  )
}
