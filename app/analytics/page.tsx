import type { Metadata } from "next"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { ProjectPerformance } from "@/components/analytics/project-performance"
import { TeamPerformance } from "@/components/analytics/team-performance"

export const metadata: Metadata = {
  title: "Analytics | WonderFlow",
  description: "View analytics and reports for your projects and team",
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AnalyticsHeader />
      <main className="flex-1 w-full p-4 md:p-6 space-y-6">
        <AnalyticsOverview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ProjectPerformance />
          <TeamPerformance />
        </div>
      </main>
    </div>
  )
}
