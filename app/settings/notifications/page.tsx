import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { NotificationSettings } from "@/components/settings/notification-settings"

export const metadata: Metadata = {
  title: "Notification Settings | WonderFlow",
  description: "Manage your notification preferences and settings",
}

export default function NotificationsSettingsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <SettingsHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <NotificationSettings />
      </main>
    </div>
  )
}
