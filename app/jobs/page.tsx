"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2, Briefcase, GraduationCap, MapPin, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"

// Mock data - replace with real API calls in production
const mockJobs = [
  {
    id: "1",
    title: "Software Engineer Intern",
    company: "Tech Corp",
    location: "Remote",
    type: "Internship",
    department: "Computer Science",
    description: "Looking for a passionate software engineer intern to join our team...",
    requirements: ["React", "TypeScript", "Node.js"],
    postedAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Data Analyst",
    company: "Data Insights Inc",
    location: "New York, NY",
    type: "Full-time",
    department: "Data Science",
    description: "Join our data team to analyze and visualize complex datasets...",
    requirements: ["Python", "SQL", "Tableau"],
    postedAt: "2024-03-14",
  },
  // Add more mock jobs as needed
]

export default function JobsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in as a student to apply for jobs",
        variant: "destructive",
      })
      return
    }

    if (user.role !== "student") {
      toast({
        title: "Access Denied",
        description: "Only students can apply for jobs",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would make an API call to submit the application
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
          <p className="text-muted-foreground mt-1">Find internships and job opportunities</p>
        </div>
      </div>

      <div className="grid gap-6">
        {mockJobs.map((job) => (
          <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </div>
                  </CardDescription>
                </div>
                <Badge variant="secondary">{job.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {job.department}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-sm">{job.description}</p>

                <div>
                  <h4 className="text-sm font-medium mb-2">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req) => (
                      <Badge key={req} variant="outline">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    onClick={() => handleApply(job.id)}
                    disabled={isLoading || !user || user.role !== "student"}
                  >
                    {isLoading ? "Applying..." : "Apply Now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 