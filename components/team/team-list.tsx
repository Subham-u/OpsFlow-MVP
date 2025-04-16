import { getTeamMembers } from "@/lib/data"
import { TeamMemberCard } from "@/components/team/team-member-card"
import { EmptyState } from "@/components/empty-state"

interface TeamListProps {
  department?: string
  status?: string
  search?: string
}

export async function TeamList({ department, status, search }: TeamListProps) {
  const members = await getTeamMembers({
    department,
    status,
    search,
  })

  if (members.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No team members found"
        description="No team members match your current filters."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}
