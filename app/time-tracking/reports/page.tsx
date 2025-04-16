import type { Metadata } from "next"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { TimeReports } from "@/components/time-tracking/time-reports"

export const metadata: Metadata = {
  title: "Time Reports | WonderFlow",
  description: "Generate and view time tracking reports",
}

export default function TimeTrackingReportsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TimeTrackingHeader />
      <div className="p-4 md:p-6">
        <TimeReports />
      </div>
    </div>
  )
}
