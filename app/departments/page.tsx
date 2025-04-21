"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"
import apiClient from "@/lib/api-client"

interface Department {
  _id: string
  name: string
  code: string
  description: string
  head: any
  faculty: any[]
  courses: any[]
  establishedYear: number
  contact: {
    email: string
    phone: string
    location: string
  }
}

export default function DepartmentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: Department[] }>("/departments")
        setDepartments(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching departments:", error)
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  const filteredDepartments = departments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <ProtectedRoute>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground">Browse academic departments</p>
          </div>

          {user?.role === "admin" && (
            <Button asChild>
              <Link href="/departments/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Department
              </Link>
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search departments by name or code..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No departments found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try a different search term" : "Check back later for new departments"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDepartments.map((department) => (
              <Card key={department._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{department.name}</CardTitle>
                      <CardDescription className="text-sm font-medium">{department.code}</CardDescription>
                    </div>
                    <Badge>{department.establishedYear}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{department.description}</p>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{department.faculty.length} Faculty Members</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{department.courses.length} Courses</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/departments/${department._id}`}>View Department</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
