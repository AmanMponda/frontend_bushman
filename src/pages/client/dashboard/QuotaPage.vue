<template>
  <VaCard class="w-full p-2">
    <!-- Statistics Cards Section -->
    <div v-if="quotaStats" class="mb-8">
      <h3 class="va-h3 mb-4">Quota Summary Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Quota Card -->
        <VaCard class="p-4" color="primary" gradient>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">Total Quota Balance</p>
              <h3 class="text-2xl font-bold">{{ quotaStats.total_quota_balance }}</h3>
            </div>
            <VaIcon name="bar_chart" size="large" />
          </div>
        </VaCard>

        <!-- Available Quota Card -->
        <VaCard class="p-4" color="success" gradient>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">Available Quota</p>
              <h3 class="text-2xl font-bold">{{ quotaStats.available_quota }}</h3>
            </div>
            <VaIcon name="check_circle" size="large" />
          </div>
        </VaCard>

        <!-- Confirmed Card -->
        <VaCard class="p-4" color="warning" gradient>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">Confirmed</p>
              <h3 class="text-2xl font-bold">{{ quotaStats.confirmed }}</h3>
            </div>
            <VaIcon name="verified" size="large" />
          </div>
        </VaCard>

        <!-- Utilisation Card -->
        <VaCard class="p-4" color="info" gradient>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-80">Utilisation Rate</p>
              <h3 class="text-2xl font-bold">{{ quotaStats.utilisation_percentage }}%</h3>
            </div>
            <VaIcon name="trending_up" size="large" />
          </div>
        </VaCard>
      </div>
    </div>

    <!-- Filter Controls Section -->
    <div class="grid md:grid-cols-4 gap-6 mb-6">
      <VaSelect
        v-model="area"
        placeholder="Filter by Area"
        :options="areasOptions"
        searchable
        value-by="value"
        label="Area"
        @update:modelValue="getAllSpeces()"
      />

      <VaSelect
        v-model="quota"
        placeholder="Filter by Quota year"
        :options="yearOptions"
        value-by="value"
        label="Quota year"
        @update:modelValue="getAllSpeces()"
      />

      <VaSelect
        v-model="species"
        placeholder="Filter by Species"
        :options="speciesOptions"
        value-by="value"
        label="Species"
        @update:modelValue="getAllSpeces()"
      />

      <!-- Download Button -->
      <VaButton icon="download" :loading="downloading" :disabled="!quotaStats" @click="downloadPDF">
        {{ downloading ? 'Generating PDF...' : 'Download Report' }}
      </VaButton>
    </div>

    <!-- Status Breakdown Section -->
    <div v-if="quotaStats" class="mb-6">
      <h4 class="va-h4 mb-3">Status Breakdown</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <VaCard class="p-3 text-center">
          <div class="text-lg font-semibold text-success">{{ quotaStats.confirmed }}</div>
          <div class="text-sm opacity-70">Confirmed</div>
        </VaCard>
        <VaCard class="p-3 text-center">
          <div class="text-lg font-semibold text-warning">{{ quotaStats.provisioned }}</div>
          <div class="text-sm opacity-70">Provisioned</div>
        </VaCard>
        <VaCard class="p-3 text-center">
          <div class="text-lg font-semibold text-danger">{{ quotaStats.cancelled }}</div>
          <div class="text-sm opacity-70">Cancelled</div>
        </VaCard>
        <VaCard class="p-3 text-center">
          <div class="text-lg font-semibold text-info">{{ quotaStats.taken }}</div>
          <div class="text-sm opacity-70">Taken</div>
        </VaCard>
      </div>
    </div>

    <!-- Data Table Section (if you still want to show tabular data) -->
    <div v-if="detailedData.length > 0" class="mt-6">
      <h4 class="va-h4 mb-3">Detailed Quota Data</h4>
      <VaDataTable :items="detailedData" :columns="columns" :filter="filter" :loading="loading">
        <template #cell(provision_sales)="{ value }">
          <VaChip color="warning" size="small">
            {{ value }}
          </VaChip>
        </template>

        <template #cell(confirmed)="{ value }">
          <VaChip color="success" size="small">
            {{ value }}
          </VaChip>
        </template>

        <template #cell(cancelled)="{ value }">
          <VaChip color="danger" size="small">
            {{ value }}
          </VaChip>
        </template>

        <template #cell(taken)="{ value }">
          <VaChip color="primary" size="small">
            {{ value }}
          </VaChip>
        </template>
      </VaDataTable>
    </div>

    <!-- No Data Message -->
    <div v-if="!loading && !quotaStats && !showMessage" class="text-center py-8">
      <VaIcon name="info" size="large" class="mb-2" />
      <p class="text-lg">No quota data available for the selected filters</p>
    </div>
  </VaCard>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { defineComponent, ref } from 'vue'
import { useToast } from 'vuestic-ui'

// Define interfaces for proper TypeScript typing
interface QuotaStats {
  total_quota_balance: number
  available_quota: number
  confirmed: number
  provisioned: number
  cancelled: number
  taken: number
  total_allocated: number
  utilisation_percentage: number
}

interface SpeciesTableItem {
  id: number
  area: string
  name: string
  scientific_name: string
  no_of_species: number
  provision_sales: number
  confirmed: number
  cancelled: number
  taken: number
}

interface SelectOption {
  value: any
  text: string
  name?: string
  start_date?: string
  end_date?: string
}

interface QuotaResponse {
  id: number
  name: string
  start_date: string
  end_date: string
}

export default defineComponent({
  setup() {
    const columns = [
      { key: 'id', sortable: true },
      { key: 'area', sortable: true },
      { key: 'name', sortable: true },
      { key: 'scientific_name', sortable: true },
      { key: 'no_of_species', sortable: true },
      { key: 'provision_sales', sortable: true },
      { key: 'confirmed', sortable: true },
      { key: 'cancelled', sortable: true }, // Changed from 'canceled' to 'cancelled'
      { key: 'taken', sortable: true },
    ]

    const filter = ref('')

    return {
      filter,
      columns,
    }
  },
  data() {
    const { init } = useToast()

    const area: any = null
    const quota: any = null
    const species: any = null
    const logo = '/logo.png'
    const selectQuota = null as any

    return {
      quotaStats: null as QuotaStats | null,
      detailedData: [] as SpeciesTableItem[],
      area,
      quota,
      species,
      currentQuota: null as any,
      areasOptions: [] as SelectOption[],
      yearOptions: [] as SelectOption[],
      speciesOptions: [] as SelectOption[],
      init,
      logo,
      selectQuota,
      with: 12,
      height: 100,
      loading: false,
      base64Pdf: '' as any,
      loadingQuota: false,
      downloading: false,
      showMessage: '',
    }
  },
  mounted() {
    this.getAllSpeces()
    this.getQuota()
    this.getSpeciesItems()
    this.getAreas()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['generateQuotaYear']),

    async downloadPDF() {
      if (!this.quotaStats) {
        this.init({ message: 'No data to download', color: 'warning' })
        return
      }

      this.downloading = true
      try {
        // Import jsPDF
        const jsPDFModule = await import('jspdf')
        const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default

        // Try to import autoTable
        try {
          await import('jspdf-autotable')
        } catch (autoTableError) {
          console.warn('jspdf-autotable not available:', autoTableError)
        }

        // Create document with proper typing
        const doc = new jsPDF('p', 'mm', 'a4') as any // Cast to any to bypass TypeScript issues

        // ===== TITLE SECTION =====
        doc.setFontSize(20)
        doc.setTextColor(40, 40, 40)
        doc.text('QUOTA MANAGEMENT REPORT', 105, 20, { align: 'center' } as any)

        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, {
          align: 'center',
        } as any)

        // ===== FILTERS SECTION =====
        let yPos = 40
        const filters: string[] = []

        if (this.quota && this.quota !== 'all' && this.quota !== null) {
          const quotaOption = this.yearOptions.find((opt) => opt.value === this.quota)
          filters.push(`Quota: ${quotaOption?.text || String(this.quota)}`)
        }

        if (this.area && this.area !== 'all' && this.area !== null) {
          const areaOption = this.areasOptions.find((opt) => opt.value === this.area)
          filters.push(`Area: ${areaOption?.text || String(this.area)}`)
        }

        if (this.species && this.species !== 'all' && this.species !== null) {
          const speciesOption = this.speciesOptions.find((opt) => opt.value === this.species)
          filters.push(`Species: ${speciesOption?.text || String(this.species)}`)
        }

        if (filters.length > 0) {
          doc.setFontSize(10)
          doc.setTextColor(60, 60, 60)
          doc.text(`Filters: ${filters.join(' | ')}`, 14, yPos)
          yPos += 10
        }

        // ===== SUMMARY SECTION =====
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text('SUMMARY STATISTICS', 14, yPos)
        yPos += 10

        // Create summary table with proper typing
        const summaryData: Array<[string, string | number]> = [
          ['Total Quota Balance:', this.quotaStats.total_quota_balance],
          ['Available Quota:', this.quotaStats.available_quota],
          ['Confirmed:', this.quotaStats.confirmed],
          ['Provisioned:', this.quotaStats.provisioned],
          ['Cancelled:', this.quotaStats.cancelled],
          ['Taken:', this.quotaStats.taken],
          ['Total Allocated:', this.quotaStats.total_allocated],
          ['Utilisation Rate:', `${this.quotaStats.utilisation_percentage}%`],
        ]

        // Draw summary manually
        let summaryY = yPos
        summaryData.forEach(([label, value]) => {
          doc.setFontSize(10)
          doc.text(String(label), 20, summaryY) // Convert to string
          doc.text(String(value), 80, summaryY) // Convert to string
          summaryY += 7
        })

        yPos = summaryY + 10

        // ===== DETAILED DATA SECTION =====
        if (this.detailedData && this.detailedData.length > 0) {
          doc.setFontSize(12)
          doc.text('DETAILED QUOTA DATA', 14, yPos)
          yPos += 10

          // Check if autoTable is available
          if (typeof doc.autoTable === 'function') {
            const tableHeaders = [
              'Area',
              'Species',
              'Scientific',
              'Total',
              'Provision',
              'Confirmed',
              'Cancelled',
              'Taken',
            ]

            const tableData = this.detailedData.map((item) => [
              (item.area || 'N/A').substring(0, 15),
              (item.name || 'N/A').substring(0, 15), // Use 'name' instead of 'species_name'
              (item.scientific_name || 'N/A').substring(0, 15),
              String(item.no_of_species || 0),
              String(item.provision_sales || 0),
              String(item.confirmed || 0),
              String(item.cancelled || 0),
              String(item.taken || 0),
            ])

            doc.autoTable({
              head: [tableHeaders],
              body: tableData,
              startY: yPos,
              theme: 'grid' as any,
              styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: 'linebreak' as any,
              },
              headStyles: {
                fillColor: [66, 135, 245],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
              },
              margin: { left: 14, right: 14 },
              pageBreak: 'auto' as any,
            })
          } else {
            // Fallback to manual table
            this.drawManualTable(doc, yPos)
          }
        } else {
          doc.setFontSize(10)
          doc.setTextColor(150, 150, 150)
          doc.text('No detailed data available', 14, yPos)
        }

        // ===== PAGE NUMBERS =====
        // Use internal API to get page count
        const pageCount = (doc as any).internal.getNumberOfPages?.() || 1
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setFontSize(8)
          doc.setTextColor(150, 150, 150)
          const pageWidth = doc.internal.pageSize.width || 210 // A4 width in mm
          const pageHeight = doc.internal.pageSize.height || 297 // A4 height in mm
          doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10)
        }

        // ===== SAVE PDF =====
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `quota-report-${timestamp}.pdf`

        doc.save(filename)

        this.init({ message: 'PDF downloaded successfully!', color: 'success' })
      } catch (error: any) {
        // Type error as 'any' to avoid TypeScript issues
        console.error('PDF generation error:', error)

        // Try a simpler approach
        try {
          await this.generateSimplePDF()
        } catch (simpleError: any) {
          console.error('Simple PDF also failed:', simpleError)
          this.init({
            message: error?.message || 'Failed to generate PDF. Please try backend PDF generation.',
            color: 'danger',
          })
        }
      } finally {
        this.downloading = false
      }
    },

    // Update the helper method with proper typing
    drawManualTable(doc: any, startY: number) {
      const headers = ['Area', 'Species', 'Total', 'Provision', 'Confirmed', 'Cancelled', 'Taken']
      const colWidths = [30, 30, 20, 20, 20, 20, 20]
      const rowHeight = 8

      let y = startY
      let x = 14

      // Draw headers
      doc.setFillColor(66, 135, 245)
      doc.setTextColor(255, 255, 255)
      doc.setFont(undefined as any, 'bold')

      headers.forEach((header, index) => {
        doc.rect(x, y, colWidths[index], rowHeight, 'F')
        doc.text(header, x + 2, y + rowHeight / 2 + 2)
        x += colWidths[index]
      })

      y += rowHeight

      // Draw rows
      doc.setFillColor(255, 255, 255)
      doc.setTextColor(0, 0, 0)
      doc.setFont(undefined as any, 'normal')

      this.detailedData.forEach((item: any, index: number) => {
        if (y > 270) {
          // New page if needed
          doc.addPage()
          y = 20
        }

        x = 14
        const row = [
          (item.area || 'N/A').substring(0, 10),
          (item.name || 'N/A').substring(0, 10), // Use 'name' instead of 'species_name'
          String(item.no_of_species || 0),
          String(item.provision_sales || 0),
          String(item.confirmed || 0),
          String(item.cancelled || 0),
          String(item.taken || 0),
        ]

        // Alternate row colors
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245)
          const totalWidth = colWidths.reduce((a, b) => a + b, 0)
          doc.rect(x, y, totalWidth, rowHeight, 'F')
        }

        row.forEach((cell, cellIndex) => {
          doc.text(String(cell), x + 2, y + rowHeight / 2 + 2)
          x += colWidths[cellIndex]
        })

        y += rowHeight
      })
    },

    async generateSimplePDF() {
      try {
        const jsPDFModule = await import('jspdf')
        const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default
        const doc = new jsPDF()

        let y = 20

        // Title
        doc.setFontSize(16)
        doc.text('Quota Report', 20, y)
        y += 10

        // Date
        doc.setFontSize(10)
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y)
        y += 15

        // Summary
        if (this.quotaStats) {
          doc.setFontSize(12)
          doc.text('Summary:', 20, y)
          y += 10

          doc.setFontSize(10)
          const summary = [
            `Total Quota: ${this.quotaStats.total_quota_balance}`,
            `Available: ${this.quotaStats.available_quota}`,
            `Confirmed: ${this.quotaStats.confirmed}`,
            `Provisioned: ${this.quotaStats.provisioned}`,
            `Cancelled: ${this.quotaStats.cancelled}`,
            `Taken: ${this.quotaStats.taken}`,
            `Utilisation: ${this.quotaStats.utilisation_percentage}%`,
          ]

          summary.forEach((text) => {
            doc.text(text, 25, y)
            y += 7
          })
          y += 10
        }

        // Detailed data if available
        if (this.detailedData && this.detailedData.length > 0) {
          doc.setFontSize(12)
          doc.text('Detailed Data:', 20, y)
          y += 10

          doc.setFontSize(8)
          this.detailedData.forEach((item: any) => {
            if (y > 270) {
              doc.addPage()
              y = 20
            }

            const text = `${item.area || 'N/A'} - ${item.name || 'N/A'}: Total ${item.no_of_species || 0}, Prov ${
              item.provision_sales || 0
            }, Conf ${item.confirmed || 0}, Can ${item.cancelled || 0}, Taken ${item.taken || 0}`
            doc.text(text.substring(0, 100), 20, y)
            y += 7
          })
        }

        const timestamp = new Date().toISOString().split('T')[0]
        doc.save(`quota-simple-${timestamp}.pdf`)

        this.init({ message: 'Simple PDF downloaded!', color: 'success' })
      } catch (error: any) {
        // throw error
      }
    },
    async getAllSpeces() {
      this.loading = true
      this.showMessage = ''
      this.quotaStats = null
      this.detailedData = []

      try {
        const response = await this.getAllSpeciesPerQuotaPerArea(this.quota, this.area, this.species)

        console.log('API Response:', response.data)

        if (response.data?.success) {
          const data = response.data.data

          // Handle summary statistics
          if (data && typeof data === 'object') {
            this.quotaStats = {
              total_quota_balance: data.total_quota_balance || 0,
              available_quota: data.available_quota || 0,
              confirmed: data.confirmed || 0,
              provisioned: data.provisioned || 0,
              cancelled: data.cancelled || 0,
              taken: data.taken || 0,
              total_allocated: data.total_allocated || 0,
              utilisation_percentage: data.utilisation_percentage || 0,
            }

            // If there's detailed data in the response, use it
            if (response.data.detailed_data && Array.isArray(response.data.detailed_data)) {
              this.detailedData = response.data.detailed_data.map((item: any) => ({
                id: item.id || 0,
                name: item.name || item.species?.name || 'N/A',
                area: item.area || item.huntingArea?.name || 'N/A',
                scientific_name: item.scientific_name || item.species?.scientific_name || 'N/A',
                no_of_species: item.no_of_species || item.quantity || 0,
                provision_sales: item.provision_sales || item.provision_quantity || 0,
                confirmed: item.confirmed || item.confirmed_quantity || 0,
                cancelled: item.cancelled || item.declined_quantity || item.cancelled_quantity || 0,
                taken: item.taken || item.completed_quantity || 0,
              }))
            }
          } else {
            this.showMessage = response.data.message || 'No data available'
          }
        } else {
          this.showMessage = response.data?.message || 'Failed to load quota data'
        }
      } catch (error: any) {
        console.error('Error fetching quota data:', error)
        this.showMessage = error.response?.data?.message || error.message || 'Failed to fetch quota data'
        this.init({ message: this.showMessage, color: 'danger' })
      } finally {
        this.loading = false
      }
    },

    async getQuota() {
      this.loadingQuota = true
      try {
        const response = await this.getQuotas(null)

        let quotasData: QuotaResponse[] = []
        if (response.data?.success && Array.isArray(response.data.data)) {
          quotasData = response.data.data
        } else if (Array.isArray(response.data)) {
          quotasData = response.data
        }

        if (quotasData.length > 0) {
          const currentQuota = quotasData[0]
          this.quota = currentQuota.id
          this.currentQuota = currentQuota

          this.yearOptions = quotasData.map((item: QuotaResponse) => {
            const result = this.generateQuotaYear(item.start_date, item.end_date)
            return {
              value: item.id,
              text: `${result} - ${item.name}`,
              name: item.name,
              start_date: item.start_date,
              end_date: item.end_date,
            }
          })
        } else {
          this.init({ message: 'No quotas found', color: 'warning' })
        }
      } catch (error: any) {
        console.error('Error fetching quotas:', error)
        const message = error.response?.data?.message || error.message || 'Failed to fetch quotas'
        this.init({ message, color: 'danger' })
      } finally {
        this.loadingQuota = false
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        let speciesData = []
        if (response.data?.success && Array.isArray(response.data.data)) {
          speciesData = response.data.data
        } else if (Array.isArray(response.data)) {
          speciesData = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          speciesData = response.data.data
        }

        this.speciesOptions = [
          {
            value: 'all',
            text: 'All',
          },
        ]

        const speciesItems = speciesData.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))

        this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error: any) {
        console.error('Error fetching species list:', error)
        const message = error.response?.data?.message || error.message || 'Failed to fetch species list'
        this.init({ message, color: 'danger' })
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()

        let areasData = []
        if (response.data?.success && Array.isArray(response.data.data)) {
          areasData = response.data.data
        } else if (Array.isArray(response.data)) {
          areasData = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          areasData = response.data.data
        }

        this.areasOptions = [
          {
            value: 'all',
            text: 'All',
          },
        ]

        const areasOptions = areasData.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))

        this.areasOptions = this.areasOptions.concat(areasOptions)
      } catch (error: any) {
        console.error('Error fetching areas:', error)
        const message = error.response?.data?.message || error.message || 'Failed to fetch areas'
        this.init({ message, color: 'danger' })
      }
    },
  },
})
</script>

<style scoped>
/* Add your styles here if needed */
</style>
