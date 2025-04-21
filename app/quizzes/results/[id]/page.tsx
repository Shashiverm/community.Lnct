"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Clock, FileText, Calendar, ArrowLeft } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function QuizResultsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const storedResult = localStorage.getItem(`quiz-result-${params.id}`)

    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      // Mock result data for demo
      setResult({
        id: "result-123",
        quiz: {
          id: params.id,
          title: "Introduction to Computer Science",
          description: "Test your knowledge of basic computer science concepts",
          course: "CS101",
          questions: [
            {
              id: "q1",
              question: "What does CPU stand for?",
              options: [
                "Central Processing Unit",
                "Computer Personal Unit",
                "Central Process Utility",
                "Central Processor Unit",
              ],
              correctAnswer: 0,
            },
            {
              id: "q2",
              question: "Which of the following is not a programming language?",
              options: ["Java", "Python", "HTML", "Microsoft Word"],
              correctAnswer: 3,
            },
            {
              id: "q3",
              question: "What is the binary representation of the decimal number 10?",
              options: ["1010", "1000", "1100", "1001"],
              correctAnswer: 0,
            },
          ],
          passingScore: 60,
        },
        answers: [
          { questionIndex: 0, selectedOption: 0, isCorrect: true },
          { questionIndex: 1, selectedOption: 3, isCorrect: true },
          { questionIndex: 2, selectedOption: 1, isCorrect: false },
        ],
        score: 2,
        totalPoints: 3,
        percentage: 66.67,
        passed: true,
        timeSpent: 120,
        feedback:
          "Good job! You've demonstrated a solid understanding of basic computer science concepts. Keep studying to improve your knowledge of binary numbers.",
        completedAt: new Date().toISOString(),
      })
    }

    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Results Not Found</CardTitle>
            <CardDescription>
              We couldn't find the results for this quiz. Please try again or contact support.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/quizzes">Back to Quizzes</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <a href="/quizzes">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Quiz Results</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl">{result.quiz.title}</CardTitle>
                  <CardDescription>{result.quiz.description}</CardDescription>
                </div>
                <Badge>{result.quiz.course}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`text-4xl font-bold ${result.passed ? "text-green-500" : "text-red-500"}`}>
                        {Math.round(result.percentage)}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Score: {result.score}/{result.totalPoints}
                      </p>
                      <Badge variant={result.passed ? "success" : "destructive"} className="mt-2">
                        {result.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Clock className="h-6 w-6 text-muted-foreground mb-2" />
                      <div className="text-lg font-medium">{formatTime(result.timeSpent)}</div>
                      <p className="text-sm text-muted-foreground mt-1">Time Spent</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <FileText className="h-6 w-6 text-muted-foreground mb-2" />
                      <div className="text-lg font-medium">
                        {result.answers.filter((a) => a.isCorrect).length}/{result.quiz.questions.length}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Correct Answers</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Calendar className="h-6 w-6 text-muted-foreground mb-2" />
                      <div className="text-lg font-medium">{new Date(result.completedAt).toLocaleDateString()}</div>
                      <p className="text-sm text-muted-foreground mt-1">Completion Date</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {result.feedback && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{result.feedback}</p>
                  </CardContent>
                </Card>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Question Review</h3>
                <div className="space-y-6">
                  {result.quiz.questions.map((question, index) => {
                    const answer = result.answers[index]

                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-2">
                          {answer.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-medium">
                              Question {index + 1}: {question.question}
                            </h4>

                            <div className="mt-2 space-y-1">
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className={`p-2 rounded ${
                                    optionIndex === question.correctAnswer
                                      ? "bg-green-100 dark:bg-green-900/20"
                                      : optionIndex === answer.selectedOption && !answer.isCorrect
                                        ? "bg-red-100 dark:bg-red-900/20"
                                        : ""
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <span className="mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                                    <span>{option}</span>
                                    {optionIndex === answer.selectedOption && (
                                      <span className="ml-2 text-sm">(Your answer)</span>
                                    )}
                                    {optionIndex === question.correctAnswer && (
                                      <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                                        (Correct answer)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href="/quizzes">Back to Quizzes</a>
              </Button>
              <Button asChild>
                <a href={`/quizzes/${result.quiz.id}`}>Retake Quiz</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
