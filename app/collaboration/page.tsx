import type { Metadata } from "next"
import { CollaborationHeader } from "@/components/collaboration/collaboration-header"
import { CollaborationContent } from "@/components/collaboration/collaboration-content"

export const metadata: Metadata = {
  title: "Team Collaboration | WonderFlow",
  description: "Collaborate with your team in real-time",
}

export default function CollaborationPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <CollaborationHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <CollaborationContent />
      </main>
    </div>
  )
}
