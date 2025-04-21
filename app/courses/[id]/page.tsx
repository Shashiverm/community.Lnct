"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Calendar, ArrowLeft, Edit, UserPlus, UserMinus } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import apiClient from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

interface User {
  _id: string
  name: string
  email: string
  role: string
  profileImage?: string
}

interface Course {
  _id: string
  code: string
  name: string
  description: string
  department: string
  credits: number
  faculty: User[]
  students: User[]
  syllabus: string
  semester: string
  academicYear: string
  isActive: boolean
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [unenrolling, setUnenrolling] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: Course }>(`/courses/${params.id}`)
        setCourse(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching course:", error)
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  const isEnrolled = () => {
    if (!user || !course) return false
    return course.students.some((student) => student._id === user.id)
  }

  const isFaculty = () => {
    if (!user || !course) return false
    return course.faculty.some((faculty) => faculty._id === user.id)
  }

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setEnrolling(true)
    try {
      await apiClient.post(`/courses/${params.id}/enroll`, {})

      // Update the course data
      const response = await apiClient.get<{ success: boolean; data: Course }>(`/courses/${params.id}`)
      setCourse(response.data)

      toast({
        title: "Enrolled Successfully",
        description: `You have been enrolled in ${course?.name}`,
      })
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in this course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEnrolling(false)
    }
  }

  const handleUnenroll = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setUnenrolling(true)
    try {
      await apiClient.delete(`/courses/${params.id}/enroll`)

      // Update the course data
      const response = await apiClient.get<{ success: boolean; data: Course }>(`/courses/${params.id}`)
      setCourse(response.data)

      toast({
        title: "Unenrolled Successfully",
        description: `You have been unenrolled from ${course?.name}`,
      })
    } catch (error) {
      console.error("Error unenrolling from course:", error)
      toast({
        title: "Unenrollment Failed",
        description: "There was an error unenrolling from this course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUnenrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>The course you are looking for does not exist or has been removed.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
              <p className="text-muted-foreground">{course.code}</p>
            </div>
            <div className="flex gap-2">
              {(user?.role === "admin" || isFaculty()) && (
                <Button asChild variant="outline">
                  <Link href={`/courses/${course._id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Course
                  </Link>
                </Button>
              )}

              {!isEnrolled() && !isFaculty() && user?.role !== "admin" && (
                <Button onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enrolling...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Enroll
                    </>
                  )}
                </Button>
              )}

              {isEnrolled() && !isFaculty() && user?.role !== "admin" && (
                <Button onClick={handleUnenroll} variant="outline" disabled={unenrolling}>
                  {unenrolling ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Unenrolling...
                    </div>
                  ) : (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Unenroll
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-line">{course.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <h3 className="font-semibold mb-2">Course Details</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Department: {course.department}</span>
                          </li>
                          <li className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {course.semester} - {course.academicYear}
                            </span>
                          </li>
                          <li className="flex items-center">
                            <Badge variant="outline">{course.credits} Credits</Badge>
                          </li>
                          <li className="flex items-center">
                            <Badge variant={course.isActive ? "success" : "secondary"}>
                              {course.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Faculty</h3>
                        {course.faculty.length === 0 ? (
                          <p className="text-muted-foreground">No faculty assigned yet</p>
                        ) : (
                          <ul className="space-y-2">
                            {course.faculty.map((faculty) => (
                              <li key={faculty._id} className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={faculty.profileImage || "/placeholder.svg?height=32&width=32"} />
                                  <AvatarFallback>{faculty.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{faculty.name}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="syllabus">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Syllabus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.syllabus ? (
                      <div className="whitespace-pre-line">{course.syllabus}</div>
                    ) : (
                      <p className="text-muted-foreground">No syllabus available yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No resources available yet</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignments">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No assignments available yet</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Students Enrolled</CardTitle>
                <CardDescription>{course.students.length} students</CardDescription>
              </CardHeader>
              <CardContent>
                {course.students.length === 0 ? (
                  <p className="text-muted-foreground">No students enrolled yet</p>
                ) : (
                  <div className="space-y-4">
                    {course.students.slice(0, 10).map((student) => (
                      <div key={student._id} className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={student.profileImage || "/placeholder.svg?height=32&width=32"} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    ))}

                    {course.students.length > 10 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/courses/${course._id}/students`}>View All Students</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
