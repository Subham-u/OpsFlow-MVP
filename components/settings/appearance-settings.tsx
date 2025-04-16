"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, Monitor, Check } from "lucide-react"

export function AppearanceSettings() {
  const { toast } = useToast()
  const [theme, setTheme] = useState("system")
  const [compactMode, setCompactMode] = useState(false)
  const [enableAnimations, setEnableAnimations] = useState(true)
  const [showAvatars, setShowAvatars] = useState(true)
  const [highContrastText, setHighContrastText] = useState(false)
  const [accentColor, setAccentColor] = useState("blue")
  const [fontSize, setFontSize] = useState("medium")
  const [textContrast, setTextContrast] = useState(100)

  const handleSave = () => {
    // In a real app, this would save to a database or local storage
    toast({
      title: "Settings saved",
      description: "Your appearance settings have been updated.",
    })
  }

  const handleReset = () => {
    // Reset to defaults
    setTheme("system")
    setCompactMode(false)
    setEnableAnimations(true)
    setShowAvatars(true)
    setHighContrastText(false)
    setAccentColor("blue")
    setFontSize("medium")
    setTextContrast(100)

    toast({
      title: "Settings reset",
      description: "Your appearance settings have been reset to defaults.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the application to match your preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred color theme for the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue={theme} value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              style={{ borderColor: theme === "light" ? "hsl(var(--primary))" : "" }}
            >
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Sun className="h-6 w-6 mb-3" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium leading-none">Light</p>
                {theme === "light" && <Check className="h-4 w-4 mx-auto mt-1 text-primary" />}
              </div>
            </Label>
            <Label
              htmlFor="dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              style={{ borderColor: theme === "dark" ? "hsl(var(--primary))" : "" }}
            >
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Moon className="h-6 w-6 mb-3" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium leading-none">Dark</p>
                {theme === "dark" && <Check className="h-4 w-4 mx-auto mt-1 text-primary" />}
              </div>
            </Label>
            <Label
              htmlFor="system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              style={{ borderColor: theme === "system" ? "hsl(var(--primary))" : "" }}
            >
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Monitor className="h-6 w-6 mb-3" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium leading-none">System</p>
                {theme === "system" && <Check className="h-4 w-4 mx-auto mt-1 text-primary" />}
              </div>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interface</CardTitle>
          <CardDescription>Customize how the interface looks and behaves.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce the size of UI elements to fit more content on screen.
                </p>
              </div>
              <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable animations and transitions throughout the interface.
                </p>
              </div>
              <Switch id="animations" checked={enableAnimations} onCheckedChange={setEnableAnimations} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="avatars">Show Avatars</Label>
                <p className="text-sm text-muted-foreground">
                  Display user avatars in comments, tasks, and other areas.
                </p>
              </div>
              <Switch id="avatars" checked={showAvatars} onCheckedChange={setShowAvatars} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast Text</Label>
                <p className="text-sm text-muted-foreground">Increase text contrast for better readability.</p>
              </div>
              <Switch id="high-contrast" checked={highContrastText} onCheckedChange={setHighContrastText} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <Select value={accentColor} onValueChange={setAccentColor}>
              <SelectTrigger id="accent-color">
                <SelectValue placeholder="Select accent color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="text-contrast">Text Contrast</Label>
              <span className="text-sm">{textContrast}%</span>
            </div>
            <Slider
              id="text-contrast"
              min={80}
              max={120}
              step={5}
              value={[textContrast]}
              onValueChange={(value) => setTextContrast(value[0])}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
