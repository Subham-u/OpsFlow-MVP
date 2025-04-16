"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Calculator, Download, Save, Share2, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define scenario types
type ScenarioType = "budget" | "resources" | "timeline" | "scope"

interface Scenario {
  id: string
  name: string
  type: ScenarioType
  description?: string
  parameters: {
    [key: string]: number
  }
  results: {
    [key: string]: number
  }
  createdAt: string
}

// Sample scenarios
const sampleScenarios: Scenario[] = [
  {
    id: "scenario-1",
    name: "Budget Reduction",
    type: "budget",
    description: "Impact of 15% budget reduction across all projects",
    parameters: {
      budgetReduction: 15,
      resourceAdjustment: 10,
      timelineExtension: 5,
      scopeReduction: 8,
    },
    results: {
      projectCompletion: 92,
      teamUtilization: 95,
      customerSatisfaction: 85,
      profitMargin: 18,
      riskScore: 65,
    },
    createdAt: "2023-06-15T10:30:00",
  },
  {
    id: "scenario-2",
    name: "Resource Optimization",
    type: "resources",
    description: "Adding 2 senior developers to critical projects",
    parameters: {
      budgetReduction: 0,
      resourceAdjustment: -15,
      timelineExtension: -10,
      scopeReduction: 0,
    },
    results: {
      projectCompletion: 105,
      teamUtilization: 88,
      customerSatisfaction: 92,
      profitMargin: 22,
      riskScore: 45,
    },
    createdAt: "2023-06-20T14:45:00",
  },
  {
    id: "scenario-3",
    name: "Timeline Extension",
    type: "timeline",
    description: "Extending project timelines by 4 weeks",
    parameters: {
      budgetReduction: 5,
      resourceAdjustment: -5,
      timelineExtension: 20,
      scopeReduction: 0,
    },
    results: {
      projectCompletion: 100,
      teamUtilization: 82,
      customerSatisfaction: 78,
      profitMargin: 25,
      riskScore: 35,
    },
    createdAt: "2023-06-25T09:15:00",
  },
]

// Base scenario data for comparison
const baseScenarioData = {
  projectCompletion: 100,
  teamUtilization: 85,
  customerSatisfaction: 90,
  profitMargin: 20,
  riskScore: 50,
}

// Sample data for timeline chart
const generateTimelineData = (timelineExtension: number) => {
  const baseData = [
    { month: "Jul", baseline: 25, adjusted: 25 * (1 - timelineExtension / 100) },
    { month: "Aug", baseline: 50, adjusted: 50 * (1 - timelineExtension / 100) },
    { month: "Sep", baseline: 75, adjusted: 75 * (1 - timelineExtension / 100) },
    { month: "Oct", baseline: 100, adjusted: 100 * (1 - timelineExtension / 100) },
    { month: "Nov", baseline: null, adjusted: 75 * (1 - timelineExtension / 100) + 25 },
    { month: "Dec", baseline: null, adjusted: 100 },
  ]
  return baseData
}

// Sample data for budget chart
const generateBudgetData = (budgetReduction: number) => {
  const baseData = [
    { category: "Development", baseline: 120000, adjusted: 120000 * (1 - budgetReduction / 100) },
    { category: "Design", baseline: 80000, adjusted: 80000 * (1 - budgetReduction / 100) },
    { category: "Marketing", baseline: 60000, adjusted: 60000 * (1 - budgetReduction / 100) },
    { category: "Operations", baseline: 40000, adjusted: 40000 * (1 - budgetReduction / 100) },
  ]
  return baseData
}

// Sample data for resource chart
const generateResourceData = (resourceAdjustment: number) => {
  const baseData = [
    { role: "Developers", baseline: 8, adjusted: 8 * (1 + resourceAdjustment / 100) },
    { role: "Designers", baseline: 4, adjusted: 4 * (1 + resourceAdjustment / 100) },
    { role: "Project Managers", baseline: 2, adjusted: 2 * (1 + resourceAdjustment / 100) },
    { role: "QA Engineers", baseline: 3, adjusted: 3 * (1 + resourceAdjustment / 100) },
  ]
  return baseData
}

export function WhatIfAnalysis() {
  const [scenarios, setScenarios] = useState<Scenario[]>(sampleScenarios)
  const [activeTab, setActiveTab] = useState("simulator")
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null)
  const [parameters, setParameters] = useState({
    budgetReduction: 0,
    resourceAdjustment: 0,
    timelineExtension: 0,
    scopeReduction: 0,
  })
  const [results, setResults] = useState({
    projectCompletion: 100,
    teamUtilization: 85,
    customerSatisfaction: 90,
    profitMargin: 20,
    riskScore: 50,
  })

  // Update parameters
  const updateParameter = (param: string, value: number) => {
    setParameters({
      ...parameters,
      [param]: value,
    })

    // Simple simulation logic - in a real app this would be more complex
    simulateResults()
  }

  // Simulate results based on parameters
  const simulateResults = () => {
    // This is a simplified simulation model
    // In a real app, this would be much more sophisticated
    const projectCompletion =
      100 -
      parameters.scopeReduction +
      parameters.timelineExtension / 2 -
      parameters.budgetReduction / 3 +
      parameters.resourceAdjustment / 2
    const teamUtilization =
      85 + parameters.resourceAdjustment / 3 - parameters.timelineExtension / 4 + parameters.budgetReduction / 5
    const customerSatisfaction =
      90 - parameters.scopeReduction / 2 - parameters.budgetReduction / 4 + parameters.resourceAdjustment / 5
    const profitMargin =
      20 + parameters.budgetReduction / 3 - parameters.resourceAdjustment / 2 + parameters.scopeReduction / 4
    const riskScore =
      50 +
      parameters.budgetReduction / 2 -
      parameters.resourceAdjustment / 3 +
      parameters.scopeReduction / 2 -
      parameters.timelineExtension / 4

    setResults({
      projectCompletion: Math.round(Math.max(0, Math.min(120, projectCompletion))),
      teamUtilization: Math.round(Math.max(0, Math.min(100, teamUtilization))),
      customerSatisfaction: Math.round(Math.max(0, Math.min(100, customerSatisfaction))),
      profitMargin: Math.round(Math.max(0, Math.min(40, profitMargin))),
      riskScore: Math.round(Math.max(0, Math.min(100, riskScore))),
    })
  }

  // Save current scenario
  const saveScenario = () => {
    const newScenario: Scenario = {
      id: `scenario-${scenarios.length + 1}-${Date.now()}`,
      name: `New Scenario ${scenarios.length + 1}`,
      type: "budget", // Default type
      parameters: { ...parameters },
      results: { ...results },
      createdAt: new Date().toISOString(),
    }

    setScenarios([...scenarios, newScenario])
    setActiveScenario(newScenario)
    alert("Scenario saved successfully!")
  }

  // Load scenario
  const loadScenario = (scenario: Scenario) => {
    setParameters({ ...scenario.parameters })
    setResults({ ...scenario.results })
    setActiveScenario(scenario)
    setActiveTab("simulator")
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">What-If Analysis</h2>
          <p className="text-muted-foreground">Simulate different scenarios to optimize project outcomes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={saveScenario}>
            <Save className="h-4 w-4 mr-2" />
            Save Scenario
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="simulator">Scenario Simulator</TabsTrigger>
          <TabsTrigger value="saved">Saved Scenarios</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Parameters Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Scenario Parameters</CardTitle>
                <CardDescription>Adjust parameters to simulate different project scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="budget-reduction">Budget Reduction</Label>
                    <span className="text-sm font-medium">{parameters.budgetReduction}%</span>
                  </div>
                  <Slider
                    id="budget-reduction"
                    min={-20}
                    max={30}
                    step={1}
                    value={[parameters.budgetReduction]}
                    onValueChange={(value) => updateParameter("budgetReduction", value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-20%</span>
                    <span>0%</span>
                    <span>+30%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resource-adjustment">Resource Adjustment</Label>
                    <span className="text-sm font-medium">{parameters.resourceAdjustment}%</span>
                  </div>
                  <Slider
                    id="resource-adjustment"
                    min={-30}
                    max={30}
                    step={1}
                    value={[parameters.resourceAdjustment]}
                    onValueChange={(value) => updateParameter("resourceAdjustment", value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-30%</span>
                    <span>0%</span>
                    <span>+30%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="timeline-extension">Timeline Extension</Label>
                    <span className="text-sm font-medium">{parameters.timelineExtension}%</span>
                  </div>
                  <Slider
                    id="timeline-extension"
                    min={-20}
                    max={40}
                    step={1}
                    value={[parameters.timelineExtension]}
                    onValueChange={(value) => updateParameter("timelineExtension", value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-20%</span>
                    <span>0%</span>
                    <span>+40%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="scope-reduction">Scope Adjustment</Label>
                    <span className="text-sm font-medium">{parameters.scopeReduction}%</span>
                  </div>
                  <Slider
                    id="scope-reduction"
                    min={-10}
                    max={30}
                    step={1}
                    value={[parameters.scopeReduction]}
                    onValueChange={(value) => updateParameter("scopeReduction", value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-10%</span>
                    <span>0%</span>
                    <span>+30%</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" onClick={simulateResults}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Simulation Results</CardTitle>
                <CardDescription>Projected outcomes based on the current parameter settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-sm text-muted-foreground mb-1">Project Completion</div>
                      <div className="text-2xl font-bold">{results.projectCompletion}%</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {results.projectCompletion > baseScenarioData.projectCompletion ? (
                          <span className="text-green-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />{" "}
                            {results.projectCompletion - baseScenarioData.projectCompletion}%
                          </span>
                        ) : results.projectCompletion < baseScenarioData.projectCompletion ? (
                          <span className="text-red-500">
                            <ArrowDown className="h-3 w-3 inline-block mr-1" />{" "}
                            {baseScenarioData.projectCompletion - results.projectCompletion}%
                          </span>
                        ) : (
                          <span>No change</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-sm text-muted-foreground mb-1">Team Utilization</div>
                      <div className="text-2xl font-bold">{results.teamUtilization}%</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {results.teamUtilization > baseScenarioData.teamUtilization ? (
                          <span className="text-amber-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />{" "}
                            {results.teamUtilization - baseScenarioData.teamUtilization}%
                          </span>
                        ) : results.teamUtilization < baseScenarioData.teamUtilization ? (
                          <span className="text-green-500">
                            <ArrowDown className="h-3 w-3 inline-block mr-1" />{" "}
                            {baseScenarioData.teamUtilization - results.teamUtilization}%
                          </span>
                        ) : (
                          <span>No change</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-sm text-muted-foreground mb-1">Customer Satisfaction</div>
                      <div className="text-2xl font-bold">{results.customerSatisfaction}%</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {results.customerSatisfaction > baseScenarioData.customerSatisfaction ? (
                          <span className="text-green-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />{" "}
                            {results.customerSatisfaction - baseScenarioData.customerSatisfaction}%
                          </span>
                        ) : results.customerSatisfaction < baseScenarioData.customerSatisfaction ? (
                          <span className="text-red-500">
                            <ArrowDown className="h-3 w-3 inline-block mr-1" />{" "}
                            {baseScenarioData.customerSatisfaction - results.customerSatisfaction}%
                          </span>
                        ) : (
                          <span>No change</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-sm text-muted-foreground mb-1">Profit Margin</div>
                      <div className="text-2xl font-bold">{results.profitMargin}%</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {results.profitMargin > baseScenarioData.profitMargin ? (
                          <span className="text-green-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />{" "}
                            {results.profitMargin - baseScenarioData.profitMargin}%
                          </span>
                        ) : results.profitMargin < baseScenarioData.profitMargin ? (
                          <span className="text-red-500">
                            <ArrowDown className="h-3 w-3 inline-block mr-1" />{" "}
                            {baseScenarioData.profitMargin - results.profitMargin}%
                          </span>
                        ) : (
                          <span>No change</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="text-sm text-muted-foreground mb-1">Risk Score</div>
                      <div className="text-2xl font-bold">{results.riskScore}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {results.riskScore > baseScenarioData.riskScore ? (
                          <span className="text-red-500">
                            <ArrowUp className="h-3 w-3 inline-block mr-1" />{" "}
                            {results.riskScore - baseScenarioData.riskScore}
                          </span>
                        ) : results.riskScore < baseScenarioData.riskScore ? (
                          <span className="text-green-500">
                            <ArrowDown className="h-3 w-3 inline-block mr-1" />{" "}
                            {baseScenarioData.riskScore - results.riskScore}
                          </span>
                        ) : (
                          <span>No change</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Timeline Impact</h3>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={generateTimelineData(parameters.timelineExtension)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="baseline" stroke="#8b5cf6" name="Baseline" strokeWidth={2} />
                          <Line
                            type="monotone"
                            dataKey="adjusted"
                            stroke="#3b82f6"
                            name="Adjusted"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Budget Impact</h3>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={generateBudgetData(parameters.budgetReduction)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Legend />
                          <Bar dataKey="baseline" fill="#8b5cf6" name="Baseline Budget" />
                          <Bar dataKey="adjusted" fill="#3b82f6" name="Adjusted Budget" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Resource Impact</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={generateResourceData(parameters.resourceAdjustment)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="role" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="baseline" fill="#8b5cf6" name="Baseline Team Size" />
                        <Bar dataKey="adjusted" fill="#3b82f6" name="Adjusted Team Size" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={saveScenario}>
                  <Save className="h-4 w-4 mr-2" />
                  Save This Scenario
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Scenarios</CardTitle>
              <CardDescription>Previously saved what-if scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Scenario Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Key Parameters</TableHead>
                      <TableHead>Outcomes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map((scenario) => (
                      <TableRow key={scenario.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{scenario.name}</div>
                            {scenario.description && (
                              <div className="text-sm text-muted-foreground">{scenario.description}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {scenario.type.charAt(0).toUpperCase() + scenario.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(scenario.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Budget: {scenario.parameters.budgetReduction}%</div>
                            <div>Resources: {scenario.parameters.resourceAdjustment}%</div>
                            <div>Timeline: {scenario.parameters.timelineExtension}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Completion: {scenario.results.projectCompletion}%</div>
                            <div>Profit: {scenario.results.profitMargin}%</div>
                            <div>Risk: {scenario.results.riskScore}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => loadScenario(scenario)}>
                            Load Scenario
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
              <CardDescription>Compare different scenarios side by side</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Parameters</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 text-sm">
                        <div>Budget Adjustment</div>
                        <div>Resource Adjustment</div>
                        <div>Timeline Adjustment</div>
                        <div>Scope Adjustment</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Baseline</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 text-sm">
                        <div>0%</div>
                        <div>0%</div>
                        <div>0%</div>
                        <div>0%</div>
                      </div>
                    </CardContent>
                  </Card>

                  {scenarios.slice(0, 2).map((scenario) => (
                    <Card key={scenario.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{scenario.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1 text-sm">
                          <div>{scenario.parameters.budgetReduction}%</div>
                          <div>{scenario.parameters.resourceAdjustment}%</div>
                          <div>{scenario.parameters.timelineExtension}%</div>
                          <div>{scenario.parameters.scopeReduction}%</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 text-sm">
                        <div>Project Completion</div>
                        <div>Team Utilization</div>
                        <div>Customer Satisfaction</div>
                        <div>Profit Margin</div>
                        <div>Risk Score</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Baseline</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 text-sm">
                        <div>{baseScenarioData.projectCompletion}%</div>
                        <div>{baseScenarioData.teamUtilization}%</div>
                        <div>{baseScenarioData.customerSatisfaction}%</div>
                        <div>{baseScenarioData.profitMargin}%</div>
                        <div>{baseScenarioData.riskScore}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {scenarios.slice(0, 2).map((scenario) => (
                    <Card key={scenario.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{scenario.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            {scenario.results.projectCompletion}%
                            {scenario.results.projectCompletion > baseScenarioData.projectCompletion ? (
                              <ArrowUp className="ml-1 h-3 w-3 text-green-500" />
                            ) : scenario.results.projectCompletion < baseScenarioData.projectCompletion ? (
                              <ArrowDown className="ml-1 h-3 w-3 text-red-500" />
                            ) : null}
                          </div>
                          <div className="flex items-center">
                            {scenario.results.teamUtilization}%
                            {scenario.results.teamUtilization > baseScenarioData.teamUtilization ? (
                              <ArrowUp className="ml-1 h-3 w-3 text-amber-500" />
                            ) : scenario.results.teamUtilization < baseScenarioData.teamUtilization ? (
                              <ArrowDown className="ml-1 h-3 w-3 text-green-500" />
                            ) : null}
                          </div>
                          <div className="flex items-center">
                            {scenario.results.customerSatisfaction}%
                            {scenario.results.customerSatisfaction > baseScenarioData.customerSatisfaction ? (
                              <ArrowUp className="ml-1 h-3 w-3 text-green-500" />
                            ) : scenario.results.customerSatisfaction < baseScenarioData.customerSatisfaction ? (
                              <ArrowDown className="ml-1 h-3 w-3 text-red-500" />
                            ) : null}
                          </div>
                          <div className="flex items-center">
                            {scenario.results.profitMargin}%
                            {scenario.results.profitMargin > baseScenarioData.profitMargin ? (
                              <ArrowUp className="ml-1 h-3 w-3 text-green-500" />
                            ) : scenario.results.profitMargin < baseScenarioData.profitMargin ? (
                              <ArrowDown className="ml-1 h-3 w-3 text-red-500" />
                            ) : null}
                          </div>
                          <div className="flex items-center">
                            {scenario.results.riskScore}
                            {scenario.results.riskScore > baseScenarioData.riskScore ? (
                              <ArrowUp className="ml-1 h-3 w-3 text-red-500" />
                            ) : scenario.results.riskScore < baseScenarioData.riskScore ? (
                              <ArrowDown className="ml-1 h-3 w-3 text-green-500" />
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="h-[300px]">
                  <h3 className="text-lg font-medium mb-2">Outcome Comparison</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Project Completion",
                          baseline: 100,
                          scenario1: scenarios[0]?.results.projectCompletion || 0,
                          scenario2: scenarios[1]?.results.projectCompletion || 0,
                        },
                        {
                          name: "Team Utilization",
                          baseline: 85,
                          scenario1: scenarios[0]?.results.teamUtilization || 0,
                          scenario2: scenarios[1]?.results.teamUtilization || 0,
                        },
                        {
                          name: "Customer Satisfaction",
                          baseline: 90,
                          scenario1: scenarios[0]?.results.customerSatisfaction || 0,
                          scenario2: scenarios[1]?.results.customerSatisfaction || 0,
                        },
                        {
                          name: "Profit Margin",
                          baseline: 20,
                          scenario1: scenarios[0]?.results.profitMargin || 0,
                          scenario2: scenarios[1]?.results.profitMargin || 0,
                        },
                        {
                          name: "Risk Score",
                          baseline: 50,
                          scenario1: scenarios[0]?.results.riskScore || 0,
                          scenario2: scenarios[1]?.results.riskScore || 0,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" />
                      <Bar dataKey="scenario1" fill="#3b82f6" name={scenarios[0]?.name || "Scenario 1"} />
                      <Bar dataKey="scenario2" fill="#8b5cf6" name={scenarios[1]?.name || "Scenario 2"} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
