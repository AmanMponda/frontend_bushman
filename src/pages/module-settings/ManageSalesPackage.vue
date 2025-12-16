<template>
  <div class="sales-package-page">
    <!-- Breadcrumb -->
    <div class="d-flex align-items-center mb-3">
      <div>
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Sales</a></li>
          <li class="breadcrumb-item active">Sales Packages</li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <template v-if="!showCreateNewPackageForm">
      <!-- Package List View -->
      <template v-if="showPackageList">
        <div class="row layout-top-spacing bg-white rounded">
          <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
            <div class="panel br-6 p-0">
              <div class="custom-table p-3">
                <StandardDataTable
                  :columns="columns"
                  :data="packages"
                  :loading="loading"
                  :disable-search="false"
                  :disable-pagination="false"
                  :action-buttons="pageActions"
                  :show-date-filters="false"
                >
                  <template #id="{ row }">
                    {{ (row as any).id }}
                  </template>
                  <template #name="{ row }">
                    {{ (row as any).name }}
                  </template>
                  <template #area_name="{ row }">
                    {{ (row as any).area_name }}
                  </template>
                  <template #regulatory_package_name="{ row }">
                    {{ (row as any).regulatory_package_name }}
                  </template>
                  <template #actions="{ row }">
                    <div class="d-flex gap-1">
                      <button class="btn btn-info btn-sm" title="View" @click="showDetails(row)">
                        <i class="fa fa-eye"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" title="Delete" @click="confirmDelete(row)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </template>
                </StandardDataTable>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Detail View -->
      <template v-else-if="showDetailsPage">
        <SalesPackageDetails
          :item="selectItem"
          @goBack="goBack"
          @edit="handleEditFromDetails"
          @delete="handleDeleteFromDetails"
        ></SalesPackageDetails>
      </template>

      <!-- Edit Form -->
      <template v-else-if="showEditPackageForm">
        <SalesPackageForm
          :edit-mode="true"
          :edit-item="selectItem"
          @saved="onEditSaved"
          @goBack="goBack"
        ></SalesPackageForm>
      </template>
    </template>

    <!-- Create Form -->
    <template v-if="showCreateNewPackageForm">
      <SalesPackageForm @saved="onPackageSaved" @goBack="goBack"> </SalesPackageForm>
    </template>
  </div>

  <!-- Delete Confirmation Modal -->
  <VaModal v-model="showDeleteModal" hide-default-actions>
    <template #header>
      <h3 class="va-h6">Confirm Delete</h3>
    </template>
    <p>
      Are you sure you want to delete <strong>{{ itemToDelete?.name }}</strong
      >?
    </p>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <VaButton preset="secondary" @click="showDeleteModal = false">Cancel</VaButton>
        <VaButton color="danger" :loading="deleting" @click="deletePackage">Delete</VaButton>
      </div>
    </template>
  </VaModal>

  <!-- Delete Confirmation Modal -->
  <VaModal v-model="showDeleteModal" hide-default-actions>
    <template #header>
      <h3 class="va-h6">Confirm Delete</h3>
    </template>
    <p>
      Are you sure you want to delete <strong>{{ itemToDelete?.name }}</strong
      >?
    </p>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <VaButton preset="secondary" @click="showDeleteModal = false">Cancel</VaButton>
        <VaButton color="danger" :loading="deleting" @click="deletePackage">Delete</VaButton>
      </div>
    </template>
  </VaModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import handleErrors from '../../utils/errorHandler'
import { validators } from '../../services/utils'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { mapActions, mapState } from 'pinia'
import { useQuotaStore } from '../../stores/quota-store'
import { useSettingsStore } from '../../stores/settings-store'
import { usePriceListStore } from '../../stores/price-list-store'
import { useRegulatoryPackageStore } from '../../stores/regulatrory-store'
import SalesPackageDetails from './components/SalesPackageDetails.vue'
import SalesPackageForm from './components/SalesPackageForm.vue'
import StandardDataTable from '@/components/bootstrap/StandardDataTable.vue'

export default defineComponent({
  components: {
    SalesPackageDetails,
    SalesPackageForm,
    StandardDataTable,
  },
  setup() {
    const formRef = ref()
    // const contactFormRef = ref()
    // const showAddSalesInquiriesForm = ref(false)
    // const btnIcon = ref('add')

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    const { init } = useToast()
    const showEditForm = ref(false)

    const form = reactive({
      //   id: null as any,
      //   hunting_type_id: null as any,
      package_name: '',
      description: '',
      //   sales_quota_id: null as any,
      //   amount: 0,
      // samount: 0,
      //   currency: null as any,
      //   duration: 0,
      //   start_date: null as any,
      //   end_date: null as any,
      species: null as any,
      quantity: 1,
      area: null as any,
      licence: null as any,
      //   companion_days: 0,
      //   companion_amount: 0,
      //   observer_days: 0,
      //   observer_amount: 0,
    })

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const countries = ref([]) as any
    const nationality = ref([]) as any
    const categoryOptions = ref([]) as any
    const contactsTypes = ref([]) as any
    const clients = ref([]) as any
    const step = ref(0) as any

    return {
      formRef,
      form,
      contactForm,
      showEditForm,
      countries,
      nationality,
      categoryOptions,
      contactsTypes,
      clients,
      step,
      // steps,
      init,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,

      validators,
      // getCountries,
      // // deleteSalesInquireItem,
      // getCategories,
      // getNationalities,
      // getContactTypes,
      // contactFieldType,
      // togel,
      // toggle,
    }
  },
  data() {
    const columns = [
      { key: 'id', label: 'ID', sortable: true, visible: true },
      { key: 'name', label: 'Name', sortable: true, visible: true },
      { key: 'area_name', label: 'Area', sortable: true, visible: true },
      { key: 'regulatory_package_name', label: 'Licence', sortable: true, visible: true },
      { key: 'actions', label: 'Actions', sortable: false, visible: true },
    ]

    return {
      // modules: [ClientSideRowModelModule],
      defaultColDef: {
        editable: true,
      },
      columnDefs: [{ field: 'name' }, { field: 'quantity' }],
      preferred_species: [] as any,
      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      huntingTypesOptions: [] as any,
      salesQuotasOptions: [] as any,
      speciesItemOptions: [] as any,
      currencyOptions: [] as any,
      showPackageList: true,
      showCreateNewPackageForm: false,
      showEditPackageForm: false,
      packages: [] as any,
      columns,
      loading: false,
      saving: false,
      regulatoryPackagesOptions: [] as any,
      loadingLicenceOptions: false,
      loadingSpeciesOptions: false,
      isChanged: false,
      originalQuantities: reactive({} as any), // to keep track of original quantities
      quntityChangedsaved: false,
      showDetailsPage: false,
      selectItem: null as any,
      showDeleteModal: false,
      itemToDelete: null as any,
      deleting: false,
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['licenceAreaSpecies', 'laodinglicenceAreaSpecies']),
    itemChanged(): any {
      return (id: any) => {
        const originalValue = this.originalQuantities[id]
        const currentValue = this.licenceAreaSpecies.find((item: any) => item.id === id).quantity
        console.log('Original value:', originalValue, 'Current value:', currentValue)
        return (originalValue && originalValue !== currentValue) || this.isChanged
      }
    },
    pageActions() {
      const actions = []
      if (
        this.showPackageList &&
        !this.showCreateNewPackageForm &&
        !this.showEditPackageForm &&
        !this.showDetailsPage
      ) {
        actions.push({
          label: 'Add Package',
          icon: 'fa fa-plus',
          class: 'btn btn-primary',
          method: () => this.showCreateNewPackaeListFormMethod(),
        })
      }
      return actions
    },
  },

  mounted() {
    // this.getAllSpeciesPerQuotaPerArea()
    // this.getAreas()
    // this.getHuntingTypes()
    // this.getQuotaList()
    // this.getCurrencyList()
    this.loading = true
    this.getSpeciesItems()
    this.getSalesPackages()
    this.getLicencePackages()
    this.getAreas()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useSettingsStore, ['getHuntingsTypes']),
    ...mapActions(useSettingsStore, ['getCurrencies']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(usePriceListStore, [
      'createPriceList',
      'createSalesPackage',
      'getSalesPackageList',
      'updateSalesPackage',
      'deleteSalesPackage',
    ]),
    ...mapActions(useRegulatoryPackageStore, ['getRegulatoryPackages']),
    ...mapActions(useSettingsStore, ['getHuntingLicenseAreaSpecies']),

    // addNewSpeciesItemToStorage() {},
    // CreateSalesInquiry

    // ...mapActions(useSalesInquiriesStore, ['createSalesInquiry']),

    showCreateNewPackaeListFormMethod() {
      this.showCreateNewPackageForm = true
      this.showPackageList = false
    },

    goBack() {
      this.showCreateNewPackageForm = false
      this.showPackageList = true
      this.showDetailsPage = false
      this.showEditPackageForm = false
      this.selectItem = null
      this.getSalesPackages()
    },
    onPackageSaved() {
      this.showCreateNewPackageForm = false
      this.showPackageList = true
      this.getSalesPackages()
    },

    editPackage(rowData: any) {
      this.selectItem = rowData.selfItem || rowData
      this.showEditPackageForm = true
      this.showPackageList = false
    },

    handleEditFromDetails() {
      this.showEditPackageForm = true
      this.showDetailsPage = false
    },

    handleDeleteFromDetails() {
      this.itemToDelete = this.selectItem
      this.showDeleteModal = true
      this.showDetailsPage = false
    },

    onEditSaved() {
      this.showEditPackageForm = false
      this.showPackageList = true
      this.selectItem = null
      this.getSalesPackages()
    },

    confirmDelete(rowData: any) {
      this.itemToDelete = rowData.selfItem || rowData
      this.showDeleteModal = true
    },

    async deletePackage() {
      if (!this.itemToDelete) return

      this.deleting = true
      try {
        const response = await this.deleteSalesPackage(this.itemToDelete.id, true)
        if (response.status === 200 || response.status === 204) {
          this.init({
            message: 'Package deleted successfully.',
            color: 'success',
          })
          this.showDeleteModal = false
          this.itemToDelete = null
          this.showDetailsPage = false
          this.showEditPackageForm = false
          this.selectItem = null
          this.showPackageList = true
          this.getSalesPackages()
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        this.init({
          message: errors.join(', ') || 'Failed to delete package.',
          color: 'danger',
        })
      } finally {
        this.deleting = false
      }
    },

    async submit() {
      this.saving = true

      // Filter out species with quantity 0 or less
      const speciesWithQuantity = this.licenceAreaSpecies.filter((species: any) => species.quantity > 0)

      if (speciesWithQuantity.length === 0) {
        this.init({
          message: 'Please add at least one species with quantity greater than 0.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      const requestdata = {
        name: this.form.package_name,
        description: this.form.description,
        areaId: this.form.area.value,
        licenceId: this.form.licence.value,
        speciesObjectList: speciesWithQuantity,
      }

      try {
        const response = await this.createSalesPackage(requestdata)
        if (response.status === 201) {
          this.saving = false
          console.log(response)
          this.init({ message: response.data.message, color: 'success' })

          // this.resetForm()
          // this.resetValidationForm()
          this.licenceAreaSpecies = []
        }
      } catch (error: any) {
        this.saving = false
        const errors = handleErrors(error.response)
        console.log(errors)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    async getSpeciesItems() {
      this.loadingSpeciesOptions = true
      try {
        const response = await this.getSpeciesList()

        // Add the species items from the response
        if (response.status === 200) {
          this.loadingSpeciesOptions = false
          this.speciesItemOptions = response.data.map((item: { id: any; name: any }) => {
            return {
              value: item.id,
              text: item.name,
            }
          })
        }

        // Combine default option with species items
        // this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },

    showDetails(data: any) {
      console.log('Show details for:', data)
      this.showDetailsPage = true
      this.selectItem = data.selfItem || data
      this.showPackageList = false
    },

    async getSalesPackages() {
      this.loading = true
      try {
        const response = await this.getSalesPackageList(false)
        console.log('Sales packages response:', response)
        if (response && response.status === 200) {
          // Handle different response structures
          let dataArray = []
          if (Array.isArray(response.data)) {
            dataArray = response.data
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            dataArray = response.data.data
          } else if (response.data?.data && !Array.isArray(response.data.data)) {
            dataArray = [response.data.data]
          }

          this.packages = dataArray.map((item: any) => {
            return {
              id: item.id,
              name: item.name || 'N/A',
              area_name: item?.area?.name ?? 'N/A',
              regulatory_package_name: item?.regulatory_package?.name ?? 'N/A',
              selfItem: item,
            }
          })
          console.log('Mapped packages:', this.packages)
          this.loading = false
        } else {
          this.packages = []
          this.loading = false
        }
      } catch (error) {
        console.error('Error fetching sales packages:', error)
        this.loading = false
        this.packages = []
      }
    },

    async getLicencePackages() {
      this.loadingLicenceOptions = true
      try {
        const response = await this.getRegulatoryPackages()
        if (response.status === 200) {
          this.loadingLicenceOptions = false
          const data = response.data
          this.regulatoryPackagesOptions = data.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getLicenceAreaSpeciesList() {
      const payload = {
        areaId: this.form.area.value,
        licenceId: this.form.licence.value,
      }

      try {
        const response = await this.getHuntingLicenseAreaSpecies(payload)
        if (response.status === 200) {
          const data = response.data
          this.speciesOptions = data.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        console.log(errors)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    onChange(id: any, newValue: any) {
      console.log('Quantity changed:', id, newValue)
      // this.isChanged = true

      // Set the original value if it hasn't been set yet
      if (!(id in this.originalQuantities)) {
        const item = this.licenceAreaSpecies.find((item: any) => item.id === id)
        this.originalQuantities[id] = item.quantity // Direct assignment
      }

      const updatedItem = this.licenceAreaSpecies.find((item: any) => item.id === id)
      if (updatedItem) {
        updatedItem.quantity = newValue // Update the quantity with newValue
        // then update  list
        this.licenceAreaSpecies = [...this.licenceAreaSpecies]
      }
      this.init({
        message: `Quantity for ${updatedItem.name} has been updated to ${newValue} quantity(s).`,
        color: 'success',
        position: 'bottom-right',
      })

      console.log('updated item list:', this.licenceAreaSpecies)
    },

    addNewSpeciesItemToStorage() {
      // Check if all required fields in this.sform are not null
      if (!this.form.species || !this.form.quantity) {
        this.init({
          message: 'Please fill all required fields.',
          color: 'warning',
        })
        return // Exit the method if any field is null
      }

      // Ensure quantity is a positive number
      if (Number(this.form.quantity) <= 0) {
        // Uncomment the toast message if needed
        // this.toast.init({
        //   message: 'Quantity must be greater than zero.',
        //   color: 'warning',
        // });

        this.init({
          message: 'Quantity must be greater than zero.',
          color: 'warning',
        })

        return
      }

      // Check if the species item already exists
      const exists = this.speciesObjects.some(
        (species: { species_id: any }) => species.species_id === this.form.species.value,
      )

      if (!exists) {
        this.speciesObjects.push({
          id: this.form.species.value,
          name: this.form.species.text,
          // amount: this.form.samount,
          quantity: this.form.quantity,
        })
        // console.log('New species item added:', this.speciesObjects)
      } else {
        console.log('Species item already exists:', this.form.species.value)
      }

      // this.resetSForm()
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },
  },
})
</script>

<style lang="scss" scoped>
.sales-package-page {
  padding: 0;
  min-height: 600px;
  width: 100%;
}

// Local layout spacing classes to ensure consistent spacing in production
.layout-top-spacing {
  margin-top: 20px;
}

.layout-spacing {
  padding: 10px 0;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  margin: 0;
  padding: 0;
  border: none !important;
  box-shadow: none !important;
}

.breadcrumb {
  text-transform: uppercase !important;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0 !important;

  .breadcrumb-item {
    text-transform: uppercase !important;

    &::before {
      content: ' / ' !important;
      color: #9ca3af !important;
      padding: 0 0.5rem;
    }

    &:first-child::before {
      display: none !important;
    }

    a {
      text-transform: uppercase !important;
      color: #374151 !important;
      font-weight: 600;
      text-decoration: none !important;

      &:hover {
        color: #1f2937 !important;
        text-decoration: none !important;
      }
    }

    &.active {
      color: #9ca3af !important;
      font-weight: 400;
      text-transform: uppercase !important;
    }
  }
}
</style>
