import { EmailSettings } from "@/components/settings/email-settings"
import { SettingsHeader } from "@/components/settings/settings-header"

export default function EmailSettingsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <SettingsHeader
        title="Email Notifications"
        description="Configure how and when you receive email notifications"
      />
      <EmailSettings />
    </div>
  )
}
