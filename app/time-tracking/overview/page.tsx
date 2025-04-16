"use client"

import { useEffect } from "react"
import { IntegratedTimeHeader } from "@/components/time-tracking/integrated-time-header"
import { IntegratedAttendanceWidget } from "@/components/attendance/integrated-attendance-widget"
import { IntegratedTimeTrackingWidget } from "@/components/time-tracking/integrated-time-tracking-widget"
import { TimeTrackingOverview } from "@/components/time-tracking/time-tracking-overview"
import { useTimeTracking } from "@/contexts/time-tracking-context"

export default function TimeTrackingOverviewPage() {
  const { initializeTimeTracking } = useTimeTracking()

  useEffect(() => {
    initializeTimeTracking()
  }, [initializeTimeTracking])

  return (
    <div className="flex flex-col min-h-screen">
      <IntegratedTimeHeader />

      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TimeTrackingOverview />
          </div>

          <div className="space-y-6">
            <IntegratedAttendanceWidget />
            <IntegratedTimeTrackingWidget />
          </div>
        </div>
      </main>
    </div>
  )
}
