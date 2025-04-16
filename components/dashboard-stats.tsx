import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjectStats } from "@/lib/data"
import { getTeamStats } from "@/lib/data"
import { CalendarClock, CheckCircle, Clock, Users } from "lucide-react"

export async function DashboardStats() {
  const projectStats = await getProjectStats()
  const teamStats = await getTeamStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectStats.total}</div>
          <p className="text-xs text-muted-foreground">{projectStats.completed} completed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectStats.inProgress}</div>
          <p className="text-xs text-muted-foreground">{projectStats.dueThisWeek} due this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Team Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teamStats.total}</div>
          <p className="text-xs text-muted-foreground">{teamStats.active} active members</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projectStats.upcoming}</div>
          <p className="text-xs text-muted-foreground">Next: {projectStats.nextDeadline}</p>
        </CardContent>
      </Card>
    </div>
  )
}
