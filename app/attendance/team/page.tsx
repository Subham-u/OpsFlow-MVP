import { AttendanceHeader } from "@/components/attendance/attendance-header"
import { TeamAttendance } from "@/components/attendance/team-attendance"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Team Attendance | WonderFlow",
  description: "Track and manage team attendance",
}

export default function TeamAttendancePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AttendanceHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <TeamAttendance />
      </main>
    </div>
  )
}
