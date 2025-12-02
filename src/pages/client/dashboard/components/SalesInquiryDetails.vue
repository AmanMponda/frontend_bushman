<template>
  <div class="sales-inquiry-details">
    <!-- Header Section -->
    <VaCard class="mb-6" stripe stripe-color="primary">
      <VaCardContent>
        <div class="text-center">
          <h1 class="va-h3 mb-2">{{ item?.code }}</h1>
          <div class="flex justify-center items-center gap-4 mb-3">
            <VaChip :color="item?.inquiry_type === 'standard' ? 'success' : 'info'" size="large">
              <VaIcon :name="item?.inquiry_type === 'standard' ? 'inventory_2' : 'tune'" class="mr-1" />
              {{ item?.inquiry_type === 'standard' ? 'Standard Package' : 'Custom Package' }}
            </VaChip>
            <VaChip color="primary" size="large">
              <VaIcon name="calendar_month" class="mr-1" />
              {{ item?.season?.name }}
            </VaChip>
          </div>
          <p class="text-secondary mb-3">
            <VaIcon name="event" size="small" />
            Created: {{ formatDate(item?.create_date) }}
          </p>
          <VaButton color="secondary" round icon="download" @click="downloadInquiryPdf"> Download PDF </VaButton>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <VaCard stripe stripe-color="primary">
        <VaCardContent class="text-center">
          <VaIcon name="schedule" size="large" color="primary" class="mb-2" />
          <div class="text-3xl font-bold">{{ item?.formatted_preferences?.no_of_days || 'N/A' }}</div>
          <div class="text-sm text-secondary mt-1">Days Duration</div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe stripe-color="success">
        <VaCardContent class="text-center">
          <VaIcon name="person" size="large" color="success" class="mb-2" />
          <div class="text-3xl font-bold">{{ item?.formatted_preferences?.no_of_hunters || 0 }}</div>
          <div class="text-sm text-secondary mt-1">Hunters</div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe stripe-color="warning">
        <VaCardContent class="text-center">
          <VaIcon name="groups" size="large" color="warning" class="mb-2" />
          <div class="text-3xl font-bold">{{ item?.formatted_preferences?.no_of_companions || 0 }}</div>
          <div class="text-sm text-secondary mt-1">Companions</div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe stripe-color="info">
        <VaCardContent class="text-center">
          <VaIcon name="visibility" size="large" color="info" class="mb-2" />
          <div class="text-3xl font-bold">{{ item?.formatted_preferences?.no_of_observers || 0 }}</div>
          <div class="text-sm text-secondary mt-1">Observers</div>
        </VaCardContent>
      </VaCard>
    </div>

    <!-- Client Information Section -->
    <VaCard class="mb-6" stripe stripe-color="success">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="person" />
        Client Information
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-sm text-secondary mb-1">Full Name</div>
            <div class="text-lg font-semibold">{{ safeString(item?.entity?.full_name) }}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-1">Nationality</div>
            <div class="text-lg font-semibold">{{ safeString(item?.entity?.nationality?.name) }}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-1">Country</div>
            <div class="text-lg font-semibold">{{ safeString(item?.entity?.country?.name) }}</div>
          </div>
        </div>

        <VaDivider class="my-4" />

        <div class="text-sm text-secondary mb-2">Contacts</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(contact, index) in safeArray(item?.entity?.contacts)"
            :key="index"
            class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
          >
            <VaIcon :name="getContactIcon(contact.contact_type?.name)" color="primary" />
            <span class="font-medium">{{ contact.contact }}</span>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Hunting Preferences Section -->
    <VaCard class="mb-6" stripe stripe-color="warning">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="event" />
        Hunting Preferences
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div class="text-sm text-secondary mb-1">Preferred Date</div>
            <div class="text-lg font-semibold">{{ formatDate(item?.formatted_preferences?.preferred_date) }}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-1">Start Date</div>
            <div class="text-lg font-semibold">{{ formatDate(item?.formatted_preferences?.start_date) }}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-1">End Date</div>
            <div class="text-lg font-semibold">{{ formatDate(item?.formatted_preferences?.end_date) }}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-1">Duration</div>
            <div class="text-lg font-semibold">{{ item?.formatted_preferences?.no_of_days || 'N/A' }} days</div>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Standard Package Details -->
    <VaCard
      v-if="item?.inquiry_type === 'standard' && item?.package_details"
      class="mb-6"
      stripe
      stripe-color="success"
    >
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="inventory_2" />
        Standard Package Details
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <VaCard stripe stripe-color="primary" class="col-span-1 md:col-span-2">
            <VaCardContent class="text-center">
              <VaIcon name="attach_money" size="large" color="primary" class="mb-2" />
              <div class="text-3xl font-bold text-primary">
                {{ item?.package_details?.currency_name }} {{ formatCurrency(item?.package_details?.amount) }}
              </div>
              <div class="text-sm text-secondary mt-1">Package Amount</div>
            </VaCardContent>
          </VaCard>
          <VaCard stripe stripe-color="info">
            <VaCardContent class="text-center">
              <VaIcon name="schedule" size="large" color="info" class="mb-2" />
              <div class="text-2xl font-bold">{{ item?.package_details?.duration }}</div>
              <div class="text-sm text-secondary mt-1">Days</div>
            </VaCardContent>
          </VaCard>
          <VaCard stripe stripe-color="warning">
            <VaCardContent class="text-center">
              <VaIcon name="category" size="large" color="warning" class="mb-2" />
              <div class="text-lg font-bold">{{ item?.package_details?.hunting_type_name }}</div>
              <div class="text-sm text-secondary mt-1">Hunting Type</div>
            </VaCardContent>
          </VaCard>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="text-sm text-secondary mb-1">Hunting Area</div>
            <div class="text-lg font-semibold">{{ item?.package_details?.area_name }}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-1">Package Period</div>
            <div class="text-lg font-semibold">
              {{ formatDate(item?.package_details?.start_date) }} - {{ formatDate(item?.package_details?.end_date) }}
            </div>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Custom Package Details -->
    <VaCard v-if="item?.inquiry_type === 'custom' && item?.custom_details" class="mb-6" stripe stripe-color="info">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="tune" />
        Custom Package Details
      </VaCardTitle>
      <VaCardContent>
        <!-- Custom Areas -->
        <div v-if="safeArray(item?.custom_details?.areas).length > 0" class="mb-4">
          <div class="text-sm text-secondary mb-2">Hunting Areas</div>
          <div class="flex flex-wrap gap-2">
            <VaChip v-for="(area, index) in item?.custom_details?.areas" :key="index" color="info" size="large">
              <VaIcon name="location_on" class="mr-1" />
              {{ area.area_name }}
            </VaChip>
          </div>
        </div>

        <!-- Custom Species -->
        <div v-if="safeArray(item?.custom_details?.species).length > 0">
          <div class="text-sm text-secondary mb-2">Requested Species</div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <VaCard v-for="(species, index) in item?.custom_details?.species" :key="index" color="#f0f9ff">
              <VaCardContent>
                <div class="flex justify-between items-center">
                  <div class="font-semibold">{{ species.species_name }}</div>
                  <VaBadge color="success">Qty: {{ species.quantity }}</VaBadge>
                </div>
              </VaCardContent>
            </VaCard>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Package Species Section -->
    <VaCard v-if="safeArray(item?.species).length > 0" class="mb-6" stripe stripe-color="warning">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="pets" />
        {{ item?.inquiry_type === 'custom' ? 'Additional Species' : 'Package Species' }}
        ({{ item?.species?.length || 0 }})
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <VaCard v-for="(s, index) in item?.species" :key="index" :color="s.quantity > 0 ? '#f0f9ff' : '#fef2f2'">
            <VaCardContent>
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="font-semibold text-base">{{ s.species?.name }}</div>
                  <div class="text-sm text-secondary italic">{{ s.species?.scientific_name }}</div>
                </div>
                <VaBadge :color="s.quantity > 0 ? 'success' : 'danger'" class="ml-2"> Qty: {{ s.quantity }} </VaBadge>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Observers Section -->
    <VaCard v-if="observers && observers.length > 0" class="mb-6" stripe stripe-color="info">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="visibility" />
        Observers ({{ observers.length }})
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VaCard v-for="(observer, index) in observers" :key="index" color="#f0f9ff">
            <VaCardContent>
              <div class="font-semibold text-lg mb-2">{{ observer.full_name }}</div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-secondary">Nationality:</span>
                  <span class="ml-1 font-medium">{{ observer.nationality?.name || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-secondary">Country:</span>
                  <span class="ml-1 font-medium">{{ observer.country?.name || 'N/A' }}</span>
                </div>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Companions Section -->
    <VaCard v-if="companions && companions.length > 0" class="mb-6" stripe stripe-color="success">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="groups" />
        Companions ({{ companions.length }})
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VaCard v-for="(companion, index) in companions" :key="index" color="#f0fdf4">
            <VaCardContent>
              <div class="font-semibold text-lg mb-2">{{ companion.full_name }}</div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-secondary">Nationality:</span>
                  <span class="ml-1 font-medium">{{ companion.nationality?.name || 'N/A' }}</span>
                </div>
                <div>
                  <span class="text-secondary">Country:</span>
                  <span class="ml-1 font-medium">{{ companion.country?.name || 'N/A' }}</span>
                </div>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Safari Extras Section -->
    <VaCard v-if="clientSafariExtras && clientSafariExtras.length > 0" class="mb-6" stripe stripe-color="primary">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="add_circle" />
        Safari Extras ({{ clientSafariExtras.length }})
      </VaCardTitle>
      <VaCardContent>
        <div class="va-table-responsive">
          <table class="va-table va-table--hoverable w-full">
            <thead>
              <tr>
                <th class="text-left">Service</th>
                <th class="text-left">Description</th>
                <th class="text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(extra, index) in clientSafariExtras" :key="index">
                <td class="font-semibold">{{ extra.safari_extra?.name || extra.name }}</td>
                <td class="text-secondary">{{ extra.safari_extra?.description || extra.description || 'N/A' }}</td>
                <td class="text-right">
                  <VaBadge color="primary">{{ extra.quantity || 1 }}</VaBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Accommodations Section -->
    <VaCard v-if="accommodations && accommodations.length > 0" class="mb-6" stripe stripe-color="warning">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="hotel" />
        Accommodations ({{ accommodations.length }})
      </VaCardTitle>
      <VaCardContent>
        <div class="va-table-responsive">
          <table class="va-table va-table--hoverable w-full">
            <thead>
              <tr>
                <th class="text-left">Accommodation</th>
                <th class="text-left">Type</th>
                <th class="text-center">Check-in</th>
                <th class="text-center">Check-out</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(acc, index) in accommodations" :key="index">
                <td class="font-semibold">{{ acc.name || acc.accommodation_type?.name || 'N/A' }}</td>
                <td class="text-secondary">{{ acc.accommodation_type?.name || 'N/A' }}</td>
                <td class="text-center">{{ formatDate(acc.check_in_date) }}</td>
                <td class="text-center">{{ formatDate(acc.check_out_date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Charters Section -->
    <VaCard v-if="chartersPrices && chartersPrices.length > 0" class="mb-6" stripe stripe-color="info">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="flight" />
        Charter Costs ({{ chartersPrices.length }})
      </VaCardTitle>
      <VaCardContent>
        <div class="va-table-responsive">
          <table class="va-table va-table--hoverable w-full">
            <thead>
              <tr>
                <th class="text-left">Charter</th>
                <th class="text-left">Description</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(charter, index) in chartersPrices" :key="index">
                <td class="font-semibold">{{ charter.name || charter.charter?.name || 'Charter ' + (index + 1) }}</td>
                <td class="text-secondary">{{ charter.description || 'N/A' }}</td>
                <td class="text-right font-bold">{{ formatCurrency(charter.amount || charter.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { mapState, mapActions } from 'pinia'
import { useToast } from 'vuestic-ui'

export default defineComponent({
  name: 'SalesInquiryDetails',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const { init: notify } = useToast()
    return { notify }
  },

  computed: {
    ...mapState(useSalesInquiriesStore, [
      'observers',
      'companions',
      'clientSafariExtras',
      'accommodations',
      'chartersPrices',
    ]),
  },

  mounted() {
    this.getObservers(this.item.id)
    this.getCompanions(this.item.id)
    this.getClienSafariExtras(this.item.id)
    this.getAccommodation(this.item.id)
    this.getChartersPrice(this.item.id)
  },

  methods: {
    ...mapActions(useSalesInquiriesStore, [
      'getObservers',
      'getCompanions',
      'getClienSafariExtras',
      'getAccommodation',
      'getChartersPrice',
    ]),

    async downloadInquiryPdf() {
      const inquiryId = this.item?.id
      if (!inquiryId) return

      try {
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}sales/sales-inquiries/${inquiryId}/pdf`, {
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()

        if (data.success && data.pdf) {
          // Decode base64 PDF and download
          const byteCharacters = atob(data.pdf)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })

          // Create download link
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `inquiry-${this.item?.code || inquiryId}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          this.notify({
            message: 'PDF downloaded successfully',
            color: 'success',
          })
        } else {
          this.notify({
            message: 'Failed to generate PDF',
            color: 'danger',
          })
        }
      } catch (error) {
        console.error('Error downloading PDF:', error)
        this.notify({
          message: 'Error downloading PDF',
          color: 'danger',
        })
      }
    },

    formatDate(dateString: string | number | Date) {
      return dateString ? new Date(dateString).toLocaleDateString() : 'Not provided'
    },

    formatCurrency(amount: any) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(amount) || 0)
    },

    getContactIcon(contactType: string) {
      const icons: any = {
        email: 'email',
        phone_number: 'phone',
        phone: 'phone',
        address: 'home',
      }
      return icons[contactType] || 'info'
    },

    safeArray(arr: any) {
      return arr || []
    },

    safeString(str: any, fallback = 'Not provided') {
      return str || fallback
    },
  },
})
</script>

<style lang="scss" scoped>
.sales-inquiry-details {
  padding: 1rem;
}

.text-secondary {
  color: #6b7280;
}
</style>
