"use client"

import { useState } from "react"
import { Mail, MoreHorizontal, Phone } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"

export function TeamMembers() {
  const [view, setView] = useState<"table" | "grid">("table")
  const { user } = useUser()

  const members = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "subham.m23csai@nst.rishihood.edu.in",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
    {
      id: "2",
      name: "Beth Smith",
      email: "beth@example.com",
      phone: "+1 (555) 234-5678",
      role: "Manager",
      department: "Design",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
    {
      id: "3",
      name: "Carl Davis",
      email: "carl@example.com",
      phone: "+1 (555) 345-6789",
      role: "Employee",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
    {
      id: "4",
      name: "Dana Wilson",
      email: "dana@example.com",
      phone: "+1 (555) 456-7890",
      role: "Employee",
      department: "Marketing",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
    {
      id: "5",
      name: "Eric Brown",
      email: "eric@example.com",
      phone: "+1 (555) 567-8901",
      role: "Manager",
      department: "Marketing",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
    {
      id: "6",
      name: "Fiona Green",
      email: "fiona@example.com",
      phone: "+1 (555) 678-9012",
      role: "Employee",
      department: "Design",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Inactive",
    },
    {
      id: "7",
      name: "Greg Hall",
      email: "greg@example.com",
      phone: "+1 (555) 789-0123",
      role: "Employee",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
    {
      id: "8",
      name: "Helen Irwin",
      email: "helen@example.com",
      phone: "+1 (555) 890-1234",
      role: "Client",
      department: "External",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Active",
    },
  ]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "Manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Employee":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Client":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const canEditTeamMembers = () => {
    return user?.role === "Admin" || user?.role === "Manager" || user?.role === "SuperAdmin"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">Manage your team members and their roles</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
            Table View
          </Button>
          <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
            Grid View
          </Button>
        </div>
      </div>

      {view === "table" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{member.department}</TableCell>
                    <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canEditTeamMembers() && (
                            <>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem>Reset Password</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                            </>
                          )}
                          {!canEditTeamMembers() && (
                            <>
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((member) => (
            <Card key={member.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <CardDescription>{member.department}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canEditTeamMembers() && (
                        <>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </>
                      )}
                      {!canEditTeamMembers() && (
                        <>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                    {member.role}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className={getStatusBadgeColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
