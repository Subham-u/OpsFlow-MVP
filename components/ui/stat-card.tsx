"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

const statCardVariants = cva("transition-all", {
  variants: {
    variant: {
      default: "bg-card",
      primary: "bg-primary text-primary-foreground",
      purple: "bg-gradient-purple text-white",
      outline: "bg-background border-2",
      ghost: "bg-background/50 backdrop-blur-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  className?: string
  onClick?: () => void
}

export function StatCard({ title, value, description, icon, trend, variant, className, onClick }: StatCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        statCardVariants({ variant }),
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="w-8 h-8 flex items-center justify-center">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center mt-1">
            {trend && (
              <div
                className={cn(
                  "flex items-center text-xs font-medium mr-2",
                  trend.isPositive ? "text-success" : "text-destructive",
                  variant === "primary" && "text-primary-foreground/90",
                  variant === "purple" && "text-white/90",
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpIcon className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 mr-1" />
                )}
                {trend.value}%{trend.label && <span className="ml-1">{trend.label}</span>}
              </div>
            )}
            {description && (
              <CardDescription
                className={cn(
                  "text-xs",
                  variant === "primary" && "text-primary-foreground/70",
                  variant === "purple" && "text-white/70",
                )}
              >
                {description}
              </CardDescription>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
