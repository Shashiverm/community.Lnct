"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { CalendarPlus, Search, Filter } from "lucide-react"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Annual Tech Symposium",
    description: "Join us for a day of tech talks, workshops, and networking with industry professionals.",
    date: "2023-10-15T09:00:00",
    location: "LNCT Main Auditorium",
    category: "Technical",
    attendees: 250,
    organizer: { name: "Computer Science Department", role: "Faculty" },
    attending: false,
    image: "/images/tech_symposium.jpg",
    time: "9:00 AM - 5:00 PM",
  },
  {
    id: "2",
    title: "Alumni Meetup 2023",
    description: "Connect with LNCT alumni from across the years and industries.",
    date: "2023-11-05T18:00:00",
    location: "LNCT Campus Garden",
    category: "Networking",
    attendees: 180,
    organizer: { name: "Alumni Association", role: "Association" },
    attending: true,
    image: "/images/alumni_meetup.jpg",
    time: "6:00 PM - 9:00 PM",
  },
  {
    id: "3",
    title: "Career Fair",
    description: "Meet recruiters from top companies and explore job opportunities.",
    date: "2023-09-28T10:00:00",
    location: "LNCT Placement Cell",
    category: "Career",
    attendees: 320,
    organizer: { name: "Placement Department", role: "Department" },
    attending: false,
    image: "/images/career_fair.jpg",
    time: "10:00 AM - 4:00 PM",
  },
  {
    id: "4",
    title: "Hackathon 2023",
    description: "48-hour coding competition to solve real-world problems.",
    date: "2023-10-22T08:00:00",
    location: "Computer Science Block",
    category: "Competition",
    attendees: 150,
    organizer: { name: "Coding Club", role: "Club" },
    attending: false,
    image: "/images/hackathon.jpg",
    time: "8:00 AM - 8:00 AM (Next Day)",
  },
  {
    id: "5",
    title: "Research Symposium",
    description: "Showcase of ongoing research projects by faculty and students.",
    date: "2024-11-15T14:00:00",
    location: "Research Center",
    category: "Academic",
    attendees: 120,
    organizer: { name: "Research Department", role: "Department" },
    attending: false,
    image: "/images/research_symposium.jpg",
    time: "2:00 PM - 6:00 PM",
  },
  {
    id: "6",
    title: "Cultural Fest 2024",
    description: "Annual cultural festival featuring music, dance, and art performances.",
    date: "2024-12-10T16:00:00",
    location: "LNCT Open Air Theater",
    category: "Cultural",
    attendees: 500,
    organizer: { name: "Student Council", role: "Council" },
    attending: false,
    image: "/images/cultural_fest.jpg",
    time: "4:00 PM - 10:00 PM",
  },
  {
    id: "7",
    title: "Workshop on IoT",
    description: "Hands-on workshop on Internet of Things with practical demonstrations.",
    date: "2023-08-15T10:00:00",
    location: "Electronics Lab",
    category: "Technical",
    attendees: 80,
    organizer: { name: "IoT Club", role: "Club" },
    attending: false,
    image: "/images/iot_workshop.jpg",
    time: "10:00 AM - 1:00 PM",
  },
  {
    id: "8",
    title: "Entrepreneurship Summit",
    description: "Learn from successful entrepreneurs and startup founders.",
    date: "2023-07-25T09:00:00",
    location: "Business School Auditorium",
    category: "Career",
    attendees: 200,
    organizer: { name: "E-Cell", role: "Cell" },
    attending: false,
    image: "/images/entrepreneurship_summit.jpg",
    time: "9:00 AM - 5:00 PM",
  },
]

export default function EventsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    // Filter events based on search query, category, and tab
    let filtered = mockEvents

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    const currentDate = new Date()
    if (activeTab === "upcoming") {
      filtered = filtered.filter((event) => new Date(event.date) >= currentDate)
    } else {
      filtered = filtered.filter((event) => new Date(event.date) < currentDate)
    }

    setFilteredEvents(filtered)
  }, [searchQuery, selectedCategory, activeTab])

  // Check if user is faculty
  const isFaculty = user?.role === "faculty"

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Discover and participate in upcoming events at LNCT</p>
        </div>

        {/* Only show Create Event button to faculty users */}
        {isAuthenticated && isFaculty && (
          <Button onClick={() => router.push("/events/create")}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by Category</span>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Non-faculty message */}
          {isAuthenticated && !isFaculty && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Note: Only faculty members can create events. If you need to organize an event, please contact a
                  faculty member.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img
                          src={event.image || "/placeholder.svg?height=200&width=300"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          {event.category}
                        </div>
                      </div>
                      <CardContent className="md:w-2/3 p-4 md:p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                            <div className="flex items-center text-sm">
                              <span className="font-medium mr-2">
                                {new Date(event.date).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="text-muted-foreground">{event.time}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-muted-foreground mr-1">Organized by:</span>
                              <span className="font-medium">{event.organizer.name}</span>
                              <span className="ml-1 text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                                {event.organizer.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No upcoming events found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search or filters"
                      : "Check back later for new events"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/events/${event.id}`)}
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto relative">
                        <img
                          src={event.image || "/placeholder.svg?height=200&width=300"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          {event.category}
                        </div>
                      </div>
                      <CardContent className="md:w-2/3 p-4 md:p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                            <div className="flex items-center text-sm">
                              <span className="font-medium mr-2">
                                {new Date(event.date).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="text-muted-foreground">{event.time}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-muted-foreground mr-1">Organized by:</span>
                              <span className="font-medium">{event.organizer.name}</span>
                              <span className="ml-1 text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                                {event.organizer.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No past events found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search or filters"
                      : "There are no past events to display"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
