import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as any,
      token: null as string | null,
      expiresIn: null as number | null,
      services: [] as any[],
      companies: [] as any[],
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    accessToken: (state) => state.token,
  },

  actions: {
    setUser(user: any) {
      this.user = user
      sessionStorage.setItem('user', JSON.stringify(user))
    },

    setToken(token: string, expiresIn: number) {
      this.token = token
      this.expiresIn = expiresIn
      sessionStorage.setItem('access', JSON.stringify(token))
      if (expiresIn) {
        sessionStorage.setItem('expires_in', JSON.stringify(expiresIn))
      }
    },

    setServices(services: any[]) {
      this.services = services
      sessionStorage.setItem('services', JSON.stringify(services))
    },

    setCompanies(companies: any[]) {
      this.companies = companies
      sessionStorage.setItem('companies_ids', JSON.stringify(companies))
    },

    afterLogin() {
      // Handle post-login logic
      // This could include setting up timers, refreshing data, etc.
    },

    logout() {
      this.user = null
      this.token = null
      this.expiresIn = null
      this.services = []
      this.companies = []
      sessionStorage.removeItem('access')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('services')
      sessionStorage.removeItem('companies_ids')
      sessionStorage.removeItem('expires_in')
    },

    loadFromSessionStorage() {
      const token = sessionStorage.getItem('access')
      const user = sessionStorage.getItem('user')
      const services = sessionStorage.getItem('services')
      const companies = sessionStorage.getItem('companies_ids')
      const expiresIn = sessionStorage.getItem('expires_in')

      if (token) {
        this.token = JSON.parse(token)
      }
      if (user) {
        this.user = JSON.parse(user)
      }
      if (services) {
        this.services = JSON.parse(services)
      }
      if (companies) {
        this.companies = JSON.parse(companies)
      }
      if (expiresIn) {
        this.expiresIn = JSON.parse(expiresIn)
      }
    },
  },
})
