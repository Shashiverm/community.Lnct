"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-lnct-blue">LNCT</span>
          <span className="text-lg font-medium">Community</span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/resources" className="text-sm font-medium hover:underline underline-offset-4">
            Resources
          </Link>
          <Link href="/events" className="text-sm font-medium hover:underline underline-offset-4">
            Events
          </Link>
          <Link href="/courses" className="text-sm font-medium hover:underline underline-offset-4">
            Courses
          </Link>
          <Link href="/departments" className="text-sm font-medium hover:underline underline-offset-4">
            Departments
          </Link>
          <Link href="/announcements" className="text-sm font-medium hover:underline underline-offset-4">
            Announcements
          </Link>
          <Link href="/academic-calendar" className="text-sm font-medium hover:underline underline-offset-4">
            Calendar
          </Link>
          <Link href="/network" className="text-sm font-medium hover:underline underline-offset-4">
            Network
          </Link>
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage || "/placeholder.svg?height=96&width=96"} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/messages")}>Messages</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/notifications")}>Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/quizzes")}>Quizzes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/assignments")}>Assignments</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/feedback")}>Feedback</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/support")}>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {pathname !== "/login" && (
                <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
                  Login
                </Link>
              )}
              {pathname !== "/register" && (
                <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
                  Register
                </Link>
              )}
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden container py-2 flex flex-col gap-2">
          <Link href="/resources" className="text-sm font-medium hover:underline underline-offset-4">
            Resources
          </Link>
          <Link href="/events" className="text-sm font-medium hover:underline underline-offset-4">
            Events
          </Link>
          <Link href="/courses" className="text-sm font-medium hover:underline underline-offset-4">
            Courses
          </Link>
        </div>
      )}
    </header>
  )
}
