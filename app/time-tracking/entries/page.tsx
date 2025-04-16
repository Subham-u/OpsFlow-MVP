import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { TimeEntries } from "@/components/time-tracking/time-entries"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Time Entries | WonderFlow",
  description: "View and manage your time entries",
}

export default function TimeEntriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TimeTrackingHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <TimeEntries />
      </main>
    </div>
  )
}
