"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { TeamActivity } from "@/components/dashboard/team-activity"
import { DashboardWidgets } from "@/components/dashboard/dashboard-widgets"
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
import { useToast } from "@/hooks/use-toast"

export default function DashboardPageClient() {
  const { toast } = useToast()
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false)
  const [quickTask, setQuickTask] = useState({
    title: "",
    description: "",
    project: "Website Redesign",
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0],
  })

  const createQuickTask = () => {
    if (!quickTask.title) {
      toast({
        title: "Task title is required",
        variant: "destructive",
      })
      return
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

  return (
    <div className="p-4 md:p-6 pb-20">
      <DashboardHeader/>
      <div className="space-y-6 mt-6">
        <DashboardWidgets />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentProjects />
          <div className="lg:col-span-2 space-y-6">
            <DashboardStats />
            <TeamActivity />
          </div>
        </div>
      </div>

      {/* Floating Action Button for Quick Task Creation - properly positioned */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="rounded-full shadow-lg h-14 w-14 p-0" onClick={() => setIsQuickTaskOpen(true)}>
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Task Creation Dialog */}
      <Dialog open={isQuickTaskOpen} onOpenChange={setIsQuickTaskOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Quick Task</DialogTitle>
            <DialogDescription>Quickly add a new task to your list. You can edit more details later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={quickTask.title}
                onChange={(e) => setQuickTask({ ...quickTask, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description (Optional)</Label>
              <Textarea
                id="task-description"
                placeholder="Enter task description"
                value={quickTask.description}
                onChange={(e) => setQuickTask({ ...quickTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-project">Project</Label>
                <Select
                  value={quickTask.project}
                  onValueChange={(value) => setQuickTask({ ...quickTask, project: value })}
                >
                  <SelectTrigger id="task-project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                    <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                    <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={quickTask.priority}
                  onValueChange={(value) => setQuickTask({ ...quickTask, priority: value })}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={quickTask.dueDate}
                onChange={(e) => setQuickTask({ ...quickTask, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuickTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createQuickTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
