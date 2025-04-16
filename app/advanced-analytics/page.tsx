import type { Metadata } from "next"
import { AdvancedAnalyticsHeader } from "@/components/advanced-analytics/advanced-analytics-header"
import { AnalyticsDashboard } from "@/components/advanced-analytics/analytics-dashboard"

export const metadata: Metadata = {
  title: "Advanced Analytics | Project Management",
  description: "View detailed analytics and insights for your projects and team performance.",
}

export default function AdvancedAnalyticsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AdvancedAnalyticsHeader />
      <div className="container mx-auto px-4 py-6">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
