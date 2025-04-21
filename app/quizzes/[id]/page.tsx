"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock, ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ProtectedRoute from "@/components/protected-route"
import Link from "next/link"

export default function QuizPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch quiz")
        }

        const data = await response.json()
        setQuiz(data.data)
        setTimeRemaining(data.data.timeLimit * 60)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id, router])

  useEffect(() => {
    let timer
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            submitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [quizStarted, timeRemaining, quizCompleted])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
    setSelectedAnswers(new Array(quiz.questions.length).fill(null))
  }

  const handleAnswerSelect = (answer) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = Number.parseInt(answer)
    setSelectedAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitQuiz = async () => {
    if (submitting) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      const answers = selectedAnswers.map((selectedOption, questionIndex) => ({
        questionIndex,
        selectedOption: selectedOption === null ? 0 : selectedOption, // Default to first option if not answered
      }))

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${id}/attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers,
          timeSpent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit quiz")
      }

      const data = await response.json()
      setQuizCompleted(true)
      router.push(`/quizzes/results/${data.data._id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/quizzes">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The requested quiz could not be found.</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link href="/quizzes">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <Link href="/quizzes">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
            </Button>
          </Link>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Time Limit: {quiz.timeLimit} minutes</span>
                </div>
                <div>
                  <span>Questions: {quiz.questions.length}</span>
                </div>
                <div>
                  <span>Course: {quiz.course}</span>
                </div>
                <div>
                  <span>Passing Score: {quiz.passingScore}%</span>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Once you start the quiz, the timer will begin. You must complete the quiz within the time limit. Make
                  sure you have a stable internet connection before starting.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={startQuiz} className="w-full">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <span className="font-semibold">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
            </div>
            <div className="flex items-center text-red-500 font-semibold">
              <Clock className="mr-2 h-4 w-4" />
              <span>Time Remaining: {formatTime(timeRemaining)}</span>
            </div>
          </div>

          <Progress value={progress} className="mb-6" />

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswers[currentQuestion]?.toString()} onValueChange={handleAnswerSelect}>
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                Previous
              </Button>

              {currentQuestion < quiz.questions.length - 1 ? (
                <Button onClick={nextQuestion}>Next</Button>
              ) : (
                <Button onClick={submitQuiz} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="mt-6 grid grid-cols-5 md:grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={selectedAnswers[index] !== null ? "default" : "outline"}
                className={`h-10 w-10 p-0 ${currentQuestion === index ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
