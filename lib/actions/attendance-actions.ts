"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { sendEmail } from "../email/send-email"
import {
  getClockInTemplate,
  getClockOutTemplate,
  getLeaveRequestSubmittedTemplate,
  getLeaveRequestUpdateTemplate,
  getLeaveRequestManagerTemplate,
  getAttendanceReportTemplate,
} from "../email/email-templates"
import { formatDistanceStrict } from "date-fns"
import { revalidatePath } from "next/cache"

// Helper function to get Supabase client
const getSupabase = () => {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
}

// Clock In action
export async function clockIn(formData: FormData) {
  try {
    const supabase = getSupabase()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, message: "You must be logged in to clock in" }
    }

    const userId = formData.get("userId") as string
    const location = formData.get("location") as string
    const latitude = formData.get("latitude") as string
    const longitude = formData.get("longitude") as string
    const notes = formData.get("notes") as string
    const projectId = (formData.get("projectId") as string) || null

    const now = new Date()
    const today = now.toISOString().split("T")[0]

    // Check if user already clocked in today
    const { data: existingRecord } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (existingRecord && existingRecord.clock_in) {
      return { success: false, message: "You have already clocked in today" }
    }

    // Get attendance settings
    const { data: settings } = await supabase.from("attendance_settings").select("*").limit(1).single()

    // Determine if user is late
    let status = "present"
    if (settings) {
      const workStartTime = new Date(`${today}T${settings.work_start_time}`)
      const lateThreshold = new Date(workStartTime.getTime() + settings.late_threshold_minutes * 60 * 1000)

      if (now > lateThreshold) {
        status = "late"
      }
    }

    // Create or update attendance record
    let record
    if (existingRecord) {
      const { data, error } = await supabase
        .from("attendance_records")
        .update({
          clock_in: now.toISOString(),
          status,
          location,
          latitude: latitude ? Number.parseFloat(latitude) : null,
          longitude: longitude ? Number.parseFloat(longitude) : null,
          project_id: projectId,
          notes,
          updated_at: now.toISOString(),
        })
        .eq("id", existingRecord.id)
        .select()
        .single()

      if (error) throw error
      record = data
    } else {
      const { data, error } = await supabase
        .from("attendance_records")
        .insert({
          user_id: userId,
          clock_in: now.toISOString(),
          date: today,
          status,
          location,
          latitude: latitude ? Number.parseFloat(latitude) : null,
          longitude: longitude ? Number.parseFloat(longitude) : null,
          project_id: projectId,
          notes,
          ip_address: (formData.get("ipAddress") as string) || null,
        })
        .select()
        .single()

      if (error) throw error
      record = data
    }

    // Get user details for email
    const { data: user } = await supabase.from("team_members").select("*").eq("id", userId).single()

    if (user && user.email) {
      // Send email notification
      const clockInTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const dateFormatted = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      await sendEmail({
        to: user.email,
        subject: "Clock In Confirmation",
        html: getClockInTemplate(
          { id: user.id, name: user.name, email: user.email },
          clockInTime,
          dateFormatted,
          location || "Not specified",
        ),
      })
    }

    revalidatePath("/attendance")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Clocked in successfully",
      data: record,
    }
  } catch (error) {
    console.error("Clock in error:", error)
    return {
      success: false,
      message: "Failed to clock in. Please try again.",
    }
  }
}

// Clock Out action
export async function clockOut(formData: FormData) {
  try {
    const supabase = getSupabase()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, message: "You must be logged in to clock out" }
    }

    const userId = formData.get("userId") as string
    const notes = formData.get("notes") as string

    const now = new Date()
    const today = now.toISOString().split("T")[0]

    // Check if user has clocked in today
    const { data: record } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (!record) {
      return { success: false, message: "You have not clocked in today" }
    }

    if (record.clock_out) {
      return { success: false, message: "You have already clocked out today" }
    }

    // Update attendance record with clock out time
    const { data: updatedRecord, error } = await supabase
      .from("attendance_records")
      .update({
        clock_out: now.toISOString(),
        notes: notes ? (record.notes ? `${record.notes}\n\nClock out notes: ${notes}` : notes) : record.notes,
        updated_at: now.toISOString(),
      })
      .eq("id", record.id)
      .select()
      .single()

    if (error) throw error

    // Get user details for email
    const { data: user } = await supabase.from("team_members").select("*").eq("id", userId).single()

    if (user && user.email && updatedRecord) {
      // Calculate hours worked
      const clockIn = new Date(updatedRecord.clock_in)
      const clockOut = new Date(updatedRecord.clock_out)
      const hoursWorked = formatDistanceStrict(clockIn, clockOut)

      // Send email notification
      const clockOutTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const dateFormatted = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      await sendEmail({
        to: user.email,
        subject: "Clock Out Confirmation",
        html: getClockOutTemplate(
          { id: user.id, name: user.name, email: user.email },
          clockOutTime,
          dateFormatted,
          hoursWorked,
        ),
      })
    }

    revalidatePath("/attendance")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Clocked out successfully",
      data: updatedRecord,
    }
  } catch (error) {
    console.error("Clock out error:", error)
    return {
      success: false,
      message: "Failed to clock out. Please try again.",
    }
  }
}

// Submit Leave Request action
export async function submitLeaveRequest(formData: FormData) {
  try {
    const supabase = getSupabase()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, message: "You must be logged in to submit a leave request" }
    }

    const userId = formData.get("userId") as string
    const leaveType = formData.get("leaveType") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const reason = formData.get("reason") as string

    // Create leave request
    const { data: leaveRequest, error } = await supabase
      .from("leave_requests")
      .insert({
        user_id: userId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        status: "pending",
        reason,
      })
      .select()
      .single()

    if (error) throw error

    // Get user details for email
    const { data: user } = await supabase.from("team_members").select("*").eq("id", userId).single()

    if (user && user.email) {
      // Send email notification to employee
      await sendEmail({
        to: user.email,
        subject: "Leave Request Submitted",
        html: getLeaveRequestSubmittedTemplate(
          { id: user.id, name: user.name, email: user.email },
          leaveType,
          new Date(startDate).toLocaleDateString(),
          new Date(endDate).toLocaleDateString(),
          reason,
        ),
      })

      // Get manager details and send notification
      const { data: managers } = await supabase.from("team_members").select("*").eq("role", "manager")

      if (managers && managers.length > 0) {
        for (const manager of managers) {
          if (manager.email) {
            await sendEmail({
              to: manager.email,
              subject: "New Leave Request",
              html: getLeaveRequestManagerTemplate(
                { id: user.id, name: user.name, email: user.email },
                { id: manager.id, name: manager.name, email: manager.email },
                leaveType,
                new Date(startDate).toLocaleDateString(),
                new Date(endDate).toLocaleDateString(),
                reason,
              ),
            })
          }
        }
      }
    }

    revalidatePath("/attendance/leave")

    return {
      success: true,
      message: "Leave request submitted successfully",
      data: leaveRequest,
    }
  } catch (error) {
    console.error("Leave request error:", error)
    return {
      success: false,
      message: "Failed to submit leave request. Please try again.",
    }
  }
}

// Update Leave Request Status action
export async function updateLeaveRequestStatus(formData: FormData) {
  try {
    const supabase = getSupabase()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, message: "You must be logged in to update a leave request" }
    }

    const leaveRequestId = formData.get("leaveRequestId") as string
    const status = formData.get("status") as "approved" | "rejected"
    const approvedById = formData.get("approvedById") as string
    const notes = formData.get("notes") as string

    // Update leave request
    const { data: updatedRequest, error } = await supabase
      .from("leave_requests")
      .update({
        status,
        approved_by: approvedById,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leaveRequestId)
      .select()
      .single()

    if (error) throw error

    // Get leave request details
    const { data: leaveRequest } = await supabase
      .from("leave_requests")
      .select("*, team_members(*)")
      .eq("id", leaveRequestId)
      .single()

    if (leaveRequest && leaveRequest.team_members && leaveRequest.team_members.email) {
      const user = leaveRequest.team_members

      // Send email notification to employee
      await sendEmail({
        to: user.email,
        subject: `Leave Request ${status === "approved" ? "Approved" : "Rejected"}`,
        html: getLeaveRequestUpdateTemplate(
          { id: user.id, name: user.name, email: user.email },
          leaveRequest.leave_type,
          new Date(leaveRequest.start_date).toLocaleDateString(),
          new Date(leaveRequest.end_date).toLocaleDateString(),
          status,
          notes,
        ),
      })

      // If approved, update leave balance
      if (status === "approved") {
        const startDate = new Date(leaveRequest.start_date)
        const endDate = new Date(leaveRequest.end_date)
        const daysRequested = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

        // Get current year
        const currentYear = new Date().getFullYear()

        // Get or create leave balance
        const { data: leaveBalance } = await supabase
          .from("leave_balances")
          .select("*")
          .eq("user_id", user.id)
          .eq("leave_type", leaveRequest.leave_type)
          .eq("year", currentYear)
          .single()

        if (leaveBalance) {
          // Update existing balance
          await supabase
            .from("leave_balances")
            .update({
              used: leaveBalance.used + daysRequested,
              updated_at: new Date().toISOString(),
            })
            .eq("id", leaveBalance.id)
        } else {
          // Create new balance record
          await supabase.from("leave_balances").insert({
            user_id: user.id,
            leave_type: leaveRequest.leave_type,
            balance: 0,
            allocated: 0,
            used: daysRequested,
            year: currentYear,
          })
        }
      }
    }

    revalidatePath("/attendance/leave")
    revalidatePath("/attendance/leave/manage")

    return {
      success: true,
      message: `Leave request ${status} successfully`,
      data: updatedRequest,
    }
  } catch (error) {
    console.error("Update leave request error:", error)
    return {
      success: false,
      message: "Failed to update leave request. Please try again.",
    }
  }
}

// Get Attendance Records action
export async function getAttendanceRecords(userId: string, startDate: string, endDate: string) {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false })

    if (error) throw error

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get attendance records error:", error)
    return {
      success: false,
      message: "Failed to fetch attendance records",
      data: [],
    }
  }
}

// Get Team Attendance Records action
export async function getTeamAttendanceRecords(date: string) {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("attendance_records")
      .select("*, team_members(id, name, email, role, department)")
      .eq("date", date)

    if (error) throw error

    // Get all team members
    const { data: allTeamMembers, error: teamError } = await supabase
      .from("team_members")
      .select("id, name, email, role, department")
      .eq("status", "active")

    if (teamError) throw teamError

    // Create a map of attendance records by user ID
    const attendanceMap = new Map()
    data.forEach((record) => {
      attendanceMap.set(record.user_id, record)
    })

    // Create complete team attendance data
    const teamAttendance = allTeamMembers.map((member) => {
      const attendanceRecord = attendanceMap.get(member.id)

      return {
        user: member,
        attendance: attendanceRecord || {
          user_id: member.id,
          date,
          status: "absent",
          clock_in: null,
          clock_out: null,
        },
      }
    })

    return {
      success: true,
      data: teamAttendance,
    }
  } catch (error) {
    console.error("Get team attendance records error:", error)
    return {
      success: false,
      message: "Failed to fetch team attendance records",
      data: [],
    }
  }
}

// Generate Attendance Report action
export async function generateAttendanceReport(userId: string, month: number, year: number) {
  try {
    const supabase = getSupabase()

    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const startDateStr = startDate.toISOString().split("T")[0]
    const endDateStr = endDate.toISOString().split("T")[0]

    // Get attendance records for the month
    const { data, error } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDateStr)
      .lte("date", endDateStr)

    if (error) throw error

    // Get attendance settings
    const { data: settings } = await supabase.from("attendance_settings").select("*").limit(1).single()

    // Calculate working days in the month
    const workingDays = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      // If settings exist, check if the day is a working day
      if (settings && settings.working_days.includes(currentDate.getDay())) {
        workingDays.push(new Date(currentDate))
      } else if (!settings) {
        // If no settings, assume Monday-Friday are working days
        const day = currentDate.getDay()
        if (day !== 0 && day !== 6) {
          // 0 = Sunday, 6 = Saturday
          workingDays.push(new Date(currentDate))
        }
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate statistics
    const totalWorkingDays = workingDays.length

    // Create a map of attendance records by date
    const attendanceByDate = new Map()
    data.forEach((record) => {
      attendanceByDate.set(record.date, record)
    })

    // Count present, absent, and late days
    let presentDays = 0
    let lateDays = 0
    let totalHours = 0

    workingDays.forEach((day) => {
      const dateStr = day.toISOString().split("T")[0]
      const record = attendanceByDate.get(dateStr)

      if (record) {
        if (record.status === "present") {
          presentDays++
        } else if (record.status === "late") {
          presentDays++
          lateDays++
        }

        // Calculate hours worked if both clock in and clock out exist
        if (record.clock_in && record.clock_out) {
          const clockIn = new Date(record.clock_in)
          const clockOut = new Date(record.clock_out)
          const hoursWorked = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
          totalHours += hoursWorked
        }
      }
    })

    const absentDays = totalWorkingDays - presentDays

    // Get user details for email
    const { data: user } = await supabase.from("team_members").select("*").eq("id", userId).single()

    if (user && user.email) {
      // Format month name
      const monthName = new Date(year, month - 1, 1).toLocaleString("default", { month: "long" })

      // Send email with report
      await sendEmail({
        to: user.email,
        subject: `Attendance Report - ${monthName} ${year}`,
        html: getAttendanceReportTemplate(
          { id: user.id, name: user.name, email: user.email },
          `${monthName} ${year}`,
          totalWorkingDays,
          presentDays,
          absentDays,
          lateDays,
          totalHours,
        ),
      })
    }

    return {
      success: true,
      data: {
        totalWorkingDays,
        presentDays,
        absentDays,
        lateDays,
        totalHours,
        attendanceRate: totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0,
        records: data,
      },
    }
  } catch (error) {
    console.error("Generate attendance report error:", error)
    return {
      success: false,
      message: "Failed to generate attendance report",
      data: null,
    }
  }
}

// Get Leave Requests action
export async function getLeaveRequests(userId: string) {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("leave_requests")
      .select("*, approved_by:team_members(id, name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get leave requests error:", error)
    return {
      success: false,
      message: "Failed to fetch leave requests",
      data: [],
    }
  }
}

// Get Pending Leave Requests action (for managers)
export async function getPendingLeaveRequests() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from("leave_requests")
      .select("*, team_members(id, name, email, role, department)")
      .eq("status", "pending")
      .order("created_at", { ascending: true })

    if (error) throw error

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get pending leave requests error:", error)
    return {
      success: false,
      message: "Failed to fetch pending leave requests",
      data: [],
    }
  }
}

// Start Break action
export async function startBreak(formData: FormData) {
  try {
    const supabase = getSupabase()

    const attendanceId = formData.get("attendanceId") as string
    const breakType = formData.get("breakType") as string

    const now = new Date()

    // Create break record
    const { data, error } = await supabase
      .from("attendance_breaks")
      .insert({
        attendance_id: attendanceId,
        break_start: now.toISOString(),
        break_type: breakType,
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath("/attendance")

    return {
      success: true,
      message: "Break started successfully",
      data,
    }
  } catch (error) {
    console.error("Start break error:", error)
    return {
      success: false,
      message: "Failed to start break. Please try again.",
    }
  }
}

// End Break action
export async function endBreak(formData: FormData) {
  try {
    const supabase = getSupabase()

    const breakId = formData.get("breakId") as string

    const now = new Date()

    // Update break record
    const { data, error } = await supabase
      .from("attendance_breaks")
      .update({
        break_end: now.toISOString(),
      })
      .eq("id", breakId)
      .select()
      .single()

    if (error) throw error

    revalidatePath("/attendance")

    return {
      success: true,
      message: "Break ended successfully",
      data,
    }
  } catch (error) {
    console.error("End break error:", error)
    return {
      success: false,
      message: "Failed to end break. Please try again.",
    }
  }
}
