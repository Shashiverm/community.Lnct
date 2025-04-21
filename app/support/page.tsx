"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, MessageSquare, Clock } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import apiClient from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

interface SupportTicket {
  _id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  creator: {
    _id: string
    name: string
  }
  assignedTo?: {
    _id: string
    name: string
  }
  comments: any[]
  createdAt: string
  updatedAt: string
}

export default function SupportPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "technical",
    priority: "medium",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: SupportTicket[] }>("/support-tickets/me")
        setTickets(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching support tickets:", error)
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTicket((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTicket((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTicket.title || !newTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await apiClient.post<{ success: boolean; data: SupportTicket }>("/support-tickets", newTicket)

      // Add the new ticket to the list
      setTickets((prev) => [response.data, ...prev])

      // Reset the form
      setNewTicket({
        title: "",
        description: "",
        category: "technical",
        priority: "medium",
      })

      toast({
        title: "Ticket Created",
        description: "Your support ticket has been submitted successfully",
      })
    } catch (error) {
      console.error("Error creating support ticket:", error)
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary">Open</Badge>
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>
      case "resolved":
        return <Badge variant="success">Resolved</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Support</h1>
          <p className="text-muted-foreground">Get help with any issues you encounter</p>
        </div>

        <Tabs defaultValue="tickets">
          <TabsList className="mb-4">
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="new">New Ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tickets..."
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
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No tickets found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "You haven't created any support tickets yet"}
                </p>
                <Button className="mt-4" onClick={() => document.querySelector('[data-value="new"]')?.click()}>
                  Create New Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket._id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                        <div>
                          <CardTitle className="text-xl">{ticket.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(ticket.createdAt)}</span>
                            <span>•</span>
                            <span>Ticket #{ticket._id.slice(-6)}</span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-sm">
                        <div className="flex items-center">
                          <Badge variant="outline">{ticket.category}</Badge>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">Last updated: {formatDate(ticket.updatedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/support/${ticket._id}`}>View Ticket</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Create New Support Ticket</CardTitle>
                  <CardDescription>Fill out the form below to submit a new support ticket</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Brief description of your issue"
                      value={newTicket.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid w-full gap-1.5">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide details about your issue"
                      rows={5}
                      value={newTicket.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid w-full gap-1.5">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <Select
                        value={newTicket.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="administrative">Administrative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid w-full gap-1.5">
                      <label htmlFor="priority" className="text-sm font-medium">
                        Priority
                      </label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Ticket"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
