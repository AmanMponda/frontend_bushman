<template>
  <VaCard>
    <VaCardTitle class="flex justify-between items-center">
      <div>Sales Confirmation</div>
      <div class="flex items-center gap-2">
        <VaInput v-model="searchText" placeholder="Search sales..." class="w-64" clearable @input="filterResults">
          <template #prependInner>
            <VaIcon name="search" />
          </template>
        </VaInput>
        <VaButton v-if="viewDetails" class="px-2 py-2" icon="arrow_back" size="small" @click="gotBack()">
          Go Back
        </VaButton>
      </div>
    </VaCardTitle>

    <VaCardContent>
      <template v-if="viewDetails">
        <SalesConfirmationClientDetails v-if="selectedItem" :sales-data="selectedItem" />
      </template>

      <template v-else>
        <!-- Loading State -->
        <div v-if="loadingresults" class="loading-container">
          <div class="table-header">
            <div class="header-cell">CLIENT</div>
            <div class="header-cell">AREA</div>
            <div class="header-cell">AIRPORT</div>
            <div class="header-cell">ARRIVAL</div>
            <div class="header-cell">CHARTER IN</div>
            <div class="header-cell">CHARTER OUT</div>
            <div class="header-cell">STATUS</div>
            <div class="header-cell">ACTIONS</div>
          </div>
          <div class="loading-message">
            <VaProgressBar indeterminate />
            <div class="loading-text">Loading sales confirmations...</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredResults.length === 0" class="no-items-container">
          <div class="table-header">
            <div class="header-cell">CLIENT</div>
            <div class="header-cell">AREA</div>
            <div class="header-cell">AIRPORT</div>
            <div class="header-cell">ARRIVAL</div>
            <div class="header-cell">CHARTER IN</div>
            <div class="header-cell">CHARTER OUT</div>
            <div class="header-cell">STATUS</div>
            <div class="header-cell">ACTIONS</div>
          </div>
          <div class="no-items-message">
            <VaIcon name="search" size="large" class="mb-4" />
            <div class="no-items-text">No sales confirmations found</div>
            <div v-if="searchText" class="no-items-subtext">No results for "{{ searchText }}"</div>
          </div>
        </div>

        <!-- Data Table -->
        <VaDataTable
          v-else
          :items="filteredResults"
          :columns="columns"
          :loading="loadingresults"
          class="sales-table"
          selectable
          @row:click="onRowClick"
        >
          <template #cell(client)="{ value, row }">
            <div class="client-cell">
              <div class="client-name">{{ value || 'N/A' }}</div>
              <div v-if="rowData(row).code" class="client-code">Code: {{ rowData(row).code }}</div>
            </div>
          </template>

          <template #cell(area)="{ value }">
            <div class="area-cell">{{ value || 'N/A' }}</div>
          </template>

          <template #cell(airport)="{ value }">
            <div class="airport-cell">{{ value || 'N/A' }}</div>
          </template>

          <template #cell(arrival)="{ value }">
            <div class="date-cell">{{ formatDate(value) }}</div>
          </template>

          <template #cell(charter_in)="{ value }">
            <div class="date-cell">{{ formatDate(value) }}</div>
          </template>

          <template #cell(charter_out)="{ value }">
            <div class="date-cell">{{ formatDate(value) }}</div>
          </template>

          <template #cell(status)="{ value }">
            <VaChip :color="getStatusColor(value)" size="small" class="status-chip">
              {{ formatStatusText(value) }}
            </VaChip>
          </template>

          <template #cell(actions)="{ row }">
            <div class="flex justify-center items-center gap-2">
              <VaButton
                plain
                color="primary"
                size="small"
                :icon="getActionIcon(rowData(row).status)"
                @click.stop="onRowClick(rowData(row))"
              >
                {{ getButtonTextBasedOnStatus(rowData(row).status) }}
              </VaButton>
              <VaButton
                v-if="rowData(row).pdf"
                plain
                icon="download"
                size="small"
                title="Download PDF"
                @click.stop="handleDownloadPdf(rowData(row).pdf as string)"
              />
            </div>
          </template>
        </VaDataTable>
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { format } from 'date-fns'
import { mapActions, mapState } from 'pinia'
import { useSalesInquiriesStore } from '../../../stores/sales-store'
import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'

// Import the pdf downloader function
import downloadPdf from '../../../utils/pdfDownloader'

interface SalesConfirmation {
  id?: string | number
  code?: string
  name?: string
  client?: string
  area?: string
  airport?: string
  arrival?: string
  charter_in?: string
  charter_out?: string
  status?: string
  pdf?: string
  [key: string]: any
}

interface Column {
  key: string
  label: string
  width: number
  sortable: boolean
}

// Type for DataTableRow based on Vuestic UI
interface DataTableRow<T> {
  source: T
  [key: string]: any
}

export default defineComponent({
  name: 'SalesConfirmationList',
  components: {
    SalesConfirmationClientDetails,
  },
  data() {
    return {
      searchText: '',
      columns: [
        { key: 'client', label: 'CLIENT', width: 180, sortable: true },
        { key: 'area', label: 'AREA', width: 120, sortable: true },
        { key: 'airport', label: 'AIRPORT', width: 120, sortable: true },
        { key: 'arrival', label: 'ARRIVAL', width: 140, sortable: true },
        { key: 'charter_in', label: 'CHARTER IN', width: 140, sortable: true },
        { key: 'charter_out', label: 'CHARTER OUT', width: 140, sortable: true },
        { key: 'status', label: 'STATUS', width: 120, sortable: true },
        { key: 'actions', label: 'ACTIONS', width: 140 },
      ] as Column[],
      viewDetails: false,
      selectedItem: {} as Record<string, any>,
      buttonDisabled: false,
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['results', 'loadingresults']),

    filteredResults(): SalesConfirmation[] {
      if (!this.searchText) return this.results as SalesConfirmation[]

      const searchLower = this.searchText.toLowerCase()
      return (this.results as SalesConfirmation[]).filter((item: SalesConfirmation) => {
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.area?.toLowerCase().includes(searchLower) ||
          item.airport?.toLowerCase().includes(searchLower) ||
          item.status?.toLowerCase().includes(searchLower) ||
          item.code?.toLowerCase().includes(searchLower)
        )
      })
    },
  },
  mounted() {
    this.getSalesConfirmations()
  },
  methods: {
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation']),

    // Helper to extract data from DataTableRow
    rowData(row: SalesConfirmation | DataTableRow<SalesConfirmation>): SalesConfirmation {
      // If row is a DataTableRow object, extract the source item
      // Otherwise, assume it's already the data object
      if ('source' in row) {
        return row.source
      }
      return row
    },

    async getSalesConfirmations() {
      try {
        await this.getallSalesConfirmation()
      } catch (error) {
        console.error('Error fetching sales confirmations:', error)
        this.$vaToast?.init({
          message: 'Failed to load sales confirmations',
          color: 'danger',
        })
      }
    },

    onRowClick(row: SalesConfirmation | DataTableRow<SalesConfirmation>) {
      const data = this.rowData(row)
      this.selectedItem = { ...data } as Record<string, any>
      this.viewDetails = true
    },

    gotBack() {
      this.viewDetails = false
      this.selectedItem = {}
      this.getSalesConfirmations()
    },

    formatStatusText(status: string): string {
      if (!status) return 'NO STATUS'
      return status.replace(/_/g, ' ').toUpperCase()
    },

    formatDate(dateString: string | null | undefined): string {
      if (!dateString || dateString === 'N/A') return 'N/A'
      try {
        return format(new Date(dateString), 'MMM dd, yyyy')
      } catch {
        return 'Invalid date'
      }
    },

    getStatusColor(status: string | undefined): string {
      const statusLower = status?.toLowerCase() || ''
      switch (statusLower) {
        case 'pending':
          return 'warning'
        case 'provision_sales':
          return 'warning'
        case 'confirmed':
          return 'success'
        case 'declined':
          return 'danger'
        case 'cancelled':
          return 'danger'
        case 'completed':
          return 'primary'
        default:
          return 'secondary'
      }
    },

    getActionIcon(status: string | undefined): string {
      const statusLower = status?.toLowerCase() || ''
      switch (statusLower) {
        case 'pending':
        case 'provision_sales':
          return 'check_circle'
        case 'confirmed':
        case 'declined':
        case 'cancelled':
        case 'completed':
          return 'visibility'
        default:
          return 'info'
      }
    },

    getButtonTextBasedOnStatus(status: string | undefined): string {
      const statusLower = status?.toLowerCase() || ''
      switch (statusLower) {
        case 'pending':
        case 'provision_sales':
          return 'Confirm'
        case 'confirmed':
          return 'View'
        case 'declined':
          return 'View'
        case 'cancelled':
          return 'View'
        case 'completed':
          return 'View'
        default:
          return 'View'
      }
    },

    async handleDownloadPdf(pdfUrl: string) {
      try {
        // Call the imported downloadPdf function
        await downloadPdf(pdfUrl, 'sales-confirmation.pdf')
      } catch (error) {
        console.error('Error downloading PDF:', error)
        this.$vaToast?.init({
          message: 'Failed to download PDF',
          color: 'danger',
        })
      }
    },

    filterResults() {
      // Search is handled by computed property
    },
  },
})
</script>

<style scoped>
.table-header {
  display: grid;
  grid-template-columns: 180px 120px 120px 140px 140px 140px 120px 140px;
  background-color: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
}

.header-cell {
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.no-items-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
}

.no-items-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 16px;
  min-height: 300px;
}

.no-items-text {
  color: #6c757d;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.no-items-subtext {
  color: #adb5bd;
  font-size: 14px;
}

.loading-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 16px;
  min-height: 300px;
  gap: 16px;
}

.loading-text {
  color: #6c757d;
  font-size: 14px;
}

.sales-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.client-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.client-name {
  font-weight: 500;
  color: #2c3e50;
}

.client-code {
  font-size: 0.75rem;
  color: #6c757d;
}

.area-cell,
.airport-cell {
  font-weight: 400;
  color: #495057;
}

.date-cell {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace;
  font-size: 0.875rem;
  color: #495057;
}

.status-chip {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  min-width: 100px;
  justify-content: center;
}

:deep(.va-table thead th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  padding: 12px 16px;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e0e0;
}

:deep(.va-table tbody td) {
  padding: 16px;
  vertical-align: middle;
  border-bottom: 1px solid #e0e0e0;
}

:deep(.va-table tbody tr) {
  transition: background-color 0.2s;
  cursor: pointer;
}

:deep(.va-table tbody tr:hover) {
  background-color: #f8f9fa;
}

:deep(.va-table tbody tr:last-child td) {
  border-bottom: none;
}

:deep(.va-card__title) {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

:deep(.va-card__content) {
  padding: 24px;
}
</style>
