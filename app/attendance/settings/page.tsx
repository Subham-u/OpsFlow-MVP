import { AttendanceHeader } from "@/components/attendance/attendance-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Attendance Settings | WonderFlow",
  description: "Configure attendance settings",
}

export default function AttendanceSettingsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AttendanceHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold">Attendance Settings</h2>
            <p className="text-muted-foreground">Configure your attendance preferences and policies</p>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="geofencing">Geofencing</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Working Hours</CardTitle>
                  <CardDescription>Configure your standard working hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="work-start">Work Start Time</Label>
                      <Input id="work-start" type="time" defaultValue="09:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="work-end">Work End Time</Label>
                      <Input id="work-end" type="time" defaultValue="17:00" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work-days">Working Days</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="bg-primary text-primary-foreground">
                        Mon
                      </Button>
                      <Button variant="outline" className="bg-primary text-primary-foreground">
                        Tue
                      </Button>
                      <Button variant="outline" className="bg-primary text-primary-foreground">
                        Wed
                      </Button>
                      <Button variant="outline" className="bg-primary text-primary-foreground">
                        Thu
                      </Button>
                      <Button variant="outline" className="bg-primary text-primary-foreground">
                        Fri
                      </Button>
                      <Button variant="outline">Sat</Button>
                      <Button variant="outline">Sun</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="flexible-hours">Flexible Working Hours</Label>
                        <p className="text-sm text-muted-foreground">Allow flexible clock in/out times</p>
                      </div>
                      <Switch id="flexible-hours" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="grace-period">Grace Period</Label>
                        <p className="text-sm text-muted-foreground">Allow a grace period for late arrivals</p>
                      </div>
                      <Switch id="grace-period" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grace-minutes">Grace Period (minutes)</Label>
                      <Input id="grace-minutes" type="number" defaultValue="15" min="0" max="60" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you receive attendance notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Clock In Reminders</Label>
                        <p className="text-sm text-muted-foreground">Receive reminders to clock in</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Clock Out Reminders</Label>
                        <p className="text-sm text-muted-foreground">Receive reminders to clock out</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Break Time Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts for break time</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Overtime Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts when approaching overtime</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly attendance reports</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Notification Methods</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="email-notifications" defaultChecked />
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="push-notifications" defaultChecked />
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="sms-notifications" />
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="geofencing" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Geofencing Settings</CardTitle>
                  <CardDescription>Configure location-based attendance tracking</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Geofencing</Label>
                      <p className="text-sm text-muted-foreground">Use location for attendance verification</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Office Locations</Label>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Main Office</h4>
                            <p className="text-sm text-muted-foreground">123 Business St, New York, NY 10001</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Branch Office</h4>
                            <p className="text-sm text-muted-foreground">456 Corporate Ave, San Francisco, CA 94107</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add New Location
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geofence-radius">Geofence Radius (meters)</Label>
                    <Input id="geofence-radius" type="number" defaultValue="100" min="50" max="500" />
                    <p className="text-xs text-muted-foreground">
                      The radius around office locations where attendance can be recorded
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="policies" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Policies</CardTitle>
                  <CardDescription>Configure attendance rules and policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="late-threshold">Late Threshold (minutes)</Label>
                    <Input id="late-threshold" type="number" defaultValue="15" min="0" max="60" />
                    <p className="text-xs text-muted-foreground">
                      Employees arriving after this many minutes will be marked as late
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="absent-threshold">Absent Threshold (minutes)</Label>
                    <Input id="absent-threshold" type="number" defaultValue="120" min="0" />
                    <p className="text-xs text-muted-foreground">
                      Employees arriving after this many minutes will be marked as absent
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="min-work-hours">Minimum Working Hours</Label>
                    <Input id="min-work-hours" type="number" defaultValue="8" min="0" max="24" step="0.5" />
                    <p className="text-xs text-muted-foreground">Minimum number of hours required per working day</p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Remote Work</Label>
                        <p className="text-sm text-muted-foreground">Enable attendance tracking for remote work</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Break Tracking</Label>
                        <p className="text-sm text-muted-foreground">Track break times for attendance</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Overtime</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow tracking hours beyond standard working hours
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
