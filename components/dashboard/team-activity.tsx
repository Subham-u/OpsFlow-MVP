"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageSquare, RefreshCw, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type ActivityType = "all" | "task" | "comment" | "file" | "project" | "mention"
type ActivityPeriod = "today" | "yesterday" | "week" | "month"

type Activity = {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: string
  target: string
  project: string
  time: string
  type: ActivityType
  liked: boolean
  likes: number
  comments: number
  isNew: boolean
}

export function TeamActivity() {
  const { toast } = useToast()
  const [activityType, setActivityType] = useState<ActivityType>("all")
  const [activityPeriod, setActivityPeriod] = useState<ActivityPeriod>("week")
  const [expandedActivities, setExpandedActivities] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<string[]>(["all"])
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      action: "completed task",
      target: "Design homepage wireframes",
      project: "Website Redesign",
      time: "2 hours ago",
      type: "task",
      liked: false,
      likes: 3,
      comments: 2,
      isNew: true,
    },
    {
      id: "2",
      user: {
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "BS",
      },
      action: "commented on",
      target: "User Flow Diagram",
      project: "Mobile App Development",
      time: "3 hours ago",
      type: "comment",
      liked: true,
      likes: 5,
      comments: 4,
      isNew: true,
    },
    {
      id: "3",
      user: {
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "CD",
      },
      action: "created task",
      target: "Implement authentication",
      project: "Mobile App Development",
      time: "5 hours ago",
      type: "task",
      liked: false,
      likes: 0,
      comments: 0,
      isNew: true,
    },
    {
      id: "4",
      user: {
        name: "Dana Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DW",
      },
      action: "uploaded file",
      target: "Brand Guidelines.pdf",
      project: "Marketing Campaign",
      time: "Yesterday",
      type: "file",
      liked: false,
      likes: 2,
      comments: 1,
      isNew: false,
    },
    {
      id: "5",
      user: {
        name: "Eric Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "EB",
      },
      action: "assigned task to",
      target: "Fiona Green",
      project: "Website Redesign",
      time: "Yesterday",
      type: "task",
      liked: false,
      likes: 1,
      comments: 0,
      isNew: false,
    },
    {
      id: "6",
      user: {
        name: "Fiona Green",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "FG",
      },
      action: "mentioned you in",
      target: "Weekly Status Update",
      project: "Marketing Campaign",
      time: "2 days ago",
      type: "mention",
      liked: true,
      likes: 4,
      comments: 7,
      isNew: false,
    },
    {
      id: "7",
      user: {
        name: "Greg Harris",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "GH",
      },
      action: "created project",
      target: "Q4 Marketing Strategy",
      project: "Marketing Campaign",
      time: "3 days ago",
      type: "project",
      liked: false,
      likes: 8,
      comments: 3,
      isNew: false,
    },
  ])

  // Filter activities based on selected filters
  const filteredActivities = activities.filter((activity) => {
    // Filter by type
    if (activityType !== "all" && activity.type !== activityType) return false

    // Filter by new status
    if (showOnlyNew && !activity.isNew) return false

    // Filter by project
    if (selectedProjects.includes("all")) return true
    return selectedProjects.includes(activity.project)

    return true
  })

  // Get unique projects
  const uniqueProjects = Array.from(new Set(activities.map((a) => a.project)))

  // Toggle activity expansion
  const toggleActivityExpansion = (id: string) => {
    setExpandedActivities((prev) => (prev.includes(id) ? prev.filter((actId) => actId !== id) : [...prev, id]))
  }

  // Toggle like on activity
  const toggleLike = (id: string) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.id === id) {
          const newLiked = !activity.liked
          return {
            ...activity,
            liked: newLiked,
            likes: newLiked ? activity.likes + 1 : activity.likes - 1,
          }
        }
        return activity
      }),
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setActivities((prev) =>
      prev.map((activity) => ({
        ...activity,
        isNew: false,
      })),
    )

    toast({
      title: "All activities marked as read",
    })
  }

  // Refresh activities
  const refreshActivities = () => {
    toast({
      title: "Activities refreshed",
    })
  }

  // Toggle project selection
  const toggleProjectSelection = (project: string) => {
    if (project === "all") {
      setSelectedProjects(["all"])
      return
    }

    setSelectedProjects((prev) => {
      // Remove "all" from selection
      const withoutAll = prev.filter((p) => p !== "all")

      // Toggle the selected project
      const newSelection = withoutAll.includes(project)
        ? withoutAll.filter((p) => p !== project)
        : [...withoutAll, project]

      // If nothing is selected, default to "all"
      return newSelection.length === 0 ? ["all"] : newSelection
    })
  }

  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Team Activity</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={activityPeriod} onValueChange={(value) => setActivityPeriod(value as ActivityPeriod)}>
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="ghost" size="icon" onClick={refreshActivities}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Activity Type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={activityType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityType("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={activityType === "task" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityType("task")}
                    >
                      Tasks
                    </Button>
                    <Button
                      variant={activityType === "comment" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityType("comment")}
                    >
                      Comments
                    </Button>
                    <Button
                      variant={activityType === "file" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityType("file")}
                    >
                      Files
                    </Button>
                    <Button
                      variant={activityType === "project" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityType("project")}
                    >
                      Projects
                    </Button>
                    <Button
                      variant={activityType === "mention" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityType("mention")}
                    >
                      Mentions
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Projects</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="project-all"
                        checked={selectedProjects.includes("all")}
                        onCheckedChange={() => toggleProjectSelection("all")}
                      />
                      <Label htmlFor="project-all">All Projects</Label>
                    </div>
                    {uniqueProjects.map((project) => (
                      <div key={project} className="flex items-center space-x-2">
                        <Checkbox
                          id={`project-${project}`}
                          checked={selectedProjects.includes(project)}
                          onCheckedChange={() => toggleProjectSelection(project)}
                          disabled={selectedProjects.includes("all")}
                        />
                        <Label htmlFor={`project-${project}`}>{project}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-only-new"
                    checked={showOnlyNew}
                    onCheckedChange={(checked) => setShowOnlyNew(!!checked)}
                  />
                  <Label htmlFor="show-only-new">Show only new activities</Label>
                </div>

                <div className="flex justify-between pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActivityType("all")
                      setSelectedProjects(["all"])
                      setShowOnlyNew(false)
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="px-2 overflow-visible">
        <div className="space-y-4 overflow-visible">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  "flex flex-col space-y-2 rounded-lg border p-3 transition-all overflow-visible",
                  activity.isNew && "bg-muted/30 border-l-4 border-l-primary",
                )}
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-8">
                        <p className="text-sm break-words">
                          <span className="font-medium">{activity.user.name}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>{" "}
                          <span className="font-medium">{activity.target}</span>{" "}
                          <span className="text-muted-foreground">in</span>{" "}
                          <span className="font-medium">{activity.project}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                          {activity.time}
                          {activity.isNew && (
                            <Badge variant="default" className="ml-2 h-5 text-[10px]">
                              New
                            </Badge>
                          )}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => toggleActivityExpansion(activity.id)}
                      >
                        {expandedActivities.includes(activity.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {expandedActivities.includes(activity.id) && (
                      <div className="mt-3 space-y-3">
                        <div className="rounded-md bg-muted p-3 text-sm">
                          <p>
                            Additional details about this activity would appear here. This could include the full
                            comment text, file preview, task details, or other relevant information.
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 flex items-center gap-1"
                              onClick={() => toggleLike(activity.id)}
                            >
                              <ThumbsUp className={cn("h-4 w-4", activity.liked ? "fill-primary text-primary" : "")} />
                              <span>{activity.likes}</span>
                            </Button>

                            <Button variant="ghost" size="sm" className="h-8 px-2 flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{activity.comments}</span>
                            </Button>
                          </div>

                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No activities found matching your filters</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-6 py-4 border-t">
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
        <Button variant="outline" size="sm">
          View all activity
        </Button>
      </CardFooter>
    </Card>
  )
}
