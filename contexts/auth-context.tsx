"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const storedUser = localStorage.getItem("auth_user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
        localStorage.removeItem("auth_user")
        localStorage.removeItem("auth_token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simple validation - in a real app, this would be a backend API call
      if (email === "demo@example.com" && password === "password") {
        const userData = {
          id: "user-1",
          name: "Demo User",
          email: "demo@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
        }

        // Store user data and token
        localStorage.setItem("auth_user", JSON.stringify(userData))
        localStorage.setItem("auth_token", "demo-token-12345")

        setUser(userData)

        toast({
          title: "Login successful",
          description: "Welcome back to WonderFlow!",
        })

        return true
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try demo@example.com / password",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would be a backend API call to create a user
      const userData = {
        id: `user-${Date.now()}`,
        name,
        email,
        avatar: "/placeholder.svg?height=32&width=32",
      }

      // Store user data and token
      localStorage.setItem("auth_user", JSON.stringify(userData))
      localStorage.setItem("auth_token", `token-${Date.now()}`)

      setUser(userData)

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/auth/login")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would send a password reset email
      toast({
        title: "Password reset email sent",
        description: `If an account exists for ${email}, you will receive a password reset link.`,
      })

      return true
    } catch (error) {
      console.error("Forgot password error:", error)
      toast({
        title: "Request failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would verify the token and update the password
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. You can now log in with your new password.",
      })

      return true
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        title: "Reset failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
