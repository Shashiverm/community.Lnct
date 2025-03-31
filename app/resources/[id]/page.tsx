"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, FileText, ThumbsUp, ArrowLeft, Share2, Calendar, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function ResourceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [resource, setResource] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch from the API
    const fetchResource = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock resource data
        const mockResource = {
          id,
          title: "Complete Data Structures & Algorithms Guide",
          description:
            "A comprehensive guide to data structures and algorithms for computer science students. This resource covers all the fundamental concepts, implementation details, and problem-solving techniques required for mastering DSA. Perfect for interview preparation and competitive programming.",
          category: "Academic",
          type: "PDF",
          url: "https://example.com/resources/dsa-guide.pdf",
          downloads: 1250,
          likes: 320,
          author: {
            id: "1",
            name: "Prof. Sharma",
            role: "Faculty",
            department: "Computer Science",
            profileImage: "/placeholder.svg?height=40&width=40",
          },
          date: "2023-05-15",
          tags: ["Data Structures", "Algorithms", "Programming", "Interview Preparation"],
          relatedResources: [
            { id: "2", title: "Advanced Algorithm Design", type: "PDF", category: "Academic" },
            { id: "3", title: "Competitive Programming Handbook", type: "Document", category: "Academic" },
            { id: "4", title: "System Design Interview Guide", type: "Repository", category: "Career" },
          ],
          liked: false,
        }

        setResource(mockResource)
        setLiked(mockResource.liked)
      } catch (error) {
        console.error("Error fetching resource:", error)
        toast({
          title: "Error",
          description: "Failed to load resource details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResource()
  }, [id, toast])

  const handleLike = () => {
    // In a real app, this would make an API call
    setLiked(!liked)
    setResource((prev) => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1,
    }))

    toast({
      title: liked ? "Unliked" : "Liked",
      description: `You have ${liked ? "unliked" : "liked"} this resource.`,
    })
  }

  const handleDownload = () => {
    // In a real app, this would make an API call to track downloads
    // and then redirect to the actual file
    setResource((prev) => ({
      ...prev,
      downloads: prev.downloads + 1,
    }))

    toast({
      title: "Download started",
      description: "Your download should begin shortly.",
    })

    // Simulate download by opening in new tab
    window.open(resource.url, "_blank")
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog or copy link
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Resource link copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading resource details...</p>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Resource Not Found</h2>
          <p className="mb-4">The resource you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/resources")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/resources")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Resources
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{resource.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="mr-1 h-4 w-4" />
                  {resource.type}
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">{resource.title}</CardTitle>
              <CardDescription className="text-base">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Shared by</h3>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={resource.author.profileImage} alt={resource.author.name} />
                    <AvatarFallback>{resource.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{resource.author.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {resource.author.role} • {resource.author.department}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Shared on{" "}
                  {new Date(resource.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Download className="mr-1 h-4 w-4" />
                  {resource.downloads} downloads
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {resource.likes} likes
                </div>
              </div>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant={liked ? "default" : "outline"} onClick={handleLike}>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Preview of the resource content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Preview not available</p>
                  <Button variant="link" className="mt-2" onClick={handleDownload}>
                    Download to view the full content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Related Resources</CardTitle>
              <CardDescription>You might also be interested in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resource.relatedResources.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="rounded-md bg-muted h-14 w-14 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <Button variant="link" size="sm" className="px-0 h-auto mt-1" asChild>
                      <a href={`/resources/${item.id}`}>View Resource</a>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/resources">Browse All Resources</a>
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>External Links</CardTitle>
              <CardDescription>Additional resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="link" className="w-full justify-start px-0" asChild>
                <a href="https://example.com/related-course" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Related Online Course
                </a>
              </Button>
              <Button variant="link" className="w-full justify-start px-0" asChild>
                <a href="https://example.com/practice-problems" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Practice Problems
                </a>
              </Button>
              <Button variant="link" className="w-full justify-start px-0" asChild>
                <a href="https://example.com/video-tutorial" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Video Tutorial Series
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

