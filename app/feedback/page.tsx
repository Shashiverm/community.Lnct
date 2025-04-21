"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import ProtectedRoute from "@/components/protected-route"

export default function FeedbackPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("general")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState("5")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data - would be replaced with API calls
  const previousFeedback = [
    {
      id: "1",
      subject: "Website Navigation",
      category: "ui",
      message:
        "The navigation menu is not very intuitive. It would be better if the dashboard link was more prominent.",
      rating: 3,
      status: "reviewed",
      createdAt: new Date("2023-11-10"),
      adminResponse:
        "Thank you for your feedback. We are working on improving the navigation menu and will consider your suggestions in our next update.",
    },
    {
      id: "2",
      subject: "Quiz Timer",
      category: "feature",
      message:
        "The quiz timer is not very visible. It would be better if it was more prominent and had a warning when time is running out.",
      rating: 4,
      status: "pending",
      createdAt: new Date("2023-11-15"),
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!subject || !message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Create feedback object
    const feedbackData = {
      subject,
      category,
      message,
      rating: Number.parseInt(rating),
    }

    // In a real app, this would be an API call
    console.log("Feedback data:", feedbackData)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      setSubject("")
      setCategory("general")
      setMessage("")
      setRating("5")
      setIsSubmitting(false)
    }, 1000)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "general":
        return "General"
      case "technical":
        return "Technical"
      case "content":
        return "Content"
      case "ui":
        return "User Interface"
      case "feature":
        return "Feature Request"
      default:
        return category
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "reviewed":
        return <Badge variant="secondary">Reviewed</Badge>
      case "resolved":
        return <Badge variant="success">Resolved</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground">Share your thoughts and suggestions</p>
        </div>

        <Tabs defaultValue="new">
          <TabsList className="mb-4">
            <TabsTrigger value="new">New Feedback</TabsTrigger>
            <TabsTrigger value="previous">Previous Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Submit Feedback</CardTitle>
                  <CardDescription>Your feedback helps us improve the LNCT Community platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your feedback"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                        <SelectItem value="ui">User Interface</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your feedback in detail"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Rating</Label>
                    <RadioGroup value={rating} onValueChange={setRating} className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="sr-only" />
                          <Label
                            htmlFor={`rating-${value}`}
                            className={`cursor-pointer p-2 hover:text-primary ${
                              Number.parseInt(rating) >= value ? "text-yellow-500" : "text-muted-foreground"
                            }`}
                          >
                            <Star className="h-6 w-6 fill-current" />
                          </Label>
                          <span className="text-xs">{value}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="previous">
            {previousFeedback.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Previous Feedback</CardTitle>
                  <CardDescription>You haven't submitted any feedback yet</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Submit your first feedback to help us improve the platform.</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => document.querySelector('[data-value="new"]')?.click()}>Submit Feedback</Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-4">
                {previousFeedback.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div>
                          <CardTitle>{feedback.subject}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{getCategoryLabel(feedback.category)}</Badge>
                            {getStatusBadge(feedback.status)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Submitted on {feedback.createdAt.toLocaleDateString()}</span>
                        </div>
                        <p>{feedback.message}</p>
                      </div>

                      {feedback.adminResponse && (
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <MessageSquare className="mr-2 h-4 w-4 text-primary" />
                            <span className="font-medium">Admin Response</span>
                          </div>
                          <p>{feedback.adminResponse}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
