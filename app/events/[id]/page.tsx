"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MapPin, Users, Clock, ArrowLeft, Share2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [attendanceStatus, setAttendanceStatus] = useState<"attending" | "maybe" | "not attending" | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from the API
    const fetchEvent = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock event data
        const mockEvent = {
          id,
          title: "Annual Tech Symposium",
          description:
            "Join us for a day of tech talks, workshops, and networking with industry professionals. The symposium will feature keynote speeches from leading experts in AI, blockchain, and cloud computing. There will also be hands-on workshops on the latest technologies and tools used in the industry. This is a great opportunity for students to learn about current trends and network with professionals.",
          date: "2023-10-15T09:00:00",
          endDate: "2023-10-15T17:00:00",
          location: "LNCT Main Auditorium",
          category: "Technical",
          attendees: [
            {
              user: {
                id: "1",
                name: "Rahul Verma",
                role: "Student",
                profileImage: "/placeholder.svg?height=40&width=40",
              },
              status: "attending",
            },
            {
              user: {
                id: "2",
                name: "Priya Sharma",
                role: "Student",
                profileImage: "/placeholder.svg?height=40&width=40",
              },
              status: "attending",
            },
            {
              user: {
                id: "3",
                name: "Dr. Patel",
                role: "Faculty",
                profileImage: "/placeholder.svg?height=40&width=40",
              },
              status: "attending",
            },
            {
              user: {
                id: "4",
                name: "Amit Kumar",
                role: "Alumni",
                profileImage: "/placeholder.svg?height=40&width=40",
              },
              status: "maybe",
            },
          ],
          organizer: {
            id: "5",
            name: "Computer Science Department",
            role: "Faculty",
            profileImage: "/placeholder.svg?height=40&width=40",
          },
          agenda: [
            {
              time: "09:00 AM - 09:30 AM",
              title: "Registration",
              description: "Check-in and collect your event materials",
            },
            {
              time: "09:30 AM - 10:30 AM",
              title: "Keynote Speech",
              description: "The Future of AI in Industry by Dr. Rajesh Kumar",
            },
            {
              time: "10:45 AM - 12:15 PM",
              title: "Workshop Session 1",
              description: "Hands-on workshop on Cloud Computing",
            },
            {
              time: "12:15 PM - 01:15 PM",
              title: "Lunch Break",
              description: "Networking lunch provided for all attendees",
            },
            {
              time: "01:30 PM - 03:00 PM",
              title: "Workshop Session 2",
              description: "Blockchain Technology and Applications",
            },
            {
              time: "03:15 PM - 04:15 PM",
              title: "Panel Discussion",
              description: "Career Opportunities in Tech Industry",
            },
            {
              time: "04:30 PM - 05:00 PM",
              title: "Closing Remarks",
              description: "Certificates distribution and closing ceremony",
            },
          ],
          isAttending: false,
        }

        setEvent(mockEvent)
        setAttendanceStatus(mockEvent.isAttending ? "attending" : null)
      } catch (error) {
        console.error("Error fetching event:", error)
        toast({
          title: "Error",
          description: "Failed to load event details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, toast])

  const handleAttendance = (status: "attending" | "maybe" | "not attending") => {
    // In a real app, this would make an API call
    setAttendanceStatus(status)

    toast({
      title: "Success",
      description: `You are now ${status} this event.`,
    })
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog or copy link
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Event link copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/events")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/events")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{event.category}</Badge>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <CardTitle className="text-2xl md:text-3xl">{event.title}</CardTitle>
              <CardDescription className="text-base">{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
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
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>
                    {new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                    {event.endDate &&
                      ` - ${new Date(event.endDate).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                      })}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  <span>{event.attendees.filter((a) => a.status === "attending").length} attending</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Organized by</h3>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={event.organizer.profileImage} alt={event.organizer.name} />
                    <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{event.organizer.name}</div>
                    <div className="text-sm text-muted-foreground">{event.organizer.role}</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              {user ? (
                <>
                  <Button
                    className={`w-full ${attendanceStatus === "attending" ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => handleAttendance("attending")}
                  >
                    {attendanceStatus === "attending" ? "Attending" : "Attend"}
                  </Button>
                  <Button
                    variant={attendanceStatus === "maybe" ? "default" : "outline"}
                    className={`w-full ${attendanceStatus === "maybe" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    onClick={() => handleAttendance("maybe")}
                  >
                    Maybe
                  </Button>
                  <Button
                    variant={attendanceStatus === "not attending" ? "default" : "outline"}
                    className={`w-full ${attendanceStatus === "not attending" ? "bg-red-600 hover:bg-red-700" : ""}`}
                    onClick={() => handleAttendance("not attending")}
                  >
                    Decline
                  </Button>
                </>
              ) : (
                <Button className="w-full" asChild>
                  <Link href="/login">Log in to Attend</Link>
                </Button>
              )}
            </CardFooter>
          </Card>

          <Tabs defaultValue="agenda" className="mt-8">
            <TabsList>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
            </TabsList>
            <TabsContent value="agenda" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Event Agenda</CardTitle>
                  <CardDescription>Schedule for the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="relative pl-6 pb-6 border-l border-muted">
                        <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-primary"></div>
                        <h4 className="text-sm font-medium text-muted-foreground">{item.time}</h4>
                        <h3 className="text-base font-semibold mt-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attendees" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendees</CardTitle>
                  <CardDescription>People attending this event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.attendees.map((attendee) => (
                      <div key={attendee.user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={attendee.user.profileImage} alt={attendee.user.name} />
                            <AvatarFallback>{attendee.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{attendee.user.name}</div>
                            <div className="text-sm text-muted-foreground">{attendee.user.role}</div>
                          </div>
                        </div>
                        <Badge variant={attendee.status === "attending" ? "default" : "outline"}>
                          {attendee.status === "attending" ? "Attending" : "Maybe"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Similar Events</CardTitle>
              <CardDescription>You might also be interested in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="rounded-md bg-muted h-14 w-14 flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">
                      {i === 1 ? "Workshop on IoT" : i === 2 ? "Career Fair" : "Cultural Fest 2023"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {i === 1 ? "Oct 20, 2023" : i === 2 ? "Sep 28, 2023" : "Dec 10, 2023"}
                    </p>
                    <Button variant="link" size="sm" className="px-0 h-auto mt-1" asChild>
                      <a href={`/events/${i + 10}`}>View Details</a>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
