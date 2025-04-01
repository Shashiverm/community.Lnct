"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"
import { Menu, Bell, MessageSquare, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [notificationCount, setNotificationCount] = useState(3)
  const [messageCount, setMessageCount] = useState(2)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-lnct-blue">LNCT</span>
            <span className="hidden text-lg font-medium sm:inline-block">Community</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/dashboard") ? "text-primary" : "text-foreground/80"
            }`}
          >
            {user ? "Dashboard" : "Home"}
          </Link>
          <Link
            href="/events"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/events") ? "text-primary" : "text-foreground/80"
            }`}
          >
            Events
          </Link>
          <Link
            href="/resources"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/resources") ? "text-primary" : "text-foreground/80"
            }`}
          >
            Resources
          </Link>
          {user && (
            <Link
              href="/network"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/network") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Network
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              {/* Notification and Message icons for desktop */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/notifications")}>
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      variant="destructive"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/messages")}>
                  <MessageSquare className="h-5 w-5" />
                  {messageCount > 0 && (
                    <Badge
                      className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      variant="destructive"
                    >
                      {messageCount}
                    </Badge>
                  )}
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>

                  {/* Mobile-only menu items */}
                  <div className="md:hidden">
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/notifications")}>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                      {notificationCount > 0 && (
                        <Badge className="ml-auto" variant="destructive">
                          {notificationCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/messages")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                      {messageCount > 0 && (
                        <Badge className="ml-auto" variant="destructive">
                          {messageCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="mt-6 flex flex-col gap-4">
                {user ? (
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mb-6">
                    <Button asChild>
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/register">Sign up</Link>
                    </Button>
                  </div>
                )}

                <nav className="flex flex-col gap-2">
                  <Link
                    href={user ? "/dashboard" : "/"}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                      isActive(user ? "/dashboard" : "/") ? "bg-muted" : ""
                    }`}
                  >
                    {user ? "Dashboard" : "Home"}
                  </Link>
                  <Link
                    href="/events"
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                      isActive("/events") ? "bg-muted" : ""
                    }`}
                  >
                    Events
                  </Link>
                  <Link
                    href="/resources"
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                      isActive("/resources") ? "bg-muted" : ""
                    }`}
                  >
                    Resources
                  </Link>
                  {user && (
                    <Link
                      href="/network"
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                        isActive("/network") ? "bg-muted" : ""
                      }`}
                    >
                      Network
                    </Link>
                  )}
                  {user && (
                    <Link
                      href="/messages"
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                        isActive("/messages") ? "bg-muted" : ""
                      }`}
                    >
                      Messages
                      {messageCount > 0 && <Badge variant="destructive">{messageCount}</Badge>}
                    </Link>
                  )}
                  {user && (
                    <Link
                      href="/notifications"
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                        isActive("/notifications") ? "bg-muted" : ""
                      }`}
                    >
                      Notifications
                      {notificationCount > 0 && <Badge variant="destructive">{notificationCount}</Badge>}
                    </Link>
                  )}
                  {user && (
                    <>
                      <Link
                        href="/profile"
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                          isActive("/profile") ? "bg-muted" : ""
                        }`}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                          isActive("/settings") ? "bg-muted" : ""
                        }`}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-left hover:bg-muted"
                      >
                        Log out
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

