"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageSquare, ThumbsUp, Share2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

type Post = {
  id: string
  author: {
    name: string
    role: string
    avatar?: string
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  liked: boolean
}

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: {
        name: "Dr. Rajesh Kumar",
        role: "Faculty",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Excited to announce that the Department of Computer Science will be hosting a workshop on Artificial Intelligence and Machine Learning next week. All students are welcome to attend. Registration details will be shared soon!",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5,
      liked: false,
    },
    {
      id: "2",
      author: {
        name: "Priya Sharma",
        role: "Student",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Just submitted my final year project on 'Smart Home Automation using IoT'. Thanks to everyone who helped, especially Prof. Mehta for the guidance!",
      timestamp: "5 hours ago",
      likes: 42,
      comments: 8,
      liked: true,
    },
    {
      id: "3",
      author: {
        name: "Amit Patel",
        role: "Alumni",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Happy to share that my startup has been selected for the incubation program at LNCT Business Incubator. Looking forward to mentoring current students interested in entrepreneurship. Feel free to reach out!",
      timestamp: "1 day ago",
      likes: 87,
      comments: 15,
      liked: false,
    },
  ])

  const [newPost, setNewPost] = useState("")

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          }
        }
        return post
      }),
    )
  }

  const handlePostSubmit = () => {
    if (!newPost.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: "John Doe",
        role: "Student",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: newPost,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
    }

    setPosts([post, ...posts])
    setNewPost("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-end">
          <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
            Post
          </Button>
        </CardFooter>
      </Card>

      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  {post.author.role} • {post.timestamp}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{post.content}</p>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={post.liked ? "text-primary" : ""}
                onClick={() => handleLike(post.id)}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardFooter>
          <Separator />
        </Card>
      ))}
    </div>
  )
}

