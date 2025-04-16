import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const department = searchParams.get("department")
  const status = searchParams.get("status")

  const supabase = createClient()
  let query = supabase.from("team_members").select("*")

  if (department) {
    query = query.eq("department", department)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const body = await request.json()

  const { data, error } = await supabase.from("team_members").insert(body).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  revalidatePath("/")
  revalidatePath("/team")

  return NextResponse.json(data[0])
}
