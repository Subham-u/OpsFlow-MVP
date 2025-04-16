import type { Metadata } from "next"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { PomodoroTimer } from "@/components/time-tracking/pomodoro-timer"

export const metadata: Metadata = {
  title: "Pomodoro Timer | WonderFlow",
  description: "Pomodoro technique timer for focused work sessions",
}

export default function TimeTrackingPomodoroPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TimeTrackingHeader />
      <div className="p-4 md:p-6">
        <PomodoroTimer />
      </div>
    </div>
  )
}
