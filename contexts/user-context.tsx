"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "Admin" | "Manager" | "Employee" | "Client" | "SuperAdmin"

export type UserStatus = "online" | "away" | "busy" | "offline"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  initials: string
  role: UserRole
  department?: string
  status: UserStatus
  phone?: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  setUser: (user: User) => void
  updateUserStatus: (status: UserStatus) => void
  updateUserRole: (role: UserRole) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUserState] = useState<User | null>(null)

  // Simulate fetching user data on initial load
  useEffect(() => {
    const fetchUser = async () => {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock user data
      const userData: User = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
        role: "Admin",
        department: "Management",
        status: "online",
        phone: "+1 (555) 123-4567",
      }

      setUserState(userData)
      setIsLoading(false)
    }

    fetchUser()
  }, [])

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }, [user])

  const setUser = (userData: User) => {
    setUserState(userData)
  }

  const updateUserStatus = (status: UserStatus) => {
    if (user) {
      setUserState({ ...user, status })
    }
  }

  const updateUserRole = (role: UserRole) => {
    if (user) {
      setUserState({ ...user, role })
    }
  }

  const logout = () => {
    setUserState(null)
    localStorage.removeItem("user")
    // In a real app, you would also invalidate the session/token
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        setUser,
        updateUserStatus,
        updateUserRole,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
