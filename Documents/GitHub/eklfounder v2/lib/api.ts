// API utility functions for making HTTP requests

export interface ApiResponse<T> {
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  error: string
  details?: any
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Institution API functions
export const institutionsApi = {
  getAll: (params?: {
    query?: string
    category?: string
    countries?: string
    riskLevel?: string
    isPartner?: boolean
    minRating?: number
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
    return apiRequest<ApiResponse<any[]>>(`/institutions?${searchParams}`)
  },

  getById: (id: string) => 
    apiRequest<any>(`/institutions/${id}`),

  create: (data: any) =>
    apiRequest<any>('/institutions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`/institutions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/institutions/${id}`, {
      method: 'DELETE'
    })
}

// Onboarding API functions
export const onboardingApi = {
  getAll: (params?: {
    status?: string
    fintechId?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
    return apiRequest<ApiResponse<any[]>>(`/onboarding?${searchParams}`)
  },

  getById: (id: string) =>
    apiRequest<any>(`/onboarding/${id}`),

  create: (data: any) =>
    apiRequest<any>('/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateStatus: (id: string, data: { status?: string; statusNotes?: string }) =>
    apiRequest<any>(`/onboarding/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/onboarding/${id}`, {
      method: 'DELETE'
    })
}

// Blog API functions
export const blogApi = {
  getAll: (params?: {
    query?: string
    category?: string
    locale?: string
    isPublished?: boolean
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
    return apiRequest<ApiResponse<any[]>>(`/blog?${searchParams}`)
  },

  create: (data: any) =>
    apiRequest<any>('/blog', {
      method: 'POST',
      body: JSON.stringify(data)
    })
}

// Newsletter API functions
export const newsletterApi = {
  subscribe: (email: string) =>
    apiRequest<{ message: string }>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  getSubscribers: (params?: { page?: number; limit?: number; isActive?: boolean }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
    return apiRequest<ApiResponse<any[]>>(`/newsletter?${searchParams}`)
  }
}

// Contact API functions
export const contactApi = {
  submit: (data: {
    name: string
    email: string
    subject: string
    message: string
    company?: string
    phone?: string
  }) =>
    apiRequest<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
}

// Statistics API functions
export const statsApi = {
  getDashboard: () =>
    apiRequest<any>('/stats')
}

// Helper for handling API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
} 