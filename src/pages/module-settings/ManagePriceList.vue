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
        <ModuleTable :items="items" :columns="columns" :loading="loading" @onView="toggleShowPriceListMethod">
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
      { key: 'actions', width: 80 },
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
