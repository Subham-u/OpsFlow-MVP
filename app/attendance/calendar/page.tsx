import { AttendanceHeader } from "@/components/attendance/attendance-header"
import { AttendanceCalendar } from "@/components/attendance/attendance-calendar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Attendance Calendar | WonderFlow",
  description: "View your attendance calendar",
}

export default function AttendanceCalendarPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AttendanceHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <AttendanceCalendar />
      </main>
    </div>
  )
}
