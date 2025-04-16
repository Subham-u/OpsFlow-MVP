import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Define card sizes and variants if they don't exist in utils.ts
const cardSizes = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

const cardVariants = {
  default: "",
  outline: "border",
  ghost: "border-none shadow-none bg-transparent",
  interactive: "border hover:shadow-md transition-shadow",
}

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost" | "interactive"
  footer?: React.ReactNode
  headerAction?: React.ReactNode
  noPadding?: boolean
  className?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
}

export function CardWrapper({
  title,
  description,
  size = "md",
  variant = "default",
  footer,
  headerAction,
  noPadding = false,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  children,
  ...props
}: CardWrapperProps) {
  return (
    <Card className={cn(cardVariants[variant], className)} {...props}>
      {(title || description || headerAction) && (
        <CardHeader className={cn("flex flex-row items-center justify-between gap-4", headerClassName)}>
          <div>
            {title && <CardTitle className="text-lg font-medium">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </CardHeader>
      )}
      <CardContent className={cn(noPadding ? "p-0" : cardSizes[size], contentClassName)}>{children}</CardContent>
      {footer && <CardFooter className={cn("border-t p-4", footerClassName)}>{footer}</CardFooter>}
    </Card>
  )
}
