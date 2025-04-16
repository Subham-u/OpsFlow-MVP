"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  Star,
  StarOff,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  Share2,
  Archive,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CardWrapper } from "@/components/ui/card-wrapper"

type Project = {
  id: string
  name: string
  progress: number
  status: string
  dueDate: string
  members: { name: string; image: string }[]
  description: string
  starred: boolean
  tasks: {
    total: number
    completed: number
  }
  health: "on-track" | "at-risk" | "delayed"
  client?: string
}

export function RecentProjects() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of the company website with new branding and improved UX",
      progress: 75,
      status: "In Progress",
      dueDate: "Aug 15, 2023",
      starred: true,
      health: "on-track",
      tasks: {
        total: 24,
        completed: 18,
      },
      members: [
        { name: "Alex", image: "/placeholder.svg?height=32&width=32" },
        { name: "Beth", image: "/placeholder.svg?height=32&width=32" },
        { name: "Carl", image: "/placeholder.svg?height=32&width=32" },
      ],
      client: "Acme Inc.",
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Creating a new mobile application for both iOS and Android platforms",
      progress: 45,
      status: "In Progress",
      dueDate: "Sep 20, 2023",
      starred: false,
      health: "at-risk",
      tasks: {
        total: 32,
        completed: 14,
      },
      members: [
        { name: "Dana", image: "/placeholder.svg?height=32&width=32" },
        { name: "Eric", image: "/placeholder.svg?height=32&width=32" },
      ],
      client: "TechStart LLC",
    },
    {
      id: "3",
      name: "Marketing Campaign",
      description: "Q3 marketing campaign for product launch including social media and email",
      progress: 90,
      status: "Almost Done",
      dueDate: "Aug 5, 2023",
      starred: false,
      health: "delayed",
      tasks: {
        total: 18,
        completed: 16,
      },
      members: [
        { name: "Fiona", image: "/placeholder.svg?height=32&width=32" },
        { name: "Greg", image: "/placeholder.svg?height=32&width=32" },
        { name: "Helen", image: "/placeholder.svg?height=32&width=32" },
        { name: "Ian", image: "/placeholder.svg?height=32&width=32" },
      ],
    },
  ])

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const toggleStar = (id: string) => {
    setProjects((prev) =>
      prev.map((project) => (project.id === id ? { ...project, starred: !project.starred } : project)),
    )

    const project = projects.find((p) => p.id === id)
    toast({
      title: project?.starred ? "Project removed from favorites" : "Project added to favorites",
    })
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setIsEditDialogOpen(true)
  }

  const saveProjectChanges = () => {
    if (!editingProject) return

    setProjects((prev) => prev.map((project) => (project.id === editingProject.id ? editingProject : project)))

    setIsEditDialogOpen(false)
    setEditingProject(null)

    toast({
      title: "Project updated successfully",
    })
  }

  const confirmDeleteProject = (id: string) => {
    setProjectToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const deleteProject = () => {
    if (!projectToDelete) return

    setProjects((prev) => prev.filter((project) => project.id !== projectToDelete))
    setIsDeleteDialogOpen(false)
    setProjectToDelete(null)

    toast({
      title: "Project deleted successfully",
    })
  }

  const duplicateProject = (id: string) => {
    const projectToDuplicate = projects.find((p) => p.id === id)
    if (!projectToDuplicate) return

    const newProject = {
      ...projectToDuplicate,
      id: `${Date.now()}`,
      name: `${projectToDuplicate.name} (Copy)`,
      starred: false,
    }

    setProjects((prev) => [...prev, newProject])

    toast({
      title: "Project duplicated successfully",
      description: newProject.name,
    })
  }

  const getHealthIcon = (health: Project["health"]) => {
    switch (health) {
      case "on-track":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "at-risk":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getHealthText = (health: Project["health"]) => {
    switch (health) {
      case "on-track":
        return "On Track"
      case "at-risk":
        return "At Risk"
      case "delayed":
        return "Delayed"
    }
  }

  return (
    <CardWrapper
      title="Recent Projects"
      headerAction={
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">View all</Link>
        </Button>
      }
      contentClassName="px-2 overflow-visible"
      className="col-span-1 overflow-visible"
    >
      <div className="space-y-4 overflow-visible">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col space-y-2 rounded-lg border p-3 transition-all hover:shadow-md overflow-visible"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => toggleStar(project.id)}
                      >
                        {project.starred ? (
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ) : (
                          <StarOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{project.starred ? "Unstar" : "Star"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{project.starred ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link href={`/projects/${project.id}`} className="font-medium hover:underline truncate">
                  {project.name}
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditProject(project)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateProject(project.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => confirmDeleteProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {project.description && <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {getHealthIcon(project.health)}
                <span>{getHealthText(project.health)}</span>
              </div>
              <span className="truncate">Due {project.dueDate}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member, i) => (
                  <Avatar key={i} className="h-7 w-7 border-2 border-background">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 3 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>
                    {project.tasks.completed}/{project.tasks.total}
                  </span>
                </div>

                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                          <Link href={`/projects/${project.id}/tasks`}>
                            <Plus className="h-3.5 w-3.5" />
                            <span className="sr-only">Add task</span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add task</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                          <Link href={`/projects/${project.id}`}>
                            <Users className="h-3.5 w-3.5" />
                            <span className="sr-only">View team</span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View team</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Make changes to your project here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-status">Status</Label>
                  <Select
                    value={editingProject.status}
                    onValueChange={(value) => setEditingProject({ ...editingProject, status: value })}
                  >
                    <SelectTrigger id="project-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Almost Done">Almost Done</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-health">Health</Label>
                  <Select
                    value={editingProject.health}
                    onValueChange={(value: "on-track" | "at-risk" | "delayed") =>
                      setEditingProject({ ...editingProject, health: value })
                    }
                  >
                    <SelectTrigger id="project-health">
                      <SelectValue placeholder="Select health" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-track">On Track</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-due-date">Due Date</Label>
                  <Input
                    id="project-due-date"
                    value={editingProject.dueDate}
                    onChange={(e) => setEditingProject({ ...editingProject, dueDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-progress">Progress (%)</Label>
                  <Input
                    id="project-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={editingProject.progress}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        progress: Math.min(100, Math.max(0, Number.parseInt(e.target.value) || 0)),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-client">Client (Optional)</Label>
                <Input
                  id="project-client"
                  value={editingProject.client || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveProjectChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteProject}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardWrapper>
  )
}
