"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, KeyRound, Mail, Smartphone } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register" | "2fa"
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [verificationMethod, setVerificationMethod] = useState<"email" | "sms" | "authenticator">("authenticator")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-background py-3">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-none data-[state=active]:bg-background py-3">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Welcome back</DialogTitle>
              <DialogDescription>Enter your credentials to access your account</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setActiveTab("forgot")}>
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button className="w-full" onClick={() => setActiveTab("2fa")}>
                Sign in
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                Sign up
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Create an account</DialogTitle>
              <DialogDescription>Enter your details to create your account</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Button variant="link" className="p-0 h-auto">
                    terms of service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto">
                    privacy policy
                  </Button>
                </label>
              </div>
              <Button className="w-full">Create account</Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
                Sign in
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="2fa" className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Two-Factor Authentication</DialogTitle>
              <DialogDescription>Verify your identity to continue</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex justify-center gap-4 mb-6">
                <Button
                  variant={verificationMethod === "authenticator" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setVerificationMethod("authenticator")}
                >
                  <KeyRound className="h-4 w-4 mr-2" />
                  Authenticator
                </Button>
                <Button
                  variant={verificationMethod === "email" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setVerificationMethod("email")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant={verificationMethod === "sms" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setVerificationMethod("sms")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  SMS
                </Button>
              </div>

              {verificationMethod === "authenticator" && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="w-40 h-40 bg-white p-2 rounded-lg mx-auto">
                      <img
                        src="/placeholder.svg?height=160&width=160&text=QR+Code"
                        alt="QR Code"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Scan this QR code with your authenticator app
                  </p>
                  <div className="w-full space-y-2">
                    <Label htmlFor="code">Enter 6-digit code</Label>
                    <Input id="code" placeholder="000000" maxLength={6} className="text-center text-lg" />
                  </div>
                </div>
              )}

              {verificationMethod === "email" && (
                <div className="space-y-4">
                  <p className="text-sm text-center">
                    We've sent a verification code to your email address <strong>j***@example.com</strong>
                  </p>
                  <div className="w-full space-y-2">
                    <Label htmlFor="email-code">Enter verification code</Label>
                    <Input id="email-code" placeholder="000000" maxLength={6} className="text-center text-lg" />
                  </div>
                </div>
              )}

              {verificationMethod === "sms" && (
                <div className="space-y-4">
                  <p className="text-sm text-center">
                    We've sent a verification code to your phone number <strong>+1 (***) ***-4567</strong>
                  </p>
                  <div className="w-full space-y-2">
                    <Label htmlFor="sms-code">Enter verification code</Label>
                    <Input id="sms-code" placeholder="000000" maxLength={6} className="text-center text-lg" />
                  </div>
                </div>
              )}

              <Button className="w-full">Verify</Button>

              <div className="text-center">
                <Button variant="link" className="text-sm" onClick={() => setActiveTab("login")}>
                  Back to login
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forgot" className="p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Reset your password</DialogTitle>
              <DialogDescription>We'll send you a link to reset your password</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" placeholder="name@example.com" type="email" />
              </div>
              <Button className="w-full">Send reset link</Button>
            </div>

            <div className="text-center">
              <Button variant="link" className="text-sm" onClick={() => setActiveTab("login")}>
                Back to login
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
