import type { Metadata } from "next"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { TimeTrackingSettings } from "@/components/time-tracking/time-tracking-settings"

export const metadata: Metadata = {
  title: "Time Tracking Settings | WonderFlow",
  description: "Configure your time tracking preferences and options",
}

export default function TimeTrackingSettingsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TimeTrackingHeader />
      <div className="p-4 md:p-6">
        <TimeTrackingSettings />
      </div>
    </div>
  )
}
