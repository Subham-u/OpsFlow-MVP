import type { Metadata } from "next"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { AssignmentManager } from "@/components/time-tracking/assignment-manager"

export const metadata: Metadata = {
  title: "Time Assignments | WonderFlow",
  description: "Manage time assignments for team members and projects",
}

export default function TimeTrackingAssignmentsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TimeTrackingHeader />
      <div className="p-4 md:p-6">
        <AssignmentManager />
      </div>
    </div>
  )
}
