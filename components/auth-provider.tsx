"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useRouter, usePathname } from "next/navigation"
import apiClient from "@/lib/api-client"
import { toast } from "@/components/ui/use-toast"

interface User {
  _id: string
  name: string
  email: string
  role: string
  profileImage: string
  isEmailVerified: boolean
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
  checkingAuth: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [tokenRefreshInterval, setTokenRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Function to get current user
  const getCurrentUser = async () => {
    try {
      const response = await apiClient.get<{ data: User }>("/auth/me")
      setUser(response.data)
      return response.data
    } catch (error) {
      setUser(null)
      localStorage.removeItem("token")
      return null
    } finally {
      setCheckingAuth(false)
    }
  }

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const response = await apiClient.get<{ token: string }>("/auth/refresh-token")
      localStorage.setItem("token", response.token)
      return true
    } catch (error) {
      console.error("Failed to refresh token:", error)
      return false
    }
  }

  // Setup token refresh interval
  const setupTokenRefresh = () => {
    // Refresh token every 55 minutes (assuming 1 hour expiry)
    if (tokenRefreshInterval) {
      clearInterval(tokenRefreshInterval)
    }

    const interval = setInterval(
      async () => {
        const success = await refreshToken()
        if (!success) {
          clearInterval(interval)
          setTokenRefreshInterval(null)
          await logout()
        }
      },
      55 * 60 * 1000,
    )

    setTokenRefreshInterval(interval)
  }

  // Check if user is logged in on initial load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        await getCurrentUser()
        setupTokenRefresh()
      } else {
        setCheckingAuth(false)
      }
    }

    initAuth()

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval)
      }
    }
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await apiClient.post<{ token: string; user: User }>("/auth/login", { email, password })

      localStorage.setItem("token", response.token)
      setUser(response.user)
      setupTokenRefresh()

      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.name}!`,
      })

      // Redirect based on role
      if (response.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData: any) => {
    setLoading(true)
    try {
      await apiClient.post("/auth/register", userData)

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      })

      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    try {
      await apiClient.post("/auth/logout", {})

      localStorage.removeItem("token")
      setUser(null)

      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval)
        setTokenRefreshInterval(null)
      }

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })

      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)

      // Force logout on client side even if server request fails
      localStorage.removeItem("token")
      setUser(null)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        checkingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
