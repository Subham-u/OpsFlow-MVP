import { Suspense } from "react"
import { TeamHeader } from "@/components/team/team-header"
import { TeamList } from "@/components/team/team-list"
import { TeamStats } from "@/components/team/team-stats"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { TeamMembersSkeleton, StatsSkeleton } from "@/components/skeletons"
import { getDepartments } from "@/lib/data"

export default async function TeamPage({
  searchParams,
}: {
  searchParams: { department?: string; status?: string; search?: string }
}) {
  const departments = await getDepartments()

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TeamHeader departments={departments} />

        <Suspense fallback={<StatsSkeleton />}>
          <TeamStats />
        </Suspense>

        <DashboardShell>
          <Suspense
            key={`team-list-${searchParams.department || "all"}-${searchParams.status || "all"}-${searchParams.search || ""}`}
            fallback={<TeamMembersSkeleton />}
          >
            <TeamList department={searchParams.department} status={searchParams.status} search={searchParams.search} />
          </Suspense>
        </DashboardShell>
      </div>
    </div>
  )
}
