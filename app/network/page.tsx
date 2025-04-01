"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, UserCheck, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/components/ui/use-toast"

// Mock data - replace with real API calls in production
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    role: "student",
    department: "Computer Science",
    skills: ["React", "TypeScript", "Node.js"],
    isConnected: false,
    isPending: false,
    profileImage: "/placeholder.svg",
  },
  // Add more mock users
]

const allDepartments = ["Computer Science", "Data Science", "Electrical Engineering"]
const allSkills = ["React", "TypeScript", "Node.js", "Python", "SQL"]

export default function NetworkPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRole, setSelectedRole] = React.useState("all")
  const [selectedDepartment, setSelectedDepartment] = React.useState("all")
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState("discover")
  const [isLoading, setIsLoading] = React.useState(false)
  const [filteredUsers, setFilteredUsers] = React.useState(mockUsers)

  React.useEffect(() => {
    let filtered = mockUsers

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
          user.department.toLowerCase().includes(searchQuery.toLowerCase())
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

    if (activeTab === "connections" && user) {
      filtered = filtered.filter((user) => user.isConnected)
    } else if (activeTab === "pending" && user) {
      filtered = filtered.filter((user) => user.isPending)
    }

    setFilteredUsers(filtered)
  }, [searchQuery, selectedRole, selectedDepartment, selectedSkills, activeTab, user])

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
    try {
      // In a real app, this would make an API call to send a connection request
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProfile = (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view user profiles",
        variant: "destructive",
      })
      return
    }
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
          {user && (
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
                  <Badge variant="secondary">{mockUsers.filter((u) => u.isConnected).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Pending Requests</span>
                  </div>
                  <Badge variant="secondary">{mockUsers.filter((u) => u.isPending).length}</Badge>
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
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              {user && (
                <>
                  <TabsTrigger value="connections">My Connections</TabsTrigger>
                  <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="discover" className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.department}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {user.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProfile(user.id)}
                              className="flex items-center"
                            >
                              View Profile
                            </Button>
                            {!user?.isConnected && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleConnect(user.id)}
                                disabled={isLoading}
                                className="flex items-center"
                              >
                                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {user && (
              <>
                <TabsContent value="connections" className="space-y-4">
                  {filteredUsers.filter((u) => u.isConnected).length > 0 ? (
                    filteredUsers.map((user) => (
                      <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        {/* Similar card content as discover tab */}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No connections yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  {filteredUsers.filter((u) => u.isPending).length > 0 ? (
                    filteredUsers.map((user) => (
                      <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        {/* Similar card content as discover tab */}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No pending requests</p>
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

