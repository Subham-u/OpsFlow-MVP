"use client"

import { useEffect } from "react"
import { AttendanceHeader } from "@/components/attendance/attendance-header"
import { AttendanceDashboard } from "@/components/attendance/attendance-dashboard"
import { IntegratedAttendanceWidget } from "@/components/attendance/integrated-attendance-widget"
import { IntegratedTimeTrackingWidget } from "@/components/time-tracking/integrated-time-tracking-widget"
import { useTimeTracking } from "@/contexts/time-tracking-context"

export default function AttendanceOverviewPage() {
  const { initializeTimeTracking } = useTimeTracking()

  useEffect(() => {
    initializeTimeTracking()
  }, [initializeTimeTracking])

  return (
    <div className="flex flex-col min-h-screen">
      <AttendanceHeader />

      <main className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AttendanceDashboard />
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
