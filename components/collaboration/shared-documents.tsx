"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  File,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Search,
  Plus,
  Folder,
  Download,
  Share2,
  Trash,
  Edit,
  Clock,
  Star,
  StarOff,
  SortAsc,
  Grid,
  List,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"

type Document = {
  id: string
  name: string
  type: "pdf" | "doc" | "sheet" | "image" | "folder"
  size?: string
  modified: string
  modifiedBy: {
    name: string
    avatar: string
    initials: string
  }
  shared: {
    name: string
    avatar: string
    initials: string
  }[]
  starred: boolean
  tags: string[]
  path: string[]
}

export function SharedDocuments() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "modified" | "size">("modified")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Project Requirements",
      type: "pdf",
      size: "2.4 MB",
      modified: "2023-08-05T14:30:00Z",
      modifiedBy: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      shared: [
        {
          name: "Beth Smith",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "BS",
        },
        {
          name: "Carl Davis",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "CD",
        },
      ],
      starred: true,
      tags: ["requirements", "documentation"],
      path: [],
    },
    {
      id: "2",
      name: "Design Assets",
      type: "folder",
      modified: "2023-08-04T11:20:00Z",
      modifiedBy: {
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "BS",
      },
      shared: [
        {
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "AJ",
        },
        {
          name: "Dana Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "DW",
        },
      ],
      starred: false,
      tags: ["design", "assets"],
      path: [],
    },
    {
      id: "3",
      name: "Project Timeline",
      type: "sheet",
      size: "1.2 MB",
      modified: "2023-08-06T09:15:00Z",
      modifiedBy: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      shared: [
        {
          name: "Beth Smith",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "BS",
        },
        {
          name: "Carl Davis",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "CD",
        },
        {
          name: "Dana Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "DW",
        },
      ],
      starred: true,
      tags: ["timeline", "planning"],
      path: [],
    },
    {
      id: "4",
      name: "Meeting Notes",
      type: "doc",
      size: "0.5 MB",
      modified: "2023-08-03T15:45:00Z",
      modifiedBy: {
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "CD",
      },
      shared: [
        {
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "AJ",
        },
      ],
      starred: false,
      tags: ["meetings", "notes"],
      path: [],
    },
    {
      id: "5",
      name: "Homepage Mockup",
      type: "image",
      size: "3.8 MB",
      modified: "2023-08-02T10:30:00Z",
      modifiedBy: {
        name: "Beth Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "BS",
      },
      shared: [
        {
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "AJ",
        },
        {
          name: "Dana Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "DW",
        },
      ],
      starred: false,
      tags: ["design", "mockup"],
      path: [],
    },
    {
      id: "6",
      name: "API Documentation",
      type: "pdf",
      size: "1.7 MB",
      modified: "2023-08-01T16:20:00Z",
      modifiedBy: {
        name: "Dana Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DW",
      },
      shared: [
        {
          name: "Carl Davis",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "CD",
        },
      ],
      starred: false,
      tags: ["api", "documentation"],
      path: [],
    },
    {
      id: "7",
      name: "Development Resources",
      type: "folder",
      modified: "2023-07-30T14:10:00Z",
      modifiedBy: {
        name: "Carl Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "CD",
      },
      shared: [
        {
          name: "Alex Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "AJ",
        },
        {
          name: "Dana Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "DW",
        },
      ],
      starred: false,
      tags: ["development", "resources"],
      path: [],
    },
    {
      id: "8",
      name: "Budget Forecast",
      type: "sheet",
      size: "0.9 MB",
      modified: "2023-07-28T11:05:00Z",
      modifiedBy: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      shared: [
        {
          name: "Beth Smith",
          avatar: "/placeholder.svg?height=32&width=32",
          initials: "BS",
        },
      ],
      starred: true,
      tags: ["budget", "finance"],
      path: [],
    },
  ])

  // Filter and sort documents
  const filteredDocuments = documents
    .filter((doc) => {
      // Filter by path
      if (!currentPath.every((segment, index) => doc.path[index] === segment)) {
        return false
      }

      // Filter by search query
      if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Filter by category
      if (selectedCategory === "starred" && !doc.starred) {
        return false
      } else if (selectedCategory === "shared" && doc.shared.length === 0) {
        return false
      } else if (selectedCategory === "documents" && doc.type === "folder") {
        return false
      } else if (selectedCategory === "images" && doc.type !== "image") {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by type (folders first)
      if (a.type === "folder" && b.type !== "folder") {
        return -1
      } else if (a.type !== "folder" && b.type === "folder") {
        return 1
      }

      // Then sort by the selected criteria
      if (sortBy === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "modified") {
        return sortDirection === "asc"
          ? new Date(a.modified).getTime() - new Date(b.modified).getTime()
          : new Date(b.modified).getTime() - new Date(a.modified).getTime()
      } else if (sortBy === "size") {
        // Parse size strings like "2.4 MB" to numbers for comparison
        const getSize = (doc: Document) => {
          if (doc.type === "folder" || !doc.size) return 0
          const [num, unit] = doc.size.split(" ")
          const multiplier = unit === "MB" ? 1024 : 1
          return Number.parseFloat(num) * multiplier
        }

        return sortDirection === "asc" ? getSize(a) - getSize(b) : getSize(b) - getSize(a)
      }

      return 0
    })

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // In a real app, you would upload the file to a server
      // Here we'll just add it to our documents array

      Array.from(files).forEach((file) => {
        const fileType = getFileType(file.name)

        const newDocument: Document = {
          id: `${documents.length + 1}`,
          name: file.name,
          type: fileType,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          modified: new Date().toISOString(),
          modifiedBy: {
            name: "You",
            avatar: "/placeholder.svg?height=32&width=32",
            initials: "YO",
          },
          shared: [],
          starred: false,
          tags: [],
          path: [...currentPath],
        }

        setDocuments([...documents, newDocument])
      })

      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully`,
      })

      // Reset the file input
      e.target.value = ""
    }

    setIsUploadDialogOpen(false)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      })
      return
    }

    const newFolder: Document = {
      id: `${documents.length + 1}`,
      name: newFolderName,
      type: "folder",
      modified: new Date().toISOString(),
      modifiedBy: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "YO",
      },
      shared: [],
      starred: false,
      tags: [],
      path: [...currentPath],
    }

    setDocuments([...documents, newFolder])
    setNewFolderName("")
    setIsCreateFolderDialogOpen(false)

    toast({
      title: "Folder created",
      description: `Folder "${newFolderName}" created successfully`,
    })
  }

  const handleToggleSelect = (id: string) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((docId) => docId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id))
    }
  }

  const handleToggleStar = (id: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, starred: !doc.starred } : doc)))
  }

  const handleDeleteSelected = () => {
    setDocuments((prev) => prev.filter((doc) => !selectedDocuments.includes(doc.id)))

    toast({
      title: "Items deleted",
      description: `${selectedDocuments.length} item(s) deleted successfully`,
    })

    setSelectedDocuments([])
  }

  const handleOpenFolder = (id: string) => {
    const folder = documents.find((doc) => doc.id === id && doc.type === "folder")
    if (folder) {
      setCurrentPath([...folder.path, folder.name])
    }
  }

  const handleNavigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
    }
  }

  const handleNavigateToPath = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  const getFileType = (filename: string): "pdf" | "doc" | "sheet" | "image" | "folder" => {
    const extension = filename.split(".").pop()?.toLowerCase() || ""

    if (extension === "pdf") return "pdf"
    if (["doc", "docx", "txt"].includes(extension)) return "doc"
    if (["xls", "xlsx", "csv"].includes(extension)) return "sheet"
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) return "image"

    return "doc" // Default
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />
      case "doc":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "sheet":
        return <FileText className="h-10 w-10 text-green-500" />
      case "image":
        return <ImageIcon className="h-10 w-10 text-purple-500" />
      case "folder":
        return <Folder className="h-10 w-10 text-yellow-500" />
      default:
        return <File className="h-10 w-10 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="space-y-2">
                <div className="font-medium text-sm">Sort by</div>
                <div className="space-y-1">
                  <Button
                    variant={sortBy === "name" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSortBy("name")
                      setSortDirection(sortBy === "name" && sortDirection === "asc" ? "desc" : "asc")
                    }}
                  >
                    Name {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </Button>
                  <Button
                    variant={sortBy === "modified" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSortBy("modified")
                      setSortDirection(sortBy === "modified" && sortDirection === "asc" ? "desc" : "asc")
                    }}
                  >
                    Date modified {sortBy === "modified" && (sortDirection === "asc" ? "↑" : "↓")}
                  </Button>
                  <Button
                    variant={sortBy === "size" ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setSortBy("size")
                      setSortDirection(sortBy === "size" && sortDirection === "asc" ? "desc" : "asc")
                    }}
                  >
                    Size {sortBy === "size" && (sortDirection === "asc" ? "↑" : "↓")}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsUploadDialogOpen(true)}>Upload files</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreateFolderDialogOpen(true)}>Create folder</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={handleNavigateUp} disabled={currentPath.length === 0}>
          <Folder className="h-4 w-4 mr-1" />
          Root
        </Button>

        {currentPath.map((segment, index) => (
          <div key={index} className="flex items-center">
            <span className="mx-1 text-muted-foreground">/</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigateToPath(index)}
              disabled={index === currentPath.length - 1}
            >
              {segment}
            </Button>
          </div>
        ))}
      </div>

      {/* Selection actions */}
      {selectedDocuments.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedDocuments.length === filteredDocuments.length}
              onCheckedChange={handleSelectAll}
            />
            <span>{selectedDocuments.length} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* Documents grid/list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Files and Folders</span>
            <div className="text-sm font-normal text-muted-foreground">{filteredDocuments.length} items</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No documents found</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`border rounded-md p-3 transition-colors ${
                    selectedDocuments.includes(doc.id) ? "bg-muted border-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => handleToggleSelect(doc.id)}
                        className="mt-1"
                      />
                      <div
                        className="cursor-pointer"
                        onClick={() => (doc.type === "folder" ? handleOpenFolder(doc.id) : null)}
                      >
                        {getFileIcon(doc.type)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleStar(doc.id)}>
                      {doc.starred ? (
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-2">
                    <div
                      className={`font-medium truncate ${doc.type === "folder" ? "cursor-pointer hover:text-primary" : ""}`}
                      onClick={() => (doc.type === "folder" ? handleOpenFolder(doc.id) : null)}
                    >
                      {doc.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {doc.type !== "folder" && doc.size ? `${doc.size} • ` : ""}
                      {formatDate(doc.modified)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={doc.modifiedBy.avatar} alt={doc.modifiedBy.name} />
                        <AvatarFallback>{doc.modifiedBy.initials}</AvatarFallback>
                      </Avatar>
                      {doc.shared.slice(0, 2).map((user, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {doc.shared.length > 2 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{doc.shared.length - 2}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-md divide-y">
              <div className="grid grid-cols-12 gap-4 p-3 font-medium text-sm">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Modified</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-2">Shared with</div>
                <div className="col-span-1"></div>
              </div>
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`grid grid-cols-12 gap-4 p-3 items-center ${
                    selectedDocuments.includes(doc.id) ? "bg-muted" : ""
                  }`}
                >
                  <div className="col-span-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => handleToggleSelect(doc.id)}
                      />
                      <div
                        className="cursor-pointer"
                        onClick={() => (doc.type === "folder" ? handleOpenFolder(doc.id) : null)}
                      >
                        {getFileIcon(doc.type)}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${doc.type === "folder" ? "cursor-pointer hover:text-primary" : ""}`}
                          onClick={() => (doc.type === "folder" ? handleOpenFolder(doc.id) : null)}
                        >
                          {doc.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {doc.tags.map((tag) => `#${tag}`).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center text-sm">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    {formatDate(doc.modified)}
                  </div>
                  <div className="col-span-1 text-sm">{doc.type !== "folder" && doc.size ? doc.size : "-"}</div>
                  <div className="col-span-2">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={doc.modifiedBy.avatar} alt={doc.modifiedBy.name} />
                          <AvatarFallback>{doc.modifiedBy.initials}</AvatarFallback>
                        </Avatar>
                        {doc.shared.slice(0, 1).map((user, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                        {doc.shared.length > 1 && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                            +{doc.shared.length - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleStar(doc.id)}>
                      {doc.starred ? (
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>Upload files to the current folder.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer" onClick={handleUpload}>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
              <Plus className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">Support for documents, images, and other files</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>Create a new folder in the current directory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
