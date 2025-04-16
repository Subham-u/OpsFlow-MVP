import { AdvancedAnalyticsHeader } from "@/components/advanced-analytics/advanced-analytics-header"
import { WhatIfAnalysis } from "@/components/advanced-analytics/what-if-analysis"

export default function WhatIfPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AdvancedAnalyticsHeader />
      <div className="container mx-auto px-4 py-6">
        <WhatIfAnalysis />
      </div>
    </div>
  )
}
