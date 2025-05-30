import { AdvancedAnalyticsHeader } from "@/components/advanced-analytics/advanced-analytics-header"
import { DataVisualization } from "@/components/advanced-analytics/data-visualization"

export default function VisualizationsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AdvancedAnalyticsHeader />
      <div className="container mx-auto px-4 py-6">
        <DataVisualization />
      </div>
    </div>
  )
}
