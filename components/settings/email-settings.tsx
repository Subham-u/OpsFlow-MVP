"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { testEmailConnection } from "@/lib/email/send-email"
import { toast } from "@/hooks/use-toast"

export function EmailSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    taskAssigned: true,
    taskStatusChanged: true,
    newTeamMember: true,
    newProject: true,
    projectMemberAdded: true,
    milestoneCompleted: true,
    newComment: true,
    dailyDigest: false,
    weeklyDigest: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // In a real app, this would save to the database
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: "Settings saved",
      description: "Your email notification preferences have been updated.",
    })
    setIsLoading(false)
  }

  const handleTestConnection = async () => {
    setIsLoading(true)
    const result = await testEmailConnection()

    if (result.success) {
      toast({
        title: "Connection successful",
        description: "Email server connection is working properly.",
      })
    } else {
      toast({
        title: "Connection failed",
        description: result.error || "Could not connect to email server.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Notifications</CardTitle>
          <CardDescription>Configure notifications for task-related events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-assigned">Task assigned to you</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a task is assigned to you</p>
            </div>
            <Switch
              id="task-assigned"
              checked={settings.taskAssigned}
              onCheckedChange={() => handleToggle("taskAssigned")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-status">Task status changes</Label>
              <p className="text-sm text-muted-foreground">Receive an email when the status of a task changes</p>
            </div>
            <Switch
              id="task-status"
              checked={settings.taskStatusChanged}
              onCheckedChange={() => handleToggle("taskStatusChanged")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Notifications</CardTitle>
          <CardDescription>Configure notifications for project-related events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-project">New project created</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a new project is created</p>
            </div>
            <Switch id="new-project" checked={settings.newProject} onCheckedChange={() => handleToggle("newProject")} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="project-member">Added to a project</Label>
              <p className="text-sm text-muted-foreground">Receive an email when you are added to a project</p>
            </div>
            <Switch
              id="project-member"
              checked={settings.projectMemberAdded}
              onCheckedChange={() => handleToggle("projectMemberAdded")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="milestone">Milestone completed</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a milestone is completed</p>
            </div>
            <Switch
              id="milestone"
              checked={settings.milestoneCompleted}
              onCheckedChange={() => handleToggle("milestoneCompleted")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Notifications</CardTitle>
          <CardDescription>Configure notifications for team-related events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-member">New team member</Label>
              <p className="text-sm text-muted-foreground">Receive an email when a new team member is added</p>
            </div>
            <Switch
              id="new-member"
              checked={settings.newTeamMember}
              onCheckedChange={() => handleToggle("newTeamMember")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-comment">New comments</Label>
              <p className="text-sm text-muted-foreground">
                Receive an email when someone comments on your tasks or projects
              </p>
            </div>
            <Switch id="new-comment" checked={settings.newComment} onCheckedChange={() => handleToggle("newComment")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Digest Emails</CardTitle>
          <CardDescription>Configure summary emails of activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="daily-digest">Daily digest</Label>
              <p className="text-sm text-muted-foreground">Receive a daily summary of all activities</p>
            </div>
            <Switch
              id="daily-digest"
              checked={settings.dailyDigest}
              onCheckedChange={() => handleToggle("dailyDigest")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly digest</Label>
              <p className="text-sm text-muted-foreground">Receive a weekly summary of all activities</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={settings.weeklyDigest}
              onCheckedChange={() => handleToggle("weeklyDigest")}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleTestConnection} disabled={isLoading}>
            Test Email Connection
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
