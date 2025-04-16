import type { Metadata } from "next"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { TimeCalendarView } from "@/components/time-tracking/time-calendar-view"

export const metadata: Metadata = {
  title: "Time Tracking Calendar | WonderFlow",
  description: "Calendar view of your time tracking entries",
}

export default function TimeTrackingCalendarPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TimeTrackingHeader />
      <div className="p-4 md:p-6">
        <TimeCalendarView />
      </div>
    </div>
  )
}
