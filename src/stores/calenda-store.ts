// import { defineStore } from 'pinia'
// import axios from 'axios'
// import type { EventInput } from '@fullcalendar/core'

// export interface CalendarEvent extends EventInput {
//   extendedProps: {
//     species: any[]
//     preference: any
//     contacts: any[]
//     proposed_package: any
//     areas: any[]
//     status: string
//     sales_quota: any
//   }
//   description: string
//   textColor: string
// }

// export const useCalendarStore = defineStore('calendar_store', {
//   state: () => ({
//     events: [] as CalendarEvent[],
//     loading: false,
//     error: null as string | null
//   }),

//   actions: {
//     async fetchCalendarEvents() {
//       try {
//         this.loading = true
//         this.error = null

//         const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:8000/api/v1.0/'
//         const url = `${baseUrl}sales-confirmation/calendar-stats-vset`

//         console.log('Fetching from:', url)

//         const response = await axios.get(url, {
//           params: {
//             status_list: 'confirmed,provision_sales'
//           },
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           timeout: 10000
//         })

//         console.log('API Response received:', response.data)

//         if (Array.isArray(response.data)) {
//           this.events = this.transformEvents(response.data)
//           console.log(`Successfully transformed ${this.events.length} events`)
//         } else {
//           throw new Error('Invalid response format from API')
//         }

//         return this.events

//       } catch (error: any) {
//         console.error('Error fetching calendar events:', error.message)
//         this.error = error.message

//         // Fallback to mock data
//         console.log('Using mock data as fallback')
//         this.events = this.getMockEvents()
//         return this.events
//       } finally {
//         this.loading = false
//       }
//     },

//     transformEvents(data: any[]): CalendarEvent[] {
//       if (!Array.isArray(data)) {
//         console.warn('Expected array but got:', typeof data, data)
//         return []
//       }

//       return data.map((event: any, index: number) => {
//         // Extract data safely
//         const clientName = event?.sales_inquiry?.entity?.full_name || 'Unknown Client'
//         const startDate = event?.sales_inquiry?.preference?.start_date
//         const endDate = event?.sales_inquiry?.preference?.end_date
//         const status = event?.status?.status || 'pending'

//         // Format dates for display
//         const formattedStart = startDate ? new Date(startDate).toLocaleDateString() : 'N/A'
//         const formattedEnd = endDate ? new Date(endDate).toLocaleDateString() : 'N/A'

//         return {
//           id: event.id?.toString() || (index + 1).toString(),
//           title: `${clientName}`,
//           start: this.formatDateForCalendar(startDate),
//           end: this.formatDateForCalendar(endDate),
//           backgroundColor: this.getStatusColor(status),
//           textColor: this.getTextColor(status),
//           extendedProps: {
//             species: event?.sales_inquiry?.preferred_species || [],
//             preference: event?.sales_inquiry?.preference || {},
//             contacts: event?.sales_inquiry?.entity?.contacts || [],
//             proposed_package: event?.proposed_package || {},
//             areas: event?.sales_inquiry?.area || [],
//             status: status,
//             sales_quota: event?.proposed_package?.sales_package?.sales_quota,
//           },
//           description: `${clientName} - ${formattedStart} to ${formattedEnd} (${status})`,
//         }
//       })
//     },

//     formatDateForCalendar(dateString: string): string {
//       if (!dateString) return new Date().toISOString()

//       try {
//         const date = new Date(dateString)
//         // Handle invalid dates
//         if (isNaN(date.getTime())) {
//           console.warn('Invalid date:', dateString)
//           return new Date().toISOString()
//         }
//         return date.toISOString()
//       } catch {
//         return new Date().toISOString()
//       }
//     },

//     getStatusColor(status: string): string {
//       const colors: Record<string, string> = {
//         pending: '#FFC107',
//         provision_sales: '#FFD700',
//         confirmed: '#4CAF50',
//         declined: '#F44336',
//         cancelled: '#9E9E9E',
//         completed: '#000000',
//       }
//       return colors[status?.toLowerCase()] || '#2196F3'
//     },

//     getTextColor(status: string): string {
//       const darkTextStatuses = ['pending', 'provision_sales']
//       return darkTextStatuses.includes(status?.toLowerCase()) ? '#000000' : '#FFFFFF'
//     },

//     getMockEvents(): CalendarEvent[] {
//       const today = new Date()
//       const events: CalendarEvent[] = []

//       // Create 5 sample events
//       for (let i = 1; i <= 5; i++) {
//         const startDate = new Date(today)
//         startDate.setDate(startDate.getDate() + i * 7)

//         const endDate = new Date(startDate)
//         endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 2)

//         const statuses = ['confirmed', 'provision_sales']
//         const status = statuses[Math.floor(Math.random() * statuses.length)]
//         const clientName = `Client ${i}`

//         events.push({
//           id: i.toString(),
//           title: `${clientName} - Safari`,
//           start: startDate.toISOString(),
//           end: endDate.toISOString(),
//           backgroundColor: this.getStatusColor(status),
//           textColor: this.getTextColor(status),
//           extendedProps: {
//             species: [
//               {
//                 id: i,
//                 species: {
//                   name: ['Elephant', 'Lion', 'Buffalo'][Math.floor(Math.random() * 3)],
//                   scientific_name: 'Scientific name'
//                 },
//                 quantity: 1
//               }
//             ],
//             preference: {
//               no_of_observers: Math.floor(Math.random() * 3),
//               no_of_days: Math.floor(Math.random() * 7) + 1,
//               no_of_companions: Math.floor(Math.random() * 2)
//             },
//             contacts: [
//               { id: i, contact: `client${i}@example.com` }
//             ],
//             proposed_package: {
//               sales_package: { name: 'Test Package' },
//               price_list_type: { hunting_type: { name: 'Hunting Type' } }
//             },
//             areas: [
//               { id: i, area: { name: `Area ${i}` } }
//             ],
//             status: status,
//             sales_quota: {}
//           },
//           description: `${clientName} - Safari trip`
//         })
//       }

//       return events
//     }
//   }
// })

// VITE_APP_CALENDAR_STATS_VSET_URL

// import { defineStore } from 'pinia'
// import axios from 'axios'

// export const useCalendarStore = defineStore('calendar_store', {
//   state: () => ({
//     events: [] as any[],
//     stats: {
//       total: 0,
//       confirmed: 0,
//       pending: 0,
//       provision_sales: 0,
//       upcoming: 0
//     }
//   }),

//   actions: {
//     async getCalendarStats() {
//       try {
//         const url =
//           import.meta.env.VITE_APP_BASE_URL +
//           import.meta.env.VITE_APP_SALES_CONFIRMATION_VSET_URL +
//           '?status_list=confirmed,provision_sales'

//         console.log('Fetching calendar data from:', url)

//         const response = await axios.get(url)
//         console.log('API Response:', response.data)

//         // Store the data
//         this.events = Array.isArray(response.data) ? response.data : []

//         // Calculate statistics
//         this.stats.total = this.events.length
//         this.stats.confirmed = this.events.filter(e => e.status?.status === 'confirmed').length
//         this.stats.pending = this.events.filter(e => e.status?.status === 'pending').length
//         this.stats.provision_sales = this.events.filter(e => e.status?.status === 'provision_sales').length

//         // Count upcoming events (from today onward)
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)
//         this.stats.upcoming = this.events.filter(event => {
//           const startDate = new Date(event.sales_inquiry?.preference?.start_date)
//           return startDate >= today
//         }).length

//         // Return just the data array
//         return response.data

//       } catch (error) {
//         console.error('Error fetching calendar stats:', error)
//         return []
//       }
//     },
//   },
// })
// calenda-store.ts
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCalendarStore = defineStore('calendar_store', {
  state: () => {
    return {
      events: [],
    }
  },

  actions: {
    async getCalendarStats() {
      try {
        // Use the calendar-stats-vset endpoint which returns direct array
        const url =
          import.meta.env.VITE_APP_BASE_URL +
          'sales-confirmation/calendar-stats-vset' +
          '?status_list=confirmed,provision_sales,completed'

        console.log('Fetching calendar data from:', url)

        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: url,
          headers: {
            'Content-Type': 'application/json',
          },
        }

        const response = await axios.request(config)

        console.log('API Response received:', {
          status: response.status,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array',
        })

        return response
      } catch (error) {
        console.error('Error fetching calendar stats:', error)

        // Return empty response on error
        return {
          status: 200,
          data: [],
        }
      }
    },
  },
})
