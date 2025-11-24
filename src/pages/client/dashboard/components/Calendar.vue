<template>
  <VaInnerLoading :loading="laodingData">
    <VaCard :disabled="laodingData">
      <FullCalendar :options="calendarOptions" />
    </VaCard>
  </VaInnerLoading>
  <VaModal v-model="showModal" :overlay="false" no-outside-dismiss close-button>
    <template #header>
      <div style="display: flex; align-items: center">
        <h3 class="modal-header" style="margin-right: 10px">Sales For {{ event?.title ?? 'N/A' }}</h3>
        <VaBadge
          :text="event?.extendedProps?.status ?? 'N/A'"
          :color="getStatusColorForModal(event?.extendedProps?.status)"
        />
      </div>
    </template>

    <template #default>
      <div class="modal-body">
        <div class="event-info">
          <p><strong>Client:</strong> {{ event?.title ?? 'N/A' }}</p>
          <p><strong>Start date:</strong> {{ event?.start ? formatDateTime(event.start) : 'N/A' }}</p>
          <p><strong>End date:</strong> {{ event?.end ? formatDateTime(event.end) : 'N/A' }}</p>
        </div>

        <VaDivider />

        <div class="details-container">
          <h2>Details</h2>

          <h4>Preferences</h4>
          <p>
            <strong>Preferred Date:</strong>
            {{
              event?.extendedProps?.preference?.preferred_date
                ? new Date(event.extendedProps.preference.preferred_date).toLocaleDateString()
                : 'N/A'
            }}
          </p>
          <!-- <p><strong>Number of Hunters:</strong> {{ event?.extendedProps?.preference?.no_of_hunters ?? 'N/A' }}</p> -->
          <p><strong>Number of Observers:</strong> {{ event?.extendedProps?.preference?.no_of_observers ?? 'N/A' }}</p>
          <p><strong>Number of Days:</strong> {{ event?.extendedProps?.preference?.no_of_days ?? 'N/A' }}</p>
          <p>
            <strong>Number of Companions:</strong> {{ event?.extendedProps?.preference?.no_of_companions ?? 'N/A' }}
          </p>

          <VaDivider />
          <h4>Package</h4>
          <p>
            <strong>Sales Package:</strong> {{ event?.extendedProps?.proposed_package?.sales_package?.name ?? 'N/A' }}
          </p>
          <p>
            <strong>Hunting Type:</strong>
            {{ event?.extendedProps?.proposed_package?.price_list_type?.hunting_type?.name ?? 'N/A' }}
          </p>

          <h5>Species</h5>
          <table class="info-table">
            <thead>
              <tr>
                <th>Species Name</th>
                <th>Scientific Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <!-- <th>Amount</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="specie in event?.extendedProps?.species ?? []" :key="specie.id">
                <td>{{ specie.species?.name ?? 'N/A' }}</td>
                <td>{{ specie.species?.scientific_name ?? 'N/A' }}</td>
                <td>{{ specie.species?.description ?? 'N/A' }}</td>
                <td>{{ specie.quantity ?? 'N/A' }}</td>
                <!-- <td>${{ parseFloat(specie.amount).toFixed(2) }}</td> -->
              </tr>
            </tbody>
          </table>

          <VaDivider />

          <h4>Areas</h4>
          <table class="info-table">
            <thead>
              <tr>
                <th>Area Name</th>
                <th>Description</th>
                <th>Location</th>
                <th>Coordinates</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="area in event?.extendedProps?.areas ?? []" :key="area.id">
                <td>{{ area.area?.name ?? 'N/A' }}</td>
                <td>{{ area.area?.description ?? 'N/A' }}</td>
                <td>{{ area.area?.location?.name ?? 'N/A' }}</td>
                <td>
                  {{ area.area?.location?.geo_coordinates?.coordinates?.[0]?.lat ?? 'N/A' }},
                  {{ area.area?.location?.geo_coordinates?.coordinates?.[0]?.lng ?? 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>

          <VaDivider />

          <h4>Contacts</h4>
          <ul>
            <li v-for="contact in event?.extendedProps?.contacts ?? []" :key="contact.id">
              <strong>-</strong> {{ contact.contact ?? 'N/A' }}
            </li>
          </ul>

          <VaDivider />
        </div>
      </div>
    </template>
  </VaModal>
</template>

<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { mapActions } from 'pinia'
import { format } from 'date-fns'
import { formatDateTime } from '../../../../services/utils'
import { useCalendarStore } from '../../../../stores/calenda-store'
import multiMonthPlugin from '@fullcalendar/multimonth'

export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, multiMonthPlugin],

        // initialView: 'dayGridMonth',
        initialView: 'multiMonthYear',

        eventClick: this.handleEventClick,
        events: [],
        selectable: false,
        clickable: true,
        weekends: true,
      } as any,
      showModal: false,
      event: null as any,
      laodingData: false,
      formatDateTime,
    }
  },
  computed: {
    // ...mapState(useCalendarStore, ['events']),
  },
  mounted() {
    this.calendarEvents()
  },
  methods: {
    ...mapActions(useCalendarStore, ['getCalendarStats']),
    handleDateClick: function (arg: any) {
      console.log('date click! ' + arg.dateStr)
    },

    // Existing methods...

    getContactType(contactTypeId: any) {
      const contactTypes: any = {
        1: 'Email',
        2: 'Phone',
        3: 'Address',
        // Add other types as necessary...
      }
      return contactTypes[contactTypeId] || 'Unknown'
    },

    handleEventClick(clickInfo: any) {
      //   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      // clickInfo.event.remove()
      this.showModal = true
      this.event = clickInfo.event
      console.log(clickInfo.event.start)
      console.log(clickInfo.event.end)
      //   }
    },

    getStatusColor(status: any) {
      switch (status) {
        case 'pending':
          return '#FFC107'
        case 'provision_sales':
          return 'gold'
        case 'confirmed':
          return 'green'
        case 'declined':
          return '#F44336'
        case 'cancelled':
          return '#9E9E9E'
        case 'completed':
          return 'black'
      }
    },

    // Existing methods...

    getStatusColorForModal(status: any) {
      switch (status) {
        case 'pending':
          return 'warning'
        case 'provision_sales':
          return 'warning' // Adjust as needed
        case 'confirmed':
          return 'success'
        case 'declined':
          return 'danger' // Corresponds to VaBadge color
        case 'cancelled':
          return 'danger' // or appropriate color
        case 'completed':
          return 'primary' // or appropriate color
        default:
          return 'default' // fallback color
      }
    },

    getTextColor(status: any) {
      switch (status) {
        case 'pending':
          return 'yellow'
        case 'provision_sales':
          return 'black'
        case 'confirmed':
          return 'white'
        case 'declined':
          return 'red'
        case 'cancelled':
          return 'white'
        case 'completed':
          return 'white'
      }
    },

    async calendarEvents() {
      try {
        this.laodingData = true
        const response = await this.getCalendarStats()
        if (response.status === 200) {
          this.laodingData = false
          this.calendarOptions.events = response.data.map((event: any) => {
            const start = format(event.sales_inquiry.preference.start_date, 'yyyy-MM-dd')
            const end = format(event.sales_inquiry.preference.end_date, 'yyyy-MM-dd')
            const from_date = formatDateTime(event.sales_inquiry.preference.start_date)
            const to_date = formatDateTime(event.sales_inquiry.preference.end_date)

            return {
              id: event.id,
              title: `${event?.sales_inquiry?.entity?.full_name} - from ${formatDateTime(start)}-${formatDateTime(
                end,
              )}`,
              start: start,
              end: end,
              backgroundColor: this.getStatusColor(event.status.status),
              textColor: this.getTextColor(event.status.status),
              extendedProps: {
                species: event?.sales_inquiry?.preferred_species,
                preference: event?.sales_inquiry?.preference,
                contacts: event?.sales_inquiry?.entity?.contacts,
                proposed_package: event?.proposed_package,
                areas: event.sales_inquiry?.area,
                status: event.status.status,
                sales_quota: event?.proposed_package?.sales_package?.sales_quota,
              },
              description: `${event?.sales_inquiry?.entity.full_name} - ${from_date} to ${to_date} `,
            }
          })
        } else {
          this.laodingData = false
          console.error('Failed to fetch calendar stats')
        }
      } catch (error) {
        this.laodingData = false
        console.error(error)
      }
    },
  },
}
</script>

<style scoped>
.modal-header {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-body {
  padding: 1rem;
}

.event-info {
  margin-bottom: 1rem;
}

.tables-container {
  margin-top: 1.5rem;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.info-table th,
.info-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.info-table th {
  background-color: #f5f5f5;
}
</style>
