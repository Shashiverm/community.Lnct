"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Connection = {
  id: string
  name: string
  role: string
  department?: string
  avatar?: string
  mutualConnections: number
  connected: boolean
}

export function RecommendedConnections() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      name: "Ananya Patel",
      role: "Student",
      department: "Computer Science",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualConnections: 12,
      connected: false,
    },
    {
      id: "2",
      name: "Dr. Vikram Singh",
      role: "Faculty",
      department: "Electronics",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualConnections: 8,
      connected: false,
    },
    {
      id: "3",
      name: "Rohan Sharma",
      role: "Alumni",
      department: "Mechanical",
      avatar: "/placeholder.svg?height=40&width=40",
      mutualConnections: 5,
      connected: false,
    },
  ])

  const toggleConnection = (connectionId: string) => {
    setConnections(
      connections.map((connection) => {
        if (connection.id === connectionId) {
          return {
            ...connection,
            connected: !connection.connected,
          }
        }
        return connection
      }),
    )
  }

  return (
    <div className="space-y-4">
      {connections.map((connection) => (
        <div key={connection.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={connection.avatar} alt={connection.name} />
              <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{connection.name}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs capitalize px-1.5 py-0">
                  {connection.role}
                </Badge>
                • {connection.department}
              </div>
              <div className="text-xs text-muted-foreground">{connection.mutualConnections} mutual connections</div>
            </div>
          </div>
          <Button
            variant={connection.connected ? "default" : "outline"}
            size="sm"
            onClick={() => toggleConnection(connection.id)}
          >
            {connection.connected ? "Connected" : "Connect"}
          </Button>
        </div>
      ))}
    </div>
  )
}
