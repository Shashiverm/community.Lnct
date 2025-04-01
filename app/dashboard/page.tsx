"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BookOpen, Calendar, MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import { PostFeed } from "@/components/post-feed"
import { NotificationsList } from "@/components/notifications-list"
import { UpcomingEvents } from "@/components/upcoming-events"
import { RecommendedConnections } from "@/components/recommended-connections"
import { useMediaQuery } from "@/hooks/use-media-query"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  const { user } = useAuth()
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <ProtectedRoute>
      <div className="container py-4 md:py-8">
        <div className="mb-4 md:mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Welcome back, {user?.name}! Here's what's happening in your community.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button asChild className="w-full md:w-auto">
              <Link href="/posts/new">Create Post</Link>
            </Button>
          </div>
        </div>

        {/* Update the grid layout for better responsiveness */}
        <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="feed">
              <TabsList className="mb-4 w-full justify-start overflow-auto">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="feed">
                <PostFeed />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationsList />
              </TabsContent>
              <TabsContent value="events">
                <UpcomingEvents />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Links</CardTitle>
                <CardDescription>Access frequently used features</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 md:gap-4">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/resources">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span className="truncate">Resources</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/events">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="truncate">Events</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/network">
                    <Users className="mr-2 h-4 w-4" />
                    <span className="truncate">Network</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="truncate">Messages</span>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start col-span-2 sm:col-span-3 lg:col-span-1" asChild>
                  <Link href="/notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    <span className="truncate">All Notifications</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">People You May Know</CardTitle>
                <CardDescription>Connect with other members</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendedConnections />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

