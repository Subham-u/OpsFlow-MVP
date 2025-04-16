"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  BarChart3,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PanelLeft,
  Settings,
  Users,
  Briefcase,
  CheckCircle,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/contexts/user-context"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
  badge?: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Projects",
      href: "/projects",
      icon: <Briefcase className="h-5 w-5" />,
      badge: "8",
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      title: "Team",
      href: "/team",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Time Tracking",
      href: "/time-tracking",
      icon: <Clock className="h-5 w-5" />,
      submenu: [
        {
          title: "Overview",
          href: "/time-tracking/overview",
          icon: <Home className="h-4 w-4" />,
        },
        {
          title: "Calendar",
          href: "/time-tracking/calendar",
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          title: "Pomodoro",
          href: "/time-tracking/pomodoro",
          icon: <Clock className="h-4 w-4" />,
        },
        {
          title: "Reports",
          href: "/time-tracking/reports",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: <CheckCircle className="h-5 w-5" />,
      submenu: [
        {
          title: "Overview",
          href: "/attendance/overview",
          icon: <Home className="h-4 w-4" />,
        },
        {
          title: "Team",
          href: "/attendance/team",
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: "Calendar",
          href: "/attendance/calendar",
          icon: <Calendar className="h-4 w-4" />,
        },
        {
          title: "Reports",
          href: "/attendance/reports",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Advanced Analytics",
      href: "/advanced-analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      submenu: [
        {
          title: "Dashboard",
          href: "/advanced-analytics",
          icon: <Home className="h-4 w-4" />,
        },
        {
          title: "Custom Reports",
          href: "/advanced-analytics/custom-reports",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Visualizations",
          href: "/advanced-analytics/visualizations",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          title: "What-If Analysis",
          href: "/advanced-analytics/what-if",
          icon: <BarChart3 className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Collaboration",
      href: "/collaboration",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: "Invoicing",
      href: "/invoicing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      submenu: [
        {
          title: "Account",
          href: "/settings/account",
          icon: <User className="h-4 w-4" />,
        },
        {
          title: "Notifications",
          href: "/settings/notifications",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          title: "Security",
          href: "/settings/security",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          title: "Appearance",
          href: "/settings/appearance",
          icon: <Settings className="h-4 w-4" />,
        },
      ],
    },
  ]

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40 rounded-full w-10 h-10 bg-background/80 backdrop-blur-sm border shadow-sm"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-purple rounded-lg p-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L17 7H7L12 2Z" fill="white" />
                    <path d="M17 7V17H7V7H17Z" fill="white" />
                    <path d="M7 17L12 22L17 17H7Z" fill="white" />
                  </svg>
                </div>
                <span className="font-semibold text-lg">WonderFlow</span>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.title} className="flex flex-col">
                    {item.submenu ? (
                      <>
                        <Button
                          variant="ghost"
                          className={cn(
                            "justify-between h-10 px-4 py-2 text-sm font-medium rounded-lg",
                            pathname.startsWith(item.href) && "bg-primary/10 text-primary",
                          )}
                          onClick={() => toggleSubmenu(item.title)}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.badge && (
                              <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                                {item.badge}
                              </span>
                            )}
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                openSubmenu === item.title && "transform rotate-180",
                              )}
                            />
                          </div>
                        </Button>
                        {openSubmenu === item.title && (
                          <div className="ml-8 mt-1 flex flex-col gap-1">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.title}
                                href={subitem.href}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg",
                                  pathname === subitem.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                {subitem.icon}
                                <span>{subitem.title}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between h-10 px-4 py-2 text-sm font-medium rounded-lg",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1.5 h-auto flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback>{user?.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start text-sm">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{user?.role}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:border-r md:h-screen">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-purple rounded-lg p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L17 7H7L12 2Z" fill="white" />
                <path d="M17 7V17H7V7H17Z" fill="white" />
                <path d="M7 17L12 22L17 17H7Z" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-lg">WonderFlow</span>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.title} className="flex flex-col">
                {item.submenu ? (
                  <>
                    <Button
                      variant="ghost"
                      className={cn(
                        "justify-between h-10 px-4 py-2 text-sm font-medium rounded-lg",
                        pathname.startsWith(item.href) && "bg-primary/10 text-primary",
                      )}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                            {item.badge}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openSubmenu === item.title && "transform rotate-180",
                          )}
                        />
                      </div>
                    </Button>
                    {openSubmenu === item.title && (
                      <div className="ml-8 mt-1 flex flex-col gap-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.title}
                            href={subitem.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg",
                              pathname === subitem.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                            )}
                          >
                            {subitem.icon}
                            <span>{subitem.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between h-10 px-4 py-2 text-sm font-medium rounded-lg",
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">{item.badge}</span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1.5 h-auto flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>{user?.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
