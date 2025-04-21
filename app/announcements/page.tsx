"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, AlertCircle, Bell } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import apiClient from "@/lib/api-client"

interface Announcement {
  _id: string
  title: string
  content: string
  category: string
  priority: string
  author: {
    _id: string
    name: string
    role: string
  }
  publishDate: string
  expiryDate?: string
}

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: Announcement[] }>("/announcements")
        setAnnouncements(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching announcements:", error)
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "academic":
        return <Badge variant="default">Academic</Badge>
      case "event":
        return <Badge variant="secondary">Event</Badge>
      case "emergency":
        return <Badge variant="destructive">Emergency</Badge>
      case "general":
        return <Badge variant="outline">General</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
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
    <ProtectedRoute>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground">Stay updated with the latest announcements</p>
          </div>

          {(user?.role === "admin" || user?.role === "faculty") && (
            <Button asChild>
              <Link href="/announcements/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Announcement
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search announcements..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No announcements found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try a different search term" : "Check back later for new announcements"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                    <div>
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(announcement.publishDate)}</span>
                        <span>•</span>
                        <span>By {announcement.author.name}</span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getCategoryBadge(announcement.category)}
                      {getPriorityBadge(announcement.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{announcement.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {announcement.priority === "urgent" && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Urgent announcement</span>
                    </div>
                  )}
                  <div className="ml-auto">
                    <Button asChild variant="outline">
                      <Link href={`/announcements/${announcement._id}`}>Read More</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
