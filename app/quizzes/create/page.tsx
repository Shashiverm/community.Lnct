"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import ProtectedRoute from "@/components/protected-route"
import Link from "next/link"

export default function CreateQuizPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    timeLimit: 30,
    passingScore: 60,
    isPublished: false,
    questions: [
      {
        question: "",
        options: ["", ""],
        correctAnswer: 0,
        points: 1,
      },
    ],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[index][field] = value
    setFormData({
      ...formData,
      questions: updatedQuestions,
    })
  }

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setFormData({
      ...formData,
      questions: updatedQuestions,
    })
  }

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[questionIndex].correctAnswer = Number.parseInt(value)
    setFormData({
      ...formData,
      questions: updatedQuestions,
    })
  }

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          options: ["", ""],
          correctAnswer: 0,
          points: 1,
        },
      ],
    })
  }

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = [...formData.questions]
      updatedQuestions.splice(index, 1)
      setFormData({
        ...formData,
        questions: updatedQuestions,
      })
    }
  }

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[questionIndex].options.push("")
    setFormData({
      ...formData,
      questions: updatedQuestions,
    })
  }

  const removeOption = (questionIndex, optionIndex) => {
    if (formData.questions[questionIndex].options.length > 2) {
      const updatedQuestions = [...formData.questions]
      updatedQuestions[questionIndex].options.splice(optionIndex, 1)

      // If the correct answer is the removed option or after it, adjust it
      if (updatedQuestions[questionIndex].correctAnswer >= optionIndex) {
        updatedQuestions[questionIndex].correctAnswer = Math.max(0, updatedQuestions[questionIndex].correctAnswer - 1)
      }

      setFormData({
        ...formData,
        questions: updatedQuestions,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create quiz")
      }

      router.push("/quizzes")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["faculty", "admin"]}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/quizzes">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Provide the basic information about your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter quiz title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    placeholder="Enter course name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    min="1"
                    value={formData.timeLimit}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    name="passingScore"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.passingScore}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                  <Label htmlFor="isPublished">Publish Quiz</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-4">Questions</h2>

          {formData.questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeQuestion(questionIndex)}
                  disabled={formData.questions.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${questionIndex}`}>Question</Label>
                  <Textarea
                    id={`question-${questionIndex}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(questionIndex, "question", e.target.value)}
                    required
                    placeholder="Enter your question"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Options</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addOption(questionIndex)}>
                      <Plus className="h-4 w-4 mr-1" /> Add Option
                    </Button>
                  </div>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        required
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                        disabled={question.options.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`correctAnswer-${questionIndex}`}>Correct Answer</Label>
                    <Select
                      value={question.correctAnswer.toString()}
                      onValueChange={(value) => handleCorrectAnswerChange(questionIndex, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options.map((_, optionIndex) => (
                          <SelectItem key={optionIndex} value={optionIndex.toString()}>
                            Option {optionIndex + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`points-${questionIndex}`}>Points</Label>
                    <Input
                      id={`points-${questionIndex}`}
                      type="number"
                      min="1"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(questionIndex, "points", Number.parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="mb-8">
            <Button type="button" variant="outline" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/quizzes")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Quiz
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
