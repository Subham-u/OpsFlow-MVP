"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Download,
  Save,
  Share2,
  Plus,
  Trash2,
  MoveVertical,
  BarChart4,
  LineChartIcon,
  PieChartIcon,
  Table2,
  FileText,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Report element types
type ElementType = "chart-bar" | "chart-line" | "chart-pie" | "table" | "text"

// Report element interface
interface ReportElement {
  id: string
  type: ElementType
  title: string
  dataSource: string
  settings: Record<string, any>
}

// Report template interface
interface ReportTemplate {
  id: string
  name: string
  description: string
  elements: ReportElement[]
}

// Sample data sources
const dataSources = [
  { id: "projects", name: "Projects Data" },
  { id: "tasks", name: "Tasks Data" },
  { id: "team", name: "Team Performance" },
  { id: "time", name: "Time Tracking" },
  { id: "budget", name: "Budget Data" },
]

// Sample report templates
const reportTemplates: ReportTemplate[] = [
  {
    id: "template-1",
    name: "Project Performance",
    description: "Overview of project performance metrics",
    elements: [
      {
        id: "elem-1",
        type: "chart-bar",
        title: "Project Completion Rate",
        dataSource: "projects",
        settings: { showLegend: true, stacked: false },
      },
      {
        id: "elem-2",
        type: "table",
        title: "Project Status Summary",
        dataSource: "projects",
        settings: { paginated: true, pageSize: 5 },
      },
    ],
  },
  {
    id: "template-2",
    name: "Team Productivity",
    description: "Team productivity and performance metrics",
    elements: [
      {
        id: "elem-3",
        type: "chart-line",
        title: "Productivity Trend",
        dataSource: "team",
        settings: { showPoints: true, smoothCurve: true },
      },
      {
        id: "elem-4",
        type: "chart-pie",
        title: "Task Distribution",
        dataSource: "tasks",
        settings: { donut: true, showPercentage: true },
      },
    ],
  },
]

// Sortable report element component
const SortableReportElement = ({ element }: { element: ReportElement }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getElementIcon = (type: ElementType) => {
    switch (type) {
      case "chart-bar":
        return <BarChart4 className="h-5 w-5" />
      case "chart-line":
        return <LineChartIcon className="h-5 w-5" />
      case "chart-pie":
        return <PieChartIcon className="h-5 w-5" />
      case "table":
        return <Table2 className="h-5 w-5" />
      case "text":
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card>
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-2">
            {getElementIcon(element.type)}
            <CardTitle className="text-sm font-medium">{element.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" {...attributes} {...listeners}>
              <MoveVertical className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-xs text-muted-foreground">
            Data source: {dataSources.find((ds) => ds.id === element.dataSource)?.name || element.dataSource}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Element palette item component
const ElementPaletteItem = ({
  type,
  title,
  onAdd,
}: { type: ElementType; title: string; onAdd: (type: ElementType) => void }) => {
  const getElementIcon = (type: ElementType) => {
    switch (type) {
      case "chart-bar":
        return <BarChart4 className="h-5 w-5" />
      case "chart-line":
        return <LineChartIcon className="h-5 w-5" />
      case "chart-pie":
        return <PieChartIcon className="h-5 w-5" />
      case "table":
        return <Table2 className="h-5 w-5" />
      case "text":
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div
      className="flex items-center justify-between p-2 border rounded-md mb-2 hover:bg-accent cursor-pointer"
      onClick={() => onAdd(type)}
    >
      <div className="flex items-center space-x-2">
        {getElementIcon(type)}
        <span>{title}</span>
      </div>
      <Plus className="h-4 w-4" />
    </div>
  )
}

export function CustomReportBuilder() {
  const [reportName, setReportName] = useState("New Custom Report")
  const [reportDescription, setReportDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [elements, setElements] = useState<ReportElement[]>([])
  const [activeTab, setActiveTab] = useState("design")
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Add new element to report
  const addElement = (type: ElementType) => {
    const newElement: ReportElement = {
      id: `elem-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1).replace("chart-", "")} Element`,
      dataSource: dataSources[0].id,
      settings: {},
    }

    setElements([...elements, newElement])
  }

  // Load template
  const loadTemplate = (templateId: string) => {
    const template = reportTemplates.find((t) => t.id === templateId)
    if (template) {
      setReportName(template.name)
      setReportDescription(template.description)
      setElements([...template.elements])
      setSelectedTemplate(templateId)

      toast({
        title: "Template Loaded",
        description: `The "${template.name}" template has been loaded.`,
      })
    }
  }

  // Save report
  const saveReport = () => {
    // In a real app, this would save to a database
    toast({
      title: "Report Saved",
      description: "Your custom report has been saved successfully.",
    })
  }

  // Export report
  const exportReport = () => {
    // In a real app, this would generate a PDF or other format
    toast({
      title: "Report Exported",
      description: "Your report has been exported as PDF.",
    })
  }

  // Share report
  const shareReport = () => {
    // In a real app, this would open sharing options
    toast({
      title: "Share Options",
      description: "Sharing options have been opened.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Custom Report Builder</h2>
          <p className="text-muted-foreground">Create custom reports by adding and arranging elements</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={shareReport}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm" onClick={saveReport}>
            <Save className="mr-2 h-4 w-4" />
            Save Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-4">
          <div className="grid grid-cols-12 gap-6">
            {/* Report Elements Panel */}
            <div className="col-span-9">
              <Card>
                <CardHeader>
                  <CardTitle>Report Elements</CardTitle>
                  <CardDescription>Drag and drop elements to rearrange them</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input
                      placeholder="Report Name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      className="text-lg font-bold mb-2"
                    />
                    <Input
                      placeholder="Report Description (optional)"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                    />
                  </div>

                  <Separator className="my-4" />

                  <ScrollArea className="h-[500px] pr-4">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={elements.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                        {elements.length > 0 ? (
                          elements.map((element) => <SortableReportElement key={element.id} element={element} />)
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No elements added yet. Add elements from the palette or select a template.</p>
                          </div>
                        )}
                      </SortableContext>
                    </DndContext>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Element Palette */}
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Element Palette</CardTitle>
                  <CardDescription>Add elements to your report</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Charts</h4>
                      <ElementPaletteItem type="chart-bar" title="Bar Chart" onAdd={addElement} />
                      <ElementPaletteItem type="chart-line" title="Line Chart" onAdd={addElement} />
                      <ElementPaletteItem type="chart-pie" title="Pie Chart" onAdd={addElement} />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Data</h4>
                      <ElementPaletteItem type="table" title="Table" onAdd={addElement} />
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Content</h4>
                      <ElementPaletteItem type="text" title="Text Block" onAdd={addElement} />
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Templates</h4>
                      <Select value={selectedTemplate || ""} onValueChange={loadTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>{reportName}</CardTitle>
              <CardDescription>{reportDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Report preview would be displayed here</p>
                <p className="text-sm mt-2">
                  In a real implementation, this would render the actual report with real data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Report Settings</CardTitle>
              <CardDescription>Configure report settings and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-refresh">Data Refresh Rate</Label>
                    <Select defaultValue="manual">
                      <SelectTrigger id="data-refresh">
                        <SelectValue placeholder="Select refresh rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Refresh</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="export-format">Default Export Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="export-format">
                        <SelectValue placeholder="Select export format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>Public Report</span>
                        <Badge variant="outline">Anyone with link</Badge>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>Allow Comments</span>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>Allow Editing by Team</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() =>
                  toast({ title: "Settings Saved", description: "Your report settings have been updated." })
                }
              >
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomReportBuilder
