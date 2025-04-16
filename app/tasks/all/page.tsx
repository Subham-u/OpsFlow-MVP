"use client"

import { useState } from "react"
import { TasksHeader } from "@/components/tasks/tasks-header"
import TasksBoard from "@/components/tasks/tasks-board"
import TaskAIAssistant from "@/components/tasks/task-ai-assistant"
import TaskTimelineView from "@/components/tasks/task-timeline-view"
import TaskMatrixView from "@/components/tasks/task-matrix-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles } from "lucide-react"

const mockTasks = [
  {
    id: "1",
    title: "Design homepage wireframes",
    description: "Create wireframes for the new homepage design",
    status: "todo",
    priority: "high",
    startDate: "2023-08-01",
    dueDate: "2023-08-10",
    assignee: "Alex Johnson",
    tags: ["design", "ui"],
    progress: 33,
    importance: 8,
    urgency: 9,
  },
  {
    id: "2",
    title: "Create user personas",
    description: "Develop detailed user personas for the target audience",
    status: "todo",
    priority: "medium",
    startDate: "2023-08-05",
    dueDate: "2023-08-15",
    assignee: "Beth Smith",
    tags: ["research", "ux"],
    progress: 0,
    importance: 7,
    urgency: 6,
  },
  {
    id: "3",
    title: "Implement authentication",
    description: "Set up user authentication and authorization",
    status: "in-progress",
    priority: "high",
    startDate: "2023-08-03",
    dueDate: "2023-08-12",
    assignee: "Carl Davis",
    tags: ["development", "security"],
    progress: 66,
    importance: 9,
    urgency: 7,
  },
  {
    id: "4",
    title: "Design social media graphics",
    description: "Create graphics for social media campaign",
    status: "in-progress",
    priority: "medium",
    startDate: "2023-08-02",
    dueDate: "2023-08-08",
    assignee: "Dana Wilson",
    tags: ["design", "social media"],
    progress: 33,
    importance: 6,
    urgency: 8,
  },
  {
    id: "5",
    title: "Review content strategy",
    description: "Review and finalize content strategy document",
    status: "review",
    priority: "low",
    startDate: "2023-08-01",
    dueDate: "2023-08-05",
    assignee: "Eric Brown",
    tags: ["content", "strategy"],
    progress: 100,
    importance: 4,
    urgency: 5,
  },
  {
    id: "6",
    title: "Finalize logo design",
    description: "Review and approve final logo design",
    status: "review",
    priority: "medium",
    startDate: "2023-08-02",
    dueDate: "2023-08-07",
    assignee: "Fiona Green",
    tags: ["design", "branding"],
    progress: 66,
    importance: 7,
    urgency: 6,
  },
  {
    id: "7",
    title: "Set up analytics",
    description: "Implement analytics tracking for the website",
    status: "done",
    priority: "medium",
    startDate: "2023-08-01",
    dueDate: "2023-08-03",
    assignee: "Greg Hall",
    tags: ["development", "analytics"],
    progress: 100,
    importance: 6,
    urgency: 4,
  },
  {
    id: "8",
    title: "Create email templates",
    description: "Design and code email templates for campaign",
    status: "done",
    priority: "high",
    startDate: "2023-07-30",
    dueDate: "2023-08-02",
    assignee: "Helen Irwin",
    tags: ["design", "email"],
    progress: 100,
    importance: 8,
    urgency: 9,
  },
]

export default function TasksPage() {
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [tasks, setTasks] = useState(mockTasks)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeView, setActiveView] = useState("board")

  // Handle task creation from AI assistant
  const handleCreateTask = (newTask: any) => {
    setTasks((prevTasks) => [...prevTasks, { ...newTask, id: `task-${prevTasks.length + 1}` }])
    setIsAIOpen(false)
  }

  // Handle task click in matrix view
  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
  }

  return (
    <>
      <TasksHeader />
      <div className="container relative py-6">
        <div className="space-y-4">
          <Tabs defaultValue="board" onValueChange={setActiveView} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="board">Board View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="matrix">Matrix View</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-4">
              <TasksBoard />
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>List View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Calendar view coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-4">
              <TaskTimelineView tasks={tasks} />
            </TabsContent>

            <TabsContent value="matrix" className="mt-4">
              <TaskMatrixView tasks={tasks} onTaskClick={handleTaskClick} />
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assistant Dialog */}
        <Dialog open={isAIOpen} onOpenChange={setIsAIOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full size-14 p-0">
              <Sparkles className="h-6 w-6" />
              <span className="sr-only">Open AI Assistant</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>AI Task Assistant</DialogTitle>
              <DialogDescription>Let AI help you manage your tasks more efficiently.</DialogDescription>
            </DialogHeader>
            <TaskAIAssistant onClose={() => setIsAIOpen(false)} onCreateTask={handleCreateTask} />
          </DialogContent>
        </Dialog>

        {/* Task Details Dialog */}
        <Dialog open={selectedTask !== null} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>{selectedTask?.description}</DialogDescription>
            </DialogHeader>
            {/* Display task details here */}
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
