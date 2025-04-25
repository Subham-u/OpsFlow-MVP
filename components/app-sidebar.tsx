"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
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
  Settings,
  Users,
  Briefcase,
  CheckCircle,
  ChevronDown,
  LogOut,
  User,
  ChevronRight,
  Mail,
  MessageCircle,
  Search,
  Bell,
  X,
  Sparkles,
  Star,
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { signOut } from "next-auth/react"

interface AppItem {
  id: string
  title: string
  icon: React.ReactNode
  href: string
  color: string
  bgColor: string
  hoverColor: string
  activeColor: string
  notifications?: number
}

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
  badge?: string
  notifications?: number
  isNew?: boolean
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentApp, setCurrentApp] = useState("project-management")
  const { user } = useUser()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Auto-expand sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setIsExpanded(true)
      } else if (window.innerWidth <= 1024) {
        setIsExpanded(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const apps: AppItem[] = [
    {
      id: "project-management",
      title: "OpsFlow",
      icon: <Briefcase className="h-5 w-5" />,
      href: "/dashboard",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      hoverColor: "hover:bg-violet-500/20",
      activeColor: "bg-violet-500/20",
      notifications: 3,
    },
    {
      id: "mail",
      title: "LeadFlow",
      icon: <Mail className="h-5 w-5" />,
      href: "/mail",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      hoverColor: "hover:bg-blue-500/20",
      activeColor: "bg-blue-500/20",
    },
    // {
    //   id: "chat",
    //   title: "Chat",
    //   icon: <MessageCircle className="h-5 w-5" />,
    //   href: "/chat",
    //   color: "text-emerald-500",
    //   bgColor: "bg-emerald-500/10",
    //   hoverColor: "hover:bg-emerald-500/20",
    //   activeColor: "bg-emerald-500/20",
    //   notifications: 5,
    // },
    // {
    //   id: "calendar",
    //   title: "Calendar App",
    //   icon: <Calendar className="h-5 w-5" />,
    //   href: "/calendar-app",
    //   color: "text-amber-500",
    //   bgColor: "bg-amber-500/10",
    //   hoverColor: "hover:bg-amber-500/20",
    //   activeColor: "bg-amber-500/20",
    // },
    // {
    //   id: "analytics",
    //   title: "Analytics",
    //   icon: <BarChart3 className="h-5 w-5" />,
    //   href: "/analytics",
    //   color: "text-rose-500",
    //   bgColor: "bg-rose-500/10",
    //   hoverColor: "hover:bg-rose-500/20",
    //   activeColor: "bg-rose-500/20",
    // },
  ]

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
      notifications: 2,
    },
    {
      title: "Tasks",
      href: "/tasks",
      icon: <CheckCircle className="h-5 w-5" />,
      isNew: true,
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
      notifications: 1,
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
          isNew: true,
        },
        {
          title: "Reports",
          href: "/time-tracking/reports",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
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
          icon: <Sparkles className="h-4 w-4" />,
          isNew: true,
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
          icon: <Bell className="h-4 w-4" />,
        },
        {
          title: "Security",
          href: "/settings/security",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          title: "Appearance",
          href: "/settings/appearance",
          icon: <Star className="h-4 w-4" />,
        },
      ],
    },
  ]

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  // Get current app data
  const currentAppData = apps.find((app) => app.id === currentApp) || apps[0]

  // Animation variants
  const sidebarVariants = {
    expanded: { width: 280, opacity: 1, x: 0 },
    collapsed: { width: 80, opacity: 1, x: 0 },
  }

  const searchVariants = {
    open: { opacity: 1, y: 0, height: "auto" },
    closed: { opacity: 0, y: -10, height: 0 },
  }

  const submenuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        when: "beforeChildren",
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
      },
    },
  }

  const submenuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 },
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/auth/login")
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
        <SheetContent side="left" className="w-80 p-0 border-r border-border/50 backdrop-blur-xl bg-background/95">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("rounded-lg p-1.5", currentAppData.bgColor)}>{currentAppData.icon}</div>
                  <span className="font-semibold text-lg">{currentAppData.title}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 flex gap-2">
                {apps.map((app) => (
                  <Button
                    key={app.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex-1 relative",
                      currentApp === app.id ? app.activeColor : app.hoverColor,
                      app.color,
                    )}
                    onClick={() => setCurrentApp(app.id)}
                  >
                    {app.icon}
                    {app.notifications && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                      >
                        {app.notifications}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-9 bg-muted/50 border-none" />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4">
                <nav className="space-y-1.5">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      {item.submenu ? (
                        <>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-between group",
                              pathname.startsWith(item.href) && "bg-primary/10 text-primary",
                            )}
                            onClick={() => toggleSubmenu(item.title)}
                          >
                            <span className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.title}</span>
                              {item.isNew && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 h-5 border-green-500 text-green-500 text-[10px]"
                                >
                                  NEW
                                </Badge>
                              )}
                            </span>
                            <div className="flex items-center">
                              {item.notifications && (
                                <Badge variant="secondary" className="mr-2 h-5 px-1.5 bg-primary/10 text-primary">
                                  {item.notifications}
                                </Badge>
                              )}
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform duration-200",
                                  openSubmenu === item.title && "rotate-180",
                                )}
                              />
                            </div>
                          </Button>

                          <AnimatePresence initial={false}>
                            {openSubmenu === item.title && (
                              <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={submenuVariants}
                                className="overflow-hidden"
                              >
                                <div className="ml-4 mt-1 pl-4 border-l border-border/50 space-y-1">
                                  {item.submenu.map((subitem) => (
                                    <motion.div key={subitem.title} variants={submenuItemVariants}>
                                      <Button
                                        variant="ghost"
                                        className={cn(
                                          "w-full justify-start gap-2 h-9",
                                          pathname === subitem.href && "bg-primary/10 text-primary",
                                        )}
                                        asChild
                                      >
                                        <Link href={subitem.href}>
                                          {subitem.icon}
                                          <span>{subitem.title}</span>
                                          {subitem.isNew && (
                                            <Badge
                                              variant="outline"
                                              className="ml-2 h-5 border-green-500 text-green-500 text-[10px]"
                                            >
                                              NEW
                                            </Badge>
                                          )}
                                        </Link>
                                      </Button>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-between",
                            pathname === item.href && "bg-primary/10 text-primary",
                          )}
                          asChild
                        >
                          <Link href={item.href}>
                            <span className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.title}</span>
                              {item.isNew && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 h-5 border-green-500 text-green-500 text-[10px]"
                                >
                                  NEW
                                </Badge>
                              )}
                            </span>
                            {(item.badge || item.notifications) && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {item.badge || item.notifications}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1.5 h-auto flex items-center gap-2">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">{user?.initials}</AvatarFallback>
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
                    <DropdownMenuItem onClick={handleLogout}>
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

      {/* Desktop Two-Level Sidebar */}
      {isMounted && (
        <motion.div
          className="hidden md:block fixed inset-y-0 left-0 h-screen z-30"
          initial={isExpanded ? "expanded" : "collapsed"}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={sidebarVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="h-full flex flex-col border-r bg-background/95 backdrop-blur-sm">
            <div className="p-4 border-b flex items-center justify-between">
              {isExpanded ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className={cn("rounded-lg p-1.5", currentAppData.bgColor)}>{currentAppData.icon}</div>
                    <span className="font-semibold text-lg">{currentAppData.title}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("rounded-xl", currentAppData.bgColor, currentAppData.color)}
                        onClick={() => setIsExpanded(true)}
                      >
                        {currentAppData.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{currentAppData.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {isExpanded ? (
              <>
                <div className="p-4 border-b">
                  <div className="flex gap-2">
                    {apps.map((app) => (
                      <Button
                        key={app.id}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "flex-1 relative",
                          currentApp === app.id ? app.activeColor : app.hoverColor,
                          app.color,
                        )}
                        onClick={() => setCurrentApp(app.id)}
                      >
                        {app.icon}
                        {app.notifications && (
                          <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                          >
                            {app.notifications}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search..." className="pl-9 bg-muted/50 border-none" />
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4">
                    <nav className="space-y-1.5">
                      {navItems.map((item) => (
                        <div key={item.title}>
                          {item.submenu ? (
                            <>
                              <Button
                                variant="ghost"
                                className={cn(
                                  "w-full justify-between group",
                                  pathname.startsWith(item.href) && "bg-primary/10 text-primary",
                                )}
                                onClick={() => toggleSubmenu(item.title)}
                              >
                                <span className="flex items-center gap-2">
                                  {item.icon}
                                  <span>{item.title}</span>
                                  {item.isNew && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 h-5 border-green-500 text-green-500 text-[10px]"
                                    >
                                      NEW
                                    </Badge>
                                  )}
                                </span>
                                <div className="flex items-center">
                                  {item.notifications && (
                                    <Badge variant="secondary" className="mr-2 h-5 px-1.5 bg-primary/10 text-primary">
                                      {item.notifications}
                                    </Badge>
                                  )}
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 transition-transform duration-200",
                                      openSubmenu === item.title && "rotate-180",
                                    )}
                                  />
                                </div>
                              </Button>

                              <AnimatePresence initial={false}>
                                {openSubmenu === item.title && (
                                  <motion.div
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={submenuVariants}
                                    className="overflow-hidden"
                                  >
                                    <div className="ml-4 mt-1 pl-4 border-l border-border/50 space-y-1">
                                      {item.submenu.map((subitem) => (
                                        <motion.div key={subitem.title} variants={submenuItemVariants}>
                                          <Button
                                            variant="ghost"
                                            className={cn(
                                              "w-full justify-start gap-2 h-9",
                                              pathname === subitem.href && "bg-primary/10 text-primary",
                                            )}
                                            asChild
                                          >
                                            <Link href={subitem.href}>
                                              {subitem.icon}
                                              <span>{subitem.title}</span>
                                              {subitem.isNew && (
                                                <Badge
                                                  variant="outline"
                                                  className="ml-2 h-5 border-green-500 text-green-500 text-[10px]"
                                                >
                                                  NEW
                                                </Badge>
                                              )}
                                            </Link>
                                          </Button>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-between",
                                pathname === item.href && "bg-primary/10 text-primary",
                              )}
                              asChild
                            >
                              <Link href={item.href}>
                                <span className="flex items-center gap-2">
                                  {item.icon}
                                  <span>{item.title}</span>
                                  {item.isNew && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 h-5 border-green-500 text-green-500 text-[10px]"
                                    >
                                      NEW
                                    </Badge>
                                  )}
                                </span>
                                {(item.badge || item.notifications) && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    {item.badge || item.notifications}
                                  </Badge>
                                )}
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </nav>
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-1.5 h-auto flex items-center gap-2">
                          <Avatar className="h-8 w-8 border-2 border-primary/20">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">{user?.initials}</AvatarFallback>
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
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <ThemeToggle />
                  </div>
                </div>
              </>
            ) : (
              <>
                <ScrollArea className="flex-1">
                  <div className="py-4 px-2">
                    <div className="space-y-3">
                      <TooltipProvider delayDuration={100}>
                        {apps.map((app) => (
                          <Tooltip key={app.id}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "w-full h-12 rounded-xl relative group transition-all duration-200",
                                  currentApp === app.id ? cn(app.activeColor, app.color) : "hover:bg-muted",
                                )}
                                onClick={() => setCurrentApp(app.id)}
                              >
                                <div
                                  className={cn(
                                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-all duration-200",
                                    currentApp === app.id
                                      ? "bg-current opacity-100"
                                      : "opacity-0 group-hover:opacity-50",
                                  )}
                                />
                                {app.icon}
                                {app.notifications && (
                                  <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                                  >
                                    {app.notifications}
                                  </Badge>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{app.title}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}

                        <div className="pt-2">
                          {navItems.map((item) => (
                            <Tooltip key={item.title}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "w-full h-12 rounded-xl relative group transition-all duration-200 my-1",
                                    pathname === item.href || pathname.startsWith(item.href + "/")
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-muted",
                                  )}
                                  onClick={() => {
                                    if (item.submenu) {
                                      setIsExpanded(true)
                                      toggleSubmenu(item.title)
                                    }
                                  }}
                                  asChild={!item.submenu}
                                >
                                  {!item.submenu ? (
                                    <Link href={item.href}>
                                      <div
                                        className={cn(
                                          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-all duration-200",
                                          pathname === item.href || pathname.startsWith(item.href + "/")
                                            ? "bg-primary opacity-100"
                                            : "opacity-0 group-hover:opacity-50 bg-foreground",
                                        )}
                                      />
                                      {item.icon}
                                      {item.notifications && (
                                        <Badge
                                          variant="destructive"
                                          className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                                        >
                                          {item.notifications}
                                        </Badge>
                                      )}
                                    </Link>
                                  ) : (
                                    <>
                                      <div
                                        className={cn(
                                          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full transition-all duration-200",
                                          pathname.startsWith(item.href)
                                            ? "bg-primary opacity-100"
                                            : "opacity-0 group-hover:opacity-50 bg-foreground",
                                        )}
                                      />
                                      {item.icon}
                                      {item.notifications && (
                                        <Badge
                                          variant="destructive"
                                          className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                                        >
                                          {item.notifications}
                                        </Badge>
                                      )}
                                    </>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>{item.title}</p>
                                {item.submenu && <p className="text-xs text-muted-foreground">Click to expand</p>}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </TooltipProvider>
                    </div>
                  </div>
                </ScrollArea>

                <div className="p-2 border-t">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-full rounded-xl hover:bg-muted"
                          onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                          <Search className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Search</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-full rounded-xl hover:bg-muted mt-2">
                              <Avatar className="h-8 w-8 border-2 border-primary/20">
                                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">{user?.initials}</AvatarFallback>
                              </Avatar>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
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
                            <DropdownMenuItem onClick={handleLogout}>
                              <LogOut className="mr-2 h-4 w-4" />
                              Log out
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Profile</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-full rounded-xl hover:bg-muted mt-2">
                          <ThemeToggle />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Toggle Theme</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Main content padding to prevent overlap */}
      <div className={cn("transition-all duration-300", isExpanded ? "md:ml-[280px]" : "md:ml-[80px]")} />
    </>
  )
}
