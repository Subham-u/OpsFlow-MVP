"use client"

import type React from "react"

import { useState } from "react"
import { useUser, type UserStatus, type UserRole } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, Building, UserCircle, Shield, Clock, Save } from "lucide-react"

export function UserProfile() {
  const { user, updateUserStatus, updateUserRole } = useUser()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
  })

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>You need to be logged in to view your profile</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full">Log In</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleStatusChange = (status: string) => {
    updateUserStatus(status as UserStatus)
    toast({
      title: "Status updated",
      description: `Your status is now set to ${status}`,
    })
  }

  const handleRoleChange = (role: string) => {
    updateUserRole(role as UserRole)
    toast({
      title: "Role updated",
      description: `Your role is now set to ${role}`,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    // In a real app, you would save this to the backend
    // and then update the user context
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved",
    })
    setIsEditing(false)
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      case "Manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Employee":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Client":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      case "SuperAdmin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(
                    user.status,
                  )}`}
                />
              </div>
              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <Badge variant="outline" className={`mt-1 ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
              {user.department && <p className="text-sm text-muted-foreground">{user.department}</p>}

              <div className="mt-4 w-full">
                <Separator className="my-4" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Select defaultValue={user.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="away">Away</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(user.role === "Admin" || user.role === "SuperAdmin") && (
                  <div className="space-y-1 mt-4">
                    <p className="text-sm font-medium">Role</p>
                    <Select defaultValue={user.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Employee">Employee</SelectItem>
                        {user.role === "SuperAdmin" && <SelectItem value="SuperAdmin">Super Admin</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View and update your account details</CardDescription>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 border rounded-md">
                            <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{user.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 border rounded-md">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{user.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 border rounded-md">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{user.phone || "Not provided"}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        {isEditing ? (
                          <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            placeholder="Enter your department"
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 border rounded-md">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{user.department || "Not assigned"}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex items-center h-10 px-3 border rounded-md">
                        <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{user.role}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Change your password to keep your account secure.</p>
                      <Button variant="outline">Change Password</Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Login Sessions</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your active sessions and sign out from other devices.
                      </p>
                      <Button variant="outline">Manage Sessions</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notifications</h3>
                      <p className="text-sm text-muted-foreground">Configure how and when you receive notifications.</p>
                      <Button variant="outline">Notification Settings</Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Time Zone</h3>
                      <p className="text-sm text-muted-foreground">
                        Set your preferred time zone for accurate scheduling.
                      </p>
                      <div className="flex items-center h-10 px-3 border rounded-md">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>UTC-05:00 Eastern Time (US & Canada)</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Language</h3>
                      <p className="text-sm text-muted-foreground">Choose your preferred language.</p>
                      <div className="flex items-center h-10 px-3 border rounded-md">
                        <span>English (US)</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
