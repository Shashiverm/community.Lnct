"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Calendar, Clock, Plus, X, MapPin, CalendarPlus } from "lucide-react"

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    category: "",
    isPublic: true,
    maxAttendees: "",
    agendaItems: [{ time: "", title: "", description: "" }],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAgendaChange = (index: number, field: string, value: string) => {
    const newAgendaItems = [...formData.agendaItems]
    newAgendaItems[index] = { ...newAgendaItems[index], [field]: value }
    setFormData((prev) => ({ ...prev, agendaItems: newAgendaItems }))
  }

  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agendaItems: [...prev.agendaItems, { time: "", title: "", description: "" }],
    }))
  }

  const removeAgendaItem = (index: number) => {
    const newAgendaItems = formData.agendaItems.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      agendaItems: newAgendaItems.length ? newAgendaItems : [{ time: "", title: "", description: "" }],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the event",
        variant: "destructive",
      })
      return
    }

    if (!formData.date) {
      toast({
        title: "Error",
        description: "Please select an event date",
        variant: "destructive",
      })
      return
    }

    if (!formData.time) {
      toast({
        title: "Error",
        description: "Please select a start time",
        variant: "destructive",
      })
      return
    }

    if (!formData.location.trim()) {
      toast({
        title: "Error",
        description: "Please provide an event location",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select an event category",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would make an API call to create the event
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: "Event created successfully!",
      })

      router.push("/events")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/events")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Create a new event for the LNCT community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this event is about"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="time">Start Time</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter event location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  placeholder="Leave blank for unlimited"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup
                value={formData.isPublic ? "public" : "private"}
                onValueChange={(value) => handleSelectChange("isPublic", value === "public")}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal">
                    Public - Visible to everyone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal">
                    Private - By invitation only
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Event Agenda (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAgendaItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {formData.agendaItems.map((item, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-md">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Agenda Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAgendaItem(index)}
                      disabled={formData.agendaItems.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`agenda-time-${index}`}>Time</Label>
                      <Input
                        id={`agenda-time-${index}`}
                        placeholder="e.g., 9:00 AM - 10:30 AM"
                        value={item.time}
                        onChange={(e) => handleAgendaChange(index, "time", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`agenda-title-${index}`}>Title</Label>
                      <Input
                        id={`agenda-title-${index}`}
                        placeholder="e.g., Registration, Keynote Speech"
                        value={item.title}
                        onChange={(e) => handleAgendaChange(index, "title", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`agenda-description-${index}`}>Description (Optional)</Label>
                    <Input
                      id={`agenda-description-${index}`}
                      placeholder="Brief description of this agenda item"
                      value={item.description}
                      onChange={(e) => handleAgendaChange(index, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/events")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Create Event
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

