<template>
  <div class="species-page">
    <!-- Breadcrumb -->
    <div class="d-flex align-items-center mb-3">
      <div>
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">SETTINGS</a></li>
          <li class="breadcrumb-item active">SPECIES</li>
        </ul>
      </div>
    </div>

    <VaCard class="p-6">
      <!-- Form for Adding Species -->

      <div v-if="!showSpeciesList" class="flex flex-col md:flex-row gap-2 mb-2 justify-between align-items-center">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton v-if="!showSpeciesList" size="small" class="px-2" icon="arrow_back" @click="showSpecies">
            Go Back
          </VaButton>
        </div>
      </div>

      <ModuleTable v-if="showSpeciesList" :items="items" :columns="columns" :loading="loading" @onView="showSpecies">
        <template #filter-elements-and-download-btn>
          <VaButton
            class="px-2 py-2"
            color="primary"
            label="Add New Species"
            icon="add"
            size="small"
            @click="showSpecies"
            >Add a new species</VaButton
          >
        </template>
      </ModuleTable>

      <div v-else class="p-2">
        <VaForm ref="sformRef" class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            <!-- name -->

            <VaInput
              v-model="sform.name"
              label="Species Name"
              placeholder="Enter Species Name"
              :rules="[(v: any) => !!v || 'Species Name is required']"
              required
            />
            <VaInput
              v-model="sform.scientific_name"
              label="Scientific Name"
              placeholder="Select Scientific Name"
              :rules="[(v: any) => !!v || 'Scientific Name is required']"
              required
            />
            <!-- Type -->
            <div class="mb-4 grid grid-cols-1 md:grid-cols-1">
              <VaSelect
                v-model="sform.type"
                label="Type"
                :options="TYPES"
                :rules="[(v: any) => !!v || 'Type is required']"
                required-mark
              />
            </div>
          </div>
          <!-- description -->
          <div class="mb-4 grid grid-cols-1 md:grid-cols-1">
            <VaTextarea
              v-model="sform.description"
              label="Description"
              placeholder="Enter Description"
              :rules="[(v: any) => !!v || 'Description is required']"
              required
            />
          </div>
          <!-- start_date -->
        </VaForm>

        <div class="mb-6">
          <VaButton
            :disabled="!isValidSForm"
            color="primary"
            icon="save"
            icon-color="#fff"
            @click="validateSForm() && addNewSpecies()"
          >
            Save
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
import ModuleTable from './components/ModuleTable.vue'
import { useSpeciesStore } from '../../stores/species-store'
import handleErrors from '../../utils/errorHandler'
// import PDFViewer from 'pdf-viewer-vue'
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
    // PDFViewer,
  },

  setup() {
    const formRef = ref(null) as any
    const sformRef = ref(null) as any

    const columns = [
      { key: 'id', label: 'ID', sortable: true, sortingOptions: ['desc', 'asc'] },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'scientific_name', label: 'Scientific Name', sortable: true },
      { key: 'type', label: 'Type', sortable: true },

      // { key: 'actions', width: 80 },
    ]

    const {
      isValid: isValidSForm,
      validate: validateSForm,
      resetValidation: resetValidationSForm,
      reset: resetSForm,
    } = useForm()

    // Make sure to use `isValidForm`, `validateForm`, and `resetValidationForm` in your component logic as needed
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
    const items: [] = []

    const sform = reactive({
      id: null as any,
      name: '',
      type: null as any,
      scientific_name: '',
      description: '',
    })

    const TYPES = [
      {
        value: 'MAIN',
        text: 'Main Species',
      },
      {
        value: 'NORMAL',
        text: 'Normal Species',
      },
    ]

    const quotasOptions = [] as any

    return {
      items,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(), // Initialize useToast here

      sform,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      speciesObjects: [] as any,
      showModal: false,
      quotasOptions,
      showSpeciesList: true,
      quotaItems: [] as any,
      excellFile: [] as any,
      loading: false,
      saving: false,
      TYPES,
    }
  },

  mounted() {
    this.getSpeciesItems()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useSpeciesStore, ['createSpecies']),

    showSpecies(e: any) {
      console.log(e.id)
      this.showSpeciesList = !this.showSpeciesList
      // this.sform.salesQuota = {
      //   value: e.id,
      //   text: this.generateQuotaYear(e.start_date, e.end_date) + ` - ${e.name}`,
      // }
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async addNewSpecies() {
      this.saving = true
      const requestData = {
        name: this.sform.name,
        type: this.sform.type.value,
        scientific_name: this.sform.scientific_name,
        description: this.sform.description,
      }
      try {
        const response = await this.createSpecies(requestData)
        if (response.status === 201) {
          this.saving = false
          this.toast.init({
            message: response.data.message,
            color: 'success',
          })
          this.resetSForm()
          this.getSpeciesItems()
        }
      } catch (error: any) {
        this.saving = false
        const errors = handleErrors(error.response || error) // Handle any error response

        console.log('Caught errors:', errors) // Log caught errors for debugging

        const message =
          errors.length > 0
            ? '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n')
            : 'An unexpected error occurred. Please try again later.' // Fallback message

        this.toast.init({
          message, // Use the constructed message
          color: 'danger',
        })
      }
    },

    formatDate(date: Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    async getSpeciesItems() {
      try {
        this.loading = true
        const response = await this.getSpeciesList()

        if (response.status === 200) {
          this.items = response?.data?.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            scientific_name: item.scientific_name,
          }))

          this.loading = false
        } else {
          this.loading = false
          this.toast.init({
            message: 'Failed to fetch species items',
            color: 'danger',
          })
        }
      } catch (error) {
        this.loading = false
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
