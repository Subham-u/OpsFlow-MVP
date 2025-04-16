import type { Metadata } from "next"
import CalendarPage from "./calendar-page"

export const metadata: Metadata = {
  title: "Calendar | WonderFlow",
  description: "View your schedule and project deadlines",
}

export default function Page() {
  return <CalendarPage />
}
