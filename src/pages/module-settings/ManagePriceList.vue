<template>
  <VaCard class="price-list-page">
    <VaCardContent>
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row gap-2 mb-4 justify-between items-center">
        <div class="flex flex-col md:flex-row gap-2 justify-start items-center">
          <VaButton
            v-if="!showPriceList || showEditForm"
            class="px-3 py-2"
            icon="arrow_back"
            size="small"
            @click="goBack"
          >
            Back to List
          </VaButton>
          <h2 v-if="showPriceList && !showEditForm" class="text-xl font-bold text-gray-700">
            <VaIcon name="list_alt" class="mr-2" />
            Price Lists
          </h2>
          <h2 v-if="showEditForm" class="text-xl font-bold text-gray-700">
            <VaIcon name="edit" class="mr-2" />
            Edit Price List
          </h2>
        </div>
        <VaButton
          v-if="!ShowCreateNewPriceListForm && showPriceList && !showEditForm"
          class="px-4 py-2"
          color="primary"
          icon="add"
          round
          @click="showCreateNewPriceListFormMethod"
        >
          Add a new Price List
        </VaButton>
      </div>

      <VaDivider />

      <!-- Main Content -->
      <template v-if="!ShowCreateNewPriceListForm">
        <!-- Price List View -->
        <template v-if="showPriceList">
          <!-- Filters Section -->
          <div class="filters-section bg-gray-50 rounded-lg p-4 mb-6 mt-4">
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <!-- Season Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  <VaIcon name="date_range" size="small" class="mr-1" />
                  Season
                </label>
                <VaSelect
                  v-model="seasonValue"
                  :options="seasonOptions"
                  placeholder="Select Season"
                  :loading="loadingSeasons"
                  @update:modelValue="getPriceLists"
                />
              </div>

              <!-- Hunting Type Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  <VaIcon name="pets" size="small" class="mr-1" />
                  Hunting Type
                </label>
                <VaSelect
                  v-model="huntingTypeValue"
                  :options="huntingTypeOptions"
                  placeholder="Filter By Type"
                  @update:modelValue="getPriceLists"
                />
              </div>

              <!-- Area Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  <VaIcon name="location_on" size="small" class="mr-1" />
                  Hunting Area
                </label>
                <VaSelect
                  v-model="areaValue"
                  :options="areasOptions"
                  placeholder="Filter By Area"
                  @update:modelValue="getPriceLists"
                />
              </div>

              <!-- Min Amount Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  <VaIcon name="attach_money" size="small" class="mr-1" />
                  Min Amount
                </label>
                <VaInput v-model="minAmount" type="number" placeholder="Min price" @change="getPriceLists" />
              </div>

              <!-- Max Amount Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  <VaIcon name="attach_money" size="small" class="mr-1" />
                  Max Amount
                </label>
                <VaInput v-model="maxAmount" type="number" placeholder="Max price" @change="getPriceLists" />
              </div>

              <!-- Download Button -->
              <div class="flex items-end">
                <VaButton
                  class="w-full"
                  color="secondary"
                  icon="download"
                  :loading="downloadingPdf"
                  @click="onDownloadPdf"
                >
                  Download PDF
                </VaButton>
              </div>
            </div>
          </div>

          <!-- Stats Summary -->
          <div v-if="items.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div class="stat-card bg-blue-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ items.length }}</div>
              <div class="text-sm text-gray-600">Total Packages</div>
            </div>
            <div class="stat-card bg-green-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-green-600">{{ activePackages }}</div>
              <div class="text-sm text-gray-600">Active</div>
            </div>
            <div class="stat-card bg-amber-50 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-amber-600">{{ uniqueAreas }}</div>
              <div class="text-sm text-gray-600">Areas</div>
            </div>
          </div>

          <!-- Price List Table -->
          <VaInnerLoading :loading="loading">
            <div v-if="items.length === 0 && !loading" class="text-center py-12">
              <VaIcon name="inventory_2" size="4rem" color="gray" />
              <p class="text-gray-500 mt-4">No price lists found for the selected filters.</p>
            </div>

            <VaDataTable v-else :items="items" :columns="columns" hoverable striped :loading="loading">
              <template #cell(package_name)="{ rowData }">
                <div class="font-semibold">{{ rowData.package_name }}</div>
              </template>
              <template #cell(area)="{ rowData }">
                <div class="flex items-center gap-1">
                  <VaIcon name="location_on" size="small" color="secondary" />
                  {{ rowData.area }}
                </div>
              </template>
              <template #cell(amount)="{ rowData }">
                <span class="font-semibold text-green-600">{{ rowData.amount }}</span>
              </template>
              <template #cell(duration)="{ rowData }"> {{ rowData.duration }} Days </template>
              <template #cell(status)="{ rowData }">
                <VaBadge :text="rowData.status" :color="rowData.status === 'Active' ? 'success' : 'warning'" />
              </template>
              <template #cell(season_name)="{ rowData }">
                {{ rowData.season_name || 'N/A' }}
              </template>
              <template #cell(species_count)="{ rowData }">
                <VaBadge :text="String(rowData.species_count || 0)" color="info" />
              </template>
              <template #cell(actions)="{ rowData }">
                <div class="flex gap-2">
                  <VaButton
                    preset="plain"
                    icon="visibility"
                    color="primary"
                    size="small"
                    title="View Details"
                    @click="toggleShowPriceListMethod(rowData)"
                  />
                  <VaButton
                    preset="plain"
                    icon="edit"
                    color="warning"
                    size="small"
                    title="Edit"
                    @click="editPriceList(rowData)"
                  />
                  <VaButton
                    preset="plain"
                    icon="delete"
                    color="danger"
                    size="small"
                    title="Delete"
                    @click="confirmDelete(rowData)"
                  />
                </div>
              </template>
            </VaDataTable>
          </VaInnerLoading>
        </template>

        <!-- Detail View -->
        <template v-else-if="!showEditForm">
          <PricesListDetails :price-list-item="item" :pdf-data="individualPriceListPdf"></PricesListDetails>
        </template>

        <!-- Edit Form -->
        <template v-else-if="showEditForm">
          <CreatePricesListForm :edit-mode="true" :edit-item="editItem" @saved="onEditSaved"></CreatePricesListForm>
        </template>
      </template>

      <!-- Create Form -->
      <template v-if="ShowCreateNewPriceListForm">
        <CreatePricesListForm></CreatePricesListForm>
      </template>
    </VaCardContent>
  </VaCard>

  <!-- Delete Confirmation Modal -->
  <VaModal v-model="showDeleteModal" hide-default-actions>
    <template #header>
      <h3 class="va-h6">Confirm Delete</h3>
    </template>
    <p>
      Are you sure you want to delete <strong>{{ itemToDelete?.package_name }}</strong
      >?
    </p>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <VaButton preset="secondary" @click="showDeleteModal = false">Cancel</VaButton>
        <VaButton color="danger" :loading="deleting" @click="confirmDeletePriceList">Delete</VaButton>
      </div>
    </template>
  </VaModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useToast } from 'vuestic-ui'
import PricesListDetails from './components/PricesList/PriceListDetails.vue'
import { usePriceListStore } from '../../stores/price-list-store'
import CreatePricesListForm from './components/PricesList/CreatePricesListForm.vue'
import { useQuotaStore } from '../../stores/quota-store'
import { useSettingsStore } from '../../stores/settings-store'
import downloadPdf from '../../utils/pdfDownloader'
import handleErrors from '../../utils/errorHandler'

export default defineComponent({
  name: 'ManagePriceList',
  components: {
    PricesListDetails,
    CreatePricesListForm,
  },

  setup() {
    const formRef = ref(null) as any
    return {
      formRef,
    }
  },

  data() {
    const columns = [
      { key: 'package_name', label: 'Package Name', sortable: true },
      { key: 'area', label: 'Area', sortable: true },
      { key: 'hunting_type', label: 'Hunting Type', sortable: true },
      { key: 'amount', label: 'Price', sortable: true },
      { key: 'duration', label: 'Duration', sortable: true },
      { key: 'season_name', label: 'Season', sortable: true },
      { key: 'species_count', label: 'Species', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false, width: 120 },
    ]

    return {
      columns,
      items: [] as any[],
      printableDataList: [] as any[],
      item: null as any,
      toast: useToast(),
      areasOptions: [] as any,
      huntingTypeOptions: [] as any,
      seasonOptions: [] as any,
      showPriceList: true,
      ShowCreateNewPriceListForm: false,
      loading: false,
      loadingSeasons: false,
      huntingTypeValue: null as any,
      areaValue: null as any,
      seasonValue: null as any,
      minAmount: null as any,
      maxAmount: null as any,
      poriceListPdf: '' as any,
      individualPriceListPdf: '' as any,
      downloadPdf,
      downloadingPdf: false,
      showDeleteModal: false,
      itemToDelete: null as any,
      deleting: false,
      showEditForm: false,
      editItem: null as any,
    }
  },

  computed: {
    ...mapState(useSettingsStore, ['logo']),

    activePackages(): number {
      return this.items.filter((item: any) => item.status === 'Active').length
    },

    uniqueAreas(): number {
      const areas = new Set(this.items.map((item: any) => item.area))
      return areas.size
    },
  },

  mounted() {
    this.getSeasonOptions()
    this.getPriceLists()
    this.getAreas()
    this.getHuntingTypesOptions()
    this.loadLogo()
  },

  methods: {
    ...mapActions(usePriceListStore, [
      'getPriceList',
      'getPriceListByHuntingType',
      'getPriceListById',
      'deletePriceList',
      'getCompletePriceListPdf',
    ]),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useSettingsStore, ['getHuntingsTypes', 'loadLogo', 'getSeasons']),

    getActiveSpecies(species: any[]) {
      return species.filter((s: any) => s.quantity > 0)
    },

    formatDate(dateStr: string) {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },

    async getSeasonOptions() {
      this.loadingSeasons = true
      try {
        const response = await this.getSeasons(false)
        if (response.status === 200) {
          const all = { value: '', text: 'All Seasons' }
          this.seasonOptions = response.data.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
          this.seasonOptions.unshift(all)
          this.seasonValue = this.seasonOptions[0]
        }
      } catch (error) {
        console.error('Error fetching seasons:', error)
      } finally {
        this.loadingSeasons = false
      }
    },

    async toggleShowPriceListMethod(rowData: any) {
      const priceListId = rowData?.id
      if (!priceListId) return

      try {
        const response = await this.getPriceListById(priceListId)
        this.item = response.data.data || response.data
        this.individualPriceListPdf = response.data.pdf || ''
        this.showPriceList = false
      } catch (error) {
        console.error('Error fetching price list detail:', error)
      }
    },

    async onDownloadPdf() {
      this.downloadingPdf = true
      try {
        const unwrap = (v: any) => {
          if (v === null || v === undefined) return ''
          if (typeof v === 'object' && 'value' in v) return v.value
          return v
        }

        const huntingTypeId = unwrap(this.huntingTypeValue) || ''
        const areaId = unwrap(this.areaValue) || ''
        const seasonId = unwrap(this.seasonValue) || ''
        const minAmount = this.minAmount || ''
        const maxAmount = this.maxAmount || ''

        const response = await this.getCompletePriceListPdf(huntingTypeId, areaId, seasonId, minAmount, maxAmount)

        if (response.status === 200) {
          const pdf = response.data?.pdf || response.data
          const isUrl = (s: any) => typeof s === 'string' && /^https?:\/\//i.test(s)
          const isLikelyBase64 = (s: any) => typeof s === 'string' && s.length > 200 && /^[A-Za-z0-9+/=\r\n]+$/.test(s)

          if (!pdf || (!isUrl(pdf) && !isLikelyBase64(pdf))) {
            this.toast?.init({ message: 'PDF not available', color: 'warning' })
            return
          }

          await downloadPdf(pdf, `price-list-${Date.now()}.pdf`)
        } else {
          this.toast?.init({ message: 'Failed to generate PDF', color: 'danger' })
        }
      } catch (err) {
        console.error('Error downloading PDF:', err)
        this.toast?.init({ message: 'Failed to download PDF', color: 'danger' })
      } finally {
        this.downloadingPdf = false
      }
    },

    goBack() {
      this.showPriceList = true
      this.ShowCreateNewPriceListForm = false
      this.showEditForm = false
      this.editItem = null
      this.getPriceLists()
    },

    showCreateNewPriceListFormMethod() {
      this.ShowCreateNewPriceListForm = true
      this.showPriceList = false
      this.showEditForm = false
    },

    async editPriceList(item: any) {
      try {
        // Fetch full details for editing
        const response = await this.getPriceListById(item.id)
        this.editItem = response.data.data || response.data
        this.showEditForm = true
        this.showPriceList = false
        this.ShowCreateNewPriceListForm = false
      } catch (error) {
        console.error('Error fetching price list for edit:', error)
        this.toast?.init({ message: 'Failed to load price list details', color: 'danger' })
      }
    },

    onEditSaved() {
      this.showEditForm = false
      this.showPriceList = true
      this.editItem = null
      this.getPriceLists()
      this.toast?.init({ message: 'Price list updated successfully', color: 'success' })
    },

    confirmDelete(item: any) {
      this.itemToDelete = item
      this.showDeleteModal = true
    },

    async confirmDeletePriceList() {
      if (!this.itemToDelete) return

      this.deleting = true
      try {
        const response = await this.deletePriceList(this.itemToDelete.id, true)
        if (response.status === 200 || response.status === 204) {
          this.toast?.init({ message: 'Price list deleted successfully', color: 'success' })
          this.showDeleteModal = false
          this.itemToDelete = null
          this.getPriceLists()
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        this.toast?.init({ message: errors.join(', ') || 'Failed to delete price list', color: 'danger' })
      } finally {
        this.deleting = false
      }
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
        const seasonId = unwrap(this.seasonValue) || ''
        const minAmount = this.minAmount || ''
        const maxAmount = this.maxAmount || ''

        const response = await this.getPriceList(huntingTypeId, areaId, seasonId, minAmount, maxAmount)

        if (response.status === 200) {
          const raw = response?.data
          const dataArray = Array.isArray(raw) ? raw : raw?.data ?? []

          this.printableDataList = raw
          this.poriceListPdf = raw?.pdf || ''

          if (Array.isArray(dataArray)) {
            this.items = dataArray.map((item: any) => ({
              id: item.id,
              package_name: item.package_name,
              area: item.area,
              area_package: item.area_package,
              hunting_type: item.hunting_type,
              amount: item.amount,
              duration: item.duration,
              status: item.status,
              start_date: item.start_date,
              end_date: item.end_date,
              season_id: item.season_id,
              season_name: item.season_name,
              species_count: item.species_count,
              species: item.species || [],
              companion_hunter_costs: item.companion_hunter_costs || [],
            }))
          } else {
            this.items = []
          }
        }
      } catch (error) {
        console.error('Error in getPriceLists:', error)
      } finally {
        this.loading = false
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        const all = { value: '', text: 'All Areas' }
        this.areasOptions = response?.data?.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
        this.areasOptions.unshift(all)
        this.areaValue = this.areasOptions[0]
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    },

    async getHuntingTypesOptions() {
      try {
        const response = await this.getHuntingsTypes()
        if (response.status === 200) {
          const all = { value: '', text: 'All Types' }
          this.huntingTypeOptions = response?.data?.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
          this.huntingTypeOptions.unshift(all)
          this.huntingTypeValue = this.huntingTypeOptions[0]
        }
      } catch (error) {
        console.error('Error fetching hunting types:', error)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.price-list-page {
  min-height: 600px;
}

.filters-section {
  border: 1px solid #e5e7eb;
}

.stat-card {
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.price-card {
  .card-header {
    background: linear-gradient(135deg, #92400e 0%, #b45309 100%);
  }

  .detail-item {
    display: flex;
    align-items: center;
  }
}

.species-preview {
  .va-badge {
    font-size: 0.7rem !important;
  }
}
</style>
