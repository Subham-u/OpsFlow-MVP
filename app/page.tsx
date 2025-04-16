import { Suspense } from "react"
import { ProjectList } from "@/components/project-list"
import { TeamMembersList } from "@/components/team-members-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardStats } from "@/components/dashboard-stats"
import { ProjectsSkeleton, TeamMembersSkeleton, StatsSkeleton } from "@/components/skeletons"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <DashboardShell className="h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Projects</h2>
              </div>
              <Suspense fallback={<ProjectsSkeleton />}>
                <ProjectList />
              </Suspense>
            </DashboardShell>
          </div>
          <div className="col-span-3">
            <DashboardShell className="h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Team Members</h2>
              </div>
              <Suspense fallback={<TeamMembersSkeleton />}>
                <TeamMembersList />
              </Suspense>
            </DashboardShell>
          </div>
        </div>
      </div>
    </div>
  )
}
