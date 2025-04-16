"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import { Bell, Plus, Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { LayoutDashboard, Settings } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/contexts/user-context"

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "task" | "mention" | "project" | "system"
}

type FilterPeriod = "today" | "week" | "month" | "all"

export function DashboardHeader() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New task assigned to you",
      description: "Marketing Campaign - Design Banner",
      time: "2 hours ago",
      read: false,
      type: "task",
    },
    {
      id: "2",
      title: "You were mentioned in a comment",
      description: "Website Redesign - Homepage Mockup",
      time: "3 hours ago",
      read: false,
      type: "mention",
    },
    {
      id: "3",
      title: "Project deadline approaching",
      description: "Mobile App Development - Due in 2 days",
      time: "5 hours ago",
      read: true,
      type: "project",
    },
    {
      id: "4",
      title: "Team meeting scheduled",
      description: "Weekly Sprint Planning - Tomorrow at 10:00 AM",
      time: "Yesterday",
      read: true,
      type: "system",
    },
    {
      id: "5",
      title: "New comment on your task",
      description: "Website Redesign - Navigation Component",
      time: "2 days ago",
      read: true,
      type: "mention",
    },
  ])

  const [notificationFilter, setNotificationFilter] = useState<string>("all")
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false)
  const [quickTask, setQuickTask] = useState({
    title: "",
    description: "",
    project: "Website Redesign",
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0],
  })
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeView, setActiveView] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false)

  // Initialize active view based on pathname
  useState(() => {
    if (pathname) {
      if (pathname === "/dashboard") {
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
      router.push("/dashboard")
    } else {
      router.push(`/dashboard/${view}`)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter((notification) => {
    if (notificationFilter === "all") return true
    return notification.type === notificationFilter
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All notifications marked as read",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    toast({
      title: "Notification removed",
    })
  }

  const createQuickTask = () => {
    if (!quickTask.title) {
      toast({
        title: "Task title is required",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would save this to a database
    const newTask = {
      ...quickTask,
      id: `task-${Date.now()}`,
      assignedTo: user?.id || "unassigned",
      createdBy: user?.id || "unknown",
      createdAt: new Date().toISOString(),
    }

    toast({
      title: "Task created successfully",
      description: quickTask.title,
    })

    // Reset form
    setQuickTask({
      title: "",
      description: "",
      project: "Website Redesign",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0],
    })

    setIsQuickTaskOpen(false)
  }

  const getFilterLabel = () => {
    switch (filterPeriod) {
      case "today":
        return "Today"
      case "week":
        return "This Week"
      case "month":
        return "This Month"
      case "all":
        return "All Time"
      default:
        return "Filter"
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Time Period Filter */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {getFilterLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Filter Dashboard</h4>
                <Tabs
                  defaultValue={filterPeriod}
                  value={filterPeriod}
                  onValueChange={(value) => {
                    setFilterPeriod(value as FilterPeriod)
                    setIsFilterOpen(false)
                    toast({
                      title: `Dashboard filtered to show ${value === "all" ? "all time" : value} data`,
                    })
                  }}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 gap-1 mb-2">
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-2 gap-1">
                    <TabsTrigger value="month">This Month</TabsTrigger>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </PopoverContent>
          </Popover>

          {/* Notification Center */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px] max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-2">
                <DropdownMenuLabel className="px-0">Notifications</DropdownMenuLabel>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Filter className="h-3 w-3 mr-1" />
                        <span className="sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuRadioGroup value={notificationFilter} onValueChange={setNotificationFilter}>
                        <DropdownMenuRadioItem value="all">All notifications</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="task">Tasks</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="mention">Mentions</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="project">Projects</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Settings className="h-3 w-3" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[60vh] overflow-auto">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start p-3 hover:bg-muted/50 relative group",
                        !notification.read && "bg-muted/30",
                      )}
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => markAsRead(notification.id)}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{notification.title}</span>
                          {!notification.read && <Badge variant="default" className="h-1.5 w-1.5 rounded-full p-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute top-2 right-2"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <p>No notifications found</p>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center">View all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
