"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import {
  MessageSquare,
  ThumbsUp,
  Share,
  MoreHorizontal,
  Image,
  Link,
  Smile,
  Send,
  School,
  GraduationCap,
  BookOpen,
} from "lucide-react"

// Mock data for posts
const mockPosts = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Dr. Rajesh Kumar",
      role: "faculty",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Excited to announce that our department is organizing a workshop on 'Advanced Machine Learning Techniques' next week. All interested students are welcome to join!",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 5,
    shares: 2,
    isLiked: false,
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "Amit Sharma",
      role: "student",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Just completed my internship at Microsoft! It was an amazing learning experience. Happy to share my insights with anyone interested in applying for tech internships.",
    timestamp: "5 hours ago",
    likes: 42,
    comments: 8,
    shares: 3,
    isLiked: true,
  },
  {
    id: "3",
    author: {
      id: "3",
      name: "Priya Verma",
      role: "alumni",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Visited the campus after 3 years! So many changes and improvements. Proud to see LNCT growing. Had a great time meeting professors and juniors.",
    timestamp: "1 day ago",
    likes: 56,
    comments: 12,
    shares: 4,
    isLiked: false,
  },
]

export function PostFeed() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState(mockPosts)
  const [newPostContent, setNewPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLike = (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.isLiked
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !isLiked,
          }
        }
        return post
      }),
    )
  }

  const handleComment = (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment on posts",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would open a comment form or modal
    toast({
      title: "Comment Feature",
      description: "Comment functionality will be implemented soon",
    })
  }

  const handleShare = (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to share posts",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would open a share dialog
    toast({
      title: "Share Feature",
      description: "Share functionality will be implemented soon",
    })
  }

  const handleSubmitPost = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create posts",
        variant: "destructive",
      })
      return
    }

    if (!newPostContent.trim()) {
      toast({
        title: "Empty Post",
        description: "Please enter some content for your post",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would make an API call to create a post
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add new post to the list
      const newPost = {
        id: `temp-${Date.now()}`,
        author: {
          id: user?.id || "unknown",
          name: user?.name || "Anonymous",
          role: user?.role || "student",
          profileImage: user?.profileImage || "/placeholder.svg?height=40&width=40",
        },
        content: newPostContent,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
      }

      setPosts([newPost, ...posts])
      setNewPostContent("")

      toast({
        title: "Post Created",
        description: "Your post has been published successfully",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to render role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "faculty":
        return (
          <Badge variant="outline" className="ml-2 flex items-center text-blue-500 border-blue-200">
            <School className="h-3 w-3 mr-1" />
            Faculty
          </Badge>
        )
      case "alumni":
        return (
          <Badge variant="outline" className="ml-2 flex items-center text-purple-500 border-purple-200">
            <GraduationCap className="h-3 w-3 mr-1" />
            Alumni
          </Badge>
        )
      case "student":
        return (
          <Badge variant="outline" className="ml-2 flex items-center text-green-500 border-green-200">
            <BookOpen className="h-3 w-3 mr-1" />
            Student
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={user?.profileImage || "/placeholder.svg?height=40&width=40"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Image className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Link className="h-4 w-4 mr-2" />
                Link
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Smile className="h-4 w-4 mr-2" />
                Emoji
              </Button>
            </div>
            <Button size="sm" onClick={handleSubmitPost} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 cursor-pointer" onClick={() => router.push(`/profile/${post.author.id}`)}>
                  <AvatarImage src={post.author.profileImage} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="flex items-center">
                    <span
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => router.push(`/profile/${post.author.id}`)}
                    >
                      {post.author.name}
                    </span>
                    {getRoleBadge(post.author.role)}
                  </div>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="whitespace-pre-line">{post.content}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex justify-between w-full text-muted-foreground">
              <div className="flex items-center text-xs">
                <ThumbsUp className="h-3.5 w-3.5 mr-1 fill-current" />
                <span>{post.likes}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-xs">{post.comments} comments</span>
                <span className="text-xs">{post.shares} shares</span>
              </div>
            </div>
          </CardFooter>
          <div className="border-t px-4 py-2">
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className={`flex-1 ${post.isLiked ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => handleLike(post.id)}
              >
                <ThumbsUp className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
                Like
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-muted-foreground"
                onClick={() => handleComment(post.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-muted-foreground"
                onClick={() => handleShare(post.id)}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
