"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

export function TimeTrackingSettings() {
  const { toast } = useToast()
  const [generalSettings, setGeneralSettings] = useState({
    defaultHourlyRate: "25",
    timeRounding: "15",
    autoStopTimer: true,
    defaultView: "overview",
  })

  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    intervalsBeforeLongBreak: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    alarmSound: "bell",
    alarmVolume: 70,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    dailySummary: false,
    weeklySummary: true,
    idleTimeReminders: true,
    timerCompletionNotifications: true,
  })

  const handleGeneralSettingsChange = (field: string, value: string | boolean) => {
    setGeneralSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handlePomodoroSettingsChange = (field: string, value: number | boolean | string) => {
    setPomodoroSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationSettingsChange = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }))
  }

  const saveSettings = () => {
    // Here you would typically save the settings to your database
    console.log("Saving settings:", {
      generalSettings,
      pomodoroSettings,
      notificationSettings,
    })

    toast({
      title: "Settings saved",
      description: "Your time tracking settings have been updated",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Time Tracking Settings</h2>
        <p className="text-muted-foreground">Configure your time tracking preferences and options.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro Timer</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general time tracking settings and defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-hourly-rate">Default Hourly Rate ($)</Label>
                <Input
                  id="default-hourly-rate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={generalSettings.defaultHourlyRate}
                  onChange={(e) => handleGeneralSettingsChange("defaultHourlyRate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-rounding">Time Rounding (minutes)</Label>
                <Select
                  value={generalSettings.timeRounding}
                  onValueChange={(value) => handleGeneralSettingsChange("timeRounding", value)}
                >
                  <SelectTrigger id="time-rounding">
                    <SelectValue placeholder="Select time rounding" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">Round time entries to the nearest interval</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-stop-timer">Auto-stop Timer</Label>
                  <p className="text-sm text-muted-foreground">Automatically stop timer after period of inactivity</p>
                </div>
                <Switch
                  id="auto-stop-timer"
                  checked={generalSettings.autoStopTimer}
                  onCheckedChange={(checked) => handleGeneralSettingsChange("autoStopTimer", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-view">Default View</Label>
                <Select
                  value={generalSettings.defaultView}
                  onValueChange={(value) => handleGeneralSettingsChange("defaultView", value)}
                >
                  <SelectTrigger id="default-view">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="entries">Time Entries</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pomodoro" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pomodoro Timer Settings</CardTitle>
              <CardDescription>Customize your Pomodoro timer for optimal productivity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="work-duration">Work Duration: {pomodoroSettings.workDuration} minutes</Label>
                <Slider
                  id="work-duration"
                  min={5}
                  max={60}
                  step={5}
                  value={[pomodoroSettings.workDuration]}
                  onValueChange={(value) => handlePomodoroSettingsChange("workDuration", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-break-duration">
                  Short Break Duration: {pomodoroSettings.shortBreakDuration} minutes
                </Label>
                <Slider
                  id="short-break-duration"
                  min={1}
                  max={15}
                  step={1}
                  value={[pomodoroSettings.shortBreakDuration]}
                  onValueChange={(value) => handlePomodoroSettingsChange("shortBreakDuration", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long-break-duration">
                  Long Break Duration: {pomodoroSettings.longBreakDuration} minutes
                </Label>
                <Slider
                  id="long-break-duration"
                  min={5}
                  max={30}
                  step={5}
                  value={[pomodoroSettings.longBreakDuration]}
                  onValueChange={(value) => handlePomodoroSettingsChange("longBreakDuration", value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intervals-before-long-break">
                  Intervals Before Long Break: {pomodoroSettings.intervalsBeforeLongBreak}
                </Label>
                <Slider
                  id="intervals-before-long-break"
                  min={2}
                  max={6}
                  step={1}
                  value={[pomodoroSettings.intervalsBeforeLongBreak]}
                  onValueChange={(value) => handlePomodoroSettingsChange("intervalsBeforeLongBreak", value[0])}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start-breaks">Auto-start Breaks</Label>
                  <p className="text-sm text-muted-foreground">Automatically start breaks when work interval ends</p>
                </div>
                <Switch
                  id="auto-start-breaks"
                  checked={pomodoroSettings.autoStartBreaks}
                  onCheckedChange={(checked) => handlePomodoroSettingsChange("autoStartBreaks", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start-pomodoros">Auto-start Pomodoros</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically start next work interval when break ends
                  </p>
                </div>
                <Switch
                  id="auto-start-pomodoros"
                  checked={pomodoroSettings.autoStartPomodoros}
                  onCheckedChange={(checked) => handlePomodoroSettingsChange("autoStartPomodoros", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alarm-sound">Alarm Sound</Label>
                <Select
                  value={pomodoroSettings.alarmSound}
                  onValueChange={(value) => handlePomodoroSettingsChange("alarmSound", value)}
                >
                  <SelectTrigger id="alarm-sound">
                    <SelectValue placeholder="Select alarm sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alarm-volume">Alarm Volume: {pomodoroSettings.alarmVolume}%</Label>
                <Slider
                  id="alarm-volume"
                  min={0}
                  max={100}
                  step={10}
                  value={[pomodoroSettings.alarmVolume]}
                  onValueChange={(value) => handlePomodoroSettingsChange("alarmVolume", value[0])}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications about time tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive time tracking notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-summary">Daily Summary</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily summary of your time tracking</p>
                </div>
                <Switch
                  id="daily-summary"
                  checked={notificationSettings.dailySummary}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("dailySummary", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-summary">Weekly Summary</Label>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of your time tracking</p>
                </div>
                <Switch
                  id="weekly-summary"
                  checked={notificationSettings.weeklySummary}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("weeklySummary", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="idle-time-reminders">Idle Time Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded when you've been idle for a while</p>
                </div>
                <Switch
                  id="idle-time-reminders"
                  checked={notificationSettings.idleTimeReminders}
                  onCheckedChange={(checked) => handleNotificationSettingsChange("idleTimeReminders", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="timer-completion-notifications">Timer Completion Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when timers and pomodoros complete</p>
                </div>
                <Switch
                  id="timer-completion-notifications"
                  checked={notificationSettings.timerCompletionNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationSettingsChange("timerCompletionNotifications", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}
