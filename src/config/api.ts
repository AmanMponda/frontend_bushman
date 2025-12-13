// API configuration helper
// This helps with CORS issues in development by using the Vite proxy

export const getApiBaseUrl = (): string => {
  // In development, use relative URL to leverage Vite proxy
  if (import.meta.env.DEV) {
    // Return empty string to use relative URLs, which will go through Vite proxy
    return ''
  }

  // In production, use the full API URL
  return import.meta.env.VITE_APP_BASE_URL || 'https://bushman-api.abooderp.com/api/v1.0/'
}

export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl()
  // Remove leading slash from endpoint if baseUrl already ends with slash or is empty
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

  if (!baseUrl) {
    // In dev mode with proxy, use /api prefix
    return `/api/v1.0/${cleanEndpoint}`
  }

  return `${cleanBaseUrl}/${cleanEndpoint}`
}
