"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bell, Calendar, MessageSquare, ThumbsUp, Users } from "lucide-react"

type Notification = {
  id: string
  type: "like" | "comment" | "connection" | "event" | "message"
  content: string
  from: {
    name: string
    avatar?: string
    role?: string
  }
  timestamp: string
  read: boolean
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      content: "liked your post about the upcoming hackathon.",
      from: {
        name: "Rahul Verma",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
      },
      timestamp: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "comment",
      content: 'commented on your post: "Great insights! Looking forward to collaborating on this project."',
      from: {
        name: "Neha Gupta",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
      },
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "connection",
      content: "accepted your connection request.",
      from: {
        name: "Prof. Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "professor",
      },
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "event",
      content: 'invited you to the event "Annual Tech Symposium 2023".',
      from: {
        name: "LNCT Events",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "organizer",
      },
      timestamp: "Yesterday",
      read: true,
    },
    {
      id: "5",
      type: "message",
      content: "sent you a message regarding the upcoming project submission.",
      from: {
        name: "Dr. Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "professor",
      },
      timestamp: "2 days ago",
      read: true,
    },
  ])

  const markAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === notificationId) {
          return { ...notification, read: true }
        }
        return notification
      }),
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Notifications</h3>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Bell className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-center text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              !notification.read ? "border-l-4 border-l-primary" : ""
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Avatar>
                  <AvatarImage src={notification.from.avatar} alt={notification.from.name} />
                  <AvatarFallback>{notification.from.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-muted p-1">{getNotificationIcon(notification.type)}</div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">{notification.from.name}</span>
                      <span className="text-xs text-muted-foreground ml-1 capitalize">({notification.from.role})</span>{" "}
                      {notification.content}
                    </p>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{notification.timestamp}</p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

