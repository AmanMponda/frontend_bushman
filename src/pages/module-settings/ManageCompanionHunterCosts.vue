<template>
  <VaCard class="companion-hunter-costs-page">
    <VaCardContent>
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row gap-2 mb-4 justify-between items-center">
        <h2 class="text-xl font-bold text-gray-700">
          <VaIcon name="group_add" class="mr-2" />
          Companion Hunter Costs
        </h2>
        <VaButton class="px-4 py-2" color="primary" icon="add" round @click="openAddModal"> Add New Cost </VaButton>
      </div>

      <VaDivider />

      <!-- Data Table -->
      <VaInnerLoading :loading="loading">
        <div v-if="companionHunterCosts.length === 0 && !loading" class="text-center py-12">
          <VaIcon name="payments" size="4rem" color="#9B9FB5" />
          <p class="text-gray-500 mt-4">No companion hunter costs found.</p>
          <VaButton class="mt-4" preset="secondary" @click="openAddModal">Add your first cost</VaButton>
        </div>

        <VaDataTable v-else :items="companionHunterCosts" :columns="columns" hoverable striped>
          <template #cell(days)="{ rowData }">
            <VaBadge :text="`${rowData.days} days`" color="info" />
          </template>

          <template #cell(amount)="{ rowData }">
            <span class="font-bold text-green-600">${{ formatAmount(rowData.amount) }}</span>
          </template>

          <template #cell(created_date)="{ rowData }">
            <span class="text-sm text-gray-600">{{ formatDate(rowData.created_date) }}</span>
          </template>

          <template #cell(actions)="{ rowData }">
            <div class="flex gap-2">
              <VaButton
                preset="plain"
                icon="edit"
                color="warning"
                size="small"
                title="Edit"
                @click="openEditModal(rowData)"
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
    </VaCardContent>
  </VaCard>

  <!-- Add/Edit Modal -->
  <VaModal
    v-model="showFormModal"
    :title="isEditMode ? 'Edit Companion Hunter Cost' : 'Add Companion Hunter Cost'"
    hide-default-actions
    size="small"
  >
    <VaForm ref="formRef" class="space-y-4">
      <VaInput
        v-model.number="form.days"
        type="number"
        label="Days"
        placeholder="Enter number of days"
        :rules="[(v: any) => !!v || 'Days is required', (v: any) => v > 0 || 'Days must be greater than 0']"
        required-mark
        min="1"
      />

      <VaInput
        v-model.number="form.amount"
        type="number"
        label="Amount ($)"
        placeholder="Enter amount"
        :rules="[
          (v: any) => (v !== null && v !== '') || 'Amount is required',
          (v: any) => v >= 0 || 'Amount must be positive',
        ]"
        required-mark
        step="0.01"
        min="0"
      />
    </VaForm>

    <template #footer>
      <div class="flex gap-2 justify-end">
        <VaButton preset="secondary" @click="closeFormModal">Cancel</VaButton>
        <VaButton color="primary" :loading="saving" @click="saveForm">
          {{ isEditMode ? 'Update' : 'Save' }}
        </VaButton>
      </div>
    </template>
  </VaModal>

  <!-- Delete Confirmation Modal -->
  <VaModal v-model="showDeleteModal" hide-default-actions>
    <template #header>
      <h3 class="va-h6">Confirm Delete</h3>
    </template>
    <p>Are you sure you want to delete this companion hunter cost record?</p>
    <p class="text-sm text-gray-500 mt-2">
      <strong>Days:</strong> {{ itemToDelete?.days }} | <strong>Amount:</strong> ${{
        formatAmount(itemToDelete?.amount)
      }}
    </p>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <VaButton preset="secondary" @click="showDeleteModal = false">Cancel</VaButton>
        <VaButton color="danger" :loading="deleting" @click="deleteItem">Delete</VaButton>
      </div>
    </template>
  </VaModal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useToast, useForm } from 'vuestic-ui'
import { useSettingsStore } from '../../stores/settings-store'
import handleErrors from '../../utils/errorHandler'

export default defineComponent({
  name: 'ManageCompanionHunterCosts',

  setup() {
    const formRef = ref(null) as any
    const { validate, reset } = useForm(formRef)

    return {
      formRef,
      validate,
      reset,
    }
  },

  data() {
    const columns = [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'days', label: 'Days', sortable: true },
      { key: 'amount', label: 'Amount', sortable: true },
      { key: 'created_date', label: 'Created', sortable: true },
      { key: 'actions', label: 'Actions', width: 100 },
    ]

    return {
      columns,
      toast: useToast(),
      loading: false,
      saving: false,
      deleting: false,
      showFormModal: false,
      showDeleteModal: false,
      isEditMode: false,
      editItemId: null as number | null,
      itemToDelete: null as any,
      form: {
        days: null as number | null,
        amount: null as number | null,
      },
    }
  },

  computed: {
    ...mapState(useSettingsStore, ['companionHunterCosts']),
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    ...mapActions(useSettingsStore, [
      'getCompanionHunterCosts',
      'createCompanionHunterCost',
      'updateCompanionHunterCost',
      'deleteCompanionHunterCost',
    ]),

    formatAmount(amount: any): string {
      if (!amount) return '0.00'
      return parseFloat(amount).toFixed(2)
    },

    formatDate(dateStr: string): string {
      if (!dateStr) return 'N/A'
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },

    async fetchData() {
      this.loading = true
      try {
        await this.getCompanionHunterCosts()
      } catch (error) {
        this.toast?.init({ message: 'Failed to load data', color: 'danger' })
      } finally {
        this.loading = false
      }
    },

    openAddModal() {
      this.isEditMode = false
      this.editItemId = null
      this.form = {
        days: null,
        amount: null,
      }
      this.showFormModal = true
    },

    openEditModal(item: any) {
      this.isEditMode = true
      this.editItemId = item.id
      this.form = {
        days: item.days,
        amount: parseFloat(item.amount),
      }
      this.showFormModal = true
    },

    closeFormModal() {
      this.showFormModal = false
      this.form = {
        days: null,
        amount: null,
      }
    },

    async saveForm() {
      const isValid = await this.validate()
      if (!isValid) return

      this.saving = true

      const payload = {
        days: this.form.days,
        amount: this.form.amount,
      }

      try {
        if (this.isEditMode && this.editItemId) {
          const response = await this.updateCompanionHunterCost(this.editItemId, payload)
          if (response.status === 200) {
            this.toast?.init({ message: 'Cost updated successfully', color: 'success' })
            this.closeFormModal()
          }
        } else {
          const response = await this.createCompanionHunterCost(payload)
          if (response.status === 201) {
            this.toast?.init({ message: 'Cost created successfully', color: 'success' })
            this.closeFormModal()
          }
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        this.toast?.init({ message: errors.join(', ') || 'Failed to save', color: 'danger' })
      } finally {
        this.saving = false
      }
    },

    confirmDelete(item: any) {
      this.itemToDelete = item
      this.showDeleteModal = true
    },

    async deleteItem() {
      if (!this.itemToDelete) return

      this.deleting = true
      try {
        const response = await this.deleteCompanionHunterCost(this.itemToDelete.id)
        if (response.status === 200 || response.status === 204) {
          this.toast?.init({ message: 'Cost deleted successfully', color: 'success' })
          this.showDeleteModal = false
          this.itemToDelete = null
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        this.toast?.init({ message: errors.join(', ') || 'Failed to delete', color: 'danger' })
      } finally {
        this.deleting = false
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.companion-hunter-costs-page {
  min-height: 400px;
}

.stat-card {
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
