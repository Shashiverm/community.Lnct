"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import {
  Search,
  Filter,
  UserPlus,
  Users,
  UserCheck,
  Briefcase,
  GraduationCap,
  School,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code,
} from "lucide-react"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@lnct.ac.in",
    role: "faculty",
    department: "Computer Science",
    batch: "",
    profileImage: "/placeholder.svg?height=100&width=100",
    bio: "Professor with 15 years of experience in AI and Machine Learning",
    location: "Bhopal",
    phone: "+91 9876543210",
    skills: ["Machine Learning", "Artificial Intelligence", "Python", "Data Science"],
    isConnected: false,
    isPending: false,
    teacherId: "LNCT-FAC-001",
  },
  {
    id: "2",
    name: "Amit Sharma",
    email: "amit.sharma@lnct.ac.in",
    role: "student",
    department: "Computer Science",
    batch: "2020-2024",
    profileImage: "/placeholder.svg?height=100&width=100",
    bio: "Final year B.Tech student interested in web development",
    location: "Bhopal",
    phone: "+91 9876543211",
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    isConnected: true,
    isPending: false,
    enrollmentNumber: "0901CS201001",
  },
  {
    id: "3",
    name: "Priya Verma",
    email: "priya.verma@lnct.ac.in",
    role: "alumni",
    department: "Electronics",
    batch: "2016-2020",
    profileImage: "/placeholder.svg?height=100&width=100",
    bio: "Working as a Hardware Engineer at Intel",
    location: "Bangalore",
    phone: "+91 9876543212",
    skills: ["VLSI", "Embedded Systems", "IoT", "PCB Design"],
    isConnected: false,
    isPending: true,
    enrollmentNumber: "0901EC161045",
  },
  {
    id: "4",
    name: "Dr. Sunita Patel",
    email: "sunita.patel@lnct.ac.in",
    role: "faculty",
    department: "Mechanical Engineering",
    batch: "",
    profileImage: "/placeholder.svg?height=100&width=100",
    bio: "Associate Professor specializing in Thermal Engineering",
    location: "Bhopal",
    phone: "+91 9876543213",
    skills: ["Thermal Engineering", "Fluid Mechanics", "CAD/CAM", "Renewable Energy"],
    isConnected: false,
    isPending: false,
    teacherId: "LNCT-FAC-012",
  },
  {
    id: "5",
    name: "Rahul Mishra",
    email: "rahul.mishra@lnct.ac.in",
    role: "student",
    department: "Information Technology",
    batch: "2021-2025",
    profileImage: "/placeholder.svg?height=100&width=100",
    bio: "Third year IT student passionate about cybersecurity",
    location: "Bhopal",
    phone: "+91 9876543214",
    skills: ["Network Security", "Ethical Hacking", "Python", "Linux"],
    isConnected: false,
    isPending: false,
    enrollmentNumber: "0901IT211023",
  },
  {
    id: "6",
    name: "Neha Gupta",
    email: "neha.gupta@lnct.ac.in",
    role: "alumni",
    department: "Civil Engineering",
    batch: "2017-2021",
    profileImage: "/placeholder.svg?height=100&width=100",
    bio: "Working as a Structural Engineer at L&T",
    location: "Mumbai",
    phone: "+91 9876543215",
    skills: ["Structural Design", "AutoCAD", "Project Management", "Construction"],
    isConnected: true,
    isPending: false,
    enrollmentNumber: "0901CE171032",
  },
]

export default function NetworkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [activeTab, setActiveTab] = useState("discover")
  const [expandedUsers, setExpandedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get all unique skills from users
  const allSkills = Array.from(new Set(mockUsers.flatMap((user) => user.skills))).sort()

  // Get all unique departments
  const allDepartments = Array.from(new Set(mockUsers.map((user) => user.department))).sort()

  useEffect(() => {
    // Filter users based on search query, role, department, skills, and tab
    let filtered = mockUsers

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          user.department.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole)
    }

    if (selectedDepartment !== "all") {
      filtered = filtered.filter((user) => user.department === selectedDepartment)
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((user) => selectedSkills.some((skill) => user.skills.includes(skill)))
    }

    // Filter based on tab
    if (activeTab === "connections") {
      filtered = filtered.filter((user) => user.isConnected)
    } else if (activeTab === "pending") {
      filtered = filtered.filter((user) => user.isPending)
    }

    setFilteredUsers(filtered)
  }, [searchQuery, selectedRole, selectedDepartment, selectedSkills, activeTab])

  const handleConnect = async (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect with other users",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would make an API call to send a connection request
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully",
      })
    } catch (err) {
      setError("Failed to send connection request. Please try again.")
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would make an API call to accept a connection request
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Connection Accepted",
        description: "Connection request has been accepted",
      })
    } catch (err) {
      setError("Failed to accept connection request. Please try again.")
      toast({
        title: "Error",
        description: "Failed to accept connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async (userId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would make an API call to reject a connection request
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      
      toast({
        title: "Connection Rejected",
        description: "Connection request has been rejected",
      })
    } catch (err) {
      setError("Failed to reject connection request. Please try again.")
      toast({
        title: "Error",
        description: "Failed to reject connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUserExpand = (userId: string) => {
    setExpandedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const viewProfile = (userId: string) => {
    // In a real app, this would navigate to the user's profile page
    router.push(`/profile/${userId}`)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network</h1>
          <p className="text-muted-foreground mt-1">Connect with students, alumni, and faculty members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Network Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Connections</span>
                    </div>
                    <Badge variant="secondary">{mockUsers.filter((user) => user.isConnected).length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Pending Requests</span>
                    </div>
                    <Badge variant="secondary">{mockUsers.filter((user) => user.isPending).length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Total Network</span>
                    </div>
                    <Badge variant="secondary">{mockUsers.length}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
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
                <label className="text-sm font-medium">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={selectedSkills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}

          <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="connections">My Connections</TabsTrigger>
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={user.profileImage || "/placeholder.svg"}
                              alt={user.name}
                              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1">
                              <Badge
                                className={`
                                ${
                                  user.role === "faculty"
                                    ? "bg-blue-500"
                                    : user.role === "alumni"
                                      ? "bg-purple-500"
                                      : "bg-green-500"
                                } 
                                text-white hover:${
                                  user.role === "faculty"
                                    ? "bg-blue-600"
                                    : user.role === "alumni"
                                      ? "bg-purple-600"
                                      : "bg-green-600"
                                }
                              `}
                              >
                                {user.role === "faculty" ? "Faculty" : user.role === "alumni" ? "Alumni" : "Student"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{user.name}</h3>
                              <p className="text-muted-foreground">{user.email}</p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                <div className="flex items-center text-sm">
                                  {user.role === "faculty" ? (
                                    <School className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                  ) : user.role === "student" ? (
                                    <BookOpen className="h-3.5 w-3.5 mr-1 text-green-500" />
                                  ) : (
                                    <GraduationCap className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                  )}
                                  <span>{user.department}</span>
                                </div>

                                {user.batch && (
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span>{user.batch}</span>
                                  </div>
                                )}

                                <div className="flex items-center text-sm">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  <span>{user.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewProfile(user.id)}
                                className="flex items-center"
                              >
                                View Profile
                              </Button>
                              {user.isConnected ? (
                                <Badge variant="outline" className="flex items-center">
                                  <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                                  Connected
                                </Badge>
                              ) : user.isPending ? (
                                <div className="flex flex-col gap-2">
                                  <Badge variant="outline" className="flex items-center">
                                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                    Request Pending
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleAccept(user.id)}
                                      disabled={isLoading}
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReject(user.id)}
                                      disabled={isLoading}
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConnect(user.id)}
                                  className="flex items-center"
                                  disabled={isLoading}
                                >
                                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                  Connect
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUserExpand(user.id)}
                              className="flex items-center"
                            >
                              {expandedUsers.includes(user.id) ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                  Show Less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                  Show More
                                </>
                              )}
                            </Button>
                          </div>

                          {expandedUsers.includes(user.id) && (
                            <div className="mt-4 space-y-3 border-t pt-3">
                              <p className="text-sm">{user.bio}</p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex items-center text-sm">
                                  <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                  <span>{user.email}</span>
                                </div>

                                <div className="flex items-center text-sm">
                                  <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                  <span>{user.phone}</span>
                                </div>

                                {user.role === "faculty" && user.teacherId && (
                                  <div className="flex items-center text-sm">
                                    <Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                    <span>Teacher ID: {user.teacherId}</span>
                                  </div>
                                )}

                                {(user.role === "student" || user.role === "alumni") && user.enrollmentNumber && (
                                  <div className="flex items-center text-sm">
                                    <Code className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                    <span>Enrollment: {user.enrollmentNumber}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your criteria
                </div>
              )}
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={user.profileImage || "/placeholder.svg"}
                              alt={user.name}
                              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1">
                              <Badge
                                className={`
                                ${
                                  user.role === "faculty"
                                    ? "bg-blue-500"
                                    : user.role === "alumni"
                                      ? "bg-purple-500"
                                      : "bg-green-500"
                                } 
                                text-white hover:${
                                  user.role === "faculty"
                                    ? "bg-blue-600"
                                    : user.role === "alumni"
                                      ? "bg-purple-600"
                                      : "bg-green-600"
                                }
                              `}
                              >
                                {user.role === "faculty" ? "Faculty" : user.role === "alumni" ? "Alumni" : "Student"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{user.name}</h3>
                              <p className="text-muted-foreground">{user.email}</p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                <div className="flex items-center text-sm">
                                  {user.role === "faculty" ? (
                                    <School className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                  ) : user.role === "student" ? (
                                    <BookOpen className="h-3.5 w-3.5 mr-1 text-green-500" />
                                  ) : (
                                    <GraduationCap className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                  )}
                                  <span>{user.department}</span>
                                </div>

                                {user.batch && (
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span>{user.batch}</span>
                                  </div>
                                )}

                                <div className="flex items-center text-sm">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  <span>{user.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewProfile(user.id)}
                                className="flex items-center"
                              >
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No connections found
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <img
                              src={user.profileImage || "/placeholder.svg"}
                              alt={user.name}
                              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                            />
                            <div className="absolute -bottom-1 -right-1">
                              <Badge
                                className={`
                                ${
                                  user.role === "faculty"
                                    ? "bg-blue-500"
                                    : user.role === "alumni"
                                      ? "bg-purple-500"
                                      : "bg-green-500"
                                } 
                                text-white hover:${
                                  user.role === "faculty"
                                    ? "bg-blue-600"
                                    : user.role === "alumni"
                                      ? "bg-purple-600"
                                      : "bg-green-600"
                                }
                              `}
                              >
                                {user.role === "faculty" ? "Faculty" : user.role === "alumni" ? "Alumni" : "Student"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{user.name}</h3>
                              <p className="text-muted-foreground">{user.email}</p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                <div className="flex items-center text-sm">
                                  {user.role === "faculty" ? (
                                    <School className="h-3.5 w-3.5 mr-1 text-blue-500" />
                                  ) : user.role === "student" ? (
                                    <BookOpen className="h-3.5 w-3.5 mr-1 text-green-500" />
                                  ) : (
                                    <GraduationCap className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                  )}
                                  <span>{user.department}</span>
                                </div>

                                {user.batch && (
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                    <span>{user.batch}</span>
                                  </div>
                                )}

                                <div className="flex items-center text-sm">
                                  <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  <span>{user.location}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewProfile(user.id)}
                                className="flex items-center"
                              >
                                View Profile
                              </Button>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleAccept(user.id)}
                                  disabled={isLoading}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(user.id)}
                                  disabled={isLoading}
                                >
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No pending requests found
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

