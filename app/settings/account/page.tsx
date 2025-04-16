import type { Metadata } from "next"
import { SettingsHeader } from "@/components/settings/settings-header"
import { AccountSettings } from "@/components/settings/account-settings"

export const metadata: Metadata = {
  title: "Account Settings | WonderFlow",
  description: "Manage your account security and preferences",
}

export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <SettingsHeader />
      <main className="flex-1 w-full p-4 md:p-6">
        <div className="w-full max-w-6xl mx-auto">
          <AccountSettings />
        </div>
      </main>
    </div>
  )
}
