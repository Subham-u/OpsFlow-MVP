import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Invoice Details | WonderFlow",
  description: "View and manage invoice details",
}

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/invoicing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Invoice #{params.id}</h1>
      </div>

      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          This is a placeholder for the invoice details page. In a real application, this would display the invoice with
          options to edit, download, or send it.
        </p>
      </div>
    </div>
  )
}
