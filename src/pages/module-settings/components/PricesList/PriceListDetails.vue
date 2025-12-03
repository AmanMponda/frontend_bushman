<template>
  <VaSkeletonGroup v-if="cardStore.loading || !priceListItem || !priceListItem.sales_package">
    <VaSkeleton class="mb-4" height="160px" variant="squared" />
    <VaSkeleton class="mb-4" height="160px" variant="squared" />
    <VaSkeleton height="360px" variant="squared" />
  </VaSkeletonGroup>

  <div v-else class="price-list-details">
    <!-- Header Section -->
    <VaCard class="mb-6" stripe stripe-color="primary">
      <VaCardContent>
        <div class="text-center">
          <h1 class="va-h3 mb-2">{{ priceListItem.sales_package?.name }}</h1>
          <div class="flex justify-center items-center gap-4 mb-3">
            <VaChip color="primary" size="large">
              <VaIcon name="calendar_month" class="mr-1" />
              {{ formatDate(priceListItem.price_list_type?.price_list?.start_date) }} -
              {{ formatDate(priceListItem.price_list_type?.price_list?.end_date) }}
            </VaChip>
            <VaChip v-if="priceListItem.price_list_type?.is_active" color="success" size="large">
              <VaIcon name="check_circle" class="mr-1" />
              Active
            </VaChip>
            <VaChip v-else color="danger" size="large">
              <VaIcon name="cancel" class="mr-1" />
              Inactive
            </VaChip>
          </div>
          <p class="text-lg text-secondary">
            <VaIcon name="location_on" size="small" />
            {{ priceListItem.sales_package?.area?.name }} ({{ priceListItem.sales_package?.area?.description }})
          </p>
          <!-- Download PDF Button -->
          <div class="mt-4">
            <VaButton v-if="pdfData" color="primary" icon="download" @click="downloadPriceListPdf">
              Download PDF
            </VaButton>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Package Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <VaCard stripe stripe-color="primary">
        <VaCardContent class="text-center">
          <VaIcon name="attach_money" size="large" color="primary" class="mb-2" />
          <div class="text-3xl font-bold">
            {{ priceListItem.price_list_type.currency.symbol }}{{ formatAmount(priceListItem.price_list_type.amount) }}
          </div>
          <div class="text-sm text-secondary mt-1">Base Amount</div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe stripe-color="success">
        <VaCardContent class="text-center">
          <VaIcon name="schedule" size="large" color="success" class="mb-2" />
          <div class="text-3xl font-bold">{{ priceListItem.price_list_type.duration }}</div>
          <div class="text-sm text-secondary mt-1">Days Duration</div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe stripe-color="warning">
        <VaCardContent class="text-center">
          <VaIcon name="verified" size="large" color="warning" class="mb-2" />
          <div class="text-lg font-bold">{{ priceListItem.sales_package.regulatory_package?.name }}</div>
          <div class="text-sm text-secondary mt-1">License Type</div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe stripe-color="info">
        <VaCardContent class="text-center">
          <VaIcon name="category" size="large" color="info" class="mb-2" />
          <div class="text-lg font-bold">{{ priceListItem.price_list_type.hunting_type.name }}</div>
          <div class="text-sm text-secondary mt-1">Hunting Type</div>
        </VaCardContent>
      </VaCard>
    </div>

    <!-- Species Section -->
    <VaCard class="mb-6" stripe stripe-color="success">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="pets" />
        Available Species ({{ speciesList.length }})
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <VaCard
            v-for="species in speciesList"
            :key="species.id"
            class="species-card"
            :color="species.quantity > 0 ? '#f0f9ff' : '#fef2f2'"
          >
            <VaCardContent>
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="font-semibold text-base">{{ getSpeciesName(species) }}</div>
                  <div class="text-sm text-secondary italic">{{ getSpeciesScientificName(species) }}</div>
                </div>
                <VaBadge :color="species.quantity > 0 ? 'success' : 'danger'" class="ml-2">
                  Qty: {{ species.quantity }}
                </VaBadge>
              </div>
            </VaCardContent>
          </VaCard>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Trophy Fees Section -->
    <VaCard class="mb-6" stripe stripe-color="warning">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="military_tech" />
        Trophy Fees ({{ priceListItem.price_list_type.currency.name }})
      </VaCardTitle>
      <VaCardContent>
        <div v-if="priceListItem.trophy_fees && priceListItem.trophy_fees.length > 0">
          <div class="va-table-responsive">
            <table class="va-table va-table--hoverable w-full">
              <thead>
                <tr>
                  <th class="text-left">Species</th>
                  <th class="text-left">Scientific Name</th>
                  <th class="text-center">Sequence</th>
                  <th class="text-right">Price ({{ priceListItem.price_list_type.currency.symbol }})</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fee in priceListItem.trophy_fees" :key="fee.id">
                  <td class="font-semibold">{{ fee.species.name }}</td>
                  <td class="text-secondary italic">{{ fee.species.scientific_name }}</td>
                  <td class="text-center">
                    <VaBadge :text="getSequenceLabel(fee.sequence_order)" color="primary" />
                  </td>
                  <td class="text-right font-bold text-lg">
                    {{ priceListItem.price_list_type.currency.symbol }}{{ formatAmount(fee.price_usd) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <VaAlert v-else color="info" border="top"> No trophy fees available for this package </VaAlert>
      </VaCardContent>
    </VaCard>

    <!-- Upgrade Fees Section -->
    <VaCard
      v-if="priceListItem.upgrade_fees && priceListItem.upgrade_fees.length > 0"
      class="mb-6"
      stripe
      stripe-color="warning"
    >
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="upgrade" />
        Upgrade Fees
      </VaCardTitle>
      <VaCardContent>
        <div class="va-table-responsive">
          <table class="va-table va-table--hoverable w-full">
            <thead>
              <tr>
                <th class="text-left">Species</th>
                <th class="text-right">Amount</th>
                <th class="text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fee in priceListItem.upgrade_fees" :key="fee.id">
                <td class="font-semibold">{{ fee.species_name }}</td>
                <td class="text-right font-bold text-lg">{{ fee.currency_symbol }}{{ formatAmount(fee.amount) }}</td>
                <td class="text-secondary">{{ fee.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Safari Extras & Additional Costs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Safari Extras -->
      <VaCard stripe stripe-color="info">
        <VaCardTitle class="flex items-center gap-2">
          <VaIcon name="add_circle" />
          Safari Extras
        </VaCardTitle>
        <VaCardContent>
          <div class="space-y-3">
            <!-- Observer -->
            <div v-if="priceListItem.observer && priceListItem.observer.length > 0" class="p-4 rounded-lg bg-gray-50">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-semibold text-base">Observer</div>
                  <div class="text-sm text-secondary">Observer cost</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-lg">
                    {{ priceListItem.price_list_type.currency.symbol }}{{ priceListItem.observer[0]?.amount }}
                  </div>
                  <div class="text-xs text-secondary">per day / person</div>
                </div>
              </div>
            </div>

            <!-- Other Extras -->
            <div v-for="extra in priceListItem.safari_extras" :key="extra.id" class="p-4 rounded-lg bg-gray-50">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-semibold text-base capitalize">{{ extra.name }}</div>
                  <div class="text-sm text-secondary">{{ extra.description }}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-lg">{{ extra.currency.symbol }}{{ extra.amount }}</div>
                  <div class="text-xs text-secondary">{{ formatChargesPer(extra.charges_per) }}</div>
                </div>
              </div>
            </div>
          </div>
        </VaCardContent>
      </VaCard>

      <!-- Companion Hunter Costs -->
      <VaCard stripe stripe-color="success">
        <VaCardTitle class="flex items-center gap-2">
          <VaIcon name="groups" />
          Companion Hunter Costs
        </VaCardTitle>
        <VaCardContent>
          <div class="space-y-4">
            <!-- Companion Hunter -->
            <div v-if="companionHunterCosts && companionHunterCosts.length > 0">
              <div class="text-sm font-semibold text-secondary mb-2">Companion Hunter</div>
              <div
                v-for="companion in companionHunterCosts"
                :key="companion.id"
                class="p-4 rounded-lg bg-green-50 mb-2"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-base">Days</span>
                  <span class="font-bold text-xl">{{ companion.days }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-base">Rate</span>
                  <span class="font-bold text-xl"> {{ currencySymbol }}{{ companion.amount }} </span>
                </div>
              </div>
            </div>
            <VaAlert v-else color="info" border="top"> No companion hunter costs available </VaAlert>
          </div>
        </VaCardContent>
      </VaCard>
    </div>

    <!-- Important Notes -->
    <VaCard class="mb-6" stripe stripe-color="danger">
      <VaCardContent>
        <VaAlert color="warning" border="left" class="mb-3">
          <template #title>
            <div class="flex items-center gap-2">
              <VaIcon name="warning" />
              <span class="font-bold">Important Information</span>
            </div>
          </template>
          All hunts confirmation is subject to quota availability. Other safari packages are available on request and
          can be customized depending on client requirements.
        </VaAlert>

        <VaAlert v-if="hasUpgradeFees" color="info" border="left">
          <template #title>
            <div class="flex items-center gap-2">
              <VaIcon name="info" />
              <span class="font-bold">Upgrade Fees</span>
            </div>
          </template>
          If additional trophies beyond the standard package are taken, upgrade fees may apply (plus trophy fees).
        </VaAlert>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePaymentCardsStore } from '../../../../stores/payment-cards'
import { format } from 'date-fns'
import downloadPdf from '../../../../utils/pdfDownloader'

export default defineComponent({
  components: {
    // PriceListQuota,
    // PriceListByHuntingType,
    // PriceListPackagesDetails,
    // PricesSpeciesList,
    // ObComCosts,
    // AdditionCharges,
  },

  props: {
    priceListItem: {
      type: Object,
      required: true,
    },
    pdfData: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      cardStore: usePaymentCardsStore(),
      format,
    }
  },
  computed: {
    loading() {
      return this.cardStore.loading
    },
    hasUpgradeFees() {
      // Check if there are upgrade fees from the API
      return this.priceListItem.upgrade_fees && this.priceListItem.upgrade_fees.length > 0
    },
    // Support both old (sales_package.species) and new (species) API structures
    speciesList() {
      // New structure: species array directly on priceListItem
      if (this.priceListItem.species && Array.isArray(this.priceListItem.species)) {
        return this.priceListItem.species
      }
      // Old structure: nested under sales_package.species
      return this.priceListItem.sales_package?.species || []
    },
    // Support both old (componions_hunter) and new (companion_hunter_costs) API structures
    companionHunterCosts() {
      // New structure: companion_hunter_costs array
      if (this.priceListItem.companion_hunter_costs && Array.isArray(this.priceListItem.companion_hunter_costs)) {
        return this.priceListItem.companion_hunter_costs
      }
      // Old structure: componions_hunter
      return this.priceListItem.componions_hunter || []
    },
    // Get currency symbol from various sources
    currencySymbol() {
      return this.priceListItem.price_list_type?.currency?.symbol || this.priceListItem.currency?.symbol || '$'
    },
  },
  mounted() {
    this.cardStore.load()
  },
  methods: {
    // Format date safely
    formatDate(dateStr: string | null | undefined) {
      if (!dateStr) return 'N/A'
      try {
        return this.format(dateStr, 'MMM yyyy')
      } catch {
        return dateStr
      }
    },
    // Get species name - supports both old nested structure and new flat structure
    getSpeciesName(species: any) {
      // New structure: name directly on species object
      if (species.name) {
        return species.name
      }
      // Old structure: nested species.species.name
      return species.species?.name || 'Unknown'
    },
    // Get species scientific name - supports both structures
    getSpeciesScientificName(species: any) {
      // New structure: scientific_name directly on species object
      if (species.scientific_name) {
        return species.scientific_name
      }
      // Old structure: nested species.species.scientific_name
      return species.species?.scientific_name || ''
    },
    formatChargesPer(chargesPer: string) {
      if (!chargesPer) return ''
      // Convert "PER_DAY" to "per day", "PER_ROUND" to "per round", etc.
      return chargesPer.toLowerCase().replace('_', ' ')
    },
    formatAmount(amount: string | number | null | undefined) {
      if (amount === null || amount === undefined) return 'N/A'
      const num = typeof amount === 'string' ? parseFloat(amount) : amount
      if (isNaN(num)) return 'N/A'
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    getSequenceLabel(sequence: number) {
      const suffixes = ['th', 'st', 'nd', 'rd']
      const value = sequence % 100
      const suffix = suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]
      return `${sequence}${suffix}`
    },
    async downloadPriceListPdf() {
      if (!this.pdfData) {
        console.warn('No PDF data available')
        return
      }
      try {
        const packageName = this.priceListItem?.sales_package?.name || 'price-list'
        const fileName = `${packageName.replace(/\s+/g, '-')}-${Date.now()}.pdf`
        await downloadPdf(this.pdfData, fileName)
      } catch (err) {
        console.error('Failed to download PDF:', err)
      }
    },
  },
})
</script>

<style scoped>
.price-list-details {
  max-width: 1400px;
  margin: 0 auto;
}

.species-card {
  transition: all 0.3s ease;
}

.species-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.va-table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.va-table tbody tr {
  transition: background-color 0.2s ease;
}

.va-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
