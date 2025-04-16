import { AdvancedAnalyticsHeader } from "@/components/advanced-analytics/advanced-analytics-header"
import { CustomReportBuilder } from "@/components/advanced-analytics/custom-report-builder"

export default function CustomReportsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AdvancedAnalyticsHeader />
      <div className="container mx-auto px-4 py-6">
        <CustomReportBuilder />
      </div>
    </div>
  )
}
