"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, UserPlus, Clock, Calendar, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    workload: 85,
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JS",
    workload: 60,
  },
  {
    id: "3",
    name: "Alex Johnson",
    role: "Project Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    workload: 75,
  },
  {
    id: "4",
    name: "Sarah Williams",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SW",
    workload: 40,
  },
  {
    id: "5",
    name: "Michael Brown",
    role: "QA Engineer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MB",
    workload: 90,
  },
]

const projects = [
  { id: "1", name: "Website Redesign", color: "bg-blue-500" },
  { id: "2", name: "Mobile App Development", color: "bg-green-500" },
  { id: "3", name: "Marketing Campaign", color: "bg-purple-500" },
  { id: "4", name: "Database Migration", color: "bg-yellow-500" },
]

const tasks = [
  {
    id: "1",
    title: "Homepage Layout",
    project: "Website Redesign",
    assignee: "John Doe",
    assigneeId: "1",
    dueDate: "2023-09-20",
    estimatedHours: 8,
    status: "In Progress",
    priority: "High",
  },
  {
    id: "2",
    title: "User Authentication",
    project: "Mobile App Development",
    assignee: "Sarah Williams",
    assigneeId: "4",
    dueDate: "2023-09-25",
    estimatedHours: 12,
    status: "To Do",
    priority: "Medium",
  },
  {
    id: "3",
    title: "Social Media Graphics",
    project: "Marketing Campaign",
    assignee: "Jane Smith",
    assigneeId: "2",
    dueDate: "2023-09-18",
    estimatedHours: 6,
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: "4",
    title: "Contact Form",
    project: "Website Redesign",
    assignee: "John Doe",
    assigneeId: "1",
    dueDate: "2023-09-22",
    estimatedHours: 4,
    status: "To Do",
    priority: "Low",
  },
  {
    id: "5",
    title: "Schema Design",
    project: "Database Migration",
    assignee: "Michael Brown",
    assigneeId: "5",
    dueDate: "2023-09-15",
    estimatedHours: 10,
    status: "In Progress",
    priority: "High",
  },
  {
    id: "6",
    title: "API Integration",
    project: "Mobile App Development",
    assignee: null,
    assigneeId: null,
    dueDate: "2023-09-28",
    estimatedHours: 16,
    status: "To Do",
    priority: "High",
  },
]

export function AssignmentManager() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")
  const [tasksList, setTasksList] = useState(tasks)

  const handleAssignTask = (taskId: string, assigneeId: string) => {
    const updatedTasks = tasksList.map((task) => {
      if (task.id === taskId) {
        const assignee = teamMembers.find((member) => member.id === assigneeId)
        return {
          ...task,
          assignee: assignee ? assignee.name : null,
          assigneeId: assigneeId,
        }
      }
      return task
    })

    setTasksList(updatedTasks)

    const taskName = tasksList.find((task) => task.id === taskId)?.title
    const assigneeName = teamMembers.find((member) => member.id === assigneeId)?.name

    toast({
      title: "Task assigned",
      description: `"${taskName}" has been assigned to ${assigneeName}`,
    })
  }

  const handleBulkAssign = (assigneeId: string) => {
    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to assign",
        variant: "destructive",
      })
      return
    }

    const updatedTasks = tasksList.map((task) => {
      if (selectedTasks.includes(task.id)) {
        const assignee = teamMembers.find((member) => member.id === assigneeId)
        return {
          ...task,
          assignee: assignee ? assignee.name : null,
          assigneeId: assigneeId,
        }
      }
      return task
    })

    setTasksList(updatedTasks)

    const assigneeName = teamMembers.find((member) => member.id === assigneeId)?.name

    toast({
      title: "Tasks assigned",
      description: `${selectedTasks.length} tasks have been assigned to ${assigneeName}`,
    })

    setSelectedTasks([])
  }

  const toggleTaskSelection = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
    } else {
      setSelectedTasks([...selectedTasks, taskId])
    }
  }

  const selectAllTasks = () => {
    if (selectedTasks.length === tasksList.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(tasksList.map((task) => task.id))
    }
  }

  const filteredTasks = tasksList.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesProject = selectedProject
      ? task.project === projects.find((p) => p.id === selectedProject)?.name
      : true
    const matchesAssignee = selectedAssignee ? task.assigneeId === selectedAssignee : true

    return matchesSearch && matchesProject && matchesAssignee
  })

  const getWorkloadColor = (workload: number) => {
    if (workload < 50) return "bg-green-500"
    if (workload < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="workload">Team Workload</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="w-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Task Assignments</CardTitle>
                <CardDescription>Manage and assign tasks to team members</CardDescription>
              </div>

              {selectedTasks.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedTasks.length} selected</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {teamMembers.map((member) => (
                        <DropdownMenuItem key={member.id} onClick={() => handleBulkAssign(member.id)}>
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="rounded-md border w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedTasks.length === tasksList.length}
                          onCheckedChange={selectAllTasks}
                        />
                      </TableHead>
                      <TableHead className="w-[250px]">Task</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Est. Hours</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No tasks found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedTasks.includes(task.id)}
                              onCheckedChange={() => toggleTaskSelection(task.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${projects.find((p) => p.name === task.project)?.color} text-white`}
                            >
                              {task.project}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {task.assignee ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={teamMembers.find((m) => m.id === task.assigneeId)?.avatar} />
                                  <AvatarFallback>
                                    {teamMembers.find((m) => m.id === task.assigneeId)?.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{task.assignee}</span>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {task.estimatedHours}h
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                task.priority === "High"
                                  ? "destructive"
                                  : task.priority === "Medium"
                                    ? "default"
                                    : "outline"
                              }
                            >
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assign to
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="workload" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Team Workload</CardTitle>
              <CardDescription>View and manage team member workloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{member.workload}%</div>
                        <div className="text-sm text-muted-foreground">
                          {member.workload < 50 ? "Available" : member.workload < 80 ? "Busy" : "Overloaded"}
                        </div>
                      </div>
                    </div>
                    <Progress value={member.workload} className={`h-2 ${getWorkloadColor(member.workload)}`} />
                    <div className="text-sm">
                      {tasksList.filter((task) => task.assigneeId === member.id).length} assigned tasks
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workload Distribution</CardTitle>
              <CardDescription>Balance workload across team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm">
                    Some team members may be overloaded. Consider redistributing tasks to balance workload.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From (overloaded team member)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers
                          .filter((member) => member.workload >= 80)
                          .map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.workload}%)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>To (available team member)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers
                          .filter((member) => member.workload < 70)
                          .map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.workload}%)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full">Redistribute Tasks</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
