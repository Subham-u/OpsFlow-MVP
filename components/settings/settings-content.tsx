"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Bell, Moon, Sun, User, Lock, Globe, BellRing, Clock, Palette } from "lucide-react"

export function SettingsContent() {
  const [theme, setTheme] = useState("light")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [language, setLanguage] = useState("english")
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminders: true,
    mentions: true,
    deadlines: true,
    updates: false,
    marketing: false,
  })
  const [timeTracking, setTimeTracking] = useState({
    autoStart: false,
    autoStop: true,
    roundTime: "nearest15",
    defaultProject: "none",
    pomodoroLength: 25,
    shortBreak: 5,
    longBreak: 15,
  })

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="profile" className="w-full">

        <TabsContent value="profile" className="space-y-6 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" defaultValue="Product Manager" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Write a short bio about yourself..."
                  defaultValue="Product Manager with 5+ years of experience in SaaS products. Passionate about user experience and data-driven decisions."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge>Product Management</Badge>
                  <Badge>UX Design</Badge>
                  <Badge>Data Analysis</Badge>
                  <Badge>Agile</Badge>
                  <Badge>Scrum</Badge>
                  <Badge variant="outline">+ Add Skill</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-md border-2 cursor-pointer ${theme === "light" ? "border-primary" : "border-border"}`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-md border-2 cursor-pointer ${theme === "dark" ? "border-primary" : "border-border"}`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-8 w-8 text-blue-500" />
                  </div>
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-md border-2 cursor-pointer ${theme === "system" ? "border-primary" : "border-border"}`}
                    onClick={() => setTheme("system")}
                  >
                    <div className="flex">
                      <Sun className="h-8 w-8 text-yellow-500" />
                      <Moon className="h-8 w-8 text-blue-500 -ml-4" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing and padding throughout the UI</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable animations and transitions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Avatars</Label>
                    <p className="text-sm text-muted-foreground">Display user avatars throughout the application</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <Select defaultValue="violet">
                  <SelectTrigger id="accentColor">
                    <SelectValue placeholder="Select accent color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="violet">Violet</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="fontSize">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="timetracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking Settings</CardTitle>
              <CardDescription>Configure how time tracking works for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-start timer when task is opened</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start tracking time when you open a task
                    </p>
                  </div>
                  <Switch
                    checked={timeTracking.autoStart}
                    onCheckedChange={(checked) => setTimeTracking({ ...timeTracking, autoStart: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-stop timer when switching tasks</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically stop tracking time when you switch to another task
                    </p>
                  </div>
                  <Switch
                    checked={timeTracking.autoStop}
                    onCheckedChange={(checked) => setTimeTracking({ ...timeTracking, autoStop: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="roundTime">Round tracked time to</Label>
                <Select
                  value={timeTracking.roundTime}
                  onValueChange={(value) => setTimeTracking({ ...timeTracking, roundTime: value })}
                >
                  <SelectTrigger id="roundTime">
                    <SelectValue placeholder="Select rounding option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Exact time (no rounding)</SelectItem>
                    <SelectItem value="nearest5">Nearest 5 minutes</SelectItem>
                    <SelectItem value="nearest15">Nearest 15 minutes</SelectItem>
                    <SelectItem value="up15">Up to 15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultProject">Default Project</Label>
                <Select
                  value={timeTracking.defaultProject}
                  onValueChange={(value) => setTimeTracking({ ...timeTracking, defaultProject: value })}
                >
                  <SelectTrigger id="defaultProject">
                    <SelectValue placeholder="Select default project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No default project</SelectItem>
                    <SelectItem value="project1">Website Redesign</SelectItem>
                    <SelectItem value="project2">Mobile App Development</SelectItem>
                    <SelectItem value="project3">Marketing Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Pomodoro Timer Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pomodoroLength">Pomodoro Length (minutes)</Label>
                    <Input
                      id="pomodoroLength"
                      type="number"
                      min="1"
                      max="60"
                      value={timeTracking.pomodoroLength}
                      onChange={(e) =>
                        setTimeTracking({ ...timeTracking, pomodoroLength: Number.parseInt(e.target.value) || 25 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortBreak">Short Break (minutes)</Label>
                    <Input
                      id="shortBreak"
                      type="number"
                      min="1"
                      max="30"
                      value={timeTracking.shortBreak}
                      onChange={(e) =>
                        setTimeTracking({ ...timeTracking, shortBreak: Number.parseInt(e.target.value) || 5 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longBreak">Long Break (minutes)</Label>
                    <Input
                      id="longBreak"
                      type="number"
                      min="1"
                      max="60"
                      value={timeTracking.longBreak}
                      onChange={(e) =>
                        setTimeTracking({ ...timeTracking, longBreak: Number.parseInt(e.target.value) || 15 })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control when and how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label>Email Notifications</Label>
                      <Badge variant="outline">Primary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <Label>Task Reminders</Label>
                    </div>
                    <Switch
                      checked={notifications.taskReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, taskReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <Label>Mentions</Label>
                    </div>
                    <Switch
                      checked={notifications.mentions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, mentions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <Label>Deadlines</Label>
                    </div>
                    <Switch
                      checked={notifications.deadlines}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, deadlines: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <Label>Project Updates</Label>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <Label>Marketing & Tips</Label>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="quietHours">Quiet Hours</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quietHoursStart" className="text-sm text-muted-foreground">
                      Start Time
                    </Label>
                    <Input id="quietHoursStart" type="time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quietHoursEnd" className="text-sm text-muted-foreground">
                      End Time
                    </Label>
                    <Input id="quietHoursEnd" type="time" defaultValue="08:00" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Configure language, time format, and other preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger id="timeFormat">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (1:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (13:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="dateFormat">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label>Start Week on Monday</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set Monday as the first day of the week in calendars
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Label>Auto-save</Label>
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Recommended
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show completed tasks</Label>
                    <p className="text-sm text-muted-foreground">Display completed tasks in task lists</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Keyboard Shortcuts</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New Task</span>
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">Ctrl+N</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Search</span>
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">Ctrl+/</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Save</span>
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">Ctrl+S</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Timer</span>
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">Alt+T</span>
                  </div>
                </div>
                <Button variant="link" size="sm" className="mt-2 h-auto p-0">
                  View all keyboard shortcuts
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Password must be at least 8 characters and include a number, a symbol, and an uppercase letter.
              </div>

              <Button className="mt-2">Change Password</Button>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline" disabled>
                  Set Up Two-Factor Authentication
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500 text-white p-1 rounded">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-muted-foreground">Calendar and Contact sync</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-700 text-white p-1 rounded">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Microsoft</p>
                        <p className="text-sm text-muted-foreground">Calendar and Teams integration</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-600 text-white p-1 rounded">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">Notifications and commands</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                <div className="space-y-2">
                  <Button variant="destructive">Delete Account</Button>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
