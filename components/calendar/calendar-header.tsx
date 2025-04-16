"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarIcon,
  Users,
  LayoutGrid,
  List,
  Clock,
  Settings,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import the date utilities and date-fns format function
import { formatDate } from "@/lib/date-utils"
// Keep the existing import for format from date-fns if it's used for the Calendar component

export function CalendarHeader() {
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("month")
  const [open, setOpen] = useState(false)
  const [eventTitle, setEventTitle] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventStartDate, setEventStartDate] = useState<Date | undefined>(new Date())
  const [eventEndDate, setEventEndDate] = useState<Date | undefined>(new Date())
  const [eventStartTime, setEventStartTime] = useState("09:00")
  const [eventEndTime, setEventEndTime] = useState("10:00")
  const [eventProject, setEventProject] = useState("")
  const [eventCategory, setEventCategory] = useState("meeting")
  const [eventLocation, setEventLocation] = useState("")
  const [isAllDay, setIsAllDay] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringPattern, setRecurringPattern] = useState("weekly")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Sample team members
  const teamMembers = [
    { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "4", name: "Sarah Williams", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "5", name: "David Brown", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === "timeline") {
      newDate.setMonth(newDate.getMonth() - 3)
    }
    setCurrentDate(newDate)

    toast({
      title: "Calendar updated",
      description: `Viewing ${newDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    })
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (view === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === "timeline") {
      newDate.setMonth(newDate.getMonth() + 3)
    }
    setCurrentDate(newDate)

    toast({
      title: "Calendar updated",
      description: `Viewing ${newDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
    })
  }

  const navigateToday = () => {
    setCurrentDate(new Date())

    toast({
      title: "Calendar updated",
      description: "Viewing current date",
    })
  }

  const handleCreateEvent = () => {
    // Validate form
    if (!eventTitle) {
      toast({
        title: "Error",
        description: "Event title is required",
        variant: "destructive",
      })
      return
    }

    if (!eventStartDate) {
      toast({
        title: "Error",
        description: "Start date is required",
        variant: "destructive",
      })
      return
    }

    if (!eventProject) {
      toast({
        title: "Error",
        description: "Project is required",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would save the event to the database
    toast({
      title: "Success",
      description: "Event created successfully",
    })

    // Reset form and close dialog
    setEventTitle("")
    setEventDescription("")
    setEventStartDate(new Date())
    setEventEndDate(new Date())
    setEventStartTime("09:00")
    setEventEndTime("10:00")
    setEventProject("")
    setEventCategory("meeting")
    setEventLocation("")
    setIsAllDay(false)
    setIsRecurring(false)
    setRecurringPattern("weekly")
    setSelectedTeamMembers([])
    setOpen(false)
  }

  const handleSyncCalendar = () => {
    toast({
      title: "Calendar synced",
      description: "Your calendar has been synced with external calendars",
    })
  }

  const handleExportCalendar = () => {
    toast({
      title: "Calendar exported",
      description: "Your calendar has been exported to iCal format",
    })
  }

  const handleImportCalendar = () => {
    toast({
      title: "Calendar imported",
      description: "External calendar events have been imported",
    })
  }

  const toggleTeamMember = (id: string) => {
    setSelectedTeamMembers((prev) => (prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]))
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Calendar</h1>
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="w-full pl-9"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
              <SelectItem value="team">Team Schedule</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Integrations</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Calendar Integrations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Google Calendar",
                    description: "Successfully connected to Google Calendar",
                  })
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 4.8V19.2C6 19.6418 6.35817 20 6.8 20H17.2C17.6418 20 18 19.6418 18 19.2V4.8C18 4.35817 17.6418 4 17.2 4H6.8C6.35817 4 6 4.35817 6 4.8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M6 8H18" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 16H15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Google Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Outlook Calendar",
                    description: "Successfully connected to Outlook Calendar",
                  })
                }}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 4.8V19.2C6 19.6418 6.35817 20 6.8 20H17.2C17.6418 20 18 19.6418 18 19.2V4.8C18 4.35817 17.6418 4 17.2 4H6.8C6.35817 4 6 4.35817 6 4.8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M6 8H18" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 16H15" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Outlook Calendar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Calendar Settings",
                    description: "Calendar settings opened",
                  })
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Calendar Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add a new event to your calendar.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="attendees">Attendees</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="event-title">Event Title*</Label>
                      <Input
                        id="event-title"
                        placeholder="Enter event title"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea
                        id="event-description"
                        placeholder="Enter event description"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="event-location">Location</Label>
                      <Input
                        id="event-location"
                        placeholder="Enter location"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="event-category">Category</Label>
                      <Select value={eventCategory} onValueChange={setEventCategory}>
                        <SelectTrigger id="event-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="milestone">Milestone</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="event-project">Project*</Label>
                      <Select value={eventProject} onValueChange={setEventProject}>
                        <SelectTrigger id="event-project">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website Redesign</SelectItem>
                          <SelectItem value="mobile">Mobile App Development</SelectItem>
                          <SelectItem value="marketing">Marketing Campaign</SelectItem>
                          <SelectItem value="branding">Brand Refresh</SelectItem>
                          <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="all-day" checked={isAllDay} onCheckedChange={setIsAllDay} />
                    <Label htmlFor="all-day">All day event</Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Start Date*</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventStartDate ? formatDate(eventStartDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={eventStartDate} onSelect={setEventStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {!isAllDay && (
                      <div className="grid gap-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={eventStartTime}
                          onChange={(e) => setEventStartTime(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventEndDate ? formatDate(eventEndDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={eventEndDate} onSelect={setEventEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {!isAllDay && (
                      <div className="grid gap-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={eventEndTime}
                          onChange={(e) => setEventEndTime(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                      <Label htmlFor="recurring">Recurring event</Label>
                    </div>

                    {isRecurring && (
                      <div className="grid gap-2 mt-2">
                        <Label htmlFor="recurring-pattern">Recurrence Pattern</Label>
                        <Select value={recurringPattern} onValueChange={setRecurringPattern}>
                          <SelectTrigger id="recurring-pattern">
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="biweekly">Bi-weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {isRecurring && (
                      <>
                        <div className="grid gap-2 mt-2">
                          <Label htmlFor="recurring-end">Recurrence End</Label>
                          <Select defaultValue="never">
                            <SelectTrigger id="recurring-end">
                              <SelectValue placeholder="Select end type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never</SelectItem>
                              <SelectItem value="after">After occurrences</SelectItem>
                              <SelectItem value="on-date">On date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2 mt-2">
                          <Label htmlFor="recurring-exceptions">Exceptions</Label>
                          <Button variant="outline" size="sm" className="justify-start text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            Add dates to exclude
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="attendees" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <Label>Team Members</Label>
                    <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2 py-2">
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={selectedTeamMembers.includes(member.id)}
                            onCheckedChange={() => toggleTeamMember(member.id)}
                          />
                          <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 cursor-pointer">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="h-6 w-6 rounded-full"
                            />
                            {member.name}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {selectedTeamMembers.length} team members selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Checking availability",
                            description: "Finding optimal meeting times for selected team members",
                          })
                        }}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Check Availability
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="enable-notifications" defaultChecked />
                      <Label htmlFor="enable-notifications">Enable notifications</Label>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>First reminder</Label>
                          <Select defaultValue="15min">
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5min">5 minutes before</SelectItem>
                              <SelectItem value="15min">15 minutes before</SelectItem>
                              <SelectItem value="30min">30 minutes before</SelectItem>
                              <SelectItem value="1hour">1 hour before</SelectItem>
                              <SelectItem value="1day">1 day before</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label>Notification method</Label>
                          <Select defaultValue="app">
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="app">In-app notification</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add another reminder
                      </Button>

                      <div className="flex items-center space-x-2">
                        <Switch id="notify-attendees" />
                        <Label htmlFor="notify-attendees">Notify attendees of changes</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-4">
          <Button
            variant={view === "day" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => setView("day")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Day
          </Button>
          <Button
            variant={view === "week" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => setView("week")}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Week
          </Button>
          <Button
            variant={view === "month" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => setView("month")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Month
          </Button>
          <Button
            variant={view === "agenda" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => setView("agenda")}
          >
            <List className="h-4 w-4 mr-2" />
            Agenda
          </Button>
          <Button
            variant={view === "timeline" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => setView("timeline")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Timeline
          </Button>
          <Button
            variant={view === "team" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => setView("team")}
          >
            <Users className="h-4 w-4 mr-2" />
            Team
          </Button>
        </div>
      </div>
    </header>
  )
}
