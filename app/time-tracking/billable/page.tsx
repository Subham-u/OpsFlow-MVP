import type { Metadata } from "next"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { BillableHours } from "@/components/time-tracking/billable-hours"

export const metadata: Metadata = {
  title: "Billable Hours | WonderFlow",
  description: "Manage and track billable hours for clients and projects",
}

export default function TimeTrackingBillablePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <TimeTrackingHeader />
      <div className="p-4 md:p-6">
        <BillableHours />
      </div>
    </div>
  )
}
