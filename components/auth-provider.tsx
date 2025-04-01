"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Update the User type to include new fields
type User = {
  id: string
  name: string
  email: string
  username?: string
  enrollmentNumber?: string
  teacherId?: string
  role: "student" | "alumni" | "faculty" | "admin"
  profileImage?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

// Update the RegisterData type to include new fields
type RegisterData = {
  name: string
  email: string
  username?: string
  enrollmentNumber?: string
  teacherId?: string
  password: string
  role: "student" | "alumni" | "faculty"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("lnct_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: "1",
        name: "John Doe",
        email,
        role: "student",
        profileImage: "/placeholder.svg?height=40&width=40",
      }

      // Store user in localStorage
      localStorage.setItem("lnct_user", JSON.stringify(mockUser))
      setUser(mockUser)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update the register function to handle new fields
  const register = async (userData: RegisterData) => {
    setLoading(true)
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      const mockUser: User = {
        id: "1",
        name: userData.name,
        email: userData.email,
        username: userData.username,
        enrollmentNumber: userData.enrollmentNumber,
        teacherId: userData.teacherId,
        role: userData.role,
        profileImage: "/placeholder.svg?height=40&width=40",
      }

      // Store user in localStorage
      localStorage.setItem("lnct_user", JSON.stringify(mockUser))
      setUser(mockUser)
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("lnct_user")
    setUser(null)
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

