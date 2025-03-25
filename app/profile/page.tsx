"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PenSquare } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function ProfilePage() {
  const { user, loading } = useAuth()

  // If not logged in, redirect to login page
  if (!loading && !user) {
    redirect("/login")
  }

  if (loading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  // Mock user data
  const userData = {
    id: "1",
    name: user?.name || "John Doe",
    role: user?.role || "Student",
    department: "Computer Science",
    batch: "2020-2024",
    email: user?.email || "john.doe@example.com",
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
        link: "https://github.com/johndoe/smart-home",
      },
      {
        title: "Student Management System",
        description: "Created a web application for managing student records, attendance, and grades.",
        technologies: ["React", "Node.js", "MongoDB"],
        link: "https://github.com/johndoe/student-management",
      },
    ],
    achievements: [
      "Winner of LNCT Hackathon 2022",
      "3rd Prize in State Level Technical Quiz Competition",
      "Published a research paper on 'IoT Applications in Smart Cities'",
    ],
    connections: 156,
    posts: 24,
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.profileImage || "/placeholder.svg?height=96&width=96"} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{userData.name}</CardTitle>
              <CardDescription>
                {userData.role} • {userData.department}
                {userData.batch && <div>{userData.batch}</div>}
              </CardDescription>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                <Badge variant="outline">{userData.connections} Connections</Badge>
                <Badge variant="outline">{userData.posts} Posts</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile/edit">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Contact Information</h3>
                  <div className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{userData.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{userData.location}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="mb-2 text-sm font-medium">Skills</h3>
                  <div className="flex flex-wrap gap-1">
                    {userData.skills.map((skill) => (
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
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{userData.bio}</p>
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
                    {userData.education.map((edu, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="text-lg font-medium">{edu.institution}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground">{edu.degree}</p>
                          <Badge variant="outline">{edu.year}</Badge>
                        </div>
                        <p className="text-sm">Grade: {edu.grade}</p>
                        {index < userData.education.length - 1 && <Separator className="my-4" />}
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
                  {userData.experience.length > 0 ? (
                    <div className="space-y-6">
                      {userData.experience.map((exp, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="text-lg font-medium">{exp.position}</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground">{exp.company}</p>
                            <Badge variant="outline">{exp.duration}</Badge>
                          </div>
                          <p className="text-sm">{exp.description}</p>
                          {index < userData.experience.length - 1 && <Separator className="my-4" />}
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
                    {userData.projects.map((project, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{project.title}</h3>
                          <Link href={project.link} target="_blank" className="text-sm text-primary hover:underline">
                            View Project
                          </Link>
                        </div>
                        <p className="text-sm">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {index < userData.projects.length - 1 && <Separator className="my-4" />}
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
                    {userData.achievements.map((achievement, index) => (
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

