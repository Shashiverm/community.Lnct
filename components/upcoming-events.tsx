"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users } from "lucide-react"
import Link from "next/link"

type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  attendees: number
  attending: boolean
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Annual Tech Symposium",
      description: "Join us for a day of tech talks, workshops, and networking with industry professionals.",
      date: "2023-10-15T09:00:00",
      location: "LNCT Main Auditorium",
      category: "Technical",
      attendees: 250,
      attending: false,
    },
    {
      id: "2",
      title: "Alumni Meetup 2023",
      description: "Connect with LNCT alumni from across the years and industries.",
      date: "2023-11-05T18:00:00",
      location: "LNCT Campus Garden",
      category: "Networking",
      attendees: 180,
      attending: true,
    },
    {
      id: "3",
      title: "Career Fair",
      description: "Meet recruiters from top companies and explore job opportunities.",
      date: "2023-09-28T10:00:00",
      location: "LNCT Placement Cell",
      category: "Career",
      attendees: 320,
      attending: false,
    },
    {
      id: "4",
      title: "Hackathon 2023",
      description: "48-hour coding competition to solve real-world problems.",
      date: "2023-10-22T08:00:00",
      location: "Computer Science Block",
      category: "Competition",
      attendees: 150,
      attending: false,
    },
    {
      id: "5",
      title: "Research Symposium",
      description: "Showcase of ongoing research projects by faculty and students.",
      date: "2023-11-15T14:00:00",
      location: "Research Center",
      category: "Academic",
      attendees: 120,
      attending: false,
    },
  ])

  const toggleAttendance = (eventId: string) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            attendees: event.attending ? event.attendees - 1 : event.attendees + 1,
            attending: !event.attending,
          }
        }
        return event
      }),
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{event.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                {event.attendees}
              </div>
            </div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant={event.attending ? "default" : "outline"} onClick={() => toggleAttendance(event.id)}>
              {event.attending ? "Attending" : "Attend"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/events/${event.id}`}>Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
