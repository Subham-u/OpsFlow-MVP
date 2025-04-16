import { AdvancedAnalyticsHeader } from "@/components/advanced-analytics/advanced-analytics-header"
import { ReportScheduler } from "@/components/advanced-analytics/report-scheduler"

export default function ScheduledReportsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AdvancedAnalyticsHeader />
      <div className="container mx-auto px-4 py-6">
        <ReportScheduler />
      </div>
    </div>
  )
}
