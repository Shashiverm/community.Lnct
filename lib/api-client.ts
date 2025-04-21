import { toast } from "@/components/ui/use-toast"

interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  cache?: "force-cache" | "no-store" | "no-cache" | "only-if-cached" | "default"
}

class ApiClient {
  private baseUrl: string
  private defaultOptions: FetchOptions

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    this.defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      retries: 3,
      retryDelay: 1000,
    }
  }

  private async fetchWithRetry(url: string, options: FetchOptions): Promise<Response> {
    const { retries = 3, retryDelay = 1000, ...fetchOptions } = options

    let lastError: Error | null = null

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, fetchOptions)

        // Only retry on network errors or 5xx server errors
        if (!response.ok && response.status >= 500) {
          const error = new Error(`HTTP error! status: ${response.status}`)
          throw error
        }

        return response
      } catch (error) {
        lastError = error as Error
        console.error(`Fetch attempt ${i + 1} failed:`, error)

        if (i < retries - 1) {
          // Wait before retrying (with exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, i)))
        }
      }
    }

    throw lastError || new Error("Failed to fetch after retries")
  }

  private getAuthHeader(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const fetchOptions: FetchOptions = {
      ...this.defaultOptions,
      ...options,
      method: "GET",
      headers: {
        ...this.defaultOptions.headers,
        ...this.getAuthHeader(),
        ...options.headers,
      },
    }

    try {
      const response = await this.fetchWithRetry(url, fetchOptions)
      return await response.json()
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async post<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const fetchOptions: FetchOptions = {
      ...this.defaultOptions,
      ...options,
      method: "POST",
      headers: {
        ...this.defaultOptions.headers,
        ...this.getAuthHeader(),
        ...options.headers,
      },
      body: JSON.stringify(data),
    }

    try {
      const response = await this.fetchWithRetry(url, fetchOptions)
      return await response.json()
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async put<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const fetchOptions: FetchOptions = {
      ...this.defaultOptions,
      ...options,
      method: "PUT",
      headers: {
        ...this.defaultOptions.headers,
        ...this.getAuthHeader(),
        ...options.headers,
      },
      body: JSON.stringify(data),
    }

    try {
      const response = await this.fetchWithRetry(url, fetchOptions)
      return await response.json()
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const fetchOptions: FetchOptions = {
      ...this.defaultOptions,
      ...options,
      method: "DELETE",
      headers: {
        ...this.defaultOptions.headers,
        ...this.getAuthHeader(),
        ...options.headers,
      },
    }

    try {
      const response = await this.fetchWithRetry(url, fetchOptions)
      return await response.json()
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  async upload<T>(endpoint: string, formData: FormData, options: FetchOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const fetchOptions: FetchOptions = {
      ...this.defaultOptions,
      ...options,
      method: "POST",
      headers: {
        ...this.getAuthHeader(),
        ...options.headers,
      },
      body: formData,
    }

    // Remove Content-Type header as it will be set automatically with the correct boundary
    delete fetchOptions.headers?.["Content-Type"]

    try {
      const response = await this.fetchWithRetry(url, fetchOptions)
      return await response.json()
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  private handleError(error: any): void {
    console.error("API request failed:", error)

    // Show toast notification for user feedback
    toast({
      title: "Error",
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive",
    })
  }
}

// Create a singleton instance
const apiClient = new ApiClient()
export default apiClient
