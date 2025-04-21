"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, User } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes")
        }

        const data = await response.json()
        setQuizzes(data.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [router])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <Link href="/quizzes/create">
            <Button>Create Quiz</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No quizzes available</h2>
            <p className="text-gray-600 mb-6">There are no quizzes available at the moment.</p>
            <Link href="/quizzes/create">
              <Button>Create Your First Quiz</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Course: {quiz.course}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="mr-2 h-4 w-4" />
                      <span>Created by: {quiz.creator?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Time Limit: {quiz.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Available until: {formatDate(quiz.availableTo)}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant={quiz.isPublished ? "success" : "secondary"}>
                        {quiz.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/quizzes/${quiz._id}`} className="w-full">
                    <Button variant="default" className="w-full">
                      {quiz.isPublished ? "Take Quiz" : "View Quiz"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
