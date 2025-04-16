import type { Metadata } from "next"
import DashboardPageClient from "./dashboard-page"

export const metadata: Metadata = {
  title: "Dashboard | WonderFlow",
  description: "Overview of your projects, tasks, and team activity",
}

export default function DashboardPage() {
  return <DashboardPageClient />
}
