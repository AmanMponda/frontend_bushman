<template>
  <VaCard class="p-6">
    <!-- Form for Adding Species -->

    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="!showPriceList" class="px-2 py-2" icon="arrow_back" size="small" @click="goBack">
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup v-if="!ShowCreateNewPriceListForm">
        <VaButton
          class="px-2 py-2"
          color="primary"
          label="Add New Quota"
          icon="add"
          :border-color="'primary'"
          round
          preset="secondary"
          size="small"
          @click="showCreateNewPriceListFormMethod"
        >
          Add a new Price List
        </VaButton>
      </VaButtonGroup>
    </div>
    <VaDivider />

    <template v-if="!ShowCreateNewPriceListForm">
      <template v-if="showPriceList">
        <ModuleTable
          :items="items"
          :columns="columns"
          :loading="loading"
          @onView="toggleShowPriceListMethod"
          @onDownload="onDownloadSinglePriceList"
        >
          <template #filter-elements-and-download-btn>
            <div class="grid sm:grid-cols-3 gap-6 mb-6">
              <VaSelect
                v-model="huntingTypeValue"
                :options="huntingTypeOptions"
                placeholder="Filter By Hunting Type"
                @update:modelValue="getPriceLists"
              />
              <VaSelect
                v-model="areaValue"
                :options="areasOptions"
                placeholder="Filter By Area"
                @update:modelValue="getPriceLists"
              />

              <VaButton
                class="px-2 py-0"
                color="primary"
                label="Download"
                icon="download"
                size="small"
                @click="onDownloadPdf"
              >
                Download
              </VaButton>
            </div>
          </template>
        </ModuleTable>
      </template>
      <template v-else>
        <PricesListDetails :price-list-item="item"></PricesListDetails>
      </template>
    </template>
    <template v-if="ShowCreateNewPriceListForm">
      <CreatePricesListForm></CreatePricesListForm>
    </template>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useToast, useForm } from 'vuestic-ui'
import ModuleTable from './components/ModuleTable.vue'
import PricesListDetails from './components/PricesList/PriceListDetails.vue'
import { usePriceListStore } from '../../stores/price-list-store'
import CreatePricesListForm from './components/PricesList/CreatePricesListForm.vue'
import { useQuotaStore } from '../../stores/quota-store'
import { useSettingsStore } from '../../stores/settings-store'
import downloadPdf from '../../utils/pdfDownloader'
import jsPDF from 'jspdf'

const defaultItem = {
  name: '',
  start_date: null,
  end_date: null,
}

export default defineComponent({
  name: 'QuotaPage',
  components: {
    ModuleTable,
    PricesListDetails,
    CreatePricesListForm,
  },

  setup() {
    const formRef = ref(null) as any
    const sformRef = ref(null) as any

    const columns = [
      { key: 'id', sortable: true, sortingOptions: ['desc', 'asc'] },
      { key: 'package_name', sortable: true },
      { key: 'area', sortable: true },
      { key: 'hunting_type', sortable: true },
      { key: 'amount', sortable: true },
      { key: 'duration', sortable: true, label: 'Duration (Days)' },
      { key: 'status', sortable: true },
      { key: 'actions', width: 120 }, // Increased width to accommodate both icons
    ]

    const {
      isValid: isValidSForm,
      validate: validateSForm,
      resetValidation: resetValidationSForm,
      reset: resetSForm,
    } = useForm(sformRef)

    return {
      isValidSForm,
      validateSForm,
      resetValidationSForm,
      resetSForm,
      formRef,
      sformRef,
      columns,
    }
  },

  data() {
    const items: any[] = []
    const printableDataList: any[] = []

    const sform = reactive({
      id: null as any,
      name: '',
      scientific_name: '',
    })

    const quotasOptions = [] as any

    return {
      items,
      printableDataList,
      item: null as any,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(),
      sform,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      huntingTypeOptions: [] as any,
      speciesObjects: [] as any,
      showModal: false,
      quotasOptions,
      showPriceList: true,
      ShowCreateNewPriceListForm: false,
      loading: false,
      currentQuota: null as any,
      quotaItems: [] as any,
      excellFile: [] as any,
      itemsByHuntingType: [] as any,
      // for filter
      huntingTypeValue: null as any,
      areaValue: null as any,
      quotaValue: null as any,
      poriceListPdf: '' as any,
      downloadPdf,
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['logo']),
  },

  mounted() {
    this.getPriceLists()
    this.getAreas()
    this.getQuota()
    this.getHuntingTypesOptions()
    this.loadLogo()
  },

  methods: {
    ...mapActions(usePriceListStore, ['getPriceList']),
    ...mapActions(usePriceListStore, ['getPriceListByHuntingType']),
    ...mapActions(usePriceListStore, ['getPriceListById']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['generateQuotaYear']),
    ...mapActions(useSettingsStore, ['getHuntingsTypes']),
    ...mapActions(useSettingsStore, ['loadLogo']),

    async toggleShowPriceListMethod(rowData: any) {
      // eslint-disable-next-line no-console
      console.log('=== Eye button clicked ===')
      // eslint-disable-next-line no-console
      console.log('Row data received:', rowData)
      // eslint-disable-next-line no-console
      console.log('Current showPriceList:', this.showPriceList)

      // Get the price list ID from the row data
      const priceListId = rowData?.id

      if (!priceListId) {
        // eslint-disable-next-line no-console
        console.error('No price list ID found in row data')
        return
      }

      try {
        // Fetch the full price list detail by ID
        // eslint-disable-next-line no-console
        console.log('Fetching price list detail for ID:', priceListId)
        const response = await this.getPriceListById(priceListId)

        // Backend returns { success: true, data: {...}, message: "..." }
        // So we need to access response.data.data to get the actual item
        this.item = response.data.data || response.data

        // eslint-disable-next-line no-console
        console.log('Fetched price list detail:', this.item)

        // Toggle to show the detail view
        this.showPriceList = false

        // eslint-disable-next-line no-console
        console.log('Switched to detail view')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching price list detail:', error)
      }
    },

    async onDownloadSinglePriceList(rowData: any) {
      // eslint-disable-next-line no-console
      console.log('=== Download button clicked ===')
      // eslint-disable-next-line no-console
      console.log('Row data for download:', rowData)

      const priceListId = rowData?.id
      if (!priceListId) {
        // eslint-disable-next-line no-console
        console.error('No price list ID found in row data')
        return
      }

      try {
        // eslint-disable-next-line no-console
        console.log('Fetching price list detail for ID:', priceListId)
        const response = await this.getPriceListById(priceListId)

        // Backend returns { success: true, data: {...}, message: "..." }
        const priceListData = response.data.data || response.data

        // eslint-disable-next-line no-console
        console.log('Fetched price list data for PDF generation:', priceListData)

        // Generate PDF from the individual price list data
        await this.generateIndividualPdf(priceListData, priceListId)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error downloading price list:', error)
        this.toast?.init({ message: 'Failed to download price list', color: 'danger' })
      }
    },

    // ... existing code ...

    async generateIndividualPdf(priceListData: any, priceListId: string) {
      try {
        // Create a new PDF document
        const doc = new jsPDF()

        // Set document properties
        doc.setProperties({
          title: `Price List ${priceListId}`,
          subject: 'Price List Details',
          author: 'Bushman System',
          creator: 'Bushman',
        })

        // Add content to PDF
        let yPosition = 20
        const lineHeight = 7
        const margin = 20
        const pageWidth = doc.internal.pageSize.width

        // Title
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('INDIVIDUAL PRICE LIST DETAILS', pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 20

        // Price List Information
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('PRICE LIST INFORMATION:', margin, yPosition)
        yPosition += lineHeight

        doc.setFont('helvetica', 'normal')
        doc.text(`ID: ${priceListData.id || 'N/A'}`, margin, yPosition)
        yPosition += lineHeight
        doc.text(`Package Name: ${priceListData.sales_package?.name || 'N/A'}`, margin, yPosition)
        yPosition += lineHeight
        doc.text(`Area: ${priceListData.sales_package?.area?.name || 'N/A'}`, margin, yPosition)
        yPosition += lineHeight
        doc.text(`Hunting Type: ${priceListData.price_list_type?.hunting_type?.name || 'N/A'}`, margin, yPosition)
        yPosition += lineHeight
        doc.text(
          `Amount: ${priceListData.price_list_type?.currency?.symbol || ''}${
            priceListData.price_list_type?.amount || 'N/A'
          }`,
          margin,
          yPosition,
        )
        yPosition += lineHeight
        doc.text(`Duration: ${priceListData.price_list_type?.duration || 'N/A'} days`, margin, yPosition)
        yPosition += lineHeight
        doc.text(`Status: ${priceListData.price_list_type?.is_active ? 'Active' : 'Inactive'}`, margin, yPosition)
        yPosition += 15

        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        // Validity Period
        doc.setFont('helvetica', 'bold')
        doc.text('VALIDITY PERIOD:', margin, yPosition)
        yPosition += lineHeight

        doc.setFont('helvetica', 'normal')
        doc.text(`Start Date: ${priceListData.price_list_type?.price_list?.start_date || 'N/A'}`, margin, yPosition)
        yPosition += lineHeight
        doc.text(`End Date: ${priceListData.price_list_type?.price_list?.end_date || 'N/A'}`, margin, yPosition)
        yPosition += 15

        // Regulatory Package
        if (priceListData.sales_package?.regulatory_package) {
          doc.setFont('helvetica', 'bold')
          doc.text('REGULATORY PACKAGE:', margin, yPosition)
          yPosition += lineHeight

          doc.setFont('helvetica', 'normal')
          doc.text(`Name: ${priceListData.sales_package.regulatory_package.name || 'N/A'}`, margin, yPosition)
          yPosition += lineHeight
          doc.text(
            `Duration: ${priceListData.sales_package.regulatory_package.duration || 'N/A'} days`,
            margin,
            yPosition,
          )
          yPosition += 15
        }

        // Included Species
        if (priceListData.sales_package?.species?.length > 0) {
          doc.setFont('helvetica', 'bold')
          doc.text('INCLUDED SPECIES:', margin, yPosition)
          yPosition += lineHeight

          doc.setFont('helvetica', 'normal')
          priceListData.sales_package.species.forEach((sp: any) => {
            const speciesInfo = sp.species || {}
            const text = `• ${speciesInfo.name} (${speciesInfo.scientific_name || 'No scientific name'}) - Quantity: ${
              sp.quantity || 1
            }`

            // Split long text into multiple lines if needed
            const lines = doc.splitTextToSize(text, pageWidth - margin * 2)
            lines.forEach((line: string) => {
              if (yPosition > 280) {
                doc.addPage()
                yPosition = 20
              }
              doc.text(line, margin, yPosition)
              yPosition += lineHeight
            })
          })
          yPosition += 10
        }

        // Footer
        doc.setFontSize(10)
        doc.setTextColor(128, 128, 128)
        doc.text(`Document generated on: ${new Date().toLocaleString()}`, margin, 285)
        doc.text('This is an auto-generated individual price list document.', margin, 292)

        // Save the PDF
        doc.save(`price-list-${priceListId}-${Date.now()}.pdf`)

        this.toast?.init({ message: 'Price list downloaded successfully', color: 'success' })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error generating individual PDF:', error)
        this.toast?.init({
          message: 'Failed to generate PDF. Please try the main Download button.',
          color: 'warning',
        })
      }
    },
    createIndividualPdfContent(priceListData: any): string {
      const currentDate = new Date().toLocaleString()
      const priceListType = priceListData.price_list_type || {}
      const salesPackage = priceListData.sales_package || {}
      const area = salesPackage.area || {}
      const regulatoryPackage = salesPackage.regulatory_package || {}

      return `
INDIVIDUAL PRICE LIST DETAILS
==============================

PRICE LIST INFORMATION:
-----------------------
ID: ${priceListData.id || 'N/A'}
Package Name: ${salesPackage.name || 'N/A'}
Area: ${area.name || 'N/A'}
Area Description: ${area.description || 'N/A'}
Hunting Type: ${priceListType.hunting_type?.name || 'N/A'}
Amount: ${priceListType.currency?.symbol || ''}${priceListType.amount || 'N/A'}
Duration: ${priceListType.duration || 'N/A'} days
Status: ${priceListType.is_active ? 'Active' : 'Inactive'}

VALIDITY PERIOD:
----------------
Start Date: ${priceListType.price_list?.start_date || 'N/A'}
End Date: ${priceListType.price_list?.end_date || 'N/A'}

REGULATORY PACKAGE:
-------------------
Name: ${regulatoryPackage.name || 'N/A'}
Duration: ${regulatoryPackage.duration || 'N/A'} days

INCLUDED SPECIES:
-----------------
${this.formatIncludedSpecies(salesPackage.species || [])}

SAFARI EXTRAS:
--------------
${this.formatSafariExtras(priceListData.safari_extras || [])}

TROPHY FEES:
------------
${this.formatTrophyFees(priceListData.trophy_fees || [])}

COMPANION & OBSERVER COSTS:
---------------------------
${this.formatCompanionObserver(priceListData.componions_hunter, priceListData.observer)}

CURRENCY INFORMATION:
---------------------
Currency: ${priceListType.currency?.name || 'N/A'}
Symbol: ${priceListType.currency?.symbol || 'N/A'}

Document generated on: ${currentDate}
This is an auto-generated individual price list document.
  `.trim()
    },

    formatIncludedSpecies(species: any[]): string {
      if (!species.length) return 'No species included'

      return species
        .map((sp) => {
          const speciesInfo = sp.species || {}
          return `• ${speciesInfo.name} (${speciesInfo.scientific_name || 'No scientific name'}) - Quantity: ${
            sp.quantity || 1
          }`
        })
        .join('\n')
    },

    formatSafariExtras(extras: any[]): string {
      if (!extras.length) return 'No safari extras available'

      return extras
        .map((extra) => {
          const currency = extra.currency || {}
          return `• ${extra.name}: ${currency.symbol || ''}${extra.amount} ${extra.charges_per || ''}`
        })
        .join('\n')
    },

    formatTrophyFees(fees: any[]): string {
      if (!fees.length) return 'No trophy fees available'

      return fees
        .map((fee) => {
          const species = fee.species || {}
          return `• ${species.name} (${species.scientific_name || 'No scientific name'}): $${fee.price_usd || 'N/A'}`
        })
        .join('\n')
    },

    formatCompanionObserver(companion: any, observer: any): string {
      let result = ''

      if (companion && companion.length > 0) {
        companion.forEach((comp: any) => {
          result += `Companion: ${comp.days || 0} days - ${comp.currency?.symbol || ''}${comp.amount || 0}\n`
        })
      } else {
        result += 'Companion: Not available\n'
      }

      if (observer && observer.length > 0) {
        observer.forEach((obs: any) => {
          result += `Observer: ${obs.days || 0} days - ${obs.currency?.symbol || ''}${obs.amount || 0}`
        })
      } else {
        result += 'Observer: Not available'
      }

      return result
    },

    async onDownloadPdf() {
      const pdf = this.poriceListPdf
      // debug
      // eslint-disable-next-line no-console
      console.log('onDownloadPdf clicked, poriceListPdf length:', pdf ? pdf.length : 0)
      const isUrl = (s: any) => typeof s === 'string' && /^https?:\/\//i.test(s)
      const isLikelyBase64 = (s: any) => typeof s === 'string' && s.length > 200 && /^[A-Za-z0-9+/=\r\n]+$/.test(s)

      if (!pdf || (!isUrl(pdf) && !isLikelyBase64(pdf))) {
        try {
          this.toast?.init({ message: 'PDF not available for this selection', color: 'warning' })
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('PDF not available')
        }
        return
      }

      try {
        await downloadPdf(pdf, `price-list-${Date.now()}.pdf`)
      } catch (err) {
        try {
          this.toast?.init({ message: 'Failed to download PDF', color: 'danger' })
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to download PDF', err)
        }
      }
    },

    goBack() {
      this.showPriceList = !this.showPriceList
      this.ShowCreateNewPriceListForm = false
      this.getPriceLists()
    },

    showCreateNewPriceListFormMethod() {
      this.ShowCreateNewPriceListForm = !this.ShowCreateNewPriceListForm
      this.showPriceList = false
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async addNewSpecies() {},

    formatDate(date: Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    async getPriceLists() {
      this.loading = true

      try {
        const unwrap = (v: any) => {
          if (v === null || v === undefined) return ''
          if (typeof v === 'object' && 'value' in v) return v.value
          return v
        }

        const huntingTypeId = unwrap(this.huntingTypeValue) || ''
        const areaId = unwrap(this.areaValue) || ''
        const quotaId = unwrap(this.quotaValue) || ''

        console.log('Filter params:', { huntingTypeId, areaId, quotaId })
        console.log('huntingTypeValue:', this.huntingTypeValue)
        console.log('areaValue:', this.areaValue)
        const response = await this.getPriceList(huntingTypeId, areaId, quotaId)
        console.log('API response:', response)
        console.log('Response data structure:', response?.data)

        if (response.status === 200) {
          this.loading = false

          // Normalize response: support both `[]` and `{ data: [] }` shapes
          const raw = response?.data
          const dataArray = Array.isArray(raw) ? raw : raw?.data ?? []
          console.log('Data array:', dataArray)

          this.printableDataList = raw
          this.poriceListPdf = raw?.pdf || ''

          if (Array.isArray(dataArray)) {
            this.items = dataArray.map((item: any) => ({
              id: item.id,
              package_name: item.package_name,
              area: item.area,
              hunting_type: item.hunting_type,
              amount: item.amount,
              duration: item.duration,
              status: item.status,
            }))
          } else {
            console.error('Data is not an array:', dataArray)
            this.items = []
          }

          console.log('Updated items:', this.items)
        }
      } catch (error) {
        this.loading = false
        console.error('Error in getPriceLists:', error)
      }
    },

    async getPriceListByHuntingTypes(hunting_type_id: any) {
      try {
        const response = await this.getPriceListByHuntingType(hunting_type_id)

        this.itemsByHuntingType = response?.data?.map((item: any) => ({
          id: item?.id,
          item: item,
        }))

        console.log(this.itemsByHuntingType)
      } catch (error) {
        console.log(error)
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        const all = {
          value: '',
          text: 'All',
        }

        this.areasOptions = response?.data?.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
        this.areasOptions.unshift(all)
        // make all default value
        this.areaValue = this.areasOptions[0]
      } catch (error) {
        console.log(error)
      }
    },

    async getQuota() {
      try {
        const response = await this.getQuotas(null)

        if (response.status === 200) {
          const currentQuota = response.data[0]
          const result1 = this.generateQuotaYear(currentQuota.start_date, currentQuota.end_date)

          this.quotaValue = {
            value: currentQuota.id,
            text: `${result1} - ${currentQuota.name}`,
            name: currentQuota.name,
            start_date: currentQuota.start_date,
            end_date: currentQuota.end_date,
          }
          this.currentQuota = currentQuota

          // all object
          const all = {
            value: '',
            text: 'All',
          }

          this.quotasOptions = response.data.map((item: any) => {
            const result = this.generateQuotaYear(item.start_date, item.end_date)

            return {
              value: item.id,
              text: `${result} - ${item.name}`,
              name: item.name,
              start_date: item.start_date,
              end_date: item.end_date,
            }
          })
          // add all option
          this.quotasOptions.unshift(all)
          // make all default value
          // this.quotaValue = this.quotasOptions[0]
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getHuntingTypesOptions() {
      const response = await this.getHuntingsTypes()
      if (response.status === 200) {
        const all = {
          value: '',
          text: 'All',
        }
        this.huntingTypeOptions = response?.data?.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
        this.huntingTypeOptions.unshift(all)
        // make all default value
        this.huntingTypeValue = this.huntingTypeOptions[0]
      }
    },
  },
})
</script>

<style lang="scss">
.modal-content {
  padding: 16px; /* Add padding around content */
}

.input-group {
  margin-bottom: 16px; /* Space between input fields */
}

.input-label {
  margin-bottom: 8px; /* Space between label and input */
  font-weight: bold; /* Make the label bold for clarity */
}

/* Flexbox for horizontal alignment of date inputs */
.input-container {
  display: flex;
  align-items: center; /* Align items vertically centered */
}

.input-container > VaDateInput {
  margin-right: 8px; /* Space between start date and end date */
}

.input-container > VaInput {
  flex: 1; /* Let the input take the remaining space */
}
</style>
