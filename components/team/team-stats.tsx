import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTeamStats } from "@/lib/data"
import { Users, UserCheck, UserMinus, Building } from "lucide-react"

export async function TeamStats() {
  const stats = await getTeamStats()

  // Get top departments (up to 3)
  const topDepartments = Object.entries(stats.byDepartment)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Across {Object.keys(stats.byDepartment).length} departments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((stats.active / stats.total) * 100)}% of total team
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive/On Leave</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total - stats.active}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(((stats.total - stats.active) / stats.total) * 100)}% of total team
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Department</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topDepartments.length > 0 ? topDepartments[0][0] : "None"}</div>
          <p className="text-xs text-muted-foreground">
            {topDepartments.length > 0 ? `${topDepartments[0][1]} members` : "No departments"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
