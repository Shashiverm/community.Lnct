"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, UserPlus, UserCheck, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function UserProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"none" | "pending" | "connected">("none")

  useEffect(() => {
    // In a real app, this would fetch from the API
    const fetchUserProfile = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock user data
        const mockUser = {
          id,
          name: "Priya Sharma",
          role: "Student",
          department: "Computer Science",
          batch: "2020-2024",
          email: "priya.sharma@example.com",
          phone: "+91 9876543210",
          location: "Bhopal, Madhya Pradesh",
          bio: "Computer Science student at LNCT with a passion for web development and artificial intelligence. Looking for internship opportunities in software development.",
          skills: ["JavaScript", "React", "Node.js", "Python", "Machine Learning", "Data Structures", "Algorithms"],
          education: [
            {
              institution: "Lakshmi Narain College of Technology",
              degree: "B.Tech in Computer Science",
              year: "2020 - 2024",
              grade: "8.7 CGPA",
            },
            {
              institution: "Delhi Public School",
              degree: "Higher Secondary (12th)",
              year: "2018 - 2020",
              grade: "92%",
            },
          ],
          experience: [
            {
              company: "TechSolutions Inc.",
              position: "Software Development Intern",
              duration: "May 2022 - July 2022",
              description:
                "Worked on developing a web application using React and Node.js. Implemented user authentication and database integration.",
            },
          ],
          projects: [
            {
              title: "Smart Home Automation",
              description: "Developed a system to control home appliances using IoT devices and a mobile application.",
              technologies: ["Arduino", "React Native", "Firebase"],
              link: "https://github.com/priyasharma/smart-home",
            },
            {
              title: "Student Management System",
              description: "Created a web application for managing student records, attendance, and grades.",
              technologies: ["React", "Node.js", "MongoDB"],
              link: "https://github.com/priyasharma/student-management",
            },
          ],
          achievements: [
            "Winner of LNCT Hackathon 2022",
            "3rd Prize in State Level Technical Quiz Competition",
            "Published a research paper on 'IoT Applications in Smart Cities'",
          ],
          connections: 156,
          posts: 24,
          profileImage: "/placeholder.svg?height=96&width=96",
        }

        setProfileUser(mockUser)

        // Simulate connection status
        if (user) {
          // Randomly set connection status for demo
          const statuses = ["none", "pending", "connected"]
          setConnectionStatus(statuses[Math.floor(Math.random() * statuses.length)] as "none" | "pending" | "connected")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [id, user, toast])

  const handleConnect = async () => {
    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setConnectionStatus("pending")

      toast({
        title: "Connection Request Sent",
        description: `Your connection request has been sent to ${profileUser.name}.`,
      })
    } catch (error) {
      console.error("Error sending connection request:", error)
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMessage = () => {
    router.push(`/messages?recipient=${id}`)
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="mb-4">The user you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/network")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Network
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileUser.profileImage} alt={profileUser.name} />
                <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{profileUser.name}</CardTitle>
              <CardDescription>
                {profileUser.role} • {profileUser.department}
                {profileUser.batch && <div>{profileUser.batch}</div>}
              </CardDescription>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                <Badge variant="outline">{profileUser.connections} Connections</Badge>
                <Badge variant="outline">{profileUser.posts} Posts</Badge>
              </div>
              <div className="mt-4 flex gap-2 w-full">
                {user && user.id !== id && (
                  <>
                    <Button
                      variant={connectionStatus === "connected" ? "default" : "outline"}
                      className="flex-1"
                      onClick={handleConnect}
                      disabled={connectionStatus === "pending" || connectionStatus === "connected"}
                    >
                      {connectionStatus === "none" && (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Connect
                        </>
                      )}
                      {connectionStatus === "pending" && (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Pending
                        </>
                      )}
                      {connectionStatus === "connected" && (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Connected
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleMessage}
                      disabled={connectionStatus === "none"}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Contact Information</h3>
                  <div className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{profileUser.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{profileUser.location}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="mb-2 text-sm font-medium">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {profileUser.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{profileUser.bio}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profileUser.education.map((edu, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="text-lg font-medium">{edu.institution}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground">{edu.degree}</p>
                          <Badge variant="outline">{edu.year}</Badge>
                        </div>
                        <p className="text-sm">Grade: {edu.grade}</p>
                        {index < profileUser.education.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {profileUser.experience.length > 0 ? (
                    <div className="space-y-6">
                      {profileUser.experience.map((exp, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-lg font-medium">{exp.position}</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">{exp.company}</p>
                            <Badge variant="outline">{exp.duration}</Badge>
                          </div>
                          <p className="text-sm">{exp.description}</p>
                          {index < profileUser.experience.length - 1 && <Separator className="my-4" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">No experience added yet</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profileUser.projects.map((project, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{project.title}</h3>
                          <Button variant="link" size="sm" className="h-auto p-0" asChild>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              View Project
                            </a>
                          </Button>
                        </div>
                        <p className="text-sm">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {index < profileUser.projects.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-inside list-disc space-y-2">
                    {profileUser.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
