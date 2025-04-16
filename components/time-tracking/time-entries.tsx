"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Copy,
  TimerReset,
  CheckCircle,
  XCircle,
  CircleAlert,
  DollarSign,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function TimeEntries() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<{ from: Date; to: Date }>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [filterProject, setFilterProject] = useState("all")
  const [filterBillable, setFilterBillable] = useState("all")

  // Mock time entries data
  const timeEntries = [
    {
      id: "entry-1",
      date: "2025-04-05",
      project: "Website Redesign",
      task: "Frontend Development",
      description: "Implementing responsive components using Tailwind CSS",
      startTime: "09:00",
      endTime: "11:30",
      duration: "2h 30m",
      tags: ["development", "frontend"],
      billable: true,
      status: "approved",
    },
    {
      id: "entry-2",
      date: "2025-04-05",
      project: "Mobile App",
      task: "API Integration",
      description: "Integrating payment gateway API endpoints",
      startTime: "13:00",
      endTime: "15:45",
      duration: "2h 45m",
      tags: ["development", "api"],
      billable: true,
      status: "pending",
    },
    {
      id: "entry-3",
      date: "2025-04-04",
      project: "Marketing Campaign",
      task: "Strategy Meeting",
      description: "Quarterly marketing strategy planning with team",
      startTime: "10:15",
      endTime: "12:00",
      duration: "1h 45m",
      tags: ["meeting", "planning"],
      billable: false,
      status: "approved",
    },
    {
      id: "entry-4",
      date: "2025-04-04",
      project: "Website Redesign",
      task: "Styling Components",
      description: "Creating dark mode theme for components",
      startTime: "14:30",
      endTime: "17:00",
      duration: "2h 30m",
      tags: ["design", "frontend"],
      billable: true,
      status: "rejected",
    },
    {
      id: "entry-5",
      date: "2025-04-04",
      project: "Internal",
      task: "Team Check-in",
      description: "Weekly team sync meeting to discuss progress",
      startTime: "17:15",
      endTime: "18:00",
      duration: "0h 45m",
      tags: ["meeting", "internal"],
      billable: false,
      status: "approved",
    },
    {
      id: "entry-6",
      date: "2025-04-03",
      project: "Data Migration",
      task: "Database Schema Design",
      description: "Designing new schema for customer data migration",
      startTime: "09:30",
      endTime: "11:45",
      duration: "2h 15m",
      tags: ["database", "architecture"],
      billable: true,
      status: "approved",
    },
    {
      id: "entry-7",
      date: "2025-04-03",
      project: "Mobile App",
      task: "Bug Fixes",
      description: "Fixing UI issues on Android devices",
      startTime: "13:30",
      endTime: "16:00",
      duration: "2h 30m",
      tags: ["bug", "android"],
      billable: true,
      status: "pending",
    },
  ]

  const handleSelectAllEntries = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(timeEntries.map((entry) => entry.id))
    } else {
      setSelectedEntries([])
    }
  }

  const handleSelectEntry = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEntries((prev) => [...prev, id])
    } else {
      setSelectedEntries((prev) => prev.filter((entryId) => entryId !== id))
    }
  }

  const handleDeleteSelected = () => {
    toast({
      title: "Entries deleted",
      description: `${selectedEntries.length} time ${selectedEntries.length === 1 ? "entry" : "entries"} deleted successfully.`,
    })
    setSelectedEntries([])
    setIsDeleteDialogOpen(false)
  }

  const totalHours = timeEntries.reduce((total, entry) => {
    const [hours, minutes] = entry.duration.split("h ").map((part) => Number.parseInt(part.replace("m", "").trim()))
    return total + hours + minutes / 60
  }, 0)

  const billableHours = timeEntries
    .filter((entry) => entry.billable)
    .reduce((total, entry) => {
      const [hours, minutes] = entry.duration.split("h ").map((part) => Number.parseInt(part.replace("m", "").trim()))
      return total + hours + minutes / 60
    }, 0)

  const filteredEntries = timeEntries.filter((entry) => {
    const matchesSearch =
      entry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesProject = filterProject === "all" || entry.project === filterProject

    const matchesBillable =
      filterBillable === "all" ||
      (filterBillable === "billable" && entry.billable) ||
      (filterBillable === "non-billable" && !entry.billable)

    return matchesSearch && matchesProject && matchesBillable
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <CircleAlert className="h-4 w-4 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Time Entries</h2>
          <p className="text-muted-foreground">View and manage your tracked time across projects.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button variant="default" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="project-filter">Project</Label>
                <Select value={filterProject} onValueChange={setFilterProject}>
                  <SelectTrigger id="project-filter">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                    <SelectItem value="Data Migration">Data Migration</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <DatePickerWithRange date={selectedDate} setDate={setSelectedDate} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billable-filter">Billable Status</Label>
                <Select value={filterBillable} onValueChange={setFilterBillable}>
                  <SelectTrigger id="billable-filter">
                    <SelectValue placeholder="Billable status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Entries</SelectItem>
                    <SelectItem value="billable">Billable Only</SelectItem>
                    <SelectItem value="non-billable">Non-Billable Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setFilterProject("all")
                    setFilterBillable("all")
                    setSelectedDate({
                      from: addDays(new Date(), -7),
                      to: new Date(),
                    })
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">{timeEntries.length} entries in selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Billable Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billableHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((billableHours / totalHours) * 100)}% of total time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalHours / 5).toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Based on 5 working days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search entries by project, task, or tags..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="table" className="w-auto">
          <TabsList>
            <TabsTrigger value="table">
              <Clock className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="table" className="w-full">
            <TabsContent value="table" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedEntries.length === timeEntries.length}
                        onCheckedChange={handleSelectAllEntries}
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Project / Task</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No time entries match your search or filter criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedEntries.includes(entry.id)}
                            onCheckedChange={(checked) => handleSelectEntry(entry.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>
                          <div className="font-medium flex items-center gap-1">
                            {entry.project}
                            {entry.billable && <DollarSign className="h-3 w-3 text-green-500" />}
                            {getStatusIcon(entry.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">{entry.task}</div>
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          <div className="font-medium">{entry.duration}</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.startTime} - {entry.endTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <TimerReset className="h-4 w-4 mr-2" />
                                Continue Timing
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedEntries([entry.id])
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="calendar" className="m-0">
              <div className="p-6 text-center text-muted-foreground">
                Calendar view is not implemented in this preview
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedEntries.length > 0 && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-background border rounded-lg shadow-lg p-4">
          <span className="text-sm font-medium">{selectedEntries.length} entries selected</span>
          <Button variant="outline" size="sm" onClick={() => setSelectedEntries([])}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Time Entries</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEntries.length} time{" "}
              {selectedEntries.length === 1 ? "entry" : "entries"}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
