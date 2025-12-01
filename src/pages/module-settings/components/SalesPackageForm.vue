<template>
  <VaForm ref="formRef">
    <div class="p-1">
      <h3 class="font-bold text-lg mb-4">{{ editMode ? 'Edit Package' : 'Create New Package' }}</h3>
      <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <VaInput
          v-model="form.package_name"
          type="text"
          placeholder="Enter Package Name"
          :rules="[(value: any) => (value && value.length > 0) || 'Package name is required']"
          label="Package name"
          required-mark
        />
        <VaSelect
          v-model="form.licence"
          label="Licence"
          :options="regulatoryPackagesOptions"
          placeholder="Select Licence"
          required-mark
          :rules="[(v: any) => !!v || 'Licence is required']"
          required
        />

        <VaSelect
          v-model="form.area"
          label="Area"
          :options="areasOptions"
          placeholder="Select area"
          required-mark
          :rules="[(v: any) => !!v || 'Area is required']"
          required
          :disabled="laodinglicenceAreaSpecies || form.licence === null"
          :loading="laodinglicenceAreaSpecies"
          @update:modelValue="getLicenceAreaSpeciesList"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols gap-4">
        <VaTextarea
          v-model="form.description"
          max-length="120"
          label="Description"
          counter
          required-mark
          placeholder="Enter Description"
          :rules="[
            (v: any) => (v && v.length > 0) || 'Required',
            (v: any) => (v && v.length < 60) || 'Maximum 120 characters',
          ]"
        />
      </div>
    </div>
  </VaForm>

  <h3 class="font-bold text-lg mb-2">Species</h3>
  <VaInnerLoading :loading="laodinglicenceAreaSpecies" :size="30">
    <div class="va-table-responsive" :disabled="laodinglicenceAreaSpecies">
      <table class="va-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in licenceAreaSpecies" :key="item.id">
            <tr>
              <td>{{ item.name }}</td>
              <td>
                <VaCounter
                  v-model="item.quantity"
                  increase-icon="add_circle_outline"
                  decrease-icon="remove_circle_outline"
                  class="w-100 p-0"
                  :success="quntityChangedsaved"
                  manual-input
                  color="#6938D1"
                  max="100"
                  min="0"
                  max-length="3"
                  @update:modelValue="(value) => onChange(item.id, value)"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </VaInnerLoading>
  <div class="mt-4 d-flex p-2">
    <VaButton
      icon="save"
      :loading="saving"
      class="mr-3 mb-2"
      :disabled="!isValidForm"
      @click="validateForm() && submit()"
    >
      {{ editMode ? 'Update' : 'Save' }}
    </VaButton>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import handleErrors from '../../../utils/errorHandler'
import { validators } from '../../../services/utils'

import { useForm, useToast } from 'vuestic-ui'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { useSettingsStore } from '../../../stores/settings-store'
import { usePriceListStore } from '../../../stores/price-list-store'
import { useRegulatoryPackageStore } from '../../../stores/regulatrory-store'

export default defineComponent({
  components: {
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

    const form = reactive({
      package_name: '',
      description: '',
      species: null as any,
      quantity: 1,
      area: null as any,
      licence: null as any,
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
    }
  },
  data() {
    return {
      defaultColDef: {
        editable: true,
      },
      settingsStore: useSettingsStore(),
      speciesOptions: [] as any,
      areasOptions: [] as any,

      saving: false,
      regulatoryPackagesOptions: [] as any,
      loadingLicenceOptions: false,
      loading: false,

      originalQuantities: reactive({} as any), // to keep track of original quantities
      quntityChangedsaved: false,
    }
  },

  computed: {
    ...mapWritableState(useSettingsStore, ['licenceAreaSpecies']),
    ...mapState(useSettingsStore, ['laodinglicenceAreaSpecies']),
  },

  mounted() {
    this.getLicencePackages()
    this.getAreas()
    this.settingsStore.licenceAreaSpecies = []

    // If in edit mode, populate the form with existing data
    if (this.editMode && this.editItem) {
      this.form.package_name = this.editItem.name || ''
      this.form.description = this.editItem.description || ''

      // Set licence and area after options are loaded
      this.$nextTick(() => {
        if (this.editItem.regulatory_package) {
          this.form.licence = {
            value: this.editItem.regulatory_package.id,
            text: this.editItem.regulatory_package.name + '->' + this.editItem.regulatory_package.duration + ' days',
          }
        }
        if (this.editItem.area) {
          this.form.area = {
            value: this.editItem.area.id,
            text: this.editItem.area.name,
          }
          // Load species for the area
          this.getLicenceAreaSpeciesList()
        }

        // Pre-populate species if available
        if (this.editItem.species && this.editItem.species.length > 0) {
          setTimeout(() => {
            this.settingsStore.licenceAreaSpecies = this.editItem.species.map((s: any) => ({
              id: s.species?.id || s.id,
              name: s.species?.name || s.name,
              quantity: s.quantity || 1,
            }))
          }, 500)
        }
      })
    }
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
    ]),
    ...mapActions(useRegulatoryPackageStore, ['getRegulatoryPackages']),
    ...mapActions(useSettingsStore, ['getHuntingLicenseAreaSpecies']),

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
        let response
        if (this.editMode && this.editItem) {
          response = await this.updateSalesPackage(this.editItem.id, requestdata)
          if (response.status === 200) {
            this.saving = false
            this.init({ message: 'Package updated successfully.', color: 'success' })
            this.$emit('saved')
          }
        } else {
          response = await this.createSalesPackage(requestdata)
          if (response.status === 201) {
            this.saving = false
            this.init({ message: response.data.message, color: 'success' })
            this.getSalesPackages()
          }
        }
      } catch (error: any) {
        this.saving = false
        const errors = handleErrors(error.response)
        console.log(errors)
        this.init({
          message: error instanceof Error ? error.message : 'An error occurred',
          color: 'danger',
        })
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
            text: item.name + '->' + item.duration + ' ' + ' ' + 'days',
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
          message: error instanceof Error ? error.message : 'An error occurred',
          color: 'danger',
        })
      }
    },

    async getSalesPackages() {
      this.loading = true
      try {
        const response = await this.getSalesPackageList(true)
        if (response.status === 200) {
          this.loading = false
        }
      } catch (error) {
        console.log(error)
      }
    },

    onChange(id: any, newValue: any) {
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
    },
  },
})
</script>

<style lang="scss">
@import '@vuestic/ag-grid-theme';
</style>
