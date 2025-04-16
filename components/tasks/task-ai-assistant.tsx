"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, CheckCircle2, Calendar, Clock, Tag, User } from "lucide-react"

interface TaskAIAssistantProps {
  onClose: () => void
  onCreateTask: (task: any) => void
}

export default function TaskAIAssistant({ onClose, onCreateTask }: TaskAIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTask, setGeneratedTask] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("generate")

  // Mock AI generation
  const generateTaskFromPrompt = () => {
    setIsGenerating(true)

    // Simulate AI processing delay
    setTimeout(() => {
      // Parse the prompt to extract potential task details
      const lowercasePrompt = prompt.toLowerCase()

      // Generate a task based on the prompt content
      const newTask = {
        id: `task-${Date.now()}`,
        title: prompt.split(".")[0] || "New Task",
        description: prompt,
        status: "todo",
        priority:
          lowercasePrompt.includes("urgent") || lowercasePrompt.includes("important")
            ? "high"
            : lowercasePrompt.includes("when you can") || lowercasePrompt.includes("low priority")
              ? "low"
              : "medium",
        startDate: new Date().toISOString().split("T")[0],
        dueDate: (() => {
          // Try to extract date information
          if (lowercasePrompt.includes("tomorrow")) {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            return tomorrow.toISOString().split("T")[0]
          } else if (lowercasePrompt.includes("next week")) {
            const nextWeek = new Date()
            nextWeek.setDate(nextWeek.getDate() + 7)
            return nextWeek.toISOString().split("T")[0]
          } else {
            // Default to one week from now
            const oneWeek = new Date()
            oneWeek.setDate(oneWeek.getDate() + 7)
            return oneWeek.toISOString().split("T")[0]
          }
        })(),
        assignee: "Me",
        tags: (() => {
          const tags = []
          if (lowercasePrompt.includes("design")) tags.push("design")
          if (lowercasePrompt.includes("develop")) tags.push("development")
          if (lowercasePrompt.includes("research")) tags.push("research")
          if (lowercasePrompt.includes("meeting")) tags.push("meeting")
          if (tags.length === 0) tags.push("general")
          return tags
        })(),
        progress: 0,
        importance: lowercasePrompt.includes("important") ? 8 : 5,
        urgency: lowercasePrompt.includes("urgent") ? 8 : 5,
      }

      setGeneratedTask(newTask)
      setIsGenerating(false)
      setActiveTab("review")
    }, 1500)
  }

  const handleCreateTask = () => {
    if (generatedTask) {
      onCreateTask(generatedTask)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Task</TabsTrigger>
          <TabsTrigger value="review" disabled={!generatedTask}>
            Review & Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe your task</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the task you want to create. For example: 'Create a presentation for the marketing team about our new product launch. It's important and needed by next week.'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={generateTaskFromPrompt} disabled={!prompt.trim() || isGenerating} className="gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Task
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Task Generation Tips:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include specific details about what needs to be done</li>
              <li>• Mention deadlines or timeframes if applicable</li>
              <li>• Use words like "urgent" or "important" to set priority</li>
              <li>• Include any relevant categories or tags</li>
              <li>• Specify who should be assigned to the task</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {generatedTask && (
            <>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={generatedTask.title}
                        onChange={(e) => setGeneratedTask({ ...generatedTask, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={generatedTask.description}
                        onChange={(e) => setGeneratedTask({ ...generatedTask, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={generatedTask.priority}
                          onValueChange={(value) => setGeneratedTask({ ...generatedTask, priority: value })}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={generatedTask.status}
                          onValueChange={(value) => setGeneratedTask({ ...generatedTask, status: value })}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={generatedTask.startDate}
                          onChange={(e) => setGeneratedTask({ ...generatedTask, startDate: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dueDate" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Due Date
                        </Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={generatedTask.dueDate}
                          onChange={(e) => setGeneratedTask({ ...generatedTask, dueDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assignee" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assignee
                      </Label>
                      <Input
                        id="assignee"
                        value={generatedTask.assignee}
                        onChange={(e) => setGeneratedTask({ ...generatedTask, assignee: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags (comma separated)
                      </Label>
                      <Input
                        id="tags"
                        value={generatedTask.tags.join(", ")}
                        onChange={(e) =>
                          setGeneratedTask({
                            ...generatedTask,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedTask(null)
                    setActiveTab("generate")
                  }}
                >
                  Start Over
                </Button>
                <Button onClick={handleCreateTask} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Create Task
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
