import type { LucideIcon } from "lucide-react"
import { Users, FileText, AlertCircle } from "lucide-react"

interface EmptyStateProps {
  icon: "users" | "projects" | "custom"
  title: string
  description: string
  customIcon?: LucideIcon
}

export function EmptyState({ icon, title, description, customIcon: CustomIcon }: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case "users":
        return <Users className="h-10 w-10 text-muted-foreground" />
      case "projects":
        return <FileText className="h-10 w-10 text-muted-foreground" />
      case "custom":
        return CustomIcon ? <CustomIcon className="h-10 w-10 text-muted-foreground" /> : null
      default:
        return <AlertCircle className="h-10 w-10 text-muted-foreground" />
    }
  }

  return (
    <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {getIcon()}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
