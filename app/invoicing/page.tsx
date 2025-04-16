import type { Metadata } from "next"
import { InvoiceGenerator } from "@/components/invoicing/invoice-generator"

export const metadata: Metadata = {
  title: "Invoice Generator | WonderFlow",
  description: "Create and manage invoices for your clients",
}

export default function InvoicingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <InvoiceGenerator />
    </div>
  )
}
