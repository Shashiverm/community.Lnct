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
import { ArrowLeft, Upload, X, Plus, FileText } from "lucide-react"

export default function ResourceUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    tags: [""],
    visibility: "public",
    file: null as File | null,
    url: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData((prev) => ({ ...prev, tags: newTags }))
  }

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }))
  }

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, tags: newTags.length ? newTags : [""] }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the resource",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }

    if (!formData.type) {
      toast({
        title: "Error",
        description: "Please select a resource type",
        variant: "destructive",
      })
      return
    }

    if (!formData.file && !formData.url.trim()) {
      toast({
        title: "Error",
        description: "Please either upload a file or provide a URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would make an API call to upload the resource
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: "Resource uploaded successfully!",
      })

      router.push("/resources")
    } catch (error) {
      console.error("Error uploading resource:", error)
      toast({
        title: "Error",
        description: "Failed to upload resource. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/resources")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Resources
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Upload Resource</CardTitle>
          <CardDescription>
            Share educational materials, career resources, and technical guides with the community
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter resource title"
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
                placeholder="Describe what this resource is about"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Repository">Repository</SelectItem>
                    <SelectItem value="Link">Link</SelectItem>
                    <SelectItem value="Course">Course</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Tag ${index + 1}`}
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTag(index)}
                      disabled={formData.tags.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addTag} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(value) => handleSelectChange("visibility", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal">
                    Public - Visible to everyone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="connections" id="connections" />
                  <Label htmlFor="connections" className="font-normal">
                    Connections only - Visible to your connections
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal">
                    Private - Only visible to you
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Resource File or URL</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm text-muted-foreground">
                    Upload File
                  </Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    {formData.file ? (
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{formData.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                          className="mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your file here or click to browse
                        </p>
                        <Input id="file" type="file" className="hidden" onChange={handleFileChange} />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("file")?.click()}
                        >
                          Browse Files
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm text-muted-foreground">
                    Or Provide URL
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    placeholder="https://example.com/resource"
                    value={formData.url}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    For external resources, GitHub repositories, or cloud storage links
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/resources")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resource
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

