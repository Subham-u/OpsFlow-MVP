"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"
import { supabase } from "@/lib/supabase/supabase-server"
import { Share2, Trash, Edit, MoreHorizontal, Star, StarOff, Users, Calendar, Copy, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { deleteProject } from "@/lib/actions/project-actions"

export function ProjectsGrid() {
  const { toast } = useToast()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [openNewProject, setOpenNewProject] = useState(false)
  const [openShareDialog, setOpenShareDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectStatus, setProjectStatus] = useState("planning")
  const [projectDueDate, setProjectDueDate] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "dueDate" | "progress">("dueDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showFilters, setShowFilters] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [shareEmail, setShareEmail] = useState("")
  const [shareRole, setShareRole] = useState("viewer")
  const [shareLink, setShareLink] = useState("")
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editStatus, setEditStatus] = useState("")
  const [editDueDate, setEditDueDate] = useState("")

  // Use the custom hook to detect mobile screens
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Set view to list on mobile by default
  useEffect(() => {
    if (isMobile) {
      setView("list")
    }
  }, [isMobile])

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const { data, error } = await supabase.from("projects").select("*")
      if (error) {
        console.error("Error fetching projects:", error)
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }

    fetchProjects()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark-text-green-400"
      case "In Progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Almost Done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Just Started":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
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

    // Create new project
    const newProject = {
      id: (projects.length + 1).toString(),
      name: projectName,
      description: projectDescription,
      progress: 0,
      status: projectStatus === "planning" ? "Just Started" : "In Progress",
      dueDate: new Date(projectDueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      isStarred: false,
      members: [{ name: "You", image: "/placeholder.svg?height=32&width=32" }],
      tasks: { total: 0, completed: 0 },
    }

    setProjects([...projects, newProject])

    toast({
      title: "Success",
      description: "Project created successfully",
    })

    // Reset form and close dialog
    setProjectName("")
    setProjectDescription("")
    setProjectStatus("planning")
    setProjectDueDate("")
    setOpenNewProject(false)
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return

    try {
      const result = await deleteProject(selectedProject.id)
      
      if (result.success) {
        setProjects(projects.filter((project) => project.id !== selectedProject.id))
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete project",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setOpenDeleteDialog(false)
      setSelectedProject(null)
    }
  }

  const handleEditProject = () => {
    if (!selectedProject) return

    // Validate form
    if (!editName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    if (!editDueDate) {
      toast({
        title: "Error",
        description: "Due date is required",
        variant: "destructive",
      })
      return
    }

    // Update project
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          name: editName,
          description: editDescription,
          status: editStatus,
          dueDate: new Date(editDueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }
      }
      return project
    })

    setProjects(updatedProjects)

    toast({
      title: "Project updated",
      description: "The project has been updated successfully",
    })

    setOpenEditDialog(false)
  }

  const handleShareProject = () => {
    if (!selectedProject || !shareEmail) return

    // In a real app, this would send an invitation email

    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${shareEmail} with ${shareRole} access`,
    })

    setShareEmail("")
    setOpenShareDialog(false)
  }

  const handleCopyShareLink = () => {
    if (!shareLink) return

    navigator.clipboard.writeText(shareLink)

    toast({
      title: "Link copied",
      description: "Project link copied to clipboard",
    })
  }

  const handleToggleStarProject = (projectId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    setProjects(
      projects.map((project) => (project.id === projectId ? { ...project, isStarred: !project.isStarred } : project)),
    )

    const project = projects.find((p) => p.id === projectId)
    toast({
      title: project?.isStarred ? "Project unstarred" : "Project starred",
      description: project?.isStarred ? "Project removed from favorites" : "Project added to favorites",
    })
  }

  const openShare = (project: any) => {
    setSelectedProject(project)
    setShareLink(`https://projectmanagement.app/projects/${project.id}`)
    setOpenShareDialog(true)
  }

  const openEdit = (project: any) => {
    setSelectedProject(project)
    setEditName(project.name)
    setEditDescription(project.description || "")
    setEditStatus(project.status)
    setEditDueDate(project.dueDate)
    setOpenEditDialog(true)
  }

  const openDelete = (project: any) => {
    setSelectedProject(project)
    setOpenDeleteDialog(true)
  }

  // Filter and sort projects
  const filteredProjects = projects.filter((project) => {
    // Filter by search query
    if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by status
    if (filterStatus && project.status !== filterStatus) {
      return false
    }

    return true
  })

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "dueDate") {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    } else if (sortBy === "progress") {
      return sortOrder === "asc" ? a.progress - b.progress : b.progress - a.progress
    }
    return 0
  })

  // Group projects by starred status
  const starredProjects = sortedProjects.filter((project) => project.isStarred)
  const unstarredProjects = sortedProjects.filter((project) => !project.isStarred)

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Starred Projects Section */}
          {starredProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400" />
                Starred Projects
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {starredProjects.map((project) => (
                  <ProjectCard
                    key={`starred-${project.id}`}
                    project={project}
                    onToggleStar={handleToggleStarProject}
                    onShare={() => openShare(project)}
                    onEdit={() => openEdit(project)}
                    onDelete={() => openDelete(project)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Projects Section */}
          <div className="space-y-4">
            {starredProjects.length > 0 && <h2 className="text-xl font-semibold">All Projects</h2>}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {unstarredProjects.map((project) => (
                <ProjectCard
                  key={`all-${project.id}`}
                  project={project}
                  onToggleStar={handleToggleStarProject}
                  onShare={() => openShare(project)}
                  onEdit={() => openEdit(project)}
                  onDelete={() => openDelete(project)}
                />
              ))}
            </div>
          </div>

          {/* No Projects State */}
          {projects.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">Create your first project to get started</p>
              <Button onClick={() => setOpenNewProject(true)}>Create Project</Button>
            </div>
          )}
        </>
      )}

      {/* Share Project Dialog */}
      <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>Share "{selectedProject?.name}" with your team or via link</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="invite">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invite">Invite People</TabsTrigger>
              <TabsTrigger value="link">Share Link</TabsTrigger>
            </TabsList>

            <TabsContent value="invite" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  placeholder="colleague@company.com"
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Permission</Label>
                <Select value={shareRole} onValueChange={setShareRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="link">Share link</Label>
                <div className="flex space-x-2">
                  <Input id="link" value={shareLink} readOnly />
                  <Button size="icon" onClick={handleCopyShareLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Anyone with this link will be able to view this project</p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sm:justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              {selectedProject?.members?.length || 1} people have access
            </div>
            <Button type="submit" onClick={handleShareProject}>
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Make changes to your project</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Just Started">Just Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Almost Done">Almost Done</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Project Card Component
function ProjectCard({
  project,
  onToggleStar,
  onShare,
  onEdit,
  onDelete,
}: {
  project: any
  onToggleStar: (id: string, e: React.MouseEvent) => void
  onShare: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "In Progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "Almost Done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Just Started":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 group">
        <div className="relative h-36 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="absolute top-3 right-3 flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => onToggleStar(project.id, e)}
            >
              {project.isStarred ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={onDelete}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-4xl font-bold text-primary/40">{project.name.charAt(0)}</div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                <h3 className="text-lg font-semibold">{project.name}</h3>
              </Link>
              <Badge variant="outline" className={`mt-2 ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
            </div>
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground h-10">
            {project.description || "No description provided"}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2 mt-1" />
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.members?.map((member: any, index: number) => (
                <Avatar key={index} className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Due {project.dueDate}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
