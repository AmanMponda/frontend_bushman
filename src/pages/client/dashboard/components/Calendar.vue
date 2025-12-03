<template>
  <div class="calendar-page">
    <!-- Statistics Summary Cards -->
    <div class="summary-cards">
      <VaCard class="summary-card">
        <VaCardContent>
          <div class="card-content">
            <VaIcon name="calendar_today" size="large" color="primary" />
            <div class="card-text">
              <h3 class="card-title">{{ totalEvents }}</h3>
              <p class="card-description">Total Bookings</p>
            </div>
          </div>
        </VaCardContent>
      </VaCard>

      <VaCard class="summary-card">
        <VaCardContent>
          <div class="card-content">
            <VaIcon name="check_circle" size="large" color="success" />
            <div class="card-text">
              <h3 class="card-title">{{ confirmedEvents }}</h3>
              <p class="card-description">Confirmed</p>
            </div>
          </div>
        </VaCardContent>
      </VaCard>

      <VaCard class="summary-card">
        <VaCardContent>
          <div class="card-content">
            <VaIcon name="pending" size="large" color="warning" />
            <div class="card-text">
              <h3 class="card-title">{{ provisionEvents }}</h3>
              <p class="card-description">Provision Sales</p>
            </div>
          </div>
        </VaCardContent>
      </VaCard>

      <VaCard class="summary-card">
        <VaCardContent>
          <div class="card-content">
            <VaIcon name="upcoming" size="large" color="info" />
            <div class="card-text">
              <h3 class="card-title">{{ upcomingEvents }}</h3>
              <p class="card-description">Upcoming</p>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
    </div>

    <!-- Calendar Section -->
    <VaCard class="calendar-container">
      <VaCardContent>
        <div class="calendar-header">
          <h2>Hunting Schedule Calendar</h2>
          <div class="legend">
            <div class="legend-item">
              <span class="legend-color confirmed"></span>
              <span>Confirmed</span>
            </div>
            <div class="legend-item">
              <span class="legend-color provision"></span>
              <span>Provision Sales</span>
            </div>
            <div class="legend-item">
              <span class="legend-color pending"></span>
              <span>Pending</span>
            </div>
          </div>
        </div>

        <VaInnerLoading :loading="loadingData">
          <FullCalendar :key="calendarKey" :options="calendarOptions" />
        </VaInnerLoading>
      </VaCardContent>
    </VaCard>

    <!-- Event Details Modal -->
    <VaModal v-model="showModal" :overlay="false" no-outside-dismiss close-button size="large">
      <template #header>
        <div class="modal-header-content">
          <h2 class="modal-title">{{ selectedEvent?.title || 'Event Details' }}</h2>
          <VaBadge
            :text="selectedEventStatus"
            :color="getStatusColorForModal(selectedEvent?.extendedProps?.status || '')"
          />
        </div>
      </template>

      <template #default>
        <div v-if="selectedEvent" class="modal-body">
          <!-- Client & Date Info -->
          <div class="event-summary">
            <VaCard class="info-card">
              <VaCardContent>
                <h3 class="section-title">Booking Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <strong>Client:</strong>
                    <span>{{ selectedEvent.title || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Start Date:</strong>
                    <span>{{ formatEventDate(selectedEvent.start) }}</span>
                  </div>
                  <div class="info-item">
                    <strong>End Date:</strong>
                    <span>{{ formatEventDate(selectedEvent.end) }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Duration:</strong>
                    <span>{{ calculateDuration(selectedEvent.start, selectedEvent.end) }} days</span>
                  </div>
                  <div class="info-item">
                    <strong>Package:</strong>
                    <span>{{ selectedEvent.extendedProps?.proposed_package?.sales_package?.name || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Hunting Type:</strong>
                    <span>{{
                      selectedEvent.extendedProps?.proposed_package?.price_list_type?.hunting_type?.name || 'N/A'
                    }}</span>
                  </div>
                </div>
              </VaCardContent>
            </VaCard>
          </div>

          <!-- Preferences -->
          <div class="details-section">
            <h3 class="section-title">Preferences</h3>
            <VaCard>
              <VaCardContent>
                <div class="preferences-grid">
                  <div class="pref-item">
                    <VaIcon name="people" size="small" />
                    <div>
                      <strong>Observers:</strong>
                      <p>{{ selectedEvent.extendedProps?.preference?.no_of_observers || 0 }}</p>
                    </div>
                  </div>
                  <div class="pref-item">
                    <VaIcon name="person" size="small" />
                    <div>
                      <strong>Companions:</strong>
                      <p>{{ selectedEvent.extendedProps?.preference?.no_of_companions || 0 }}</p>
                    </div>
                  </div>
                  <div class="pref-item">
                    <VaIcon name="today" size="small" />
                    <div>
                      <strong>Days:</strong>
                      <p>{{ selectedEvent.extendedProps?.preference?.no_of_days || 0 }}</p>
                    </div>
                  </div>
                </div>
              </VaCardContent>
            </VaCard>
          </div>

          <!-- Species -->
          <div v-if="selectedEvent.extendedProps?.species?.length" class="details-section">
            <h3 class="section-title">Target Species</h3>
            <VaCard>
              <VaCardContent>
                <div class="species-grid">
                  <div v-for="specie in selectedEvent.extendedProps.species" :key="specie.id" class="species-card">
                    <div class="species-header">
                      <h4>{{ specie.species?.name || 'Unknown' }}</h4>
                      <VaBadge :text="`Qty: ${specie.quantity || 0}`" color="primary" />
                    </div>
                    <p class="scientific-name">{{ specie.species?.scientific_name || '' }}</p>
                    <p class="species-desc">{{ specie.species?.description || '' }}</p>
                  </div>
                </div>
              </VaCardContent>
            </VaCard>
          </div>

          <!-- Area -->
          <div v-if="selectedEvent.extendedProps?.areas?.length" class="details-section">
            <h3 class="section-title">Hunting Area</h3>
            <VaCard>
              <VaCardContent>
                <div v-for="area in selectedEvent.extendedProps.areas" :key="area.id" class="area-info">
                  <h4>{{ area.area?.name || 'Unknown Area' }}</h4>
                  <p>{{ area.area?.description || '' }}</p>
                  <div class="location-info">
                    <VaIcon name="location_on" size="small" />
                    <span>{{ area.area?.location?.name || 'Tanzania' }}</span>
                    <span class="coordinates">
                      ({{ area.area?.location?.geo_coordinates?.coordinates?.[0]?.lat || '0' }},
                      {{ area.area?.location?.geo_coordinates?.coordinates?.[0]?.lng || '0' }})
                    </span>
                  </div>
                </div>
              </VaCardContent>
            </VaCard>
          </div>

          <!-- Contacts -->
          <div v-if="selectedEvent.extendedProps?.contacts?.length" class="details-section">
            <h3 class="section-title">Contacts</h3>
            <VaCard>
              <VaCardContent>
                <div class="contacts-list">
                  <div v-for="contact in selectedEvent.extendedProps.contacts" :key="contact.id" class="contact-item">
                    <VaIcon name="contact_mail" size="small" />
                    <span>{{ contact.contact || 'N/A' }}</span>
                  </div>
                </div>
              </VaCardContent>
            </VaCard>
          </div>
        </div>
      </template>
    </VaModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import type { CalendarOptions, EventInput } from '@fullcalendar/core'
import { mapActions } from 'pinia'
import { useCalendarStore } from '../../../../stores/calenda-store'

interface CalendarEvent extends EventInput {
  id: string
  title: string
  start: string | Date
  end?: string | Date
  allDay?: boolean
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  extendedProps?: {
    species?: any[]
    preference?: any
    contacts?: any[]
    proposed_package?: any
    areas?: any[]
    status?: string
  }
}

export default defineComponent({
  name: 'CalendarPage',

  components: {
    FullCalendar,
  },

  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],
        initialView: 'multiMonthYear',
        eventClick: (info: any) => this.handleEventClick(info),
        events: [] as EventInput[],
        selectable: false,
        editable: false,
        weekends: true,
        eventDisplay: 'block',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,multiMonthYear',
        },
        // Configure for ALL months display
        initialDate: '2024-01-01', // Start at January 2024
        views: {
          multiMonthYear: {
            type: 'multiMonthYear',
            duration: { years: 1 },
            multiMonthMaxColumns: 4, // Show 4 months per row
            fixedWeekCount: false,
          },
        },
        height: 'auto',
        contentHeight: 1000, // Increased height for scrolling
        // Show more months in view
        multiMonthMinWidth: 300,
        dayMaxEventRows: 3, // Show up to 3 events per day
      } as CalendarOptions,
      showModal: false,
      selectedEvent: null as CalendarEvent | null,
      loadingData: false,
      calendarKey: 0,
      calendarEvents: [] as CalendarEvent[],
    }
  },

  computed: {
    totalEvents(): number {
      return this.calendarEvents.length
    },

    confirmedEvents(): number {
      return this.calendarEvents.filter((event) => event.extendedProps?.status === 'confirmed').length
    },

    provisionEvents(): number {
      return this.calendarEvents.filter((event) => event.extendedProps?.status === 'provision_sales').length
    },

    upcomingEvents(): number {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return this.calendarEvents.filter((event) => {
        const startDate = new Date(event.start as string)
        return startDate >= today
      }).length
    },

    selectedEventStatus(): string {
      const status = this.selectedEvent?.extendedProps?.status
      if (!status) return 'Unknown'

      const statusMap: Record<string, string> = {
        confirmed: 'Confirmed',
        pending: 'Pending',
        provision_sales: 'Provision Sales',
        declined: 'Declined',
        cancelled: 'Cancelled',
        completed: 'Completed',
      }

      return statusMap[status] || status
    },
  },

  mounted() {
    console.log('Calendar component mounted')
    this.loadCalendarEvents()
  },

  methods: {
    ...mapActions(useCalendarStore, ['getCalendarStats']),

    formatEventDate(date: string | Date | undefined): string {
      if (!date) return 'N/A'
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch {
        return 'Invalid Date'
      }
    },

    calculateDuration(start: string | Date | undefined, end: string | Date | undefined): number {
      if (!start || !end) return 0
      try {
        const startDate = new Date(start as string)
        const endDate = new Date(end as string)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      } catch {
        return 0
      }
    },

    handleEventClick(clickInfo: any) {
      console.log('Event clicked:', clickInfo.event)
      this.selectedEvent = {
        id: clickInfo.event.id,
        title: clickInfo.event.title,
        start: clickInfo.event.start,
        end: clickInfo.event.end || clickInfo.event.start,
        extendedProps: clickInfo.event.extendedProps,
      }
      this.showModal = true
    },

    getStatusColor(status: string): string {
      const colorMap: Record<string, string> = {
        pending: '#FFC107',
        provision_sales: '#FF9800',
        confirmed: '#4CAF50',
        declined: '#F44336',
        cancelled: '#9E9E9E',
        completed: '#2196F3',
      }
      return colorMap[status?.toLowerCase()] || '#757575'
    },

    getStatusColorForModal(status: string): string {
      const colorMap: Record<string, string> = {
        pending: 'warning',
        provision_sales: 'warning',
        confirmed: 'success',
        declined: 'danger',
        cancelled: 'danger',
        completed: 'primary',
      }
      return colorMap[status?.toLowerCase()] || 'default'
    },

    async loadCalendarEvents() {
      console.log('Loading calendar events from API...')
      this.loadingData = true

      try {
        const response = await this.getCalendarStats()
        console.log('API response:', response)

        if (response && response.status === 200 && Array.isArray(response.data)) {
          console.log('API data received:', response.data)

          if (response.data.length > 0) {
            const apiEvents = this.transformApiEvents(response.data)
            console.log('Transformed API events:', apiEvents)

            this.calendarOptions.events = apiEvents
            this.calendarEvents = apiEvents
            this.calendarKey++

            console.log(`Loaded ${apiEvents.length} events successfully`)
          } else {
            console.warn('No events found in API response')
            // Use test data if API returns empty
            // this.loadTestEvents()
          }
        } else {
          console.error('Invalid API response:', response)
          // Use test data if API fails
          // this.loadTestEvents()
        }
      } catch (error) {
        console.error('Error loading calendar events:', error)
        // Use test data if API fails
        // this.loadTestEvents()
      } finally {
        this.loadingData = false
      }
    },

    // loadTestEvents() {
    //   console.log('Loading test events as fallback...')
    //   const testEvents = this.createTestEventsFromYourData()
    //   this.calendarOptions.events = testEvents
    //   this.calendarEvents = testEvents
    //   this.calendarKey++
    // },

    // createTestEventsFromYourData(): CalendarEvent[] {
    //   const events: CalendarEvent[] = [
    //     {
    //       id: '3',
    //       title: 'David Nogoreda (4d)',
    //       start: '2025-12-02',
    //       end: '2025-12-05',
    //       allDay: true,
    //       backgroundColor: this.getStatusColor('confirmed'),
    //       textColor: '#FFFFFF',
    //       borderColor: this.getStatusColor('confirmed'),
    //       extendedProps: {
    //         status: 'confirmed',
    //         species: [{
    //           id: 1,
    //           species: {
    //             name: 'Elephant',
    //             scientific_name: 'Loxodonta africana',
    //             description: 'Game animal'
    //           },
    //           quantity: 1
    //         }],
    //         preference: {
    //           start_date: '2025-12-02',
    //           end_date: '2025-12-05',
    //           no_of_observers: 0,
    //           no_of_days: 10,
    //           no_of_companions: 1,
    //           preferred_date: '2025-12-02'
    //         },
    //         contacts: [{
    //           id: 1,
    //           contact: 'contact@example.com'
    //         }],
    //         proposed_package: {
    //           sales_package: {
    //             name: 'Standard Package'
    //           },
    //           price_list_type: {
    //             hunting_type: {
    //               name: 'Big Game Hunting'
    //             }
    //           }
    //         },
    //         areas: [{
    //           id: 1,
    //           area: {
    //             name: 'Game Reserve',
    //             description: 'Hunting area',
    //             location: {
    //               name: 'Tanzania'
    //             }
    //           }
    //         }]
    //       }
    //     },
    //     {
    //       id: '25',
    //       title: 'John Michael Howard (14d)',
    //       start: '2024-07-24',
    //       end: '2024-08-06',
    //       allDay: true,
    //       backgroundColor: this.getStatusColor('confirmed'),
    //       textColor: '#FFFFFF',
    //       borderColor: this.getStatusColor('confirmed'),
    //       extendedProps: {
    //         status: 'confirmed'
    //       }
    //     },
    //     {
    //       id: '10',
    //       title: 'Joshua Bowmar (11d)',
    //       start: '2024-08-02',
    //       end: '2024-08-12',
    //       allDay: true,
    //       backgroundColor: this.getStatusColor('confirmed'),
    //       textColor: '#FFFFFF',
    //       borderColor: this.getStatusColor('confirmed'),
    //       extendedProps: {
    //         status: 'confirmed'
    //       }
    //     },
    //     {
    //       id: '29',
    //       title: 'SESILIA EDMUNDY MLELWA (5d)',
    //       start: '2025-12-07',
    //       end: '2025-12-11',
    //       allDay: true,
    //       backgroundColor: this.getStatusColor('confirmed'),
    //       textColor: '#FFFFFF',
    //       borderColor: this.getStatusColor('confirmed'),
    //       extendedProps: {
    //         status: 'confirmed'
    //       }
    //     },
    //     {
    //       id: '28',
    //       title: 'Naomi Elia Myoka (14d)',
    //       start: '2025-12-11',
    //       end: '2025-12-24',
    //       allDay: true,
    //       backgroundColor: this.getStatusColor('confirmed'),
    //       textColor: '#FFFFFF',
    //       borderColor: this.getStatusColor('confirmed'),
    //       extendedProps: {
    //         status: 'confirmed'
    //       }
    //     },
    //     {
    //       id: '27',
    //       title: 'Amani Mponda (5d)',
    //       start: '2025-11-30',
    //       end: '2025-12-04',
    //       allDay: true,
    //       backgroundColor: this.getStatusColor('confirmed'),
    //       textColor: '#FFFFFF',
    //       borderColor: this.getStatusColor('confirmed'),
    //       extendedProps: {
    //         status: 'confirmed'
    //       }
    //     }
    //   ]

    //   console.log('Created test events:', events)
    //   return events
    // },

    transformApiEvents(apiData: any[]): CalendarEvent[] {
      const events: CalendarEvent[] = []

      apiData.forEach((item: any, index: number) => {
        try {
          const salesInquiry = item.sales_inquiry || {}
          const entity = salesInquiry.entity || {}
          const preference = salesInquiry.preference || {}

          // Parse dates
          const startDate = this.parseApiDate(preference.start_date)
          const endDate = this.parseApiDate(preference.end_date)

          if (!startDate) {
            console.warn(`Skipping event ${item.id} - invalid start date:`, preference.start_date)
            return
          }

          // Format dates for FullCalendar
          const eventStart = startDate.toISOString().split('T')[0]
          const eventEnd = endDate ? endDate.toISOString().split('T')[0] : eventStart

          // Calculate duration
          const duration = this.calculateDuration(eventStart, eventEnd)

          // Create event
          const event: CalendarEvent = {
            id: item.id?.toString() || `event-${Date.now()}-${index}`,
            title: `${entity.full_name || 'Unknown Client'} (${duration}d)`,
            start: eventStart,
            end: eventEnd,
            allDay: true,
            backgroundColor: this.getStatusColor(item.status?.status || ''),
            textColor: '#FFFFFF',
            borderColor: this.getStatusColor(item.status?.status || ''),
            extendedProps: {
              species: salesInquiry.preferred_species || [],
              preference: preference,
              contacts: entity.contacts || [],
              proposed_package: item.proposed_package || {},
              areas: salesInquiry.area || [],
              status: item.status?.status || 'unknown',
            },
          }

          events.push(event)
          console.log(`Added event: ${event.title} from ${eventStart} to ${eventEnd}`)
        } catch (error) {
          console.error('Error transforming event:', item.id, error)
        }
      })

      // Sort by start date
      return events.sort((a, b) => {
        return new Date(a.start as string).getTime() - new Date(b.start as string).getTime()
      })
    },

    parseApiDate(dateString: string | undefined): Date | null {
      if (!dateString) return null

      try {
        // Clean the date string
        let cleanDate = dateString.trim()

        // Handle MySQL datetime format
        if (cleanDate.includes(' ')) {
          cleanDate = cleanDate.split(' ')[0]
        }

        // Parse date
        const date = new Date(cleanDate + 'T00:00:00')

        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateString)
          return null
        }

        return date
      } catch (error) {
        console.error('Error parsing date:', dateString, error)
        return null
      }
    },
  },
})
</script>

<style scoped>
.calendar-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  overflow-y: auto;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-text {
  flex: 1;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.card-description {
  margin: 5px 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.calendar-container {
  margin-top: 20px;
  height: 70vh;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-wrap: wrap;
  gap: 15px;
}

.calendar-header h2 {
  margin: 0;
  color: #2c3e50;
}

.legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.confirmed {
  background-color: #4caf50;
}

.legend-color.provision {
  background-color: #ff9800;
}

.legend-color.pending {
  background-color: #ffc107;
}

/* FullCalendar Custom Styles */
:deep(.fc) {
  font-family: inherit;
  height: auto !important;
  min-height: 2000px;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2px;
  white-space: normal;
  word-break: break-word;
}

:deep(.fc-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

:deep(.fc-day-today) {
  background-color: rgba(52, 152, 219, 0.1) !important;
}

:deep(.fc-daygrid-day-frame) {
  min-height: 100px;
}

:deep(.fc-col-header-cell) {
  background-color: #f8f9fa;
  padding: 10px 0;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
}

/* 2x2 Month Layout */
:deep(.fc-view) {
  background: white;
  border-radius: 8px;
  overflow: visible !important;
  height: auto !important;
  min-height: 2000px;
}

:deep(.fc-view-harness) {
  height: auto !important;
  min-height: 2000px !important;
}

:deep(.fc-scroller) {
  overflow: visible !important;
  height: auto !important;
}

:deep(.fc-multimonth-sync) {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  gap: 20px !important;
  padding: 20px !important;
  height: auto !important;
  min-height: 2000px !important;
}

:deep(.fc-multimonth-month) {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 0 10px 20px 10px !important;
  background: #fafafa;
  min-height: 380px;
  min-width: 45% !important;
  max-width: 48% !important;
  flex: 1 1 45% !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.fc-multimonth-title) {
  background-color: #2c3e50;
  color: white;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px 8px 0 0;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

@media (max-width: 1200px) {
  :deep(.fc-multimonth-month) {
    min-width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 100% !important;
  }
}

/* Modal styles */
.modal-header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.modal-title {
  margin: 0;
  flex: 1;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 5px;
}

.event-summary {
  margin-bottom: 20px;
}

.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item strong {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 4px;
}

.info-item span {
  font-size: 1.1rem;
  font-weight: 600;
}

.details-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.pref-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.species-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.species-card {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.species-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.scientific-name {
  font-style: italic;
  color: #666;
  margin: 5px 0;
  font-size: 0.9rem;
}

.area-info {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
