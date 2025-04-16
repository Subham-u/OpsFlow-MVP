"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { clockIn, clockOut } from "@/lib/actions/attendance-actions"
import { useUser } from "@/contexts/user-context"
import { MapPin, ClockIcon } from "lucide-react"
import { useFormState } from "react-dom"

export function ClockInOut() {
  const { user } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState("Office")
  const [notes, setNotes] = useState("")
  const [projectId, setProjectId] = useState("")
  const [projects, setProjects] = useState([])
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null })
  const [ipAddress, setIpAddress] = useState("")
  const [state, formAction] = useFormState(clockInAction, { success: false, message: null })

  // Get current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Check if user is already clocked in
  useEffect(() => {
    const checkClockInStatus = async () => {
      if (!user?.id) return

      try {
        // Fetch today's attendance record
        const response = await fetch(`/api/attendance/status?userId=${user.id}`)
        const data = await response.json()

        if (data.success && data.data) {
          setIsClockedIn(!!data.data.clock_in && !data.data.clock_out)
        }
      } catch (error) {
        console.error("Error checking clock in status:", error)
      }
    }

    checkClockInStatus()
  }, [user?.id])

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }

    // Get IP address
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => console.error("Error getting IP address:", error))

    // Fetch projects
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data)
        }
      })
      .catch((error) => console.error("Error fetching projects:", error))
  }, [])

  const handleClockIn = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to clock in",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("userId", user.id)
      formData.append("location", location)

      if (coordinates.latitude) {
        formData.append("latitude", coordinates.latitude.toString())
        formData.append("longitude", coordinates.longitude.toString())
      }

      if (ipAddress) {
        formData.append("ipAddress", ipAddress)
      }

      if (notes) {
        formData.append("notes", notes)
      }

      if (projectId) {
        formData.append("projectId", projectId)
      }

      const result = await clockIn(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "You have successfully clocked in",
        })
        setIsClockedIn(true)
        setNotes("")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to clock in",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Clock in error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClockOut = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to clock out",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("userId", user.id)

      if (notes) {
        formData.append("notes", notes)
      }

      const result = await clockOut(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "You have successfully clocked out",
        })
        setIsClockedIn(false)
        setNotes("")
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to clock out",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Clock out error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5" />
          Attendance
        </CardTitle>
        <CardDescription>Track your work hours by clocking in and out</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-center">
            <div className="text-4xl font-bold tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {currentTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>

          <div className="flex items-center justify-center mt-4">
            <div className={`text-lg font-semibold ${isClockedIn ? "text-green-500" : "text-yellow-500"}`}>
              {isClockedIn ? "Currently Clocked In" : "Not Clocked In"}
            </div>
          </div>

          {!isClockedIn && (
            <>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input
                    id="location"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project (Optional)</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about your work day"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form action={formAction}>
          <input type="hidden" name="userId" value={user?.id || ""} />
          <input type="hidden" name="location" value={location} />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : isClockedIn ? "Clock Out" : "Clock In"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

async function clockInAction(
  prevState: any,
  formData: FormData,
): Promise<{ success: boolean; message: string | null }> {
  const userId = formData.get("userId") as string
  const location = formData.get("location") as string

  if (!userId || !location) {
    return { success: false, message: "Missing required fields" }
  }

  try {
    // Simulate a successful clock-in
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true, message: "Clocked in successfully!" }
  } catch (error) {
    console.error("Clock in error:", error)
    return { success: false, message: "Failed to clock in. Please try again." }
  }
}
