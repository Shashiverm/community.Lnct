'use client'

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ClientLayoutProps {
  children: React.ReactNode
  inter: ReturnType<typeof Inter>
}

export default function ClientLayout({ children, inter }: ClientLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1 w-full max-w-full overflow-x-hidden">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </LocalizationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 