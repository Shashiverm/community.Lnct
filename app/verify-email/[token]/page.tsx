"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Check, X, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const { token } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // In a real app, this would make an API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate successful verification
        setStatus("success")
        setMessage("Your email has been verified successfully.")

        toast({
          title: "Success",
          description: "Your email has been verified successfully.",
        })
      } catch (error) {
        console.error("Error verifying email:", error)
        setStatus("error")
        setMessage("Failed to verify your email. The verification link may be invalid or expired.")

        toast({
          title: "Error",
          description: "Failed to verify your email. The verification link may be invalid or expired.",
          variant: "destructive",
        })
      }
    }

    verifyEmail()
  }, [token, toast])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Email Verification</h1>
          <p className="text-sm text-muted-foreground">Verifying your email address</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {status === "loading" && (
            <div className="rounded-full bg-primary/10 p-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}

          {status === "success" && (
            <div className="rounded-full bg-green-100 p-6 dark:bg-green-900">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          )}

          {status === "error" && (
            <div className="rounded-full bg-red-100 p-6 dark:bg-red-900">
              <X className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
          )}

          <div className="text-center">
            <h2 className="text-lg font-medium">
              {status === "loading"
                ? "Verifying your email"
                : status === "success"
                  ? "Email Verified"
                  : "Verification Failed"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {status === "loading" ? "Please wait while we verify your email address..." : message}
            </p>
          </div>

          {status !== "loading" && (
            <Button className="w-full" asChild>
              <Link href={status === "success" ? "/login" : "/register"}>
                {status === "success" ? "Go to Login" : "Back to Registration"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
