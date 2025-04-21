"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Search, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

export default function AssignmentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("active")

  // Mock data - would be replaced with API calls
  const activeAssignments = [
    {
      id: "1",
      title: "Data Structures Implementation",
      description: "Implement a linked list, stack, and queue in your preferred programming language",
      course: "CS201",
      dueDate: new Date("2023-12-15"),
      totalPoints: 100,
      creator: { name: "Dr. Johnson", role: "faculty" },
    },
    {
      id: "2",
      title: "Database Design Project",
      description: "Design a database schema for a library management system",
      course: "CS301",
      dueDate: new Date("2023-12-20"),
      totalPoints: 150,
      creator: { name: "Dr. Williams", role: "faculty" },
    },
    {
      id: "3",
      title: "Web Application Development",
      description: "Build a simple web application using React and Node.js",
      course: "CS401",
      dueDate: new Date("2023-12-25"),
      totalPoints: 200,
      creator: { name: "Dr. Davis", role: "faculty" },
    },
  ]

  const completedAssignments = [
    {
      id: "4",
      title: "Algorithm Analysis",
      description: "Analyze the time and space complexity of common sorting algorithms",
      course: "CS201",
      submittedAt: new Date("2023-11-10"),
      dueDate: new Date("2023-11-15"),
      score: 90,
      totalPoints: 100,
      feedback:
        "Excellent analysis of quicksort and mergesort. Your complexity calculations were accurate and well-explained.",
    },
  ]

  const filteredAssignments = activeAssignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate
  }

  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground">View and submit your assignments</p>
          </div>

          {user?.role === "faculty" && (
            <Button asChild>
              <Link href="/assignments/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assignments by title, description, or course..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Assignments</TabsTrigger>
            <TabsTrigger value="completed">Completed Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No assignments found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try a different search term" : "Check back later for new assignments"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAssignments.map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{assignment.title}</CardTitle>
                        <Badge>{assignment.course}</Badge>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Due: {assignment.dueDate.toLocaleDateString()}</span>
                          {isOverdue(assignment.dueDate) ? (
                            <Badge variant="destructive" className="ml-2">
                              Overdue
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="ml-2">
                              {getDaysRemaining(assignment.dueDate)} days left
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Points: {assignment.totalPoints}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/assignments/${assignment.id}`}>View Assignment</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedAssignments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No completed assignments</h3>
                <p className="text-muted-foreground">You haven't completed any assignments yet</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedAssignments.map((assignment) => (
                  <Card key={assignment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{assignment.title}</CardTitle>
                        <Badge>{assignment.course}</Badge>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Submitted: {assignment.submittedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            Score: {assignment.score}/{assignment.totalPoints} (
                            {Math.round((assignment.score / assignment.totalPoints) * 100)}%)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/assignments/submissions/${assignment.id}`}>View Submission</Link>
                      </Button>
                    </CardFooter>
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
