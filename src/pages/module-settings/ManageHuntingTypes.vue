<template>
  <VaCard class="p-6">
    <div class="flex flex-col md:flex-row gap-2 mb-4 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="!showList" class="px-2 py-2" icon="arrow_back" size="small" @click="goBack()">
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup v-if="showList">
        <VaButton class="px-2 py-2" color="primary" icon="add" size="small" @click="showCreateForm()">
          Add a New Hunting Type
        </VaButton>
      </VaButtonGroup>
    </div>

    <!-- Data Table -->
    <VaDataTable v-if="showList" :items="items" :columns="columns" :loading="loading" hoverable striped>
      <template #cell(actions)="{ rowData }">
        <div class="flex gap-2">
          <VaButton preset="plain" icon="edit" color="primary" @click="editItem(rowData)" />
          <VaButton preset="plain" icon="delete" color="danger" @click="confirmDelete(rowData)" />
        </div>
      </template>
    </VaDataTable>

    <!-- Create/Edit Form -->
    <div v-else class="p-2">
      <VaForm ref="formRef" class="mb-6">
        <h3 class="font-bold text-lg mb-4">{{ editMode ? 'Edit Hunting Type' : 'New Hunting Type' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <VaInput
            v-model="form.name"
            label="Name"
            placeholder="Enter Hunting Type Name (e.g., 1x1, 2x1)"
            :rules="[(v: any) => !!v || 'Name is required']"
            required
          />

          <VaInput v-model="form.description" type="textarea" label="Description" placeholder="Enter Description" />
        </div>
      </VaForm>

      <div class="mb-6 flex gap-2">
        <VaButton
          :disabled="!isValidForm"
          color="primary"
          :icon="editMode ? 'save' : 'add'"
          :loading="saving"
          @click="validateForm() && (editMode ? updateItem() : createItem())"
        >
          {{ editMode ? 'Update' : 'Save' }}
        </VaButton>
        <VaButton preset="secondary" @click="goBack()"> Cancel </VaButton>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <VaModal v-model="showDeleteModal" hide-default-actions>
      <template #header>
        <h3 class="va-h6">Confirm Delete</h3>
      </template>
      <div class="p-4">
        <p class="mb-4">
          Are you sure you want to delete the hunting type <strong>{{ itemToDelete?.name }}</strong
          >?
        </p>
        <VaAlert color="danger" class="mb-4">
          <template #icon>
            <VaIcon name="warning" />
          </template>
          <strong>Warning:</strong> This hunting type may be referenced by:
          <ul class="list-disc ml-6 mt-2">
            <li>Price Lists</li>
            <li>Sales Packages</li>
            <li>Trophy Fees</li>
          </ul>
          <p class="mt-2 font-bold">This action cannot be undone!</p>
        </VaAlert>
      </div>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <VaButton preset="secondary" @click="showDeleteModal = false">Cancel</VaButton>
          <VaButton color="danger" :loading="deleting" @click="deleteItemConfirmed()"> Force Delete </VaButton>
        </div>
      </template>
    </VaModal>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useSettingsStore } from '../../stores/settings-store'
import { mapActions } from 'pinia'
import { useToast } from '@/composables/useToast'
import { useForm } from '@/composables/useForm'
import handleErrors from '../../utils/errorHandler'

export default defineComponent({
  name: 'ManageHuntingTypes',

  setup() {
    const formRef = ref(null) as any
    const { isValid: isValidForm, validate: validateForm, resetValidation: resetValidationForm } = useForm()

    return {
      isValidForm,
      validateForm,
      resetValidationForm,
      formRef,
    }
  },

  data() {
    const columns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'description', label: 'Description', sortable: true },
      { key: 'actions', label: 'Actions', sortable: false },
    ]

    return {
      items: [] as any[],
      columns,
      loading: false,
      saving: false,
      deleting: false,
      showList: true,
      editMode: false,
      showDeleteModal: false,
      itemToDelete: null as any,
      toast: useToast(),
      form: reactive({
        id: null as number | null,
        name: '',
        description: '',
      }),
    }
  },

  mounted() {
    this.loadItems()
  },

  methods: {
    ...mapActions(useSettingsStore, [
      'getHuntingsTypes',
      'createHuntingType',
      'updateHuntingType',
      'deleteHuntingType',
    ]),

    async loadItems() {
      this.loading = true
      try {
        const response = await this.getHuntingsTypes()
        if (response.status === 200) {
          this.items = response.data
        }
      } catch (error) {
        console.error('Failed to load hunting types', error)
        this.toast.init({
          message: 'Failed to load hunting types',
          color: 'danger',
        })
      } finally {
        this.loading = false
      }
    },

    showCreateForm() {
      this.editMode = false
      this.resetForm()
      this.showList = false
    },

    editItem(rowData: any) {
      this.editMode = true
      this.form.id = rowData.id
      this.form.name = rowData.name
      this.form.description = rowData.description || ''
      this.showList = false
    },

    goBack() {
      this.resetForm()
      this.showList = true
      this.loadItems()
    },

    resetForm() {
      this.form.id = null
      this.form.name = ''
      this.form.description = ''
      this.editMode = false
      this.resetValidationForm()
    },

    async createItem() {
      this.saving = true
      try {
        const response = await this.createHuntingType({
          name: this.form.name,
          description: this.form.description,
        })
        if (response.status === 201 || response.status === 200) {
          this.toast.init({
            message: 'Hunting Type created successfully',
            color: 'success',
          })
          this.goBack()
        }
      } catch (error) {
        const errors = handleErrors(error)
        this.toast.init({
          message: errors.length > 0 ? errors.join(', ') : 'Failed to create hunting type',
          color: 'danger',
        })
      } finally {
        this.saving = false
      }
    },

    async updateItem() {
      if (!this.form.id) return
      this.saving = true
      try {
        const response = await this.updateHuntingType(this.form.id, {
          name: this.form.name,
          description: this.form.description,
        })
        if (response.status === 200) {
          this.toast.init({
            message: 'Hunting Type updated successfully',
            color: 'success',
          })
          this.goBack()
        }
      } catch (error) {
        const errors = handleErrors(error)
        this.toast.init({
          message: errors.length > 0 ? errors.join(', ') : 'Failed to update hunting type',
          color: 'danger',
        })
      } finally {
        this.saving = false
      }
    },

    confirmDelete(rowData: any) {
      this.itemToDelete = rowData
      this.showDeleteModal = true
    },

    async deleteItemConfirmed() {
      if (!this.itemToDelete) return
      this.deleting = true
      try {
        const response = await this.deleteHuntingType(this.itemToDelete.id, true)
        if (response.status === 204 || response.status === 200) {
          this.toast.init({
            message: 'Hunting Type deleted successfully',
            color: 'success',
          })
          this.showDeleteModal = false
          this.itemToDelete = null
          this.loadItems()
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.detail || error?.response?.data?.message
        this.toast.init({
          message: errorMessage || 'Failed to delete hunting type',
          color: 'danger',
        })
      } finally {
        this.deleting = false
      }
    },
  },
})
</script>
