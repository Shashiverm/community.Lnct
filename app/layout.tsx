import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "LNCT Community",
  description: "Connect with students, alumni, and faculty of Lakshmi Narain College of Technology",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://lnct-community.vercel.app"),
  keywords: ["LNCT", "community", "college", "education", "students", "alumni", "faculty"],
  authors: [{ name: "LNCT Community Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://lnct-community.vercel.app",
    title: "LNCT Community",
    description: "Connect with students, alumni, and faculty of Lakshmi Narain College of Technology",
    siteName: "LNCT Community",
  },
  twitter: {
    card: "summary_large_image",
    title: "LNCT Community",
    description: "Connect with students, alumni, and faculty of Lakshmi Narain College of Technology",
  },
  manifest: "/site.webmanifest",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout inter={inter}>{children}</ClientLayout>
}
