"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { redirect } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Bell, Lock, User, Shield, LogOut } from "lucide-react"

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    notifyOnLikes: true,
    notifyOnComments: true,
    notifyOnConnections: true,
    notifyOnMessages: true,
    notifyOnEvents: true,
    digestFrequency: "daily",
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowTagging: true,
    allowMessaging: "everyone",
  })

  // If not logged in, redirect to login page
  if (!loading && !user) {
    redirect("/login")
  }

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccountSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleNotificationSelectChange = (name: string, value: string) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handlePrivacyToggle = (name: string, checked: boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handlePrivacySelectChange = (name: string, value: string) => {
    setPrivacySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Account settings updated successfully.",
      })

      // Reset password fields
      setAccountSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (error) {
      console.error("Error updating account settings:", error)
      toast({
        title: "Error",
        description: "Failed to update account settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Notification settings updated successfully.",
      })
    } catch (error) {
      console.error("Error updating notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePrivacy = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Privacy settings updated successfully.",
      })
    } catch (error) {
      console.error("Error updating privacy settings:", error)
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-8">
        <TabsList>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account information and email address</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveAccount}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={accountSettings.email}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveAccount}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={accountSettings.currentPassword}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={accountSettings.newPassword}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={accountSettings.confirmPassword}
                      onChange={handleAccountChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account status and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Deactivate Account</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Temporarily deactivate your account. You can reactivate it later.
                    </p>
                  </div>
                  <Button variant="outline">Deactivate</Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium">Log Out</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Log out from your account on this device.</p>
                  </div>
                  <Button variant="outline" onClick={handleLogout}>
                    Log Out
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4 border-destructive/50">
                  <div className="space-y-0.5">
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all your data. This action cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("pushNotifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnLikes">Likes</Label>
                    <p className="text-sm text-muted-foreground">When someone likes your post or comment</p>
                  </div>
                  <Switch
                    id="notifyOnLikes"
                    checked={notificationSettings.notifyOnLikes}
                    onCheckedChange={(checked) => handleNotificationToggle("notifyOnLikes", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnComments">Comments</Label>
                    <p className="text-sm text-muted-foreground">When someone comments on your post</p>
                  </div>
                  <Switch
                    id="notifyOnComments"
                    checked={notificationSettings.notifyOnComments}
                    onCheckedChange={(checked) => handleNotificationToggle("notifyOnComments", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnConnections">Connections</Label>
                    <p className="text-sm text-muted-foreground">Connection requests and acceptances</p>
                  </div>
                  <Switch
                    id="notifyOnConnections"
                    checked={notificationSettings.notifyOnConnections}
                    onCheckedChange={(checked) => handleNotificationToggle("notifyOnConnections", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnMessages">Messages</Label>
                    <p className="text-sm text-muted-foreground">When you receive a new message</p>
                  </div>
                  <Switch
                    id="notifyOnMessages"
                    checked={notificationSettings.notifyOnMessages}
                    onCheckedChange={(checked) => handleNotificationToggle("notifyOnMessages", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyOnEvents">Events</Label>
                    <p className="text-sm text-muted-foreground">Event invitations and updates</p>
                  </div>
                  <Switch
                    id="notifyOnEvents"
                    checked={notificationSettings.notifyOnEvents}
                    onCheckedChange={(checked) => handleNotificationToggle("notifyOnEvents", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Digest</h3>
                <div className="space-y-2">
                  <Label htmlFor="digestFrequency">Email Digest Frequency</Label>
                  <Select
                    value={notificationSettings.digestFrequency}
                    onValueChange={(value) => handleNotificationSelectChange("digestFrequency", value)}
                  >
                    <SelectTrigger id="digestFrequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Receive a summary of all your notifications</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control who can see your information and interact with you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Visibility</h3>
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Who can see your profile</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => handlePrivacySelectChange("profileVisibility", value)}
                  >
                    <SelectTrigger id="profileVisibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Everyone</SelectItem>
                      <SelectItem value="connections">Connections only</SelectItem>
                      <SelectItem value="private">Only me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showEmail">Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">Display your email address on your profile</p>
                  </div>
                  <Switch
                    id="showEmail"
                    checked={privacySettings.showEmail}
                    onCheckedChange={(checked) => handlePrivacyToggle("showEmail", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showPhone">Show Phone Number</Label>
                    <p className="text-sm text-muted-foreground">Display your phone number on your profile</p>
                  </div>
                  <Switch
                    id="showPhone"
                    checked={privacySettings.showPhone}
                    onCheckedChange={(checked) => handlePrivacyToggle("showPhone", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interactions</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowTagging">Allow Tagging</Label>
                    <p className="text-sm text-muted-foreground">Allow others to tag you in posts and comments</p>
                  </div>
                  <Switch
                    id="allowTagging"
                    checked={privacySettings.allowTagging}
                    onCheckedChange={(checked) => handlePrivacyToggle("allowTagging", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowMessaging">Who can message you</Label>
                  <Select
                    value={privacySettings.allowMessaging}
                    onValueChange={(value) => handlePrivacySelectChange("allowMessaging", value)}
                  >
                    <SelectTrigger id="allowMessaging">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="connections">Connections only</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePrivacy} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

