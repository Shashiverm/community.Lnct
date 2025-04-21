"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import apiClient from "@/lib/api-client"

interface CalendarEvent {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  category: string
  isAllDay: boolean
  location: string
}

interface AcademicCalendar {
  _id: string
  academicYear: string
  title: string
  description: string
  events: CalendarEvent[]
  isActive: boolean
}

export default function AcademicCalendarPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [calendars, setCalendars] = useState<AcademicCalendar[]>([])
  const [selectedCalendar, setSelectedCalendar] = useState<AcademicCalendar | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: AcademicCalendar[] }>("/academic-calendar")
        setCalendars(response.data)

        // Set the active calendar as default
        const activeCalendar = response.data.find((cal) => cal.isActive)
        setSelectedCalendar(activeCalendar || (response.data.length > 0 ? response.data[0] : null))

        setLoading(false)
      } catch (error) {
        console.error("Error fetching academic calendars:", error)
        setLoading(false)
      }
    }

    fetchCalendars()
  }, [])

  const handleCalendarChange = (calendarId: string) => {
    const calendar = calendars.find((cal) => cal._id === calendarId)
    setSelectedCalendar(calendar || null)
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "holiday":
        return <Badge variant="secondary">Holiday</Badge>
      case "exam":
        return <Badge variant="destructive">Exam</Badge>
      case "admission":
        return <Badge variant="default">Admission</Badge>
      case "result":
        return <Badge variant="success">Result</Badge>
      case "event":
        return <Badge variant="outline">Event</Badge>
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getEventsForDate = (date: Date) => {
    if (!selectedCalendar) return []

    return selectedCalendar.events.filter((event) => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)

      // Check if the date falls within the event range
      return date >= new Date(startDate.setHours(0, 0, 0, 0)) && date <= new Date(endDate.setHours(23, 59, 59, 999))
    })
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    // Add weekday headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className="text-center font-medium p-2 border-b">
          {weekdays[i]}
        </div>,
      )
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border bg-muted/20"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const events = getEventsForDate(date)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div key={`day-${day}`} className={`p-2 border min-h-[100px] ${isToday ? "bg-primary/10" : ""}`}>
          <div className="font-medium mb-1">{day}</div>
          {events.length > 0 && (
            <div className="space-y-1">
              {events.slice(0, 2).map((event, index) => (
                <div
                  key={`event-${day}-${index}`}
                  className="text-xs p-1 rounded bg-primary/10 truncate"
                  title={event.title}
                >
                  {event.title}
                </div>
              ))}
              {events.length > 2 && <div className="text-xs text-muted-foreground">+{events.length - 2} more</div>}
            </div>
          )}
        </div>,
      )
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>
  }

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Academic Calendar</h1>
            <p className="text-muted-foreground">View important academic dates and events</p>
          </div>

          {user?.role === "admin" && (
            <Button asChild>
              <Link href="/academic-calendar/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Calendar
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Select Academic Year</CardTitle>
                  <CardDescription>Choose an academic year to view its calendar</CardDescription>
                </div>
                <div className="w-full md:w-64">
                  <Select
                    value={selectedCalendar?._id || ""}
                    onValueChange={handleCalendarChange}
                    disabled={loading || calendars.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map((calendar) => (
                        <SelectItem key={calendar._id} value={calendar._id}>
                          {calendar.academicYear} - {calendar.title}
                          {calendar.isActive && " (Active)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !selectedCalendar ? (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No calendar available</h3>
            <p className="text-muted-foreground">
              {calendars.length === 0
                ? "No academic calendars have been created yet"
                : "Please select an academic year from the dropdown"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderCalendar()}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Events for {selectedCalendar.academicYear} - {selectedCalendar.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCalendar.events.length === 0 ? (
                  <p className="text-muted-foreground">No events scheduled for this academic year</p>
                ) : (
                  <div className="space-y-4">
                    {selectedCalendar.events
                      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                      .slice(0, 10)
                      .map((event) => (
                        <div key={event._id} className="border rounded-lg p-4">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            {getCategoryBadge(event.category)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex flex-col sm:flex-row gap-4 text-sm">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>
                                {formatDate(event.startDate)}
                                {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="ml-2">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              {selectedCalendar.events.length > 10 && (
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/academic-calendar/${selectedCalendar._id}/events`}>View All Events</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
