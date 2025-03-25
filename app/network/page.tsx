"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

type User = {
  id: string
  name: string
  role: string
  department?: string
  batch?: string
  company?: string
  position?: string
  avatar?: string
  mutualConnections: number
  connected: boolean
  skills?: string[]
}

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const users: User[] = [
    {
      id: "1",
      name: "Ananya Patel",
      role: "Student",
      department: "Computer Science",
      batch: "2020-2024",
      avatar: "/placeholder.svg?height=100&width=100",
      mutualConnections: 12,
      connected: false,
      skills: ["Java", "Python", "Machine Learning"],
    },
    {
      id: "2",
      name: "Dr. Vikram Singh",
      role: "Faculty",
      department: "Electronics",
      position: "Associate Professor",
      avatar: "/placeholder.svg?height=100&width=100",
      mutualConnections: 8,
      connected: false,
      skills: ["VLSI Design", "Embedded Systems", "IoT"],
    },
    {
      id: "3",
      name: "Rohan Sharma",
      role: "Alumni",
      department: "Mechanical",
      batch: "2015-2019",
      company: "Tata Motors",
      position: "Senior Engineer",
      avatar: "/placeholder.svg?height=100&width=100",
      mutualConnections: 5,
      connected: false,
      skills: ["CAD/CAM", "Product Design", "Automotive Engineering"],
    },
    {
      id: "4",
      name: "Priya Gupta",
      role: "Student",
      department: "Information Technology",
      batch: "2021-2025",
      avatar: "/placeholder.svg?height=100&width=100",
      mutualConnections: 15,
      connected: true,
      skills: ["Web Development", "UI/UX Design", "React"],
    },
    {
      id: "5",
      name: "Prof. Rajesh Kumar",
      role: "Faculty",
      department: "Computer Science",
      position: "Professor",
      avatar: "/placeholder.svg?height=100&width=100",
      mutualConnections: 20,
      connected: true,
      skills: ["Artificial Intelligence", "Data Science", "Cloud Computing"],
    },
    {
      id: "6",
      name: "Amit Verma",
      role: "Alumni",
      department: "Civil Engineering",
      batch: "2016-2020",
      company: "L&T Construction",
      position: "Project Manager",
      avatar: "/placeholder.svg?height=100&width=100",
      mutualConnections: 7,
      connected: false,
      skills: ["Project Management", "Structural Design", "Construction Planning"],
    },
  ]

  const roles = ["Student", "Faculty", "Alumni"]
  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Electrical Engineering",
    "Mechanical",
    "Civil Engineering",
    "Mathematics",
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.position && user.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.skills && user.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter

    return matchesSearch && matchesRole && matchesDepartment
  })

  const connections = users.filter((user) => user.connected)
  const suggestions = users.filter((user) => !user.connected)

  const toggleConnection = (userId: string) => {
    // In a real app, this would make an API call
    console.log(`Toggle connection for user ${userId}`)
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="mb-4 md:mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Network</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Connect with students, alumni, and faculty members of LNCT.
          </p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/network/invitations">
            <UserPlus className="mr-2 h-4 w-4" />
            Invitations
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="mb-4 md:mb-8 w-full justify-start overflow-auto">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="mb-4 md:mb-8 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, skills, or company..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-4">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{user.role}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {user.mutualConnections} mutual
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-lg md:text-xl font-bold">{user.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {user.department}
                    {user.batch && ` • ${user.batch}`}
                  </p>
                  {user.position && (
                    <p className="text-xs md:text-sm font-medium">
                      {user.position}
                      {user.company && ` at ${user.company}`}
                    </p>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {user.skills.slice(0, isMobile ? 2 : 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {user.skills.length > (isMobile ? 2 : 3) && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.skills.length - (isMobile ? 2 : 3)}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant={user.connected ? "default" : "outline"}
                    className="w-full"
                    onClick={() => toggleConnection(user.id)}
                  >
                    {user.connected ? "Connected" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Users className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No users found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{user.role}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {user.mutualConnections} mutual
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-lg md:text-xl font-bold">{user.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {user.department}
                    {user.batch && ` • ${user.batch}`}
                  </p>
                  {user.position && (
                    <p className="text-xs md:text-sm font-medium">
                      {user.position}
                      {user.company && ` at ${user.company}`}
                    </p>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {user.skills.slice(0, isMobile ? 2 : 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {user.skills.length > (isMobile ? 2 : 3) && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.skills.length - (isMobile ? 2 : 3)}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/messages/${user.id}`}>Message</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/profile/${user.id}`}>Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {connections.length === 0 && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Users className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No connections yet</h3>
              <p className="text-sm text-muted-foreground">Start connecting with other members of the LNCT community</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{user.role}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {user.mutualConnections} mutual
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-lg md:text-xl font-bold">{user.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {user.department}
                    {user.batch && ` • ${user.batch}`}
                  </p>
                  {user.position && (
                    <p className="text-xs md:text-sm font-medium">
                      {user.position}
                      {user.company && ` at ${user.company}`}
                    </p>
                  )}
                  {user.skills && user.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {user.skills.slice(0, isMobile ? 2 : 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {user.skills.length > (isMobile ? 2 : 3) && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.skills.length - (isMobile ? 2 : 3)}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => toggleConnection(user.id)}>
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {suggestions.length === 0 && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Users className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No suggestions available</h3>
              <p className="text-sm text-muted-foreground">We'll suggest new connections as they join the platform</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

