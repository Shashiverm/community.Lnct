"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  attribute?: "class" | "data-theme"
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

function useTheme() {
  // Placeholder implementation, as the actual implementation is within next-themes
  return {
    setTheme: (theme: string) => {
      // This function will be replaced by next-themes functionality
    },
  }
}

export { ThemeProvider, useTheme }
