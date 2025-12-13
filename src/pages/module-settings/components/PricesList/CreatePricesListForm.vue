<template>
  <div class="price-list-form-page">
    <!-- Form Container -->
    <div class="form-price-list-container">
      <div v-if="!savingPriceList" class="card">
        <div class="card-header bg-white border-bottom">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <button type="button" class="btn btn-secondary btn-sm" @click="handleGoBack">
                <i class="fa fa-arrow-left me-1"></i> Back
              </button>
              <i class="fa fa-edit text-primary fs-5"></i>
              <h2 class="h5 mb-0">{{ editMode ? 'Edit Price List' : 'Create New Price List' }}</h2>
            </div>
          </div>
        </div>

        <div class="card-body">
          <VaForm ref="formRef">
            <!-- Price List Information & Charges - Combined for better space -->
            <div class="card mb-2">
              <div class="card-header bg-light py-2">
                <h6 class="mb-0"><i class="fa fa-info-circle text-primary me-2"></i>Price List Information</h6>
              </div>
              <div class="card-body py-2">
                <div class="row g-2">
                  <div class="col-md-4">
                    <label class="form-label small mb-1">Packages <span class="text-danger">*</span></label>
                    <VaSelect
                      v-model="form.package"
                      :options="packageOptions"
                      multiple
                      clearable
                      placeholder="Select Package list here"
                      :rules="[(v: any) => v || 'Package is required']"
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
                        <i class="fa fa-plus ms-2" style="cursor: pointer" @click="_showModal()"></i>
                      </template>
                    </VaSelect>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label small mb-1">Hunting Type <span class="text-danger">*</span></label>
                    <VaSelect
                      v-model="form.hunting_type_id"
                      placeholder="Select Hunting Type"
                      :rules="[(v: any) => v || 'Hunting type is required']"
                      :options="huntingTypesOptions"
                      searchable
                      highlight-matched-text
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label small mb-1">Season <span class="text-danger">*</span></label>
                    <VaSelect v-model="form.season" :options="seasonsOptions" placeholder="Select season" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Charges -->
            <div class="card mb-2">
              <div class="card-header bg-light py-2">
                <h6 class="mb-0"><i class="fa fa-dollar-sign text-primary me-2"></i>Charges</h6>
              </div>
              <div class="card-body py-2">
                <div class="row g-2">
                  <div class="col-md-4">
                    <label class="form-label small mb-1">Amount <span class="text-danger">*</span></label>
                    <VaInput
                      v-model="form.amount"
                      type="text"
                      placeholder="Enter Amount"
                      :rules="[(value: any) => (value && value.length > 0) || 'Amount is required']"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label small mb-1">Currency <span class="text-danger">*</span></label>
                    <VaSelect
                      v-model="form.currency"
                      placeholder="Select Currency"
                      :rules="[(v: any) => v || 'Currency is required']"
                      :options="currencyOptions"
                      searchable
                      highlight-matched-text
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label small mb-1">Duration (days) <span class="text-danger">*</span></label>
                    <VaSelect
                      v-model="form.duration"
                      :options="durationsOptions"
                      placeholder="Enter Duration eg: 21 days"
                      :rules="[(v: any) => v || 'Duration is required']"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Companion & Observer Charges - Combined for better space -->
            <div class="card mb-2">
              <div class="card-header bg-light py-2">
                <h6 class="mb-0"><i class="fa fa-users text-primary me-2"></i>Companion & Observer Charges</h6>
              </div>
              <div class="card-body py-2">
                <div class="row g-2">
                  <div class="col-md-3">
                    <label class="form-label small mb-1">Companion Cost</label>
                    <VaInput v-model="form.companion_amount" type="number" placeholder="Enter Amount" />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label small mb-1">Companion Days</label>
                    <VaSelect
                      v-model="form.companion_days"
                      :options="durationsOptions"
                      placeholder="Select Days"
                      clearable
                    />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label small mb-1">Observer Cost</label>
                    <VaInput v-model="form.observer_amount" type="number" placeholder="Enter Amount" />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label small mb-1">Observer Days</label>
                    <VaSelect
                      v-model="form.observer_days"
                      :options="durationsOptions"
                      placeholder="Select Days"
                      clearable
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Upgrade Fees Section (Optional) -->
            <div class="card mb-2">
              <div class="card-header bg-light py-2 d-flex justify-content-between align-items-center">
                <h6 class="mb-0"><i class="fa fa-arrow-up text-primary me-2"></i>Upgrade Fees (Optional)</h6>
                <button type="button" class="btn btn-primary btn-sm" @click="addUpgradeFee">
                  <i class="fa fa-plus me-1"></i> Add Fee
                </button>
              </div>
              <div class="card-body py-2">
                <p class="text-muted small mb-2">
                  Add upgrade fees for additional species that can be hunted beyond the standard package.
                </p>

                <div v-if="upgradeFees.length > 0">
                  <div
                    v-for="(fee, index) in upgradeFees"
                    :key="index"
                    class="card mb-2 border-warning"
                    style="border-left: 3px solid #ffc107"
                  >
                    <div class="card-body py-2">
                      <div class="row g-2 mb-2">
                        <div class="col-md-3">
                          <label class="form-label small mb-1">Species <span class="text-danger">*</span></label>
                          <VaSelect
                            v-model="fee.species_id"
                            :options="speciesOptions"
                            placeholder="Select Species"
                            searchable
                            highlight-matched-text
                            :rules="[(v: any) => v || 'Species is required']"
                          />
                        </div>
                        <div class="col-md-2">
                          <label class="form-label small mb-1">Amount <span class="text-danger">*</span></label>
                          <VaInput
                            v-model="fee.amount"
                            type="number"
                            placeholder="Amount"
                            :rules="[(v: any) => (v !== null && v !== undefined && v !== '') || 'Amount is required']"
                          />
                        </div>
                        <div class="col-md-2">
                          <label class="form-label small mb-1">Currency <span class="text-danger">*</span></label>
                          <VaSelect
                            v-model="fee.currency_id"
                            :options="currencyOptions"
                            placeholder="Currency"
                            :rules="[(v: any) => v || 'Currency is required']"
                          />
                        </div>
                        <div class="col-md-4">
                          <label class="form-label small mb-1">Description (Optional)</label>
                          <VaInput v-model="fee.description" type="text" placeholder="Enter description" />
                        </div>
                        <div class="col-md-1 d-flex align-items-end">
                          <button
                            type="button"
                            class="btn btn-danger btn-sm w-100"
                            style="background-color: #b30000; border-color: #b30000; color: white"
                            title="Remove"
                            @click="removeUpgradeFee(index)"
                          >
                            <i class="fa fa-trash" style="color: white"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-3 text-muted border border-dashed rounded small">
                  <i class="fa fa-info-circle me-2"></i>
                  No upgrade fees added. Click "Add Fee" to add optional upgrade fees.
                </div>
              </div>
            </div>
          </VaForm>
        </div>
      </div>

      <!-- Floating Sticky Footer Navigation -->
      <div class="floating-footer-wrapper">
        <div class="floating-footer bg-white border-top shadow-lg">
          <div class="d-flex justify-content-end align-items-center py-3 px-4">
            <VaButton icon="save" :loading="savingPriceList" :disabled="!canSubmit" @click="validateForm() && submit()">
              {{ editMode ? 'Update Price List' : 'Save Price List' }}
            </VaButton>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div
    v-if="savingPriceList"
    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
    style="background: rgba(0, 0, 0, 0.5); z-index: 9999"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
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
  emits: ['saved', 'go-back'],
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
      observer_days: null as any,
      observer_amount: null as any,
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
      originalFormData: null as any,
      originalUpgradeFees: [] as any[],
    }
  },
  computed: {
    ...mapState(usePriceListStore, ['salesPackages', 'packageOptions', 'latestPackage', 'loadingpackages']),
    ...mapWritableState(usePriceListStore, {
      _shM: 'showModal',
    }),
    // Check if form has changed from original values
    hasFormChanged() {
      if (!this.editMode || !this.originalFormData) {
        return true // In create mode, always allow submit (validation will handle it)
      }

      // Helper function to get value from option object or direct value
      const getValue = (val: any) => {
        if (val === null || val === undefined) return null
        if (typeof val === 'object' && val !== null && 'value' in val) return val.value
        return val
      }

      // Helper to compare two values (handles null/undefined)
      const compareValues = (a: any, b: any) => {
        const valA = getValue(a)
        const valB = getValue(b)
        if (valA === null && valB === null) return true
        if (valA === null || valB === null) return false
        return valA === valB
      }

      // Compare form fields
      if (!compareValues(this.form.hunting_type_id, this.originalFormData.hunting_type_id)) return true
      if (!compareValues(this.form.currency, this.originalFormData.currency)) return true
      if (!compareValues(this.form.duration, this.originalFormData.duration)) return true

      // Compare season by ID
      const currentSeasonId = getValue(this.form.season)?.id || getValue(this.form.season)
      const originalSeasonId = getValue(this.originalFormData.season)?.id || getValue(this.originalFormData.season)
      if (currentSeasonId !== originalSeasonId) return true

      // Compare amounts (normalize to string for comparison)
      const normalizeAmount = (amt: any) => String(amt || '').trim()
      if (normalizeAmount(this.form.amount) !== normalizeAmount(this.originalFormData.amount)) return true
      if (normalizeAmount(this.form.companion_amount) !== normalizeAmount(this.originalFormData.companion_amount))
        return true
      if (normalizeAmount(this.form.observer_amount) !== normalizeAmount(this.originalFormData.observer_amount))
        return true

      if (!compareValues(this.form.companion_days, this.originalFormData.companion_days)) return true
      if (!compareValues(this.form.observer_days, this.originalFormData.observer_days)) return true

      // Compare packages - check if arrays have same values
      const currentPackages = (this.form.package || [])
        .map((p: any) => getValue(p))
        .filter((v: any) => v !== null && v !== undefined)
        .sort()
      const originalPackages = (this.originalFormData.package || [])
        .map((p: any) => getValue(p))
        .filter((v: any) => v !== null && v !== undefined)
        .sort()
      if (currentPackages.length !== originalPackages.length) return true
      if (JSON.stringify(currentPackages) !== JSON.stringify(originalPackages)) return true

      // Compare upgrade fees
      const normalizeFees = (fees: any[]) => {
        return fees
          .map((fee: any) => ({
            id: fee.id || null,
            species_id: getValue(fee.species_id),
            amount: normalizeAmount(fee.amount),
            currency_id: getValue(fee.currency_id),
            description: (fee.description || '').trim(),
          }))
          .sort((a: any, b: any) => {
            // Sort by id first, then by species_id
            if (a.id !== b.id) return (a.id || 0) - (b.id || 0)
            return (a.species_id || 0) - (b.species_id || 0)
          })
      }

      const currentFees = normalizeFees(this.upgradeFees || [])
      const originalFees = normalizeFees(this.originalUpgradeFees || [])
      if (currentFees.length !== originalFees.length) return true
      if (JSON.stringify(currentFees) !== JSON.stringify(originalFees)) return true

      return false
    },
    // In edit mode, check if form has changed
    // In create mode, check validation
    canSubmit() {
      if (this.editMode) {
        return this.hasFormChanged // Only allow submit if form has changed
      }
      return this.isValidForm // Check validation in create mode
    },
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

    handleGoBack() {
      this.$emit('go-back')
    },

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
        // Also include price_type_packages array expected by backend
        price_type_packages: this.form.package
          ?.filter((v: any) => v?.value !== undefined)
          .map((v: any) => ({ sales_package_id: v?.value })),
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
        companionAmount:
          this.form.companion_amount !== null && this.form.companion_amount !== undefined
            ? Number(this.form.companion_amount)
            : null,
        companionDays: this.form.companion_days?.value || this.form.companion_days,
        observerAmount:
          this.form.observer_amount !== null && this.form.observer_amount !== undefined
            ? Number(this.form.observer_amount)
            : null,
        observerDays: this.form.observer_days?.value || this.form.observer_days,
        upgrade_fees: validUpgradeFees.length > 0 ? validUpgradeFees : null,
      }

      // Log the payload being sent
      console.log('=== PRICE LIST SUBMIT PAYLOAD ===')
      console.log('Edit Mode:', this.editMode)
      console.log('Full Request Data:', JSON.stringify(requestdata, null, 2))
      console.log('Observer Amount:', requestdata.observerAmount)
      console.log('Observer Days:', requestdata.observerDays)
      console.log('Companion Amount:', requestdata.companionAmount)
      console.log('Companion Days:', requestdata.companionDays)
      console.log('=================================')

      try {
        let response: any
        if (this.editMode && this.editItem) {
          console.log('Updating price list with ID:', this.editItem.id)
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

      // Set observer fields - check for observer_hunter_costs in nested structure
      const observerCosts = this.editItem.observer_hunter_costs || priceListType.observer_hunter_costs
      if (observerCosts && observerCosts.length > 0) {
        const firstObserver = observerCosts[0]
        this.form.observer_amount = firstObserver.amount || null
        if (firstObserver.days) {
          this.form.observer_days = this.durationsOptions.find((d: any) => d.value === firstObserver.days) || {
            value: firstObserver.days,
            text: `${firstObserver.days} days`,
          }
        }
      } else {
        // Fallback to direct properties
        this.form.observer_amount = this.editItem.observer_amount || null
        if (this.editItem.observer_days) {
          this.form.observer_days = this.durationsOptions.find((d: any) => d.value === this.editItem.observer_days) || {
            value: this.editItem.observer_days,
            text: `${this.editItem.observer_days} days`,
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
        this.upgradeFees = upgradeFees.map((fee: any) => {
          // Find species option
          const speciesOption = this.speciesOptions.find((s: any) => s.value === fee.species_id)
          // Find currency option
          const currencyOption = this.currencyOptions.find((c: any) => c.value === fee.currency_id)

          return {
            id: fee.id, // Keep the ID for updating existing fees
            species_id: speciesOption || {
              value: fee.species_id,
              text: fee.species?.name || fee.species_name || `Species ${fee.species_id}`,
            },
            // Convert amount to string for input field
            amount: fee.amount ? String(fee.amount) : null,
            currency_id: currencyOption || {
              value: fee.currency_id,
              text: fee.currency?.name || fee.currency_symbol || 'USD',
            },
            description: fee.description || '',
          }
        })
      }

      // Store original form data for change detection (deep clone)
      this.originalFormData = JSON.parse(JSON.stringify(this.form))
      this.originalUpgradeFees = JSON.parse(JSON.stringify(this.upgradeFees))
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

<style scoped>
.price-list-form-page {
  position: relative;
}

/* Form Price List Container - wraps card and footer */
.form-price-list-container {
  position: relative;
}

/* Floating Footer Wrapper - matches card width and adds margins */
.floating-footer-wrapper {
  position: sticky;
  bottom: 1rem;
  z-index: 1050;
  padding: 0 1rem;
  margin-top: 1rem;
}

/* Floating Footer - matches card width, rounded corners, shadow, doesn't touch sides */
.floating-footer {
  width: 100%;
  max-width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 0 auto;
}

/* Add padding to card body to prevent content from being hidden behind sticky footer */
.form-price-list-container .card-body {
  padding-bottom: 100px;
}

/* Compact spacing for better space utilization */
.card-header {
  padding: 0.5rem 1rem;
}

.card-body {
  padding: 0.75rem 1rem;
}

.form-label.small {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

/* Reduce margins between cards */
.card.mb-2 {
  margin-bottom: 0.5rem !important;
}
</style>
