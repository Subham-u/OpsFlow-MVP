"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail, MoreHorizontal, Phone } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TeamMemberCardProps {
  member: {
    id: string
    name: string
    email: string
    phone?: string
    role: string
    department?: string
    avatar?: string
    status: "Active" | "Inactive" | "Away" | "Busy"
    isVerified?: boolean
  }
  className?: string
  onAction?: (action: string, memberId: string) => void
}

export function TeamMemberCard({ member, className, onAction }: TeamMemberCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success"
      case "Inactive":
        return "bg-muted"
      case "Away":
        return "bg-warning"
      case "Busy":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "purple"
      case "Manager":
        return "blue"
      case "Employee":
        return "green"
      case "Client":
        return "orange"
      default:
        return "secondary"
    }
  }

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback className="text-lg">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background",
                getStatusColor(member.status),
              )}
            />
            {member.isVerified && (
              <div className="absolute top-0 right-0 bg-info text-white rounded-full p-1 border-2 border-background">
                <CheckCircle className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="font-medium text-base flex items-center justify-center gap-1">{member.name}</h3>
            <div className="flex items-center justify-center">
              <Badge variant={getRoleBadgeVariant(member.role) as any} className="text-xs font-normal">
                {member.role}
              </Badge>
            </div>
            {member.department && <p className="text-xs text-muted-foreground">{member.department}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-6 pt-0">
        <div className="w-full flex flex-col gap-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Mail className="h-3.5 w-3.5 mr-2" />
            {member.email}
          </Button>
          {member.phone && (
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Phone className="h-3.5 w-3.5 mr-2" />
              {member.phone}
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <Button variant="default" size="sm" className="flex-1 mr-2">
            Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction?.("view", member.id)}>View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.("edit", member.id)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction?.("deactivate", member.id)} className="text-destructive">
                {member.status === "Active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}
