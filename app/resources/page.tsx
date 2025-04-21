"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, FileText, Search, ThumbsUp, Upload } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Import useAuth at the top of the file
import { useAuth } from "@/components/auth-provider"

type Resource = {
  id: string
  title: string
  description: string
  category: string
  type: string
  downloads: number
  likes: number
  author: string
  date: string
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Add useAuth hook inside the component
  const { user } = useAuth()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }

  const resources: Resource[] = [
    {
      id: "1",
      title: "Complete Data Structures & Algorithms Guide",
      description: "A comprehensive guide to data structures and algorithms for computer science students.",
      category: "Academic",
      type: "PDF",
      downloads: 1250,
      likes: 320,
      author: "Prof. Sharma",
      date: "2023-05-15",
    },
    {
      id: "2",
      title: "Resume Building Workshop Materials",
      description: "Templates and guides for creating an effective resume for tech industry jobs.",
      category: "Career",
      type: "Document",
      downloads: 850,
      likes: 210,
      author: "Career Cell",
      date: "2023-06-22",
    },
    {
      id: "3",
      title: "Machine Learning Project Examples",
      description: "Collection of machine learning projects with source code and documentation.",
      category: "Technical",
      type: "Repository",
      downloads: 720,
      likes: 180,
      author: "AI Club",
      date: "2023-07-10",
    },
    {
      id: "4",
      title: "LNCT Research Paper Template",
      description: "Official template for research papers and publications from LNCT.",
      category: "Academic",
      type: "Document",
      downloads: 950,
      likes: 150,
      author: "Research Department",
      date: "2023-04-05",
    },
    {
      id: "5",
      title: "Introduction to Web Development",
      description: "Beginner's guide to HTML, CSS, and JavaScript with practical examples.",
      category: "Technical",
      type: "Course",
      downloads: 1500,
      likes: 420,
      author: "Web Development Club",
      date: "2023-03-18",
    },
    {
      id: "6",
      title: "Internship Opportunities Guide 2023",
      description: "Comprehensive list of internship opportunities for engineering students.",
      category: "Career",
      type: "PDF",
      downloads: 2100,
      likes: 560,
      author: "Placement Cell",
      date: "2023-01-30",
    },
    {
      id: "7",
      title: "Advanced Database Management Systems",
      description: "In-depth study materials for advanced database concepts and implementations.",
      category: "Academic",
      type: "Course",
      downloads: 680,
      likes: 190,
      author: "Dr. Patel",
      date: "2023-02-14",
    },
    {
      id: "8",
      title: "IoT Project Ideas for Final Year",
      description: "Collection of Internet of Things project ideas suitable for final year projects.",
      category: "Technical",
      type: "Document",
      downloads: 920,
      likes: 240,
      author: "IoT Lab",
      date: "2023-08-05",
    },
  ]

  const categories = ["Academic", "Technical", "Career", "Research"]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || resource.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-8">
      {/* Update the header section to conditionally render the Upload Resource button */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">
            Access educational materials, career resources, and technical guides shared by the community.
          </p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/resources/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{resource.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-1 h-4 w-4" />
                  {resource.type}
                </div>
              </div>
              <CardTitle className="text-xl">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>By {resource.author}</span>
                  <span>•</span>
                  <span>{formatDate(resource.date)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Download className="mr-1 h-4 w-4" />
                  {resource.downloads}
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {resource.likes}
                </div>
              </div>
              <Button asChild size="sm">
                <Link href={`/resources/${resource.id}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <BookOpen className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-1 text-lg font-medium">No resources found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
