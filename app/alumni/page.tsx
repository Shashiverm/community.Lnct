"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, GraduationCap, Briefcase, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - replace with real API calls in production
const mockAlumni = [
  {
    id: "1",
    name: "John Doe",
    graduationYear: "2020",
    department: "Computer Science",
    currentRole: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    skills: ["React", "TypeScript", "Node.js"],
    profileImage: "/placeholder.svg",
  },
  // Add more mock alumni
]

const allDepartments = ["Computer Science", "Data Science", "Electrical Engineering"]
const allSkills = ["React", "TypeScript", "Node.js", "Python", "SQL", "Machine Learning"]

export default function AlumniDirectoryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDepartment, setSelectedDepartment] = React.useState("all")
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([])
  const [selectedYear, setSelectedYear] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(false)
  const [filteredAlumni, setFilteredAlumni] = React.useState(mockAlumni)

  React.useEffect(() => {
    let filtered = mockAlumni

    if (searchQuery) {
      filtered = filtered.filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alumni.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alumni.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((alumni) => alumni.department === selectedDepartment)
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter((alumni) => alumni.graduationYear === selectedYear)
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((alumni) => selectedSkills.some((skill) => alumni.skills.includes(skill)))
    }

    setFilteredAlumni(filtered)
  }, [searchQuery, selectedDepartment, selectedSkills, selectedYear])

  const handleViewProfile = (alumniId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view alumni profiles",
        variant: "destructive",
      })
      return
    }
    router.push(`/profile/${alumniId}`)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
          <p className="text-muted-foreground mt-1">Connect with LNCT alumni across the globe</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search alumni..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {allDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Graduation Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {["2020", "2021", "2022", "2023"].map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            {filteredAlumni.map((alumni) => (
              <Card key={alumni.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-20 w-20 md:h-24 md:w-24">
                        <AvatarImage src={alumni.profileImage} alt={alumni.name} />
                        <AvatarFallback>{alumni.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{alumni.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{alumni.department} • {alumni.graduationYear}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{alumni.currentRole} at {alumni.company}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{alumni.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {alumni.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(alumni.id)}
                            className="flex items-center"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 