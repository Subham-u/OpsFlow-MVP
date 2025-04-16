"use client"
import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/app-sidebar"
import { UserProvider } from "@/contexts/user-context"
import { TimeTrackingProvider } from "@/contexts/time-tracking-context"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Toaster } from "@/components/ui/toaster"
import { poppins } from "./fonts"
import { usePathname } from "next/navigation"

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")

  return (
    <html lang="en" suppressHydrationWarning className="flex flex-col">
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <UserProvider>
              <TimeTrackingProvider>
                <ProtectedRoute>
                  <div className="flex flex-col md:flex-row h-screen w-full">
                    {!isAuthPage && <AppSidebar />}
                    <div className="flex-1 w-full overflow-auto">{children}</div>
                  </div>
                </ProtectedRoute>
                <Toaster />
              </TimeTrackingProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
