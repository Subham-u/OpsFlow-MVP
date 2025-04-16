import { AttendanceHeader } from "@/components/attendance/attendance-header"
import { AttendanceDashboard } from "@/components/attendance/attendance-dashboard"
import { IntegratedTimeTrackingWidget } from "@/components/time-tracking/integrated-time-tracking-widget"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Attendance | WonderFlow",
  description: "Track and manage team attendance",
}

export default function AttendancePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AttendanceHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <AttendanceDashboard />
          </div>
        </div>
      </main>
    </div>
  )
}
