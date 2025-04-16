import { AttendanceHeader } from "@/components/attendance/attendance-header"
import { AttendanceStats } from "@/components/attendance/attendance-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Share2, Printer } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Attendance Reports | WonderFlow",
  description: "Generate and view attendance reports",
}

export default function AttendanceReportsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AttendanceHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Attendance Reports</h2>
              <p className="text-muted-foreground">Generate and analyze attendance reports</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="individual">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Report</SelectItem>
                  <SelectItem value="team">Team Report</SelectItem>
                  <SelectItem value="department">Department Report</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary Report</CardTitle>
                  <CardDescription>Overview of your attendance for the current month</CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceStats />

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="detailed">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Attendance Report</CardTitle>
                  <CardDescription>Day-by-day breakdown of your attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-left">Status</th>
                          <th className="p-2 text-left">Clock In</th>
                          <th className="p-2 text-left">Clock Out</th>
                          <th className="p-2 text-left">Working Hours</th>
                          <th className="p-2 text-left">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">May 1, 2023</td>
                          <td className="p-2">Present</td>
                          <td className="p-2">08:45 AM</td>
                          <td className="p-2">05:30 PM</td>
                          <td className="p-2">8h 45m</td>
                          <td className="p-2">Office</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">May 2, 2023</td>
                          <td className="p-2">Present</td>
                          <td className="p-2">08:50 AM</td>
                          <td className="p-2">05:45 PM</td>
                          <td className="p-2">8h 55m</td>
                          <td className="p-2">Office</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">May 3, 2023</td>
                          <td className="p-2">Present</td>
                          <td className="p-2">08:55 AM</td>
                          <td className="p-2">05:30 PM</td>
                          <td className="p-2">8h 35m</td>
                          <td className="p-2">Office</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">May 4, 2023</td>
                          <td className="p-2">Late</td>
                          <td className="p-2">09:15 AM</td>
                          <td className="p-2">05:30 PM</td>
                          <td className="p-2">8h 15m</td>
                          <td className="p-2">Office</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">May 5, 2023</td>
                          <td className="p-2">Absent</td>
                          <td className="p-2">-</td>
                          <td className="p-2">-</td>
                          <td className="p-2">0h</td>
                          <td className="p-2">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trends Report</CardTitle>
                  <CardDescription>Analyze your attendance patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Attendance trend visualization would appear here</p>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Attendance Report</CardTitle>
                  <CardDescription>Create a customized attendance report</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date Range</label>
                      <Select defaultValue="month">
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select defaultValue="summary">
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="trends">Trends</SelectItem>
                          <SelectItem value="exceptions">Exceptions Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="w-full">Generate Custom Report</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
