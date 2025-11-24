<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton
            v-if="!showPackageList || showDetailsPage"
            class="px-2 py-2"
            icon="arrow_back"
            size="small"
            @click="goBack"
          >
            Go Back
          </VaButton>
        </div>
        <VaButtonGroup v-if="!showCreateNewPackageForm && !showDetailsPage">
          <VaButton
            class="px-2 py-2"
            color="primary"
            label="Add New Quota"
            icon="add"
            :border-color="'primary'"
            round
            preset="secondary"
            size="small"
            @click="showCreateNewPackaeListFormMethod"
          >
            Add a package
          </VaButton>
        </VaButtonGroup>
      </div>
      <VaDivider />

      <template v-if="showDetailsPage">
        <SalesPackageDetails :item="selectItem"> </SalesPackageDetails>
      </template>

      <template v-else-if="showCreateNewPackageForm && !showDetailsPage">
        <SalesPackageForm> </SalesPackageForm>
      </template>
      <template v-else-if="showPackageList">
        <ModuleTable :items="packages" :columns="columns" :loading="loading" @onView="showDetails"> </ModuleTable>
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import handleErrors from '../../utils/errorHandler'
import { validators } from '../../services/utils'
import { useForm, useToast } from 'vuestic-ui'
import { mapActions, mapState } from 'pinia'
import { useQuotaStore } from '../../stores/quota-store'
import { useSettingsStore } from '../../stores/settings-store'
import { usePriceListStore } from '../../stores/price-list-store'
import ModuleTable from './components/ModuleTable.vue'
import { useRegulatoryPackageStore } from '../../stores/regulatrory-store'
import SalesPackageDetails from './components/SalesPackageDetails.vue'
import SalesPackageForm from './components/SalesPackageForm.vue'

export default defineComponent({
  components: {
    SalesPackageDetails,
    SalesPackageForm,

    ModuleTable,
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
    } = useForm(formRef)

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
      { key: 'id', sortable: true, sortingOptions: ['desc', 'asc'] },
      { key: 'name', sortable: true },
      { key: 'area_name', label: 'Area', sortable: true },
      { key: 'regulatory_package_name', label: 'Licence', sortable: true },
      { key: 'actions', sortable: true },
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
    ...mapActions(usePriceListStore, ['createPriceList', 'createSalesPackage', 'getSalesPackageList']),
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
      this.getSalesPackages()
    },

    async submit() {
      this.saving = true
      if (this.licenceAreaSpecies.length === 0) {
        this.init({
          message: 'Please select at least one species.',
          color: 'warning',
        })
        return
      }

      const requestdata = {
        name: this.form.package_name,
        description: this.form.description,
        areaId: this.form.area.value,
        licenceId: this.form.licence.value,
        speciesObjectList: this.licenceAreaSpecies,
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
      this.selectItem = data.selfItem
      // this.showEditForm = true
    },

    async getSalesPackages() {
      this.loading = true
      try {
        const response = await this.getSalesPackageList()
        if (response.status === 200) {
          this.packages = response.data.map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              area_name: item?.area?.name ?? 'N/A',
              regulatory_package_name: item?.regulatory_package?.name ?? 'N/A',
              selfItem: item,
            }
          })
          this.loading = false
        }
      } catch (error) {
        this.loading = false
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

<style lang="scss">
@import '@vuestic/ag-grid-theme';
</style>
