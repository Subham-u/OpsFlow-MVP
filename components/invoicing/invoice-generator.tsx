"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { Calculator, CreditCard, Download, FileText, Mail, Plus, Printer, Save, Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InvoicePreview } from "@/components/invoicing/invoice-preview"

// Mock data for clients
const clients = [
  {
    id: "1",
    name: "Acme Corp",
    email: "billing@acmecorp.com",
    address: "123 Main St, New York, NY 10001",
    taxId: "AC-123456",
  },
  {
    id: "2",
    name: "TechStart Inc",
    email: "accounts@techstart.io",
    address: "456 Market St, San Francisco, CA 94103",
    taxId: "TS-789012",
  },
  {
    id: "3",
    name: "Global Retail",
    email: "finance@globalretail.com",
    address: "789 Retail Ave, Chicago, IL 60601",
    taxId: "GR-345678",
  },
  {
    id: "4",
    name: "FinTech Solutions",
    email: "ap@fintechsolutions.com",
    address: "101 Finance Blvd, Boston, MA 02110",
    taxId: "FS-901234",
  },
]

// Mock data for projects
const projects = [
  { id: "1", name: "Website Redesign", client: "1", rate: 85 },
  { id: "2", name: "Mobile App Development", client: "2", rate: 95 },
  { id: "3", name: "Marketing Campaign", client: "3", rate: 75 },
  { id: "4", name: "Database Migration", client: "4", rate: 110 },
  { id: "5", name: "Brand Identity Refresh", client: "1", rate: 90 },
  { id: "6", name: "E-commerce Platform", client: "3", rate: 85 },
]

// Mock data for billable entries
const billableEntries = [
  {
    id: "1",
    project: "1", // Website Redesign
    task: "Homepage Layout",
    date: "2023-09-15",
    duration: 150, // in minutes
    rate: 85,
    amount: 212.5,
    status: "unbilled",
    user: "John Doe",
  },
  {
    id: "2",
    project: "2", // Mobile App Development
    task: "User Authentication",
    date: "2023-09-15",
    duration: 225,
    rate: 95,
    amount: 356.25,
    status: "unbilled",
    user: "Jane Smith",
  },
  {
    id: "3",
    project: "1", // Website Redesign
    task: "Contact Form",
    date: "2023-09-16",
    duration: 80,
    rate: 85,
    amount: 113.33,
    status: "unbilled",
    user: "John Doe",
  },
  {
    id: "4",
    project: "3", // Marketing Campaign
    task: "Social Media Graphics",
    date: "2023-09-16",
    duration: 135,
    rate: 75,
    amount: 168.75,
    status: "unbilled",
    user: "Beth Wilson",
  },
  {
    id: "5",
    project: "4", // Database Migration
    task: "Schema Design",
    date: "2023-09-17",
    duration: 195,
    rate: 110,
    amount: 357.5,
    status: "unbilled",
    user: "Alex Johnson",
  },
  {
    id: "6",
    project: "2", // Mobile App Development
    task: "UI Components",
    date: "2023-09-17",
    duration: 210,
    rate: 95,
    amount: 332.5,
    status: "unbilled",
    user: "Jane Smith",
  },
  {
    id: "7",
    project: "5", // Brand Identity Refresh
    task: "Logo Design",
    date: "2023-09-18",
    duration: 240,
    rate: 90,
    amount: 360,
    status: "unbilled",
    user: "Beth Wilson",
  },
  {
    id: "8",
    project: "6", // E-commerce Platform
    task: "Product Catalog",
    date: "2023-09-19",
    duration: 180,
    rate: 85,
    amount: 255,
    status: "unbilled",
    user: "John Doe",
  },
]

// Company information
const companyInfo = {
  name: "WonderFlow Studios",
  address: "789 Innovation Way, Tech Park, CA 94107",
  email: "billing@wonderflow.io",
  phone: "+1 (555) 123-4567",
  website: "www.wonderflow.io",
  taxId: "WF-567890",
  logo: "/placeholder.svg?height=60&width=200",
  bankAccount: {
    name: "Silicon Valley Bank",
    number: "XXXX-XXXX-XXXX-1234",
    routing: "123456789",
    swift: "SVBKUS6S",
  },
}

// Payment methods
const paymentMethods = [
  { id: "bank_transfer", name: "Bank Transfer" },
  { id: "credit_card", name: "Credit Card" },
  { id: "paypal", name: "PayPal" },
  { id: "check", name: "Check" },
]

// Payment terms
const paymentTerms = [
  { id: "due_on_receipt", name: "Due on Receipt", days: 0 },
  { id: "net_15", name: "Net 15", days: 15 },
  { id: "net_30", name: "Net 30", days: 30 },
  { id: "net_45", name: "Net 45", days: 45 },
  { id: "net_60", name: "Net 60", days: 60 },
]

// Tax rates
const taxRates = [
  { id: "none", name: "None", rate: 0 },
  { id: "sales_tax", name: "Sales Tax (8%)", rate: 8 },
  { id: "vat", name: "VAT (20%)", rate: 20 },
  { id: "gst", name: "GST (5%)", rate: 5 },
]

// Currency options
const currencies = [
  { id: "usd", name: "USD - US Dollar", symbol: "$" },
  { id: "eur", name: "EUR - Euro", symbol: "€" },
  { id: "gbp", name: "GBP - British Pound", symbol: "£" },
  { id: "cad", name: "CAD - Canadian Dollar", symbol: "C$" },
  { id: "aud", name: "AUD - Australian Dollar", symbol: "A$" },
]

// Helper function to format duration
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Helper function to generate invoice number
const generateInvoiceNumber = () => {
  const prefix = "INV"
  const year = new Date().getFullYear().toString().substr(-2)
  const month = (new Date().getMonth() + 1).toString().padStart(2, "0")
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}-${year}${month}-${random}`
}

export function InvoiceGenerator() {
  const { toast } = useToast()
  const router = useRouter()

  // State for invoice form
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(1)), // First day of current month
    to: new Date(),
  })
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber())
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [paymentTerm, setPaymentTerm] = useState("net_30")
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"))
  const [taxRate, setTaxRate] = useState("none")
  const [discount, setDiscount] = useState("0")
  const [currency, setCurrency] = useState("usd")
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")
  const [includeDetailedTimeEntries, setIncludeDetailedTimeEntries] = useState(true)
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [customItems, setCustomItems] = useState<
    Array<{ description: string; quantity: number; rate: number; amount: number }>
  >([])
  const [newItem, setNewItem] = useState({ description: "", quantity: 1, rate: 0, amount: 0 })
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [customizationOptions, setCustomizationOptions] = useState({
    showLogo: true,
    showCompanyInfo: true,
    showClientInfo: true,
    showPaymentInfo: true,
    showNotes: true,
    showSignature: true,
    accentColor: "#3b82f6", // Default blue
    fontFamily: "Inter, sans-serif",
  })

  // Update due date when payment term changes
  useEffect(() => {
    const term = paymentTerms.find((term) => term.id === paymentTerm)
    if (term) {
      setDueDate(format(addDays(new Date(invoiceDate), term.days), "yyyy-MM-dd"))
    }
  }, [paymentTerm, invoiceDate])

  // Filter billable entries based on selected client, projects, and date range
  const filteredEntries = billableEntries.filter((entry) => {
    const project = projects.find((p) => p.id === entry.project)
    if (!project) return false

    // Filter by client
    if (selectedClient && project.client !== selectedClient) return false

    // Filter by projects
    if (selectedProjects.length > 0 && !selectedProjects.includes(entry.project)) return false

    // Filter by date range
    const entryDate = new Date(entry.date)
    if (dateRange.from && entryDate < dateRange.from) return false
    if (dateRange.to && entryDate > dateRange.to) return false

    // Filter by billing status
    if (entry.status !== "unbilled") return false

    return true
  })

  // Calculate totals
  const subtotal =
    filteredEntries
      .filter((entry) => selectedEntries.includes(entry.id))
      .reduce((sum, entry) => sum + entry.amount, 0) + customItems.reduce((sum, item) => sum + item.amount, 0)

  const discountAmount = (Number.parseFloat(discount) / 100) * subtotal
  const taxAmount = ((taxRates.find((tax) => tax.id === taxRate)?.rate || 0) / 100) * (subtotal - discountAmount)
  const total = subtotal - discountAmount + taxAmount

  // Get client projects
  const clientProjects = projects.filter((project) => project.client === selectedClient)

  // Handle adding a custom item
  const handleAddCustomItem = () => {
    if (!newItem.description || newItem.rate <= 0 || newItem.quantity <= 0) {
      toast({
        title: "Invalid item",
        description: "Please enter a description, quantity, and rate",
        variant: "destructive",
      })
      return
    }

    const amount = newItem.quantity * newItem.rate
    setCustomItems([...customItems, { ...newItem, amount }])
    setNewItem({ description: "", quantity: 1, rate: 0, amount: 0 })
  }

  // Handle removing a custom item
  const handleRemoveCustomItem = (index: number) => {
    setCustomItems(customItems.filter((_, i) => i !== index))
  }

  // Handle select all entries
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(filteredEntries.map((entry) => entry.id))
    } else {
      setSelectedEntries([])
    }
  }

  // Handle select individual entry
  const handleSelectEntry = (entryId: string, checked: boolean) => {
    if (checked) {
      setSelectedEntries([...selectedEntries, entryId])
    } else {
      setSelectedEntries(selectedEntries.filter((id) => id !== entryId))
    }
  }

  // Handle generating invoice
  const handleGenerateInvoice = () => {
    if (!selectedClient) {
      toast({
        title: "Missing client",
        description: "Please select a client for this invoice",
        variant: "destructive",
      })
      return
    }

    if (selectedEntries.length === 0 && customItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one billable entry or add a custom item",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // In a real app, this would make an API call to create the invoice
    setTimeout(() => {
      setIsGenerating(false)
      setShowPreview(true)

      toast({
        title: "Invoice generated",
        description: `Invoice ${invoiceNumber} has been created successfully`,
      })
    }, 1000)
  }

  // Handle saving invoice
  const handleSaveInvoice = () => {
    toast({
      title: "Invoice saved",
      description: `Invoice ${invoiceNumber} has been saved`,
    })

    // In a real app, this would redirect to the invoice detail page
    router.push("/invoicing")
  }

  // Handle sending invoice
  const handleSendInvoice = () => {
    const client = clients.find((c) => c.id === selectedClient)

    toast({
      title: "Invoice sent",
      description: `Invoice ${invoiceNumber} has been sent to ${client?.name}`,
    })
  }

  // Handle downloading invoice
  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice downloaded",
      description: `Invoice ${invoiceNumber} has been downloaded as PDF`,
    })
  }

  // Get selected client info
  const selectedClientInfo = clients.find((client) => client.id === selectedClient)

  // Get currency symbol
  const currencySymbol = currencies.find((c) => c.id === currency)?.symbol || "$"

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Create Invoice</h1>
          <p className="text-muted-foreground">Generate a new invoice for your client</p>
        </div>

        <div className="flex items-center gap-2">
          {showPreview ? (
            <>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <X className="mr-2 h-4 w-4" /> Edit Invoice
              </Button>
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="outline" onClick={handleSendInvoice}>
                <Mail className="mr-2 h-4 w-4" /> Send to Client
              </Button>
              <Button onClick={handleSaveInvoice}>
                <Save className="mr-2 h-4 w-4" /> Save Invoice
              </Button>
            </>
          ) : (
            <>
              <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
                <DialogTrigger asChild>
                  <Button variant="outline">Customize</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Customize Invoice</DialogTitle>
                    <DialogDescription>Customize the appearance and content of your invoice</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-logo"
                          checked={customizationOptions.showLogo}
                          onCheckedChange={(checked) =>
                            setCustomizationOptions({ ...customizationOptions, showLogo: checked })
                          }
                        />
                        <Label htmlFor="show-logo">Show Logo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-company-info"
                          checked={customizationOptions.showCompanyInfo}
                          onCheckedChange={(checked) =>
                            setCustomizationOptions({ ...customizationOptions, showCompanyInfo: checked })
                          }
                        />
                        <Label htmlFor="show-company-info">Show Company Info</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-client-info"
                          checked={customizationOptions.showClientInfo}
                          onCheckedChange={(checked) =>
                            setCustomizationOptions({ ...customizationOptions, showClientInfo: checked })
                          }
                        />
                        <Label htmlFor="show-client-info">Show Client Info</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-payment-info"
                          checked={customizationOptions.showPaymentInfo}
                          onCheckedChange={(checked) =>
                            setCustomizationOptions({ ...customizationOptions, showPaymentInfo: checked })
                          }
                        />
                        <Label htmlFor="show-payment-info">Show Payment Info</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-notes"
                          checked={customizationOptions.showNotes}
                          onCheckedChange={(checked) =>
                            setCustomizationOptions({ ...customizationOptions, showNotes: checked })
                          }
                        />
                        <Label htmlFor="show-notes">Show Notes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-signature"
                          checked={customizationOptions.showSignature}
                          onCheckedChange={(checked) =>
                            setCustomizationOptions({ ...customizationOptions, showSignature: checked })
                          }
                        />
                        <Label htmlFor="show-signature">Show Signature</Label>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          value={customizationOptions.accentColor}
                          onChange={(e) =>
                            setCustomizationOptions({ ...customizationOptions, accentColor: e.target.value })
                          }
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={customizationOptions.accentColor}
                          onChange={(e) =>
                            setCustomizationOptions({ ...customizationOptions, accentColor: e.target.value })
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select
                        value={customizationOptions.fontFamily}
                        onValueChange={(value) =>
                          setCustomizationOptions({ ...customizationOptions, fontFamily: value })
                        }
                      >
                        <SelectTrigger id="font-family">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter, sans-serif">Inter (Default)</SelectItem>
                          <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                          <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                          <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                          <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsCustomizing(false)}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={handleGenerateInvoice} disabled={isGenerating}>
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" /> Generate Invoice
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {showPreview ? (
        <InvoicePreview
          invoiceNumber={invoiceNumber}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
          client={selectedClientInfo}
          company={companyInfo}
          entries={filteredEntries.filter((entry) => selectedEntries.includes(entry.id))}
          customItems={customItems}
          subtotal={subtotal}
          discount={discountAmount}
          tax={taxAmount}
          total={total}
          notes={notes}
          paymentMethod={paymentMethods.find((m) => m.id === paymentMethod)?.name || ""}
          currencySymbol={currencySymbol}
          includeDetailedTimeEntries={includeDetailedTimeEntries}
          customizationOptions={customizationOptions}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Basic information about this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input id="invoice-number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select value={paymentTerm} onValueChange={setPaymentTerm}>
                    <SelectTrigger id="payment-terms">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTerms.map((term) => (
                        <SelectItem key={term.id} value={term.id}>
                          {term.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.id} value={curr.id}>
                          {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes for the client"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client & Project</CardTitle>
                <CardDescription>Select the client and projects for this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedClient && (
                  <div className="grid gap-2">
                    <Label>Projects</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      {clientProjects.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No projects found for this client</p>
                      ) : (
                        clientProjects.map((project) => (
                          <div key={project.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`project-${project.id}`}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              checked={selectedProjects.includes(project.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProjects([...selectedProjects, project.id])
                                } else {
                                  setSelectedProjects(selectedProjects.filter((id) => id !== project.id))
                                }
                              }}
                            />
                            <label htmlFor={`project-${project.id}`} className="text-sm">
                              {project.name} (${project.rate}/hr)
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Options</CardTitle>
                <CardDescription>Additional settings for this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="tax-rate">Tax Rate</Label>
                  <Select value={taxRate} onValueChange={setTaxRate}>
                    <SelectTrigger id="tax-rate">
                      <SelectValue placeholder="Select tax rate" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxRates.map((tax) => (
                        <SelectItem key={tax.id} value={tax.id}>
                          {tax.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="detailed-time-entries"
                    checked={includeDetailedTimeEntries}
                    onCheckedChange={setIncludeDetailedTimeEntries}
                  />
                  <Label htmlFor="detailed-time-entries">Include detailed time entries</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="time-entries" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="time-entries">Billable Time Entries</TabsTrigger>
                <TabsTrigger value="custom-items">Custom Line Items</TabsTrigger>
              </TabsList>

              <TabsContent value="time-entries" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Select Time Entries</CardTitle>
                      <Badge variant="outline">
                        {selectedEntries.length} of {filteredEntries.length} selected
                      </Badge>
                    </div>
                    <CardDescription>Select the billable time entries to include in this invoice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredEntries.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No billable time entries found for the selected criteria
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try selecting a different client, project, or date range
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="select-all"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            checked={selectedEntries.length === filteredEntries.length && filteredEntries.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                          <label htmlFor="select-all" className="text-sm font-medium">
                            Select All
                          </label>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                              <tr>
                                <th scope="col" className="w-[40px] px-3 py-3"></th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Project / Task
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Date
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Duration
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Rate
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-background divide-y divide-border">
                              {filteredEntries.map((entry) => {
                                const project = projects.find((p) => p.id === entry.project)
                                return (
                                  <tr key={entry.id} className="hover:bg-muted/50">
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      <input
                                        type="checkbox"
                                        id={`entry-${entry.id}`}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedEntries.includes(entry.id)}
                                        onChange={(e) => handleSelectEntry(entry.id, e.target.checked)}
                                      />
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                      <div className="font-medium text-sm">{project?.name}</div>
                                      <div className="text-xs text-muted-foreground">{entry.task}</div>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                                      {format(new Date(entry.date), "MMM dd, yyyy")}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                                      {formatDuration(entry.duration)}
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                                      {currencySymbol}
                                      {entry.rate.toFixed(2)}/hr
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-right">
                                      {currencySymbol}
                                      {entry.amount.toFixed(2)}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom-items" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Custom Line Items</CardTitle>
                    <CardDescription>
                      Add custom line items to your invoice (e.g., expenses, materials, fixed fees)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                          <Label htmlFor="item-description">Description</Label>
                          <Input
                            id="item-description"
                            placeholder="Item description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="item-quantity">Quantity</Label>
                          <Input
                            id="item-quantity"
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseFloat(e.target.value) })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="item-rate">Rate</Label>
                          <Input
                            id="item-rate"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newItem.rate}
                            onChange={(e) => setNewItem({ ...newItem, rate: Number.parseFloat(e.target.value) })}
                          />
                        </div>
                        <div className="col-span-2 flex items-end">
                          <Button onClick={handleAddCustomItem} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Add
                          </Button>
                        </div>
                      </div>

                      {customItems.length > 0 ? (
                        <div className="border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Description
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Quantity
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Rate
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                >
                                  Amount
                                </th>
                                <th scope="col" className="w-[60px] px-3 py-3"></th>
                              </tr>
                            </thead>
                            <tbody className="bg-background divide-y divide-border">
                              {customItems.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/50">
                                  <td className="px-3 py-3 whitespace-nowrap text-sm">{item.description}</td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm text-center">{item.quantity}</td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm text-center">
                                    {currencySymbol}
                                    {item.rate.toFixed(2)}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right">
                                    {currencySymbol}
                                    {item.amount.toFixed(2)}
                                  </td>
                                  <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveCustomItem(index)}
                                      className="h-8 w-8 text-destructive"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-6 border rounded-md">
                          <p className="text-muted-foreground">No custom items added yet</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Use the form above to add custom line items to your invoice
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {currencySymbol}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  {Number.parseFloat(discount) > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Discount ({discount}%)</span>
                      <span className="font-medium text-destructive">
                        -{currencySymbol}
                        {discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {taxRate !== "none" && (
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">
                        {taxRates.find((tax) => tax.id === taxRate)?.name} (
                        {taxRates.find((tax) => tax.id === taxRate)?.rate}%)
                      </span>
                      <span className="font-medium">
                        {currencySymbol}
                        {taxAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between py-2">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">
                      {currencySymbol}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex justify-between">
                <div className="flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedEntries.length} time entries + {customItems.length} custom items
                  </span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Payment via {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
