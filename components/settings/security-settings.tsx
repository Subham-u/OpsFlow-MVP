"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, AlertTriangle, Eye, EyeOff, LogOut, History, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SecuritySettings() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginNotifications, setLoginNotifications] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState("medium")

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "current":
        setShowPassword(!showPassword)
        break
      case "new":
        setShowNewPassword(!showNewPassword)
        break
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword)
        break
    }
  }

  const handleChangePassword = () => {
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    })
  }

  const handleEnableTwoFactor = () => {
    setTwoFactorEnabled(true)
    toast({
      title: "Two-factor authentication enabled",
      description: "Your account is now more secure with 2FA",
    })
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "strong":
        return "bg-green-500"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Password Management</CardTitle>
          </div>
          <CardDescription>Change your password and manage password security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your current password"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="newPassword">New Password</Label>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePasswordVisibility("new")}>
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  onChange={(e) => {
                    // Simple password strength check
                    const value = e.target.value
                    if (value.length < 8) {
                      setPasswordStrength("weak")
                    } else if (value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value)) {
                      setPasswordStrength("strong")
                    } else {
                      setPasswordStrength("medium")
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Password Strength</Label>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full ${getPasswordStrengthColor()}`} style={{ width: "60%" }} />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Weak</span>
              <span>Medium</span>
              <span>Strong</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Password must:</p>
            <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
              <li>Be at least 8 characters long</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>

          <Button onClick={handleChangePassword}>Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">Protect your account with an additional verification step</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          {!twoFactorEnabled ? (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Your account is less secure</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Two-factor authentication adds an important security layer to your account. We strongly recommend
                    enabling it.
                  </p>
                </div>
              </div>
              <Button className="mt-4" onClick={handleEnableTwoFactor}>
                Set Up Two-Factor Authentication
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Two-factor authentication is enabled</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your account is protected with an additional verification step.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Authentication Method</Label>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Using Google Authenticator or similar app for verification codes
                    </p>
                  </div>
                  <Badge className="ml-auto">Primary</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Recovery Codes</Label>
                <p className="text-sm text-muted-foreground">
                  Recovery codes can be used to access your account if you lose your 2FA device.
                </p>
                <Button variant="outline" size="sm">
                  View Recovery Codes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Login Activity</CardTitle>
          </div>
          <CardDescription>Monitor and manage your account access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified of new logins to your account</p>
            </div>
            <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Recent Login Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start justify-between p-3 border rounded-md">
                <div className="space-y-1">
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">Chrome on Windows • New York, USA</p>
                  <p className="text-xs text-muted-foreground">IP: 192.168.1.1 • April 7, 2025 at 11:42 PM</p>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>

              <div className="flex items-start justify-between p-3 border rounded-md">
                <div className="space-y-1">
                  <p className="font-medium">Previous Login</p>
                  <p className="text-sm text-muted-foreground">Safari on macOS • San Francisco, USA</p>
                  <p className="text-xs text-muted-foreground">IP: 192.168.1.2 • April 5, 2025 at 3:15 PM</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>

              <div className="flex items-start justify-between p-3 border rounded-md">
                <div className="space-y-1">
                  <p className="font-medium">Previous Login</p>
                  <p className="text-sm text-muted-foreground">Firefox on Linux • Chicago, USA</p>
                  <p className="text-xs text-muted-foreground">IP: 192.168.1.3 • April 2, 2025 at 9:30 AM</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              View All Login Activity
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" className="w-full sm:w-auto">
            Logout of All Other Sessions
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
