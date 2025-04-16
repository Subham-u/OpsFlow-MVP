import { IntegratedTimeHeader } from "@/components/time-tracking/integrated-time-header"
import TimeTrackingOverview from "@/components/time-tracking/time-tracking-overview"
import { IntegratedAttendanceWidget } from "@/components/attendance/integrated-attendance-widget"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Time Tracking Overview | WonderFlow",
  description: "Overview of your time tracking data and statistics",
}

export default function TimeTrackingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <IntegratedTimeHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <TimeTrackingOverview />
          </div>
        </div>
      </main>
    </div>
  )
}
