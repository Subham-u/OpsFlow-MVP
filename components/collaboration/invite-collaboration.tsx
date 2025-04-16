"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Link2, Mail, Plus, Users, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InviteCollaborationProps {
  projectId?: string
  projectName?: string
}

export function InviteCollaboration({ projectId, projectName = "Project" }: InviteCollaborationProps) {
  const { toast } = useToast()
  const [inviteType, setInviteType] = useState<"email" | "link">("email")
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail])
      setCurrentEmail("")
    }
  }

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://wonderflow.app/invite/${projectId}?role=${role}`)
    toast({
      title: "Link copied",
      description: "Invitation link has been copied to clipboard",
    })
  }

  const handleSendInvites = () => {
    toast({
      title: "Invitations sent",
      description: `Invitations sent to ${emails.length} collaborators`,
    })
    setEmails([])
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Users className="h-4 w-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite to collaborate</DialogTitle>
          <DialogDescription>Add team members to collaborate on {projectName}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 my-4">
          <Button
            variant={inviteType === "email" ? "default" : "outline"}
            size="sm"
            onClick={() => setInviteType("email")}
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button
            variant={inviteType === "link" ? "default" : "outline"}
            size="sm"
            onClick={() => setInviteType("link")}
            className="flex-1"
          >
            <Link2 className="h-4 w-4 mr-2" />
            Invite link
          </Button>
        </div>

        {inviteType === "email" ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Email addresses</Label>
                <div className="flex gap-2">
                  <Input
                    id="emails"
                    placeholder="name@example.com"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" onClick={handleAddEmail} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {emails.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/30">
                  {emails.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-1 py-1.5">
                      <Avatar className="h-4 w-4 mr-1">
                        <AvatarFallback className="text-[8px]">{email.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {email}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveEmail(email)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Permission</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer (can view)</SelectItem>
                    <SelectItem value="commenter">Commenter (can comment)</SelectItem>
                    <SelectItem value="editor">Editor (can edit)</SelectItem>
                    <SelectItem value="admin">Admin (full access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="notify" />
                <label
                  htmlFor="notify"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Notify people
                </label>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendInvites} disabled={emails.length === 0}>
                Send invites
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-role">Permission</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="link-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer (can view)</SelectItem>
                    <SelectItem value="commenter">Commenter (can comment)</SelectItem>
                    <SelectItem value="editor">Editor (can edit)</SelectItem>
                    <SelectItem value="admin">Admin (full access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="link-expiry" />
                <label
                  htmlFor="link-expiry"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Set expiry date
                </label>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      https://wonderflow.app/invite/{projectId}?role={role}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
