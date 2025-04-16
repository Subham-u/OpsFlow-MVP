"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamChat } from "@/components/collaboration/team-chat"
import { TeamWorkload } from "@/components/collaboration/team-workload"
import { SharedDocuments } from "@/components/collaboration/shared-documents"
import { CollaborationActivity } from "@/components/collaboration/collaboration-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, FileText, Activity, Calendar, Video, PlusCircle, Clock, CheckSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function CollaborationContent() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  const handleCreateMeeting = () => {
    toast({
      title: "Meeting scheduled",
      description: "Your meeting has been scheduled and team members notified.",
    })
  }

  const handleStartVideoCall = () => {
    toast({
      title: "Video call initiated",
      description: "Starting video call. Team members will be notified.",
    })
  }

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TabsList className="h-auto p-1 grid grid-cols-2 sm:grid-cols-5 gap-1 w-full sm:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2 px-3 py-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2 px-3 py-2">
            <MessageSquare className="h-4 w-4" />
            <span>Team Chat</span>
          </TabsTrigger>
          <TabsTrigger value="workload" className="flex items-center gap-2 px-3 py-2">
            <Users className="h-4 w-4" />
            <span>Workload</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 px-3 py-2">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2 px-3 py-2">
            <Clock className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleStartVideoCall} className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Start Video Call</span>
          </Button>
          <Button onClick={handleCreateMeeting} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule Meeting</span>
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription>Your scheduled team meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Sprint Planning</h4>
                      <p className="text-sm text-muted-foreground">Today, 2:00 PM - 3:00 PM</p>
                    </div>
                    <Badge>In 3 hours</Badge>
                  </div>
                  <div className="flex items-center mt-3 gap-1">
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Alex" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-background -ml-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Beth" />
                      <AvatarFallback>BS</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-background -ml-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Carl" />
                      <AvatarFallback>CD</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground ml-2">+3 more</span>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Design Review</h4>
                      <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 11:30 AM</p>
                    </div>
                    <Badge variant="outline">Tomorrow</Badge>
                  </div>
                  <div className="flex items-center mt-3 gap-1">
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Beth" />
                      <AvatarFallback>BS</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-6 w-6 border-2 border-background -ml-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dana" />
                      <AvatarFallback>DW</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground ml-2">+2 more</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Meetings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Recent Conversations
              </CardTitle>
              <CardDescription>Latest team discussions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Alex" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Alex Johnson</h4>
                        <span className="text-xs text-muted-foreground">30m ago</span>
                      </div>
                      <p className="text-sm mt-1">
                        I've updated the wireframes for the homepage. Please check when you have a moment.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Beth" />
                      <AvatarFallback>BS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Beth Smith</h4>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <p className="text-sm mt-1">
                        The client approved the color palette! We can move forward with the design system.
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Open Team Chat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                Team Tasks
              </CardTitle>
              <CardDescription>Collaborative tasks in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Finalize Q3 Marketing Plan</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">Due in 2 days</p>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      In Progress
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Website Redesign Review</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">Due tomorrow</p>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      In Review
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Recent Documents
              </CardTitle>
              <CardDescription>Recently updated shared files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Project Requirements.pdf</h4>
                      <p className="text-xs text-muted-foreground">Updated 2 days ago by Alex Johnson</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-medium">Marketing Strategy.xlsx</h4>
                      <p className="text-xs text-muted-foreground">Updated yesterday by Beth Smith</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Design Assets.zip</h4>
                      <p className="text-xs text-muted-foreground">Updated 3 days ago by Carl Davis</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Team Activity
              </CardTitle>
              <CardDescription>Recent team member activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Alex" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Alex Johnson</span>{" "}
                      <span className="text-muted-foreground">completed task</span>{" "}
                      <span className="font-medium">Design homepage wireframes</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Beth" />
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Beth Smith</span>{" "}
                      <span className="text-muted-foreground">commented on</span>{" "}
                      <span className="font-medium">User Flow Diagram</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Carl" />
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Carl Davis</span>{" "}
                      <span className="text-muted-foreground">created task</span>{" "}
                      <span className="font-medium">Implement authentication</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="chat" className="space-y-4">
        <TeamChat />
      </TabsContent>

      <TabsContent value="workload" className="space-y-4">
        <TeamWorkload />
      </TabsContent>

      <TabsContent value="documents" className="space-y-4">
        <SharedDocuments />
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <CollaborationActivity />
      </TabsContent>
    </Tabs>
  )
}
