"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip during initial load to avoid flashes
    if (isLoading) return

    // If not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated && !pathname?.startsWith("/auth/")) {
      router.push("/auth/login")
    }

    // If authenticated and on an auth page, redirect to dashboard
    if (isAuthenticated && pathname?.startsWith("/auth/")) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Show nothing while checking authentication
  if (isLoading) {
    return null
  }

  // If on auth page and not authenticated, or if authenticated and not on auth page, show content
  if ((pathname?.startsWith("/auth/") && !isAuthenticated) || (!pathname?.startsWith("/auth/") && isAuthenticated)) {
    return <>{children}</>
  }

  // Otherwise show nothing while redirecting
  return null
}
