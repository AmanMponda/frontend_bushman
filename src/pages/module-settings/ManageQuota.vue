<template>
  <VaCard class="p-6">
    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="!showQuotaList" class="px-2 py-2" icon="arrow_back" size="small" @click="toggleQuotaView">
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup>
        <VaButton
          class="px-2 py-2"
          color="primary"
          label="Add New Quota"
          icon="add"
          size="small"
          @click="showAddQuotaModal()"
        >
          Add a New Quota
        </VaButton>
      </VaButtonGroup>
    </div>

    <!-- Use ModuleTable for quota list -->
    <ModuleTable
      v-if="showQuotaList"
      :items="items"
      :columns="columns"
      :loading="loadingQuotas"
      btn-view-icon="visibility"
      :show-edit="true"
      :show-delete="true"
      @onView="viewQuotaDetails"
      @onEdit="editQuota"
      @onDelete="confirmDeleteQuota"
    ></ModuleTable>

    <!-- Species Form Section (when showQuotaList is false) -->
    <div v-else class="p-2">
      <VaForm ref="sformRef" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
          <VaValue :default-value="false">
            <VaSelect
              v-model="sform.salesQuota"
              :options="quotasOptions"
              label="Sales Quota"
              :rules="[(v: any) => !!v || 'Sales Quota is required']"
              placeholder="Select Sales Quota"
              :disabled="true"
            >
              <template #appendInner>
                <VaIcon name="av_timer" size="small" color="primary" />
              </template>
            </VaSelect>
          </VaValue>

          <VaSelect
            v-model="sform.area"
            label="Hunting Area"
            :options="areasOptions"
            placeholder="Select Hunting Area"
            :rules="[(v: any) => !!v || 'Hunting Area is required']"
            required
          />
        </div>

        <VaDivider orientation="left" class="py-12">
          <span caption class="px-2">Add a List of Species</span>
        </VaDivider>

        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
              <VaSelect
                v-model="sform.id"
                label="Species"
                :options="speciesOptions"
                placeholder="Select Species"
                :rules="[(v: any) => !!v || 'Species is required']"
                required
                @update:modelValue="updateQuantitySelectedSpecies"
              />

              <VaCounter v-model="sform.quantity" label="Quantity" manual-input :min="1" :max="100" />
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
          :disabled="!isValidSForm"
          color="primary"
          :loading="savingQuotaSpecies"
          icon="save"
          icon-color="#fff"
          @click="validateSForm() && addNewSpeciesToQuota()"
        >
          save
        </VaButton>
      </div>
    </div>

    <!-- Add/Edit Quota Modal -->
    <VaModal v-model="showModal" z-index="1" :overlay="false" size="small" hide-default-actions @cancel="resetModal()">
      <VaForm ref="formRef" class="p-6">
        <h3 class="font-bold text-lg mb-4">{{ isEditing ? 'Edit Quota' : 'Add Quota' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <VaInput
            v-model="form.name"
            label="Name"
            placeholder="Enter Quota Name"
            type="text"
            :rules="[(v: any) => !!v || 'Name is required']"
            required
          />

          <VaDateInput
            v-model="form.start_date"
            label="Start Date"
            :rules="[(v: any) => !!v || 'Start Date is required']"
            manual-input
            placeholder="Select a date"
          />

          <VaDateInput
            v-model="form.end_date"
            label="End Date"
            :rules="[(v: any) => !!v || 'End Date is required']"
            manual-input
            placeholder="Select a date"
          />
        </div>
        <div class="mb-4">
          <VaButton
            :loading="savingQuota"
            :disabled="!isValidForm || savingQuota"
            color="primary"
            @click="isEditing ? updateQuotaItem() : createNewQuota()"
          >
            {{ isEditing ? 'Update' : 'Save' }}
          </VaButton>
          <VaButton class="ml-2" color="secondary" :disabled="savingQuota" @click="resetModal()"> Cancel </VaButton>
        </div>
      </VaForm>
    </VaModal>

    <!-- Delete Confirmation Modal -->
    <VaModal v-model="showDeleteModal" z-index="1" :overlay="false" size="small" hide-default-actions>
      <div class="p-6">
        <h3 class="font-bold text-lg mb-4 text-center">Confirm Delete</h3>
        <p class="mb-6 text-center">
          Are you sure you want to delete quota <strong>"{{ quotaToDelete?.name }}"</strong>?
          <br />
          <span class="text-sm text-gray-500">This action cannot be undone.</span>
        </p>
        <div class="flex justify-center gap-4">
          <VaButton color="danger" :loading="deletingQuota" @click="deleteQuotaItem()"> Delete </VaButton>
          <VaButton color="secondary" :disabled="deletingQuota" @click="cancelDelete()"> Cancel </VaButton>
        </div>
      </div>
    </VaModal>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuotaStore } from '../../stores/quota-store'
import { mapActions } from 'pinia'
import { reactive } from 'vue'
import { useToast } from '@/composables/useToast'
import { useForm } from '@/composables/useForm'
import handleErrors from '../../utils/errorHandler'
import { useSettingsStore } from '../../stores/settings-store'
import ModuleTable from './components/ModuleTable.vue'

interface QuotaItem {
  id: number
  name: string
  start_date: string
  end_date: string
  description?: string
  user_id?: number
  create_at?: string
  update_at?: string
}

interface Option {
  value: number | string
  text: string
  quantity?: number
}

interface FormData {
  id: number | null
  name: string
  start_date: Date | string | null
  end_date: Date | string | null
  description: string
}

interface SFormData {
  id: Option | null
  quantity: number
  salesQuota: Option | null
  area: Option | null
}

interface ApiResponse {
  success: boolean
  data: QuotaItem[]
  message: string
  count: number
}

export default defineComponent({
  name: 'QuotaPage',
  components: {
    ModuleTable,
  },

  setup() {
    const formRef = ref(null) as any
    const sformRef = ref(null) as any

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    const {
      isValid: isValidSForm,
      validate: validateSForm,
      resetValidation: resetValidationSForm,
      reset: resetSForm,
    } = useForm()

    // Define columns for the ModuleTable
    const columns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'NAME', sortable: true },
      { key: 'start_date', label: 'START DATE', sortable: true },
      { key: 'end_date', label: 'END DATE', sortable: true },
      { key: 'actions', label: 'ACTIONS', width: '150px' },
    ]

    return {
      isValidForm,
      validateForm,
      resetValidationForm,
      isValidSForm,
      validateSForm,
      resetValidationSForm,
      resetForm,
      resetSForm,
      formRef,
      sformRef,
      columns,
    }
  },

  data() {
    return {
      items: [] as QuotaItem[],
      editedItemId: null as number | null,
      editedItem: null as QuotaItem | null,
      createdItem: { name: '', start_date: null, end_date: null },
      toast: useToast(),
      form: reactive<FormData>({
        id: null,
        name: '',
        start_date: null,
        end_date: null,
        description: '',
      }),
      sform: reactive<SFormData>({
        id: null,
        quantity: 1,
        salesQuota: null,
        area: null,
      }),
      speciesOptions: [] as Option[],
      areasOptions: [] as Option[],
      speciesObjects: [] as any[],
      showModal: false,
      showDeleteModal: false,
      quotasOptions: [] as Option[],
      showQuotaList: true,
      quotaItems: [] as any[],
      savingQuotaSpecies: false,
      loadingQuotas: false,
      savingQuota: false,
      deletingQuota: false,
      isEditing: false,
      quotaToDelete: null as QuotaItem | null,
      currentViewQuota: null as QuotaItem | null,
    }
  },

  mounted() {
    this.getQs()
    this.getSpeciesItems()
    this.getAreas()
  },

  methods: {
    ...mapActions(useQuotaStore, [
      'getQuotas',
      'createQuota',
      'updateQuota',
      'deleteQuota',
      'getSpeciesList',
      'getAreaList',
      'createQuotaAreaSpecies',
    ]),

    ...mapActions(useSettingsStore, ['getLicenceRegulatoryHuntingPackageSpecies']),

    // Helper methods
    formatDate(date: Date | string | null): string {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    formatDisplayDate(date: string | null): string {
      if (!date) return '-'
      return new Date(date).toLocaleDateString()
    },

    generateQuotaYear(startDate: string, endDate: string): string {
      if (!startDate || !endDate) return ''
      const startYear = new Date(startDate).getFullYear()
      const endYear = new Date(endDate).getFullYear()
      return `${startYear}-${endYear}`
    },

    // ADD THE MISSING resetModal METHOD
    resetModal() {
      this.isEditing = false
      this.showModal = false
      this.form.id = null
      this.form.name = ''
      this.form.start_date = null
      this.form.end_date = null
      this.form.description = ''
      if (this.formRef) {
        this.resetValidationForm()
      }
    },

    // Toggle between list view and form view
    toggleQuotaView() {
      this.showQuotaList = !this.showQuotaList
      if (this.showQuotaList) {
        this.currentViewQuota = null
        this.sform.salesQuota = null
      }
    },

    // View quota details (species form) - called from ModuleTable
    viewQuotaDetails(rowData: QuotaItem) {
      console.log('View quota details:', rowData)
      this.showQuotaList = false
      this.currentViewQuota = rowData
      this.sform.salesQuota = {
        value: rowData.id,
        text: this.generateQuotaYear(rowData.start_date, rowData.end_date) + ` - ${rowData.name}`,
      }
      // Load species for this quota
      this.getSpeciesItems()
    },

    // Edit quota details (opens modal) - called from ModuleTable
    editQuota(rowData: QuotaItem) {
      console.log('Edit quota:', rowData)
      this.isEditing = true
      this.form.id = rowData.id
      this.form.name = rowData.name
      this.form.start_date = rowData.start_date ? new Date(rowData.start_date) : null
      this.form.end_date = rowData.end_date ? new Date(rowData.end_date) : null
      this.form.description = rowData.description || ''
      this.showModal = true
    },

    // Delete quota - called from ModuleTable
    confirmDeleteQuota(rowData: QuotaItem) {
      console.log('Delete quota:', rowData)
      this.quotaToDelete = rowData
      this.showDeleteModal = true
    },

    cancelDelete() {
      this.quotaToDelete = null
      this.showDeleteModal = false
    },

    async deleteQuotaItem() {
      if (!this.quotaToDelete) return

      this.deletingQuota = true
      try {
        const response = await this.deleteQuota(this.quotaToDelete.id)

        // Check response format
        const success = response.status === 200 || response.status === 204 || response.data?.success

        if (success) {
          this.toast.init({
            message: response.data?.message || 'Quota deleted successfully',
            color: 'success',
          })

          // Remove from local arrays
          this.items = this.items.filter((item) => item.id !== this.quotaToDelete!.id)
          this.quotasOptions = this.quotasOptions.filter((option) => option.value !== this.quotaToDelete!.id)

          this.cancelDelete()
        } else {
          this.toast.init({
            message: response.data?.message || 'Delete operation failed',
            color: 'warning',
          })
        }
      } catch (error: any) {
        console.error('Delete error:', error)

        // If method not allowed, try alternative
        if (error.response?.status === 405) {
          this.toast.init({
            message: 'Delete method not supported by API. Removing locally.',
            color: 'warning',
          })

          // Remove from local arrays anyway
          this.items = this.items.filter((item) => item.id !== this.quotaToDelete!.id)
          this.quotasOptions = this.quotasOptions.filter((option) => option.value !== this.quotaToDelete!.id)

          this.cancelDelete()
        } else {
          this.toast.init({
            message: error.response?.data?.message || 'Failed to delete quota',
            color: 'danger',
          })
        }
      } finally {
        this.deletingQuota = false
      }
    },

    async updateQuotaItem() {
      if (!this.form.id) return

      this.savingQuota = true
      try {
        const data = {
          id: this.form.id,
          name: this.form.name,
          start_date: this.formatDate(this.form.start_date),
          end_date: this.formatDate(this.form.end_date),
          description: this.form.description,
        }

        console.log('Updating quota with data:', data)

        const response = await this.updateQuota(data)
        if (response.status === 200) {
          this.toast.init({
            message: response.data.message || 'Quota updated successfully',
            color: 'success',
          })

          // Update the item in the local array
          const index = this.items.findIndex((item) => item.id === this.form.id)
          if (index !== -1) {
            const updatedItem = {
              ...this.items[index],
              name: this.form.name,
              start_date: this.formatDate(this.form.start_date),
              end_date: this.formatDate(this.form.end_date),
            }

            this.items = [...this.items.slice(0, index), updatedItem, ...this.items.slice(index + 1)]

            // Also update quotasOptions
            const quotaIndex = this.quotasOptions.findIndex((option) => option.value === this.form.id)
            if (quotaIndex !== -1) {
              const result = this.generateQuotaYear(
                this.formatDate(this.form.start_date),
                this.formatDate(this.form.end_date),
              )
              this.quotasOptions = [
                ...this.quotasOptions.slice(0, quotaIndex),
                {
                  value: this.form.id,
                  text: `${result} - ${this.form.name}`,
                },
                ...this.quotasOptions.slice(quotaIndex + 1),
              ]
            }
          }

          this.resetModal()
          this.showModal = false
        }
      } catch (error: any) {
        const errors = handleErrors(error)
        this.toast.init({
          message: '\n' + errors.map((error: string, index: number) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      } finally {
        this.savingQuota = false
      }
    },

    showAddQuotaModal() {
      this.resetModal()
      this.isEditing = false
      this.showModal = true
    },

    // Main quota fetching method
    async getQs(id: number | null = null) {
      console.log('Fetching quotas...')
      this.loadingQuotas = true
      try {
        const response = await this.getQuotas(id)

        if (response && response.data) {
          const apiResponse = response.data as ApiResponse

          if (apiResponse.success === true && Array.isArray(apiResponse.data)) {
            const quotaItems = apiResponse.data

            this.items = quotaItems.map((item: QuotaItem) => ({
              id: item.id,
              name: item.name,
              start_date: item.start_date,
              end_date: item.end_date,
            }))

            this.quotasOptions = quotaItems.map((item: QuotaItem) => {
              const result = this.generateQuotaYear(item.start_date, item.end_date)
              return {
                value: item.id,
                text: `${result} - ${item.name}`,
              }
            })
          } else {
            console.error('API response indicates failure or invalid data structure')
            this.items = []
            this.quotasOptions = []
          }

          this.loadingQuotas = false
        } else {
          console.error('Invalid response from API')
          this.items = []
          this.quotasOptions = []
          this.loadingQuotas = false
        }
      } catch (error: any) {
        this.loadingQuotas = false
        console.error('Error fetching quotas:', error)

        this.toast.init({
          message: 'Failed to load quotas. Please try again.',
          color: 'danger',
        })
      }
    },

    // Get species items for dropdown
    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()
        const speciesItems = response.data.map((item: { id: number; name: string }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        this.speciesOptions = speciesItems
      } catch (error: any) {
        console.log('Error fetching species:', error)
      }
    },

    // Get areas for dropdown
    async getAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: { id: number; name: string }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error: any) {
        console.log('Error fetching areas:', error)
      }
    },

    // Reset methods
    resetEditedItem() {
      this.editedItem = null
      this.editedItemId = null
    },

    resetCreatedItem() {
      this.createdItem = { name: '', start_date: null, end_date: null }
    },

    updateQuantitySelectedSpecies(species: Option) {
      if (species && species.quantity) {
        this.sform.quantity = species.quantity
      }
    },

    addNewSpeciesItemToStorage() {
      if (!this.sform.id || !this.sform.id.value || !this.sform.id.text || !this.sform.quantity) {
        console.error('Error: Some required fields are null or undefined.')
        return
      }

      if (Number(this.sform.quantity) <= 0) {
        return
      }

      const exists = this.speciesObjects.some((species: any) => species.id === this.sform.id!.value)

      if (!exists) {
        this.speciesObjects.push({
          id: this.sform.id.value as number,
          name: this.sform.id.text,
          quantity: this.sform.quantity,
        })
      } else {
        console.log('Species item already exists:', this.sform.id)
      }
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
    },

    async addNewSpeciesToQuota() {
      this.savingQuotaSpecies = true
      if (this.speciesObjects.length === 0) {
        this.toast.init({ message: 'Please add at least one species item.', color: 'warning' })
        this.savingQuotaSpecies = false
        return
      }

      if (!this.sform.area || !this.sform.salesQuota) {
        this.toast.init({ message: 'Please select both area and sales quota.', color: 'warning' })
        this.savingQuotaSpecies = false
        return
      }

      const rdata = {
        area_id: this.sform.area.value,
        quota_id: this.sform.salesQuota.value,
        speciesObjects: this.speciesObjects,
      }

      try {
        const response = await this.createQuotaAreaSpecies(rdata)
        if (response.status === 201) {
          this.savingQuotaSpecies = false
          this.toast.init({ message: response.data.message, color: 'success' })
          this.resetSForm()
          this.resetCreatedItem()
          this.speciesObjects = []
        }
      } catch (error: any) {
        const errors = handleErrors(error)
        this.savingQuotaSpecies = false

        this.toast.init({
          message: '\n' + errors.map((error: string, index: number) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    async createNewQuota() {
      this.savingQuota = true

      // Simple date formatting
      const formatDateForApi = (date: any): string => {
        if (!date) return ''

        if (date instanceof Date) {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }

        if (typeof date === 'string') {
          // If already in YYYY-MM-DD format, return as-is
          if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return date
          }

          // Try to parse
          const parsed = new Date(date)
          if (!isNaN(parsed.getTime())) {
            const year = parsed.getFullYear()
            const month = String(parsed.getMonth() + 1).padStart(2, '0')
            const day = String(parsed.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
          }
        }

        return String(date)
      }

      const quota = {
        name: this.form.name,
        start_date: formatDateForApi(this.form.start_date),
        end_date: formatDateForApi(this.form.end_date),
        description: this.form.description || '',
      }

      console.log('Creating quota with data:', quota)

      try {
        const response = await this.createQuota(quota)

        // Check the response format from the store
        if (response.success || response.status === 201) {
          this.savingQuota = false
          this.toast.init({
            message: response.message || 'Quota created successfully',
            color: 'success',
          })
          this.resetForm()

          // Refresh the quota list
          this.getQs()

          this.showModal = false
          this.resetCreatedItem()
        } else {
          this.savingQuota = false
          const errors = handleErrors(response)
          this.toast.init({
            message: '\n' + errors.map((error: string, index: number) => `${index + 1}. ${error}`).join('\n'),
            color: 'danger',
          })
        }
      } catch (error: any) {
        this.savingQuota = false
        console.error('Error creating quota:', error)

        this.toast.init({
          message: error.message || 'Failed to create quota',
          color: 'danger',
        })
      }
    },
  },
})
</script>

<style lang="scss">
.modal-content {
  padding: 16px;
}

.input-group {
  margin-bottom: 16px;
}

.input-label {
  margin-bottom: 8px;
  font-weight: bold;
}

.input-container {
  display: flex;
  align-items: center;
}

.input-container > VaDateInput {
  margin-right: 8px;
}

.input-container > VaInput {
  flex: 1;
}

/* Make action buttons smaller on mobile */
@media (max-width: 640px) {
  .flex.gap-2 {
    flex-direction: column;
    gap: 4px;
  }

  .flex.gap-2 .va-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
