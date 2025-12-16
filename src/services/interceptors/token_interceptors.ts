import axios from 'axios'
import router from '../../router/index'

// Request interceptor
axios.interceptors.request.use(
  function (config) {
    const tobeInoredUrl = ['/authentication/login/', '/authentication/register/', 'authentications/refresh/']

    const isToBeIgnored = tobeInoredUrl.some((url) => config.url?.includes(url))

    // Add CORS-related headers for development
    if (import.meta.env.DEV) {
      config.headers['Access-Control-Allow-Origin'] = '*'
      config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
      config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    }

    // console.log(config.url)

    if (!isToBeIgnored) {
      const token = sessionStorage.getItem('access')
      if (token) {
        try {
          const parsedToken = JSON.parse(token)
          config.headers.Authorization = `Bearer ${parsedToken}`
        } catch (e) {
          // If token is not JSON, use it directly
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    }

    return config
  },
  function (error) {
    console.log(error)
    return Promise.reject(error)
  },
)

// Response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Avoid redirecting if already on login page
      if (router.currentRoute.value.path !== '/auth/login') {
        router.push('/auth/login')
      }
    }
    return Promise.reject(error)
  },
)
