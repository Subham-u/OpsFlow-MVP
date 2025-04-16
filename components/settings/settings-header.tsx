"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Settings, User, Bell, Shield, Palette, Database, Mail } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function SettingsHeader() {
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [activeView, setActiveView] = useState("general")
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize active view based on pathname
  useState(() => {
    if (pathname) {
      if (pathname === "/settings") {
        setActiveView("general")
      } else {
        const segments = pathname.split("/")
        const lastSegment = segments[segments.length - 1]
        if (lastSegment) {
          setActiveView(lastSegment)
        }
      }
    }
  })

  const navigateToView = (view: string) => {
    setActiveView(view)

    // Navigate to the appropriate route
    if (view === "general") {
      router.push("/settings")
    } else {
      router.push(`/settings/${view}`)
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        <div className="w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search settings..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Settings reset",
                description: "All settings have been reset to default values",
              })
            }}
          >
            Reset Defaults
          </Button>
          <Button
            size="sm"
            onClick={() => {
              toast({
                title: "Settings saved",
                description: "Your settings have been saved successfully",
              })
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex space-x-4">
          <Button
            variant={activeView === "general" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("general")}
          >
            <Settings className="h-4 w-4 mr-2" />
            General
          </Button>
          <Button
            variant={activeView === "account" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("account")}
          >
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>
          <Button
            variant={activeView === "notifications" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("notifications")}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button
            variant={activeView === "security" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("security")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
          <Button
            variant={activeView === "appearance" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("appearance")}
          >
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </Button>
          <Button
            variant={activeView === "integrations" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("integrations")}
          >
            <Database className="h-4 w-4 mr-2" />
            Integrations
          </Button>
          <Button
            variant={activeView === "email" ? "default" : "ghost"}
            size="sm"
            className="flex items-center"
            onClick={() => navigateToView("email")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </div>
    </header>
  )
}
