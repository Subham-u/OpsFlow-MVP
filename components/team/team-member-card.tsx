"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Mail, MoreVertical, Phone, Trash, UserCog } from "lucide-react"
import { EditTeamMemberDialog } from "@/components/team/edit-team-member-dialog"
import { DeleteTeamMemberDialog } from "@/components/team/delete-team-member-dialog"

interface TeamMemberCardProps {
  member: {
    id: string
    name: string
    email: string
    phone: string
    role: string
    department: string
    avatar: string | null
    status: string
  }
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "on leave":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-12 left-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage
                  src={member.avatar || `/placeholder.svg?height=96&width=96&query=${member.name}`}
                  alt={member.name}
                />
                <AvatarFallback className="text-xl">{getInitials(member.name)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute right-4 top-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/30">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-14">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{member.name}</h3>
              <Badge className={`${getStatusColor(member.status)} font-medium`} variant="outline">
                {member.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{member.role}</p>
            <p className="text-xs text-muted-foreground">{member.department}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Email</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
            <Phone className="h-4 w-4" />
            <span className="sr-only">Call</span>
          </Button>
        </CardFooter>
      </Card>

      <EditTeamMemberDialog member={member} open={showEditDialog} onOpenChange={setShowEditDialog} />

      <DeleteTeamMemberDialog
        memberId={member.id}
        memberName={member.name}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}
