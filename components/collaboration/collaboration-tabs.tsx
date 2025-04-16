"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamChat } from "@/components/collaboration/team-chat"
import { TeamWorkload } from "@/components/collaboration/team-workload"
import { SharedDocuments } from "@/components/collaboration/shared-documents"
import { CollaborationActivity } from "@/components/collaboration/collaboration-activity"

export function CollaborationTabs() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="chat">Team Chat</TabsTrigger>
        <TabsTrigger value="workload">Team Workload</TabsTrigger>
        <TabsTrigger value="documents">Shared Documents</TabsTrigger>
        <TabsTrigger value="activity">Activity Feed</TabsTrigger>
      </TabsList>
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
