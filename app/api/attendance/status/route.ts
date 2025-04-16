import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
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

  // Get user ID from query params
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
  }

  try {
    // Get today's date
    const today = new Date().toISOString().split("T")[0]

    // Get attendance record for today
    const { data, error } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching attendance status:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch attendance status" }, { status: 500 })
  }
}
