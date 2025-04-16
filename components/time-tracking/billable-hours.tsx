"use client"

import { TabsContent } from "@/components/ui/tabs"

import { TabsTrigger } from "@/components/ui/tabs"

import { TabsList } from "@/components/ui/tabs"

import { Tabs } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, LineChart, Download, Filter, Plus, DollarSign, Clock } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays, format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import {
  FileText,
  Mail,
  Printer,
  Receipt,
  FileCheck,
  FileX,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

// Sample data for charts and tables
const monthlyData = [
  { name: "Jan", billable: 120, nonBillable: 20 },
  { name: "Feb", billable: 140, nonBillable: 25 },
  { name: "Mar", billable: 130, nonBillable: 30 },
  { name: "Apr", billable: 170, nonBillable: 15 },
  { name: "May", billable: 160, nonBillable: 20 },
  { name: "Jun", billable: 150, nonBillable: 25 },
]

const clientData = [
  { name: "Client A", billable: 80, rate: 150 },
  { name: "Client B", billable: 45, rate: 125 },
  { name: "Client C", billable: 60, rate: 175 },
  { name: "Client D", billable: 30, rate: 100 },
]

// Mock data for billable entries
const billableEntries = [
  {
    id: 1,
    date: "2023-04-01",
    project: "Website Redesign",
    client: "Client A",
    task: "Development",
    hours: 4.5,
    rate: 150,
    amount: 675,
  },
  {
    id: 2,
    date: "2023-04-02",
    project: "Mobile App",
    client: "Client B",
    task: "Design",
    hours: 3.0,
    rate: 125,
    amount: 375,
  },
  {
    id: 3,
    date: "2023-04-03",
    project: "Website Redesign",
    client: "Client A",
    task: "Testing",
    hours: 2.5,
    rate: 150,
    amount: 375,
  },
  {
    id: 4,
    date: "2023-04-04",
    project: "Marketing Campaign",
    client: "Client C",
    task: "Research",
    hours: 5.0,
    rate: 175,
    amount: 875,
  },
  {
    id: 5,
    date: "2023-04-05",
    project: "Data Migration",
    client: "Client D",
    task: "Development",
    hours: 6.0,
    rate: 100,
    amount: 600,
  },
  {
    id: "1",
    project: "Website Redesign",
    client: "Acme Corp",
    task: "Homepage Layout",
    date: "2023-09-15",
    duration: 150, // in minutes
    rate: 85, // hourly rate
    amount: 212.5, // calculated amount
    status: "unbilled",
    user: "John Doe",
    tags: ["design", "frontend"],
    notes: "Completed initial wireframes for homepage",
  },
  {
    id: "2",
    project: "Mobile App Development",
    client: "TechStart Inc",
    task: "User Authentication",
    date: "2023-09-15",
    duration: 225, // in minutes
    rate: 95,
    amount: 356.25,
    status: "unbilled",
    user: "Jane Smith",
    tags: ["development", "backend"],
    notes: "Implemented OAuth flow",
  },
  {
    id: "3",
    project: "Marketing Campaign",
    client: "Global Retail",
    task: "Social Media Graphics",
    date: "2023-09-16",
    duration: 135, // in minutes
    rate: 75,
    amount: 168.75,
    status: "billed",
    invoiceNumber: "INV-2023-001",
    user: "John Doe",
    tags: ["design", "marketing"],
    notes: "Created Instagram and Twitter graphics",
  },
  {
    id: "4",
    project: "Website Redesign",
    client: "Acme Corp",
    task: "Contact Form",
    date: "2023-09-16",
    duration: 80, // in minutes
    rate: 85,
    amount: 113.33,
    status: "unbilled",
    user: "John Doe",
    tags: ["development", "frontend"],
    notes: "Implemented form validation",
  },
  {
    id: "5",
    project: "Database Migration",
    client: "FinTech Solutions",
    task: "Schema Design",
    date: "2023-09-17",
    duration: 195, // in minutes
    rate: 110,
    amount: 357.5,
    status: "billed",
    invoiceNumber: "INV-2023-002",
    user: "Alex Johnson",
    tags: ["database", "backend"],
    notes: "Finalized database schema",
  },
  {
    id: "6",
    project: "Mobile App Development",
    client: "TechStart Inc",
    task: "UI Components",
    date: "2023-09-17",
    duration: 210, // in minutes
    rate: 95,
    amount: 332.5,
    status: "unbilled",
    user: "Jane Smith",
    tags: ["design", "frontend"],
    notes: "Created reusable UI components",
  },
  {
    id: "7",
    project: "Marketing Campaign",
    client: "Global Retail",
    task: "Email Template",
    date: "2023-09-18",
    duration: 195, // in minutes
    rate: 75,
    amount: 243.75,
    status: "billed",
    invoiceNumber: "INV-2023-003",
    user: "Beth Wilson",
    tags: ["design", "email"],
    notes: "Designed responsive email template",
  },
  {
    id: "8",
    project: "Website Redesign",
    client: "Acme Corp",
    task: "Navigation Menu",
    date: "2023-09-18",
    duration: 135, // in minutes
    rate: 85,
    amount: 191.25,
    status: "unbilled",
    user: "John Doe",
    tags: ["development", "frontend"],
    notes: "Implemented responsive navigation",
  },
  {
    id: "9",
    project: "Database Migration",
    client: "FinTech Solutions",
    task: "Data Transfer",
    date: "2023-09-19",
    duration: 210, // in minutes
    rate: 110,
    amount: 385,
    status: "unbilled",
    user: "Alex Johnson",
    tags: ["database", "backend"],
    notes: "Migrated user data to new schema",
  },
  {
    id: "10",
    project: "Mobile App Development",
    client: "TechStart Inc",
    task: "API Integration",
    date: "2023-09-19",
    duration: 210, // in minutes
    rate: 95,
    amount: 332.5,
    status: "unbilled",
    user: "Jane Smith",
    tags: ["development", "backend"],
    notes: "Connected app to backend APIs",
  },
]

// Mock data for invoices
const invoices = [
  {
    id: "INV-2023-001",
    client: "Global Retail",
    date: "2023-09-20",
    dueDate: "2023-10-20",
    amount: 168.75,
    status: "paid",
    paymentDate: "2023-09-25",
    items: [
      {
        id: "3",
        description: "Social Media Graphics",
        hours: 2.25,
        rate: 75,
        amount: 168.75,
      },
    ],
  },
  {
    id: "INV-2023-002",
    client: "FinTech Solutions",
    date: "2023-09-22",
    dueDate: "2023-10-22",
    amount: 357.5,
    status: "paid",
    paymentDate: "2023-09-30",
    items: [
      {
        id: "5",
        description: "Database Schema Design",
        hours: 3.25,
        rate: 110,
        amount: 357.5,
      },
    ],
  },
  {
    id: "INV-2023-003",
    client: "Global Retail",
    date: "2023-09-25",
    dueDate: "2023-10-25",
    amount: 243.75,
    status: "unpaid",
    items: [
      {
        id: "7",
        description: "Email Template Design",
        hours: 3.25,
        rate: 75,
        amount: 243.75,
      },
    ],
  },
]

// Mock data for clients
const clients = [
  { id: "1", name: "Acme Corp", email: "billing@acmecorp.com", address: "123 Main St, New York, NY 10001" },
  { id: "2", name: "TechStart Inc", email: "accounts@techstart.io", address: "456 Market St, San Francisco, CA 94103" },
  { id: "3", name: "Global Retail", email: "finance@globalretail.com", address: "789 Retail Ave, Chicago, IL 60601" },
  {
    id: "4",
    name: "FinTech Solutions",
    email: "ap@fintechsolutions.com",
    address: "101 Finance Blvd, Boston, MA 02110",
  },
]

// Mock data for projects
const projects = [
  { id: "1", name: "Website Redesign", client: "Acme Corp", rate: 85 },
  { id: "2", name: "Mobile App Development", client: "TechStart Inc", rate: 95 },
  { id: "3", name: "Marketing Campaign", client: "Global Retail", rate: 75 },
  { id: "4", name: "Database Migration", client: "FinTech Solutions", rate: 110 },
]

export function BillableHours() {
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [chartType, setChartType] = useState("bar")
  const [timeRange, setTimeRange] = useState("month")
  const [selectedClient, setSelectedClient] = useState("all")
  const [selectedProject, setSelectedProject] = useState("all")
  const [rateDialogOpen, setRateDialogOpen] = useState(false)
  const [newRate, setNewRate] = useState({
    client: "",
    project: "",
    rate: "",
    currency: "USD",
  })
  const [activeTab, setActiveTab] = useState("unbilled")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    dueDate: "",
    notes: "",
  })
  const [isEditRateDialogOpen, setIsEditRateDialogOpen] = useState(false)
  const [editingRate, setEditingRate] = useState({
    id: "",
    rate: 0,
  })

  // Calculate totals
  // const totalBillableHours = billableEntries.reduce((sum, entry) => sum + entry.hours, 0)
  // const totalBillableAmount = billableEntries.reduce((sum, entry) => sum + entry.amount, 0)
  // const averageHourlyRate = totalBillableAmount / totalBillableHours

  // Calculate totals with proper type checking
  const totalBillableHours = billableEntries.reduce((sum, entry) => {
    return sum + (typeof entry.hours === "number" ? entry.hours : 0)
  }, 0)

  const totalBillableAmount = billableEntries.reduce((sum, entry) => {
    return sum + (typeof entry.amount === "number" ? entry.amount : 0)
  }, 0)

  const averageHourlyRate = totalBillableHours > 0 ? totalBillableAmount / totalBillableHours : 0

  // Filter entries based on selected filters
  const filteredEntries = billableEntries.filter((entry) => {
    const entryDate = new Date(entry.date)

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      if (!isWithinInterval(entryDate, { start: dateRange.from, end: dateRange.to })) {
        return false
      }
    }

    // Filter by client
    if (selectedClient !== "all" && entry.client !== selectedClient) {
      return false
    }

    // Filter by project
    if (selectedProject !== "all" && entry.project !== selectedProject) {
      return false
    }

    // Filter by status
    if (selectedStatus !== "all" && entry.status !== selectedStatus) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        entry.project.toLowerCase().includes(query) ||
        entry.client.toLowerCase().includes(query) ||
        entry.task.toLowerCase().includes(query) ||
        entry.user.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Filter entries by billed/unbilled status for tabs
  const unbilledEntries = filteredEntries.filter((entry) => entry.status === "unbilled")
  const billedEntries = filteredEntries.filter((entry) => entry.status === "billed")

  // Calculate totals
  const totalUnbilled = unbilledEntries.reduce((sum, entry) => sum + entry.amount, 0)
  const totalBilled = billedEntries.reduce((sum, entry) => sum + entry.amount, 0)

  // Calculate total for selected entries
  // const selectedEntriesTotal = unbilledEntries
  //   .filter((entry) => selectedEntries.includes(entry.id))
  //   .reduce((sum, entry) => sum + entry.amount, 0)

  const selectedEntriesTotal = unbilledEntries
    .filter((entry) => selectedEntries.includes(entry.id))
    .reduce((sum, entry) => sum + (typeof entry.amount === "number" ? entry.amount : 0), 0)

  // Handle preset date ranges
  const handlePresetRange = (preset: string) => {
    const today = new Date()

    switch (preset) {
      case "thisWeek":
        setDateRange({
          from: startOfWeek(today, { weekStartsOn: 1 }),
          to: endOfWeek(today, { weekStartsOn: 1 }),
        })
        break
      case "lastWeek":
        const lastWeekStart = subDays(startOfWeek(today, { weekStartsOn: 1 }), 7)
        const lastWeekEnd = subDays(endOfWeek(today, { weekStartsOn: 1 }), 7)
        setDateRange({ from: lastWeekStart, to: lastWeekEnd })
        break
      case "thisMonth":
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today),
        })
        break
      case "lastMonth":
        const lastMonthStart = startOfMonth(subDays(startOfMonth(today), 1))
        const lastMonthEnd = endOfMonth(lastMonthStart)
        setDateRange({ from: lastMonthStart, to: lastMonthEnd })
        break
      case "last30Days":
        setDateRange({
          from: subDays(today, 29),
          to: today,
        })
        break
      case "last90Days":
        setDateRange({
          from: subDays(today, 89),
          to: today,
        })
        break
      default:
        break
    }
  }

  // Format duration in hours and minutes
  // const formatDuration = (minutes: number) => {
  //   const hours = Math.floor(minutes / 60)
  //   const mins = minutes % 60
  //   return `${hours}h ${mins}m`
  // }

  const formatDuration = (minutes: number | undefined) => {
    if (typeof minutes !== "number") return "0h 0m"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Handle select all entries
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(unbilledEntries.map((entry) => entry.id))
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

  // Handle create invoice
  const handleCreateInvoice = () => {
    if (!newInvoice.client || !newInvoice.dueDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would make an API call to create the invoice
    toast({
      title: "Invoice created",
      description: `Invoice for ${newInvoice.client} has been created`,
    })

    // Reset form and close dialog
    setNewInvoice({
      client: "",
      dueDate: "",
      notes: "",
    })
    setIsCreateInvoiceDialogOpen(false)
    setSelectedEntries([])
  }

  // Handle edit rate
  const handleEditRate = () => {
    if (!editingRate.id || editingRate.rate <= 0) {
      toast({
        title: "Invalid rate",
        description: "Please enter a valid hourly rate",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would make an API call to update the rate
    toast({
      title: "Rate updated",
      description: `Hourly rate has been updated to $${editingRate.rate.toFixed(2)}`,
    })

    // Reset form and close dialog
    setEditingRate({
      id: "",
      rate: 0,
    })
    setIsEditRateDialogOpen(false)
  }

  // Render unbilled time entries
  const renderUnbilledEntries = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedEntries.length === unbilledEntries.length && unbilledEntries.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm">
              Select All
            </label>
          </div>

          {selectedEntries.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {selectedEntries.length} entries selected (${selectedEntriesTotal.toFixed(2)})
              </span>
              <Button size="sm" onClick={() => setIsCreateInvoiceDialogOpen(true)}>
                <Receipt className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Client / Project</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unbilledEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No unbilled time entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  unbilledEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEntries.includes(entry.id)}
                          onCheckedChange={(checked) => handleSelectEntry(entry.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{entry.client}</div>
                        <div className="text-sm text-muted-foreground">{entry.project}</div>
                      </TableCell>
                      <TableCell>{entry.task}</TableCell>
                      <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{formatDuration(entry.duration)}</TableCell>
                      {/* <TableCell>${entry.rate.toFixed(2)}/hr</TableCell> */}
                      {/* <TableCell>${entry.amount.toFixed(2)}</TableCell> */}
                      <TableCell>${typeof entry.rate === "number" ? entry.rate.toFixed(2) : "0.00"}/hr</TableCell>
                      <TableCell>${typeof entry.amount === "number" ? entry.amount.toFixed(2) : "0.00"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingRate({
                                  id: entry.id,
                                  rate: entry.rate,
                                })
                                setIsEditRateDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Rate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileCheck className="h-4 w-4 mr-2" />
                              Mark as Billed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Entry
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render billed time entries
  const renderBilledEntries = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client / Project</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billedEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    No billed time entries found
                  </TableCell>
                </TableRow>
              ) : (
                billedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="font-medium">{entry.client}</div>
                      <div className="text-sm text-muted-foreground">{entry.project}</div>
                    </TableCell>
                    <TableCell>{entry.task}</TableCell>
                    <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell>{formatDuration(entry.duration)}</TableCell>
                    {/* <TableCell>${entry.rate.toFixed(2)}/hr</TableCell> */}
                    {/* <TableCell>${entry.amount.toFixed(2)}</TableCell> */}
                    <TableCell>${typeof entry.rate === "number" ? entry.rate.toFixed(2) : "0.00"}/hr</TableCell>
                    <TableCell>${typeof entry.amount === "number" ? entry.amount.toFixed(2) : "0.00"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.invoiceNumber}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileX className="h-4 w-4 mr-2" />
                            Mark as Unbilled
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  // Render invoices
  const renderInvoices = () => {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell>{format(new Date(invoice.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</TableCell>
                  {/* <TableCell>${invoice.amount.toFixed(2)}</TableCell> */}
                  <TableCell>${typeof invoice.amount === "number" ? invoice.amount.toFixed(2) : "0.00"}</TableCell>
                  <TableCell>
                    {invoice.status === "paid" ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Unpaid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send to Client
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Invoice
                        </DropdownMenuItem>
                        {invoice.status === "unpaid" ? (
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Mark as Unpaid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billable Hours</h1>
          <p className="text-muted-foreground">Track and manage your billable time and revenue</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-[300px]" />

          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="client-a">Client A</SelectItem>
              <SelectItem value="client-b">Client B</SelectItem>
              <SelectItem value="client-c">Client C</SelectItem>
              <SelectItem value="client-d">Client D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="website-redesign">Website Redesign</SelectItem>
              <SelectItem value="mobile-app">Mobile App</SelectItem>
              <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
              <SelectItem value="data-migration">Data Migration</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Billable Hours</CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <div className="text-4xl font-bold">{totalBillableHours.toFixed(1)}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {timeRange === "month" ? "5.5" : "12.5"} hours more than last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Billable Amount</CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div className="text-4xl font-bold">${totalBillableAmount.toLocaleString()}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ${timeRange === "month" ? "850" : "2,250"} more than last {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Hourly Rate</CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div className="text-4xl font-bold">${averageHourlyRate.toFixed(2)}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ${timeRange === "month" ? "5.25" : "7.50"} increase from last {timeRange}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Billable Hours Overview</CardTitle>
            <CardDescription>Billable vs. non-billable hours</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={chartType === "bar" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-l-md"
                onClick={() => setChartType("bar")}
              >
                <BarChart className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8 rounded-r-md"
                onClick={() => setChartType("line")}
              >
                <LineChart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartType === "bar" ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="billable" name="Billable Hours" fill="#3b82f6" />
                  <Bar dataKey="nonBillable" name="Non-Billable Hours" fill="#93c5fd" />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="billable" name="Billable Hours" stroke="#3b82f6" fill="#93c5fd" />
                  <Area
                    type="monotone"
                    dataKey="nonBillable"
                    name="Non-Billable Hours"
                    stroke="#6b7280"
                    fill="#e5e7eb"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billable Hours by Client</CardTitle>
          <CardDescription>Hours and revenue breakdown by client</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Billable Hours</TableHead>
                <TableHead>Hourly Rate</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientData.map((client) => (
                <TableRow key={client.name}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.billable} hrs</TableCell>
                  <TableCell>${client.rate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(client.billable * client.rate).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Billable Time Entries</CardTitle>
            <CardDescription>Detailed list of all billable time entries</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unbilled" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="unbilled">Unbilled</TabsTrigger>
              <TabsTrigger value="billed">Billed</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>
            <TabsContent value="unbilled">{renderUnbilledEntries()}</TabsContent>
            <TabsContent value="billed">{renderBilledEntries()}</TabsContent>
            <TabsContent value="invoices">{renderInvoices()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
