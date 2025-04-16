"use client"

import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarView } from "@/components/calendar/calendar-view"
import { Button } from "@/components/ui/button"
import { Printer, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CalendarPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <CalendarHeader />
  
      <main className="flex-1 w-full p-4 md:p-6">
        <CalendarView />
      </main>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          nav, header, footer, .no-print {
            display: none !important;
          }
          
          body, html {
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
          }
          
          main {
            padding: 0 !important;
          }
          
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
