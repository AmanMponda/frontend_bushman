<template>
  <div class="regulatory-package-page">
    <!-- Breadcrumb -->
    <div class="d-flex align-items-center mb-3">
      <div>
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">SALES</a></li>
          <li class="breadcrumb-item active">REGULATORY PACKAGES</li>
        </ul>
      </div>
    </div>

    <VaCard class="p-6">
      <!-- Form for Adding Species -->

      <ModuleTable
        v-if="showpackForm"
        :items="items"
        :columns="columns"
        :loading="loading"
        @onView="showNewPackageForm"
      >
        <template #filter-elements-and-download-btn>
          <VaButton
            class="px-2 py-2"
            color="primary"
            label="Add New Quota"
            icon="add"
            size="small"
            @click="showNewPackageForm"
            >Add package</VaButton
          >
        </template>
      </ModuleTable>

      <!-- <Regularorypackagelist v-if="showpackForm" :items="items" @@onView="showNewPackageForm"></Regularorypackagelist> -->

      <div v-else class="p-2">
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-start">
          <VaButton class="px-2 py-2" icon="arrow_back" size="small" @click="showNewPackageForm"> Go Back </VaButton>
        </div>

        <VaForm ref="packageFormRef" class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
            <!-- <VaValue :default-value="false">
              <VaSelect
                v-model="packageForm.salesQuota"
                :options="quotasOptions"
                label="Sales Quota"
                :rules="[(v: any) => !!v || 'Sales Quota is required']"
                placeholder="Select Sales Quota"
              >
                <template #appendInner>
                  <VaIcon name="av_timer" size="small" color="primary" />
                </template>
              </VaSelect>
            </VaValue> -->
            <!-- packageNamesOptions -->
            <VaInput
              v-model="packageForm.name"
              label="Name"
              placeholder="Enter package Name"
              type="text"
              :rules="[(v: any) => !!v || 'Package Name is required']"
              required
            />

            <!-- duration -->
            <VaInput
              v-model="packageForm.duration"
              label="Duration"
              placeholder="Enter package Duration"
              type="number"
              :rules="[(v: any) => !!v || 'Duration is required']"
              required
            />
          </div>

          <VaDivider orientation="left" class="py-6">
            <span caption class="px-2">Add a List of Species</span>
          </VaDivider>
          <!-- <h3 class="font-bold text-lg mb-4"></h3> -->

          <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
            <div class="flex flex-col md:flex-row gap-2 justify-start">
              <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
                <VaSelect
                  v-model="packageForm.id"
                  label="Species"
                  :options="speciesOptions"
                  placeholder="Select Species"
                  :rules="[(v: any) => !!v || 'Species is required']"
                  required
                />

                <VaCounter v-model="packageForm.quantity" label="Quantity" manual-input :min="1" :max="100" />
              </div>
            </div>
            <VaButtonGroup>
              <VaButton
                class="px-0 py-0"
                color="primary"
                icon="add"
                size="small"
                round
                @click="addNewSpeciesItemToStorage()"
              />
            </VaButtonGroup>
          </div>
        </VaForm>

        <div class="mb-6">
          <VaList>
            <VaListLabel v-if="speciesObjects.length > 0" class="text-md mb-2 text-left">Selected Species</VaListLabel>
            <VaListItem v-for="(s, index) in speciesObjects" :key="index" class="list__item">
              <VaListItemSection>
                <VaListItemLabel>
                  Name: {{ s.name }}
                  <VaIcon name="delete" size="small" color="primary" @click="deleteFromStorage(index)" />
                </VaListItemLabel>
                <VaListItemLabel caption>Quantity: {{ s.quantity }}</VaListItemLabel>
              </VaListItemSection>
            </VaListItem>
          </VaList>
        </div>

        <div class="mb-6">
          <VaButton
            :disabled="!isValidpackageForm"
            color="primary"
            icon="add"
            icon-color="#fff"
            @click="validatepackageForm() && addNewRegulatoryPackage()"
          >
            Submit New
          </VaButton>
        </div>
      </div>
    </VaCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuotaStore } from '../../stores/quota-store'
import { mapActions } from 'pinia'
import { reactive } from 'vue'
import { useToast } from '@/composables/useToast'
import { useForm } from '@/composables/useForm'
import handleErrors from '../../utils/errorHandler'
import ModuleTable from './components/ModuleTable.vue'
import { useRegulatoryPackageStore } from '../../stores/regulatrory-store'

const defaultItem = {
  name: '',
  start_date: null,
  end_date: null,
  // description: '',
}

export default defineComponent({
  name: 'QuotaPage',
  components: {
    ModuleTable,
  },

  setup() {
    const formRef = ref(null) as any
    const packageFormRef = ref(null) as any

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    const {
      isValid: isValidpackageForm,
      validate: validatepackageForm,
      resetValidation: resetValidationpackageForm,
      reset: resetpackageForm,
    } = useForm()

    // Make sure to use `isValidForm`, `validateForm`, and `resetValidationForm` in your component logic as needed
    return {
      isValidForm, // Ensure this is utilized somewhere
      validateForm, // Ensure this is utilized somewhere
      resetValidationForm, // Ensure this is utilized somewhere
      isValidpackageForm,
      validatepackageForm,
      resetValidationpackageForm,
      resetForm,
      resetpackageForm,
      formRef,
      packageFormRef,
    }
  },
  data() {
    const items: [] = []

    // const { isValid, validate, reset, resetValidation } = useForm(formRef)
    const form = reactive({
      id: null,
      name: '',
      start_date: null as any,
      end_date: null as any,
      description: '',
    })

    const packageForm = reactive({
      id: null as any,
      // quata: null as any,
      duration: null as any,
      name: null as any,
      quantity: 0,
      salesQuota: null as any,
      area: null as any,
    })

    const columns = [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'duration', label: 'Duration', sortable: true },
      // { key: 'description', sortable: true },
      // { key: 'actions', width: 80 },
    ]

    const packageNamesOptions = [
      { value: 'Regular', text: 'Regular Safari' },
      { value: 'Premium', text: 'Premium Safari' },
      { value: 'Major', text: 'Major Safari' },
    ]

    const quotasOptions = [] as any

    return {
      items,
      columns,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(), // Initialize useToast here

      form,
      packageForm,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      speciesObjects: [] as any,
      shopackaform: false,
      quotasOptions,
      showpackForm: true,
      quotaItems: [] as any,
      packageNamesOptions,
      loading: false,
      saving: false,
    }
  },

  mounted() {
    this.getQs()
    this.getSpeciesItems()
    this.getPackages()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['generateQuotaYear']),
    ...mapActions(useRegulatoryPackageStore, ['createNewRegulatoryPackage']),
    ...mapActions(useRegulatoryPackageStore, ['getRegulatoryPackages']),

    resetEditedItem() {
      this.editedItem = null
      this.editedItemId = null
    },
    resetCreatedItem() {
      this.createdItem = { ...defaultItem }
    },

    showNewPackageForm() {
      this.showpackForm = !this.showpackForm
      this.getPackages()
    },

    addNewSpeciesItemToStorage() {
      // Check if all required fields in this.packageForm are not null
      if (
        !this.packageForm.id ||
        !this.packageForm.id.value ||
        !this.packageForm.id.text ||
        !this.packageForm.quantity
      ) {
        console.error('Error: Some required fields are null or undefined.')
        return // Exit the method if any field is null
      }

      // Ensure quantity is a positive number
      if (Number(this.packageForm.quantity) <= 0) {
        // Uncomment the toast message if needed
        // this.toast.init({
        //   message: 'Quantity must be greater than zero.',
        //   color: 'warning',
        // });
        return
      }

      // Check if the species item already exists
      const exists = this.speciesObjects.some((species: { id: any }) => species.id === this.packageForm.id.value)

      if (!exists) {
        this.speciesObjects.push({
          id: this.packageForm.id.value,
          name: this.packageForm.id.text,
          quantity: this.packageForm.quantity,
        })
        console.log('New species item added:', this.speciesObjects)
      } else {
        console.log('Species item already exists:', this.packageForm.id)
      }

      // this.resetpackageForm()
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async addNewRegulatoryPackage() {
      if (this.speciesObjects.length === 0) {
        this.toast.init({ message: 'Please add at least one species item.', color: 'warning' })
        return
      }
      const rdata = {
        name: this.packageForm.name,
        duration: this.packageForm.duration,
        speciesObjectList: this.speciesObjects,
      }

      try {
        const response = await this.createNewRegulatoryPackage(rdata)
        if (response.status === 201) {
          this.toast.init({ message: response.data.message, color: 'success' })
          this.resetpackageForm()
          this.resetCreatedItem()
          this.speciesObjects = []
        } else {
          console.log(response.data)
        }
      } catch (error) {
        handleErrors(error)
        this.toast.init({
          message: error instanceof Error ? error.message : 'An error occurred',
          color: 'danger',
        })
      }
    },

    async getQs(id = null) {
      try {
        const response = await this.getQuotas(id)
        if (response.status === 200) {
          const data = response.data

          this.quotasOptions = data.map((item: any) => {
            const result = this.generateQuotaYear(item.start_date, item.end_date)

            // this.packageForm.salesQuota = {
            //   value: item.id,
            //   text: `${result} - ${item.name}`,
            // }

            return {
              value: item.id,
              text: `${result} - ${item.name}`,
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    async getPackages() {
      this.loading = true
      try {
        const response = await this.getRegulatoryPackages()
        if (response.status === 200) {
          this.loading = false
          const data = response.data
          this.items = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            duration: item.duration,
          }))
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        // Add the species items from the response
        const speciesItems = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        // Combine default option with species items
        this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },
  },
})
</script>

<style lang="scss">
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
