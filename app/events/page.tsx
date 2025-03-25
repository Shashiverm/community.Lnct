"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CalendarPlus, MapPin, Search, Users } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  attendees: number
  organizer: string
  attending?: boolean
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"upcoming" | "past">("upcoming")

  const events: Event[] = [
    {
      id: "1",
      title: "Annual Tech Symposium",
      description: "Join us for a day of tech talks, workshops, and networking with industry professionals.",
      date: "2023-10-15T09:00:00",
      location: "LNCT Main Auditorium",
      category: "Technical",
      attendees: 250,
      organizer: "Computer Science Department",
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
      organizer: "Alumni Association",
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
      organizer: "Placement Department",
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
      organizer: "Coding Club",
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
      organizer: "Research Department",
      attending: false,
    },
    {
      id: "6",
      title: "Cultural Fest 2023",
      description: "Annual cultural festival featuring music, dance, and art performances.",
      date: "2023-12-10T16:00:00",
      location: "LNCT Open Air Theater",
      category: "Cultural",
      attendees: 500,
      organizer: "Student Council",
      attending: false,
    },
    {
      id: "7",
      title: "Workshop on IoT",
      description: "Hands-on workshop on Internet of Things with practical demonstrations.",
      date: "2023-08-15T10:00:00",
      location: "Electronics Lab",
      category: "Technical",
      attendees: 80,
      organizer: "IoT Club",
      attending: false,
    },
    {
      id: "8",
      title: "Entrepreneurship Summit",
      description: "Learn from successful entrepreneurs and startup founders.",
      date: "2023-07-25T09:00:00",
      location: "Business School Auditorium",
      category: "Career",
      attendees: 200,
      organizer: "E-Cell",
      attending: false,
    },
  ]

  const categories = ["Technical", "Networking", "Career", "Academic", "Cultural", "Competition"]

  const currentDate = new Date()

  const upcomingEvents = events.filter((event) => new Date(event.date) >= currentDate)

  const pastEvents = events.filter((event) => new Date(event.date) < currentDate)

  const filteredUpcomingEvents = upcomingEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const filteredPastEvents = pastEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Discover and participate in events happening in the LNCT community.</p>
        </div>
        <Button asChild>
          <Link href="/events/create">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
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

      <Tabs defaultValue="upcoming" onValueChange={(value: string) => setViewMode(value as "upcoming" | "past")}>
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUpcomingEvents.map((event) => (
              <Card key={event.id} className="flex flex-col overflow-hidden">
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
                <CardContent className="flex-1">
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Organized by {event.organizer}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant={event.attending ? "default" : "outline"} size="sm">
                    {event.attending ? "Attending" : "Attend"}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/events/${event.id}`}>Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredUpcomingEvents.length === 0 && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <CalendarDays className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No upcoming events found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPastEvents.map((event) => (
              <Card key={event.id} className="flex flex-col overflow-hidden opacity-80">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{event.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {event.attendees}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Organized by {event.organizer}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredPastEvents.length === 0 && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <CalendarDays className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No past events found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

