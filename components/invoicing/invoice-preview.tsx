"use client"

import type React from "react"

import { useRef } from "react"
import { format } from "date-fns"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Format duration from minutes to hours and minutes
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Helper to calculate hours from minutes
const minutesToHours = (minutes: number) => {
  return minutes / 60
}

type InvoicePreviewProps = {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  client: any
  company: any
  entries: any[]
  customItems: any[]
  subtotal: number
  discount: number
  tax: number
  total: number
  notes: string
  paymentMethod: string
  currencySymbol: string
  includeDetailedTimeEntries: boolean
  customizationOptions: {
    showLogo: boolean
    showCompanyInfo: boolean
    showClientInfo: boolean
    showPaymentInfo: boolean
    showNotes: boolean
    showSignature: boolean
    accentColor: string
    fontFamily: string
  }
}

export function InvoicePreview({
  invoiceNumber,
  invoiceDate,
  dueDate,
  client,
  company,
  entries,
  customItems,
  subtotal,
  discount,
  tax,
  total,
  notes,
  paymentMethod,
  currencySymbol,
  includeDetailedTimeEntries,
  customizationOptions,
}: InvoicePreviewProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Group entries by project
  const entriesByProject: Record<string, any[]> = {}
  entries.forEach((entry) => {
    if (!entriesByProject[entry.project]) {
      entriesByProject[entry.project] = []
    }
    entriesByProject[entry.project].push(entry)
  })

  return (
    <div className="space-y-6">
      <Card className="p-8 max-w-4xl mx-auto" ref={invoiceRef}>
        <div
          className="invoice-container"
          style={
            {
              fontFamily: customizationOptions.fontFamily,
              "--accent-color": customizationOptions.accentColor,
            } as React.CSSProperties
          }
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            {customizationOptions.showLogo && (
              <div className="logo">
                <img src={company.logo || "/placeholder.svg"} alt={company.name} className="h-12" />
              </div>
            )}

            <div className="text-right">
              <h1 className="text-3xl font-bold" style={{ color: customizationOptions.accentColor }}>
                INVOICE
              </h1>
              <div className="text-sm text-muted-foreground mt-1">#{invoiceNumber}</div>
            </div>
          </div>

          {/* Company and Client Info */}
          <div className="flex justify-between mb-8">
            {customizationOptions.showCompanyInfo && (
              <div className="space-y-1">
                <h2 className="font-bold text-lg">From</h2>
                <div className="text-sm font-medium">{company.name}</div>
                <div className="text-sm text-muted-foreground">{company.address}</div>
                <div className="text-sm text-muted-foreground">{company.email}</div>
                <div className="text-sm text-muted-foreground">{company.phone}</div>
                {company.taxId && <div className="text-sm text-muted-foreground">Tax ID: {company.taxId}</div>}
              </div>
            )}

            {customizationOptions.showClientInfo && client && (
              <div className="space-y-1">
                <h2 className="font-bold text-lg">Bill To</h2>
                <div className="text-sm font-medium">{client.name}</div>
                <div className="text-sm text-muted-foreground">{client.address}</div>
                <div className="text-sm text-muted-foreground">{client.email}</div>
                {client.taxId && <div className="text-sm text-muted-foreground">Tax ID: {client.taxId}</div>}
              </div>
            )}
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted/30 rounded-md">
            <div>
              <div className="text-sm text-muted-foreground">Invoice Date</div>
              <div className="font-medium">{format(new Date(invoiceDate), "MMMM d, yyyy")}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="font-medium">{format(new Date(dueDate), "MMMM d, yyyy")}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Payment Method</div>
              <div className="font-medium">{paymentMethod}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Amount Due</div>
              <div className="font-bold" style={{ color: customizationOptions.accentColor }}>
                {currencySymbol}
                {total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-4">Invoice Summary</h2>

            {/* Project Summaries */}
            {Object.keys(entriesByProject).length > 0 && (
              <div className="border rounded-md overflow-hidden mb-4">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Project
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Hours
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {Object.entries(entriesByProject).map(([projectId, projectEntries]) => {
                      const project = projectEntries[0]
                      const totalMinutes = projectEntries.reduce((sum, entry) => sum + entry.duration, 0)
                      const totalHours = minutesToHours(totalMinutes)
                      const totalAmount = projectEntries.reduce((sum, entry) => sum + entry.amount, 0)

                      return (
                        <tr key={projectId}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{project.project}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-center">{totalHours.toFixed(2)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                            {currencySymbol}
                            {project.rate.toFixed(2)}/hr
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                            {currencySymbol}
                            {totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Custom Items */}
            {customItems.length > 0 && (
              <div className="border rounded-md overflow-hidden mb-4">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {customItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.description}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">{item.quantity}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                          {currencySymbol}
                          {item.rate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                          {currencySymbol}
                          {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Detailed Time Entries */}
            {includeDetailedTimeEntries && entries.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-sm mb-2">Detailed Time Entries</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Project / Task
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Staff
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Duration
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {entries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-xs">
                            {format(new Date(entry.date), "MMM d, yyyy")}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs">
                            <div className="font-medium">{entry.project}</div>
                            <div className="text-muted-foreground">{entry.task}</div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs">{entry.user}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-center">
                            {formatDuration(entry.duration)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-right">
                            {currencySymbol}
                            {entry.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Totals */}
          <div className="mb-8">
            <div className="w-full md:w-1/2 ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {currencySymbol}
                    {subtotal.toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-destructive">
                      -{currencySymbol}
                      {discount.toFixed(2)}
                    </span>
                  </div>
                )}

                {tax > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">
                      {currencySymbol}
                      {tax.toFixed(2)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between py-2">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg" style={{ color: customizationOptions.accentColor }}>
                    {currencySymbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {customizationOptions.showPaymentInfo && (
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-2">Payment Information</h2>
              <div className="p-4 bg-muted/30 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Bank Name</div>
                    <div className="text-sm text-muted-foreground">{company.bankAccount.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Account Number</div>
                    <div className="text-sm text-muted-foreground">{company.bankAccount.number}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Routing Number</div>
                    <div className="text-sm text-muted-foreground">{company.bankAccount.routing}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">SWIFT Code</div>
                    <div className="text-sm text-muted-foreground">{company.bankAccount.swift}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {customizationOptions.showNotes && notes && (
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-2">Notes</h2>
              <div className="p-4 bg-muted/30 rounded-md text-sm">{notes}</div>
            </div>
          )}

          {/* Thank You */}
          <div className="text-center mb-8">
            <h2 className="font-bold text-lg" style={{ color: customizationOptions.accentColor }}>
              Thank You for Your Business!
            </h2>
          </div>

          {/* Signature */}
          {customizationOptions.showSignature && (
            <div className="mt-12">
              <div className="flex justify-between">
                <div className="w-1/3">
                  <Separator className="mb-2" />
                  <div className="text-sm text-center text-muted-foreground">Client Signature</div>
                </div>
                <div className="w-1/3">
                  <Separator className="mb-2" />
                  <div className="text-sm text-center text-muted-foreground">Date</div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-muted-foreground">
            <p>Invoice generated by WonderFlow Studios</p>
            <p>
              {company.website} | {company.email} | {company.phone}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
