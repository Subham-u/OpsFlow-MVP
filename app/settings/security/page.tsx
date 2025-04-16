import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { SecuritySettings } from "@/components/settings/security-settings"

export const metadata: Metadata = {
  title: "Security Settings | WonderFlow",
  description: "Manage your account security and privacy settings",
}

export default function SecuritySettingsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <SettingsHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <SecuritySettings />
      </main>
    </div>
  )
}
