"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "faculty" | "student" | "alumni" | "admin"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Wait until auth state is determined
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
          variant: "destructive",
        })
        router.push("/login")
      } else if (requiredRole && user?.role !== requiredRole) {
        toast({
          title: "Access Denied",
          description: `Only ${requiredRole} can access this page`,
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, router, toast, user, requiredRole])

  // Show loading state while checking authentication
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If role is required and user doesn't have it, don't render children
  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
