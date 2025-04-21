'use client'

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
    enrollmentNumber: "",
  },
  // ... rest of your mock data ...
]

export default function NetworkContent() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [activeTab, setActiveTab] = useState("discover")
  const [expandedUsers, setExpandedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

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

  const handleConnect = (userId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to connect with other users",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would make an API call to send a connection request
    toast({
      title: "Connection Request Sent",
      description: "Your connection request has been sent successfully",
    })
  }

  const handleAccept = (userId: string) => {
    // In a real app, this would make an API call to accept a connection request
    toast({
      title: "Connection Accepted",
      description: "You are now connected with this user",
    })
  }

  const handleReject = (userId: string) => {
    // In a real app, this would make an API call to reject a connection request
    toast({
      title: "Connection Rejected",
      description: "Connection request has been rejected",
    })
  }

  const toggleUserExpand = (userId: string) => {
    setExpandedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
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
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search people..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Filters</span>
                </div>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {showFilters && (
                <div className="space-y-4 p-4 border rounded-md">
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
                    <div className="max-h-40 overflow-y-auto space-y-2 p-2 border rounded-md">
                      {allSkills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => toggleSkill(skill)}
                          />
                          <label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer">
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRole("all")
                        setSelectedDepartment("all")
                        setSelectedSkills([])
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button size="sm" onClick={() => setShowFilters(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Network Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
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

                            <div className="mt-4 md:mt-0">
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
                                    <Button size="sm" variant="default" onClick={() => handleAccept(user.id)}>
                                      Accept
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleReject(user.id)}>
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
                                >
                                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                  Connect
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {user.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {user.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto text-muted-foreground hover:text-foreground"
                              onClick={() => toggleUserExpand(user.id)}
                            >
                              {expandedUsers.includes(user.id) ? (
                                <>
                                  <ChevronUp className="h-3.5 w-3.5 mr-1" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                                  Show more
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

                              <div className="space-y-1">
                                <h4 className="text-sm font-medium">Skills</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {user.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => router.push(`/profile/${user.id}`)}>
                                  View Full Profile
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No users found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery || selectedRole !== "all" || selectedDepartment !== "all" || selectedSkills.length > 0
                      ? "Try adjusting your search or filters"
                      : "There are no users to display"}
                  </p>
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

                            <div className="mt-4 md:mt-0 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/messages?user=${user.id}`)}
                              >
                                Message
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/profile/${user.id}`)}>
                                View Profile
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {user.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {user.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No connections yet</h3>
                  <p className="text-muted-foreground mt-1">Start connecting with other users to build your network</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("discover")}>
                    Discover People
                  </Button>
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

                            <div className="mt-4 md:mt-0 flex gap-2">
                              <Button size="sm" onClick={() => handleAccept(user.id)}>
                                Accept
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleReject(user.id)}>
                                Decline
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {user.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {user.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/profile/${user.id}`)}>
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No pending requests</h3>
                  <p className="text-muted-foreground mt-1">
                    You don't have any pending connection requests at the moment
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}