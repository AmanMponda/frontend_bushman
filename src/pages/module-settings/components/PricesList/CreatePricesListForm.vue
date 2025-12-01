<template>
  <VaInnerLoading :loading="savingPriceList" :size="60">
    <VaForm ref="formRef">
      <div class="p-1">
        <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> -->
        <h3 class="font-bold text-lg mb-2">Price list Infos</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaSelect
            v-model="form.package"
            :options="packageOptions"
            multiple
            clearable
            placeholder="Select Package list here"
            :rules="[(v: any) => v || 'Package is required']"
            label="Packages"
            required-mark
            @update:modelValue="onChangePackage"
          >
            <template #content="{ value }">
              <VaChip
                v-for="chip in value"
                :key="chip"
                size="small"
                color="info"
                class="mr-1 my-1"
                closeable
                @update:modelValue="deleteChip(chip)"
              >
                {{ chip.text }}
              </VaChip>
            </template>
            <template #append>
              <VaIcon name="add" class="ml-2" @click="_showModal()" />
            </template>
          </VaSelect>
          <!-- <VaInput v-model="form.nick_name" placeholder="Nick name" label="Nick name" /> -->
          <VaSelect
            v-model="form.hunting_type_id"
            placeholder="Select Hunting Type"
            label="Hunting Type"
            :rules="[(v: any) => v || 'Hunting type is required']"
            :options="huntingTypesOptions"
            searchable
            required-mark
            highlight-matched-text
          />
          <VaSelect
            v-model="form.season"
            :options="seasonsOptions"
            required-mark
            label="Select season"
            placeholder="Select season"
          />
        </div>

        <!-- Experience and Date Group -->
        <h3 class="font-bold text-lg mb-2">Charges</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaInput
            v-model="form.amount"
            type="text"
            placeholder="Enter Amount"
            :rules="[(value: any) => (value && value.length > 0) || 'Amount is required']"
            label="Amount"
            required-mark
          />

          <VaSelect
            v-model="form.currency"
            placeholder="Select Currency"
            label="Currency"
            :rules="[(v: any) => v || 'Currency is required']"
            :options="currencyOptions"
            searchable
            highlight-matched-text
            required-mark
          />
          <!-- <vue-tel-input v-model="form.phone" mode="international" required></vue-tel-input> -->

          <VaSelect
            v-model="form.duration"
            type="text"
            :options="durationsOptions"
            required-mark
            placeholder="Enter Duration eg: 21 days"
            :rules="[(v: any) => v || 'Duration is required']"
            label="Duration(days)"
          />
        </div>

        <!-- companion group -->
        <h3 class="font-bold text-lg mb-2">Companion Charges</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <VaInput
            v-model="form.companion_amount"
            type="number"
            placeholder="Enter Companion Amount"
            label="Companion Cost"
          />
          <VaSelect
            v-model="form.companion_days"
            :options="durationsOptions"
            placeholder="Select Companion Days"
            label="Companion Days"
            clearable
          />
        </div>

        <!-- Upgrade Fees Section (Optional) -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-lg">Upgrade Fees (Optional)</h3>
            <VaButton size="small" color="primary" icon="add" @click="addUpgradeFee"> Add Upgrade Fee </VaButton>
          </div>
          <p class="text-sm text-gray-500 mb-3">
            Add upgrade fees for additional species that can be hunted beyond the standard package.
          </p>

          <div v-if="upgradeFees.length > 0" class="space-y-4">
            <VaCard
              v-for="(fee, index) in upgradeFees"
              :key="index"
              class="p-4 bg-gray-50"
              stripe
              stripe-color="warning"
            >
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <VaSelect
                  v-model="fee.species_id"
                  :options="speciesOptions"
                  placeholder="Select Species"
                  label="Species"
                  searchable
                  highlight-matched-text
                  :rules="[(v: any) => v || 'Species is required']"
                />
                <VaInput
                  v-model="fee.amount"
                  type="number"
                  placeholder="Enter Amount"
                  label="Amount"
                  :rules="[(v: any) => v || 'Amount is required']"
                />
                <VaSelect
                  v-model="fee.currency_id"
                  :options="currencyOptions"
                  placeholder="Select Currency"
                  label="Currency"
                  :rules="[(v: any) => v || 'Currency is required']"
                />
                <div class="flex items-end">
                  <VaButton color="danger" icon="delete" size="small" @click="removeUpgradeFee(index)">
                    Remove
                  </VaButton>
                </div>
              </div>
              <div class="mt-3">
                <VaInput
                  v-model="fee.description"
                  type="textarea"
                  placeholder="Enter description (optional)"
                  label="Description"
                  :min-rows="2"
                />
              </div>
            </VaCard>
          </div>

          <div v-else class="text-center py-4 text-gray-400 border border-dashed border-gray-300 rounded-lg">
            <VaIcon name="info" size="small" class="mr-1" />
            No upgrade fees added. Click "Add Upgrade Fee" to add optional upgrade fees.
          </div>
        </div>
      </div>

      <div class="mt-4 d-flex p-2">
        <VaButton
          icon="save"
          class="mr-3 mb-2"
          :loading="savingPriceList"
          :disabled="!isValidForm"
          @click="validateForm() && submit()"
        >
          {{ editMode ? 'Update' : 'Save' }}
        </VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
  <VaModal v-model="_shM" ok-text="Apply" close-button size="large" :hide-default-actions="true">
    <SalesPackageForm> </SalesPackageForm>
  </VaModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import handleErrors from '../../../../utils/errorHandler'
import { validators } from '../../../../services/utils'

import { useForm, useToast } from 'vuestic-ui'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { useQuotaStore } from '../../../../stores/quota-store'
import { useSettingsStore } from '../../../../stores/settings-store'
import { usePriceListStore } from '../../../../stores/price-list-store'
import SalesPackageForm from '../SalesPackageForm.vue'

export default defineComponent({
  components: {
    // Salesinquirieslist,
    SalesPackageForm,
    VaForm,
    VaInput,
    VaSelect,
    VaButton,
  },
  props: {
    editMode: {
      type: Boolean,
      default: false,
    },
    editItem: {
      type: Object,
      default: null,
    },
  },
  emits: ['saved'],
  setup() {
    const formRef = ref()

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const { init } = useToast()
    const showEditForm = ref(false)
    // const _usePriceListStore: any = usePriceListStore()

    // const pkg: any = computed(() => {
    //   return _usePriceListStore.latestPackage
    // })

    const form = reactive({
      id: null as any,
      hunting_type_id: null as any,
      // is list
      package: [] as any,
      // description: '',s
      // sales_quota_id: null as any,
      amount: null as any,

      currency: null as any,
      duration: null as any,
      season: null as any,
      end_date: null as any,
      species: null as any,
      quantity: null as any,
      // area: null as any,
      companion_days: null as any,
      companion_amount: null as any,
    })

    // make as copy of pkg to form package

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const deleteChip = (chip: any) => {
      form.package = form.package.filter((v: any) => v !== chip)
    }

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
      deleteChip,
      validators,
    }
  },
  data() {
    // 1-21
    const durationsOptions: any = [
      { value: 1, text: '1 day' },
      { value: 2, text: '2 days' },
      { value: 3, text: '3 days' },
      { value: 4, text: '4 days' },
      { value: 5, text: '5 days' },
      { value: 6, text: '6 days' },
      { value: 7, text: '7 days' },
      { value: 8, text: '8 days' },
      { value: 9, text: '9 days' },
      { value: 10, text: '10 days' },
      { value: 11, text: '11 days' },
      { value: 12, text: '12 days' },
      { value: 13, text: '13 days' },
      { value: 14, text: '14 days' },
      { value: 15, text: '15 days' },
      { value: 16, text: '16 days' },
      { value: 17, text: '17 days' },
      { value: 18, text: '18 days' },
      { value: 19, text: '19 days' },
      { value: 20, text: '20 days' },
      { value: 21, text: '21 days' },
    ]
    return {
      preferred_species: [] as any,
      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      huntingTypesOptions: [] as any,
      salesQuotasOptions: [] as any,
      speciesItemOptions: [] as any,
      currencyOptions: [] as any,
      // packageOptions: [] as any,
      savingPriceList: false,
      durationsOptions,
      seasonsOptions: [] as any,
      upgradeFees: [] as any[],
    }
  },
  computed: {
    ...mapState(usePriceListStore, ['salesPackages', 'packageOptions', 'latestPackage', 'loadingpackages']),
    ...mapWritableState(usePriceListStore, {
      _shM: 'showModal',
    }),
  },

  watch: {
    // use both close modal and show modal to close modal
    // i want if the  closeMadal is true then showModal should be false
  },
  async mounted() {
    // this.getAllSpeciesPerQuotaPerArea()
    await Promise.all([
      this.getAreas(),
      this.getHuntingTypes(),
      this.getQuotaList(),
      this.getCurrencyList(),
      this.getSalesPackages(),
      this.getSeasonList(),
      this.getSpeciesItems(),
    ])

    // If in edit mode, populate form with existing data (after options are loaded)
    if (this.editMode && this.editItem) {
      this.populateFormForEdit()
    }
  },

  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useSettingsStore, ['getHuntingsTypes']),
    ...mapActions(useSettingsStore, ['getCurrencies', 'getSeasons']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(usePriceListStore, ['createPriceList', 'updatePriceList']),
    ...mapActions(usePriceListStore, ['getSalesPackageList']),

    // addNewSpeciesItemToStorage() {},
    // CreateSalesInquiry

    // ...mapActions(useSalesInquiriesStore, ['createSalesInquiry']),

    onAreaChange(value: any) {
      console.log(value as any)
      // this.getAllSpieces()
    },

    async submit() {
      this.savingPriceList = true

      // Prepare upgrade fees data (only include valid entries)
      const validUpgradeFees = this.upgradeFees
        .filter((fee: any) => fee.species_id && fee.amount && fee.currency_id)
        .map((fee: any) => {
          const feeData: any = {
            species_id: fee.species_id?.value || fee.species_id,
            amount: parseFloat(fee.amount),
            currency_id: fee.currency_id?.value || fee.currency_id,
            description: fee.description || '',
          }
          // Include ID for existing fees (when editing)
          if (fee.id) {
            feeData.id = fee.id
          }
          return feeData
        })

      const requestdata = {
        huntingTypeId: this.form.hunting_type_id?.value || this.form.hunting_type_id,
        sales_package_ids: this.form.package?.filter((v: any) => v?.value !== undefined).map((v: any) => v?.value),
        amount: this.form.amount,
        currency: this.form.currency?.value || this.form.currency,
        duration: this.form.duration?.value || this.form.duration,
        season_id: this.form.season?.value?.id || this.form.season?.id,
        //chriss' codes
        start_at: this.form.season?.value?.start_at || this.form.season?.start_at,
        end_at: this.form.season?.value?.end_at || this.form.season?.end_at,
        is_active: 1,
        area_id: 3,
        user_id: 1,
        companionAmount: this.form.companion_amount ? String(this.form.companion_amount) : null,
        companionDays: this.form.companion_days?.value || this.form.companion_days,
        upgrade_fees: validUpgradeFees.length > 0 ? validUpgradeFees : null,
      }

      // console.log(requestdata);
      // return ;
      try {
        let response: any
        if (this.editMode && this.editItem) {
          response = await this.updatePriceList(this.editItem.id, requestdata)
          if (response.status === 200) {
            this.init({ message: 'Price list updated successfully', color: 'success' })
            this.savingPriceList = false
            this.$emit('saved')
          }
        } else {
          response = await this.createPriceList(requestdata)
          if (response.status === 201) {
            this.init({ message: response.data.message, color: 'success' })
            this.resetForm()
            this.resetValidationForm()
            this.speciesObjects = []
            this.upgradeFees = []
            this.savingPriceList = false
          }
        }
      } catch (error: any) {
        this.savingPriceList = false
        handleErrors(error.response)
        console.log(error)
        this.init({
          message: error.message,
          color: 'danger',
        })
      }
    },

    populateFormForEdit() {
      if (!this.editItem) return

      // Options should already be loaded since we await them in mounted()
      console.log('Edit Item:', JSON.stringify(this.editItem, null, 2))
      console.log('Hunting Types Options:', this.huntingTypesOptions)
      console.log('Seasons Options:', this.seasonsOptions)
      console.log('Currency Options:', this.currencyOptions)

      // Handle nested structure from API (price_list_type contains the main data)
      const priceListType = this.editItem.price_list_type || this.editItem

      // Set amount - handle different data structures
      const rawAmount = priceListType.amount || this.editItem.amount
      if (rawAmount) {
        this.form.amount = String(rawAmount).replace('$', '').replace(',', '')
      }

      // Set duration - handle nested structure
      const durationValue = priceListType.duration || this.editItem.duration
      if (durationValue !== undefined && durationValue !== null) {
        this.form.duration = this.durationsOptions.find((d: any) => d.value === durationValue) || {
          value: durationValue,
          text: `${durationValue} days`,
        }
      }

      // Set hunting type - match by name since API returns name only
      const huntingTypeName = priceListType.hunting_type?.name || this.editItem.hunting_type
      console.log('Hunting Type Name:', huntingTypeName)
      if (huntingTypeName) {
        this.form.hunting_type_id = this.huntingTypesOptions.find((h: any) => h.text === huntingTypeName)
      }
      console.log('Selected Hunting Type:', this.form.hunting_type_id)

      // Set season - need to find season that matches the date range
      const startDate = priceListType.price_list?.start_date
      const endDate = priceListType.price_list?.end_date
      console.log('Season dates:', startDate, endDate)
      if (startDate && endDate) {
        // Find season by matching dates
        this.form.season = this.seasonsOptions.find(
          (s: any) => s.value?.start_at === startDate && s.value?.end_at === endDate,
        )
        // If not found by exact date, try to find by year
        if (!this.form.season) {
          const year = new Date(startDate).getFullYear()
          this.form.season = this.seasonsOptions.find((s: any) => s.text?.includes(String(year)))
        }
      }
      console.log('Selected Season:', this.form.season)

      // Set currency - match by name since API returns name only
      const currencyName = priceListType.currency?.name
      console.log('Currency Name:', currencyName)
      if (currencyName) {
        this.form.currency = this.currencyOptions.find((c: any) => c.text === currencyName)
      }
      if (!this.form.currency) {
        // Default to USD if not set
        this.form.currency = this.currencyOptions.find((c: any) => c.text === 'USD') || this.currencyOptions[0]
      }
      console.log('Selected Currency:', this.form.currency)

      // Set companion fields - check for companion_hunter_costs in nested structure
      const companionCosts = this.editItem.companion_hunter_costs || priceListType.companion_hunter_costs
      if (companionCosts && companionCosts.length > 0) {
        const firstCompanion = companionCosts[0]
        this.form.companion_amount = firstCompanion.amount || null
        if (firstCompanion.days) {
          this.form.companion_days = this.durationsOptions.find((d: any) => d.value === firstCompanion.days) || {
            value: firstCompanion.days,
            text: `${firstCompanion.days} days`,
          }
        }
      } else {
        // Fallback to direct properties
        this.form.companion_amount = this.editItem.companion_amount || null
        if (this.editItem.companion_days) {
          this.form.companion_days = this.durationsOptions.find(
            (d: any) => d.value === this.editItem.companion_days,
          ) || {
            value: this.editItem.companion_days,
            text: `${this.editItem.companion_days} days`,
          }
        }
      }

      // Set packages if available - check in sales_package or packages array
      const salesPackage = this.editItem.sales_package
      if (salesPackage) {
        this.form.package = [
          {
            value: salesPackage.id,
            text: salesPackage.name,
          },
        ]
      } else if (this.editItem.packages && Array.isArray(this.editItem.packages)) {
        this.form.package = this.editItem.packages.map((p: any) => ({
          value: p.id,
          text: p.name,
        }))
      }

      // Populate upgrade fees if available
      const upgradeFees = this.editItem.upgrade_fees || priceListType.upgrade_fees
      if (upgradeFees && Array.isArray(upgradeFees) && upgradeFees.length > 0) {
        this.upgradeFees = upgradeFees.map((fee: any) => ({
          id: fee.id, // Keep the ID for updating existing fees
          species_id: this.speciesOptions.find((s: any) => s.value === fee.species_id) || {
            value: fee.species_id,
            text: fee.species?.name || `Species ${fee.species_id}`,
          },
          amount: fee.amount,
          currency_id: this.currencyOptions.find((c: any) => c.value === fee.currency_id) || {
            value: fee.currency_id,
            text: fee.currency?.name || 'USD',
          },
          description: fee.description || '',
        }))
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        // Add the species items from the response
        this.speciesOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        // Combine default option with species items
        // this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },
    async getSeasonList() {
      try {
        const response = await this.getSeasons()
        this.seasonsOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    _showModal() {
      this._shM = true
    },

    async getSalesPackages() {
      try {
        await this.getSalesPackageList(true)
      } catch (error) {
        console.log(error)
      }
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
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

    // get hunting types
    async getHuntingTypes() {
      try {
        const response = await this.getHuntingsTypes()
        this.huntingTypesOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    onChangePackage(value: any) {
      console.log(value.filter((v: any) => v?.value !== undefined).map((v: any) => v?.value))
    },

    // async getAllSpieces() {
    //   try {
    //     const response = await this.getAllSpeciesPerQuotaPerArea(null, this.form.area?.value ?? null, null)
    //     this.speciesItemOptions = response.data.map((item: any) => {
    //       return {
    //         value: item.species.id,
    //         text: item.species.name,
    //       }
    //     })
    //     // }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },

    // get quotas
    async getQuotaList() {
      try {
        const response = await this.getQuotas(null)
        this.salesQuotasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getCurrencyList() {
      try {
        const response = await this.getCurrencies()
        this.currencyOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    // Upgrade fees methods
    addUpgradeFee() {
      this.upgradeFees.push({
        species_id: null,
        amount: null,
        currency_id: null,
        description: '',
      })
    },

    removeUpgradeFee(index: number) {
      this.upgradeFees.splice(index, 1)
    },

    // get clients
  },
})
</script>
s
