"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, MessageSquare, ThumbsUp, Users, Filter } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

type Notification = {
  id: string
  type: "like" | "comment" | "connection" | "event" | "message" | "system"
  content: string
  from: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: string
  read: boolean
  relatedId?: string
  relatedType?: string
}

export default function NotificationsPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // If not logged in, redirect to login page
  if (!loading && !user) {
    redirect("/login")
  }

  useEffect(() => {
    // In a real app, this would fetch from the API
    const fetchNotifications = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock notifications data
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "like",
            content: "liked your post about the upcoming hackathon.",
            from: {
              id: "101",
              name: "Rahul Verma",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "10 minutes ago",
            read: false,
            relatedId: "post-1",
            relatedType: "post",
          },
          {
            id: "2",
            type: "comment",
            content: 'commented on your post: "Great insights! Looking forward to collaborating on this project."',
            from: {
              id: "102",
              name: "Neha Gupta",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "1 hour ago",
            read: false,
            relatedId: "post-2",
            relatedType: "post",
          },
          {
            id: "3",
            type: "connection",
            content: "accepted your connection request.",
            from: {
              id: "103",
              name: "Prof. Sharma",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "3 hours ago",
            read: true,
            relatedId: "user-103",
            relatedType: "user",
          },
          {
            id: "4",
            type: "event",
            content: 'invited you to the event "Annual Tech Symposium 2023".',
            from: {
              id: "104",
              name: "LNCT Events",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "Yesterday",
            read: true,
            relatedId: "event-1",
            relatedType: "event",
          },
          {
            id: "5",
            type: "message",
            content: "sent you a message regarding the upcoming project submission.",
            from: {
              id: "105",
              name: "Dr. Patel",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "2 days ago",
            read: true,
            relatedId: "conversation-1",
            relatedType: "conversation",
          },
          {
            id: "6",
            type: "system",
            content: "Your account has been verified successfully.",
            from: {
              id: "system",
              name: "LNCT Community",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "3 days ago",
            read: true,
          },
          {
            id: "7",
            type: "like",
            content: "and 5 others liked your comment on Prof. Kumar's post.",
            from: {
              id: "106",
              name: "Amit Patel",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "4 days ago",
            read: true,
            relatedId: "comment-1",
            relatedType: "comment",
          },
          {
            id: "8",
            type: "event",
            content: 'The event "Workshop on IoT" has been rescheduled to October 25, 2023.',
            from: {
              id: "107",
              name: "IoT Club",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            timestamp: "5 days ago",
            read: true,
            relatedId: "event-2",
            relatedType: "event",
          },
        ]

        setNotifications(mockNotifications)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [toast])

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === notificationId) {
          return { ...notification, read: true }
        }
        return notification
      }),
    )

    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="h-4 w-4" />
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "connection":
        return <Users className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "message":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationLink = (notification: Notification) => {
    if (!notification.relatedId || !notification.relatedType) return "#"

    switch (notification.relatedType) {
      case "post":
        return `/posts/${notification.relatedId}`
      case "event":
        return `/events/${notification.relatedId}`
      case "user":
        return `/profile/${notification.relatedId}`
      case "conversation":
        return `/messages?conversation=${notification.relatedId}`
      case "comment":
        return `/posts/${notification.relatedId.split("-")[0]}`
      default:
        return "#"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  if (loading || isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with activities related to your account</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="like">Likes</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="connection">Connections</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">No notifications found</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.read ? "border-l-4 border-l-primary" : ""
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <Avatar>
                      <AvatarImage src={notification.from.avatar} alt={notification.from.name} />
                      <AvatarFallback>{notification.from.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-muted p-1">{getNotificationIcon(notification.type)}</div>
                        <p className="text-sm">
                          <span className="font-semibold">{notification.from.name}</span> {notification.content}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{notification.timestamp}</p>
                      {notification.relatedId && (
                        <Button variant="link" size="sm" className="px-0 h-auto mt-1" asChild>
                          <Link href={getNotificationLink(notification)}>View Details</Link>
                        </Button>
                      )}
                    </div>
                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="unread">
          <div className="space-y-4">
            {notifications.filter((n) => !n.read).length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">No unread notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter((n) => !n.read)
                .filter((notification) => {
                  if (filter === "all" || filter === "unread") return true
                  return notification.type === filter
                })
                .map((notification) => (
                  <Card
                    key={notification.id}
                    className="cursor-pointer transition-colors hover:bg-muted/50 border-l-4 border-l-primary"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <Avatar>
                        <AvatarImage src={notification.from.avatar} alt={notification.from.name} />
                        <AvatarFallback>{notification.from.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-muted p-1">{getNotificationIcon(notification.type)}</div>
                          <p className="text-sm">
                            <span className="font-semibold">{notification.from.name}</span> {notification.content}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{notification.timestamp}</p>
                        {notification.relatedId && (
                          <Button variant="link" size="sm" className="px-0 h-auto mt-1" asChild>
                            <Link href={getNotificationLink(notification)}>View Details</Link>
                          </Button>
                        )}
                      </div>
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

