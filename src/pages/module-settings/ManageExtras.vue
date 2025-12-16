<template>
  <div class="safari-extras-page">
    <!-- Header with Add Button -->
    <div class="flex flex-col md:flex-row gap-2 mb-4 justify-between py-2">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <h2 class="va-h5">Safari Extra Services by Season</h2>
      </div>
      <VaButtonGroup>
        <VaButton
          class="px-2 py-2"
          color="primary"
          round
          present="secondary"
          border-color="primary"
          icon="add"
          size="small"
          @click="openAddModal(null)"
        >
          Add Extra Service
        </VaButton>
      </VaButtonGroup>
    </div>

    <!-- Loading State -->
    <div v-if="loadingExtras || loadingSeasons" class="flex justify-center py-8">
      <VaProgressCircle indeterminate />
    </div>

    <!-- Seasons with Extras -->
    <template v-else>
      <VaCollapse
        v-for="season in seasonsWithExtras"
        :key="season.id"
        class="mb-4"
        :header="season.name"
        icon="calendar_month"
        color="primary"
      >
        <template #header>
          <div class="flex items-center justify-between w-full pr-4">
            <div class="flex items-center gap-2">
              <VaIcon name="calendar_month" color="primary" />
              <span class="font-semibold">{{ season.name }}</span>
              <VaBadge :text="String(season.extras.length)" color="info" />
            </div>
            <VaButton
              preset="plain"
              icon="add_circle"
              color="success"
              title="Add extra to this season"
              @click.stop="openAddModal(season)"
            />
          </div>
        </template>

        <div class="pa-4">
          <div v-if="season.extras.length === 0" class="text-center text-gray-500 py-4">
            No extra services for this season.
            <VaButton preset="plain" @click="openAddModal(season)">Add one now</VaButton>
          </div>

          <VaDataTable v-else :items="season.extras" :columns="columns" hoverable striped>
            <template #cell(hunting_area)="{ rowData }">
              {{ rowData.hunting_area?.name || 'N/A' }}
            </template>
            <template #cell(amount)="{ rowData }"> {{ rowData.currency?.symbol || '' }} {{ rowData.amount }} </template>
            <template #cell(charges_per)="{ rowData }">
              <VaBadge :text="formatChargesPer(rowData.charges_per)" color="secondary" />
            </template>
            <template #cell(actions)="{ rowData }">
              <div class="flex gap-2">
                <VaButton preset="plain" icon="edit" color="warning" title="Edit" @click="openEditModal(rowData)" />
                <VaButton preset="plain" icon="delete" color="danger" title="Delete" @click="confirmDelete(rowData)" />
              </div>
            </template>
          </VaDataTable>
        </div>
      </VaCollapse>

      <!-- No seasons message -->
      <div v-if="seasonsWithExtras.length === 0" class="text-center py-8 text-gray-500">
        No seasons found. Please create seasons first in the settings.
      </div>
    </template>

    <!-- Add/Edit Modal -->
    <VaModal
      v-model="showFormModal"
      :title="editMode ? 'Edit Extra Service' : 'Add Extra Service'"
      size="medium"
      hide-default-actions
    >
      <VaForm ref="formRef" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VaInput
            v-model="form.name"
            label="Service Name"
            placeholder="e.g., Ammunition, Trophy Handling"
            :rules="[(v: any) => !!v || 'Service name is required']"
            required-mark
          />
          <VaInput
            v-model="form.amount"
            type="number"
            label="Amount"
            placeholder="Enter amount"
            :rules="[(v: any) => !!v || 'Amount is required']"
            required-mark
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VaSelect
            v-model="form.currency_id"
            label="Currency"
            placeholder="Select currency"
            :options="currenciesOptions"
            :rules="[(v: any) => !!v || 'Currency is required']"
            required-mark
          />
          <VaSelect
            v-model="form.hunting_area_id"
            label="Hunting Area"
            placeholder="Select hunting area"
            :options="areasOptions"
            :rules="[(v: any) => !!v || 'Hunting area is required']"
            required-mark
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VaSelect
            v-model="form.season_id"
            label="Season"
            placeholder="Select season"
            :options="seasonsOptions"
            :rules="[(v: any) => !!v || 'Season is required']"
            required-mark
            :disabled="!!preselectedSeason"
          />
          <VaSelect
            v-model="form.charges_per"
            label="Charges Per"
            placeholder="Select charge type"
            :options="chargesPerOptions"
            :rules="[(v: any) => !!v || 'Charges per is required']"
            required-mark
          />
        </div>

        <VaTextarea
          v-model="form.description"
          label="Description (Optional)"
          placeholder="Describe this extra service"
          :min-rows="3"
        />
      </VaForm>

      <template #footer>
        <div class="flex gap-2 justify-end">
          <VaButton preset="secondary" @click="closeFormModal">Cancel</VaButton>
          <VaButton :loading="savingSafariExtra" :disabled="savingSafariExtra" @click="submitForm">
            {{ editMode ? 'Update' : 'Save' }}
          </VaButton>
        </div>
      </template>
    </VaModal>

    <!-- Delete Confirmation Modal -->
    <VaModal v-model="showDeleteModal" title="Confirm Delete" size="small" hide-default-actions>
      <p>
        Are you sure you want to delete "<strong>{{ itemToDelete?.name }}</strong
        >"?
      </p>
      <template #footer>
        <div class="flex gap-2 justify-end">
          <VaButton preset="secondary" @click="showDeleteModal = false">Cancel</VaButton>
          <VaButton color="danger" :loading="deleting" @click="deleteExtra"> Delete </VaButton>
        </div>
      </template>
    </VaModal>
  </div>
</template>

<script lang="ts">
import { useSettingsStore } from '../../stores/settings-store'
import { useQuotaStore } from '../../stores/quota-store'
import { defineComponent, ref, reactive } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import handleErrors from '../../utils/errorHandler'
import axios from 'axios'

export default defineComponent({
  setup() {
    const { init } = useToast()
    const formRef = ref(null) as any
    const { isValid, validate, reset } = useForm()

    const form = reactive({
      id: null as any,
      name: '',
      amount: null as any,
      currency_id: null as any,
      season_id: null as any,
      hunting_area_id: null as any,
      charges_per: null as any,
      description: '',
    })

    return {
      init,
      formRef,
      isValid,
      validate,
      reset,
      form,
    }
  },

  data() {
    const columns = [
      { key: 'name', label: 'Service Name', sortable: true },
      { key: 'hunting_area', label: 'Hunting Area', sortable: true },
      { key: 'amount', label: 'Amount', sortable: true },
      { key: 'charges_per', label: 'Charges Per', sortable: true },
      { key: 'description', label: 'Description', sortable: false },
      { key: 'actions', label: 'Actions', sortable: false, width: 100 },
    ]

    const chargesPerOptions = [
      { value: 'PER_DAY', text: 'Per Day' },
      { value: 'PER_PERSON', text: 'Per Person' },
      { value: 'PER_ROUND', text: 'Per Round' },
    ]

    return {
      columns,
      chargesPerOptions,
      seasonsOptions: [] as any[],
      currenciesOptions: [] as any[],
      areasOptions: [] as any[],
      allSeasons: [] as any[],
      allExtras: [] as any[],
      loadingSeasons: false,
      showFormModal: false,
      showDeleteModal: false,
      editMode: false,
      preselectedSeason: null as any,
      itemToDelete: null as any,
      deleting: false,
    }
  },

  computed: {
    ...mapState(useSettingsStore, ['loadingExtras', 'savingSafariExtra']),

    seasonsWithExtras(): any[] {
      return this.allSeasons.map((season: any) => ({
        ...season,
        extras: this.allExtras.filter((extra: any) => extra.season_id === season.id),
      }))
    },
  },

  mounted() {
    this.loadData()
  },

  methods: {
    ...mapActions(useSettingsStore, ['getSeasons', 'getCurrencies', 'createSafariExtras']),
    ...mapActions(useQuotaStore, ['getAreaList']),

    async loadData() {
      await Promise.all([this.loadSeasons(), this.loadExtras(), this.loadCurrencies(), this.loadAreas()])
    },

    async loadSeasons() {
      this.loadingSeasons = true
      try {
        const response = await this.getSeasons()
        this.allSeasons = response.data || []
        this.seasonsOptions = this.allSeasons.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      } catch (error) {
        console.error('Error loading seasons:', error)
      } finally {
        this.loadingSeasons = false
      }
    },

    async loadExtras() {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SAFARY_EXTRAS_VSET_URL
      try {
        const response = await axios.get(url)
        this.allExtras = response.data || []
      } catch (error) {
        console.error('Error loading extras:', error)
      }
    },

    async loadCurrencies() {
      try {
        const response = await this.getCurrencies()
        this.currenciesOptions = response.data.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      } catch (error) {
        console.error('Error loading currencies:', error)
      }
    },

    async loadAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      } catch (error) {
        console.error('Error loading areas:', error)
      }
    },

    formatChargesPer(value: string): string {
      const map: Record<string, string> = {
        PER_HOUR: 'Per Hour',
        PER_DAY: 'Per Day',
        PER_PERSON: 'Per Person',
        PER_ROUND: 'Per Round',
      }
      return map[value] || value
    },

    openAddModal(season: any) {
      this.editMode = false
      this.preselectedSeason = season
      this.resetForm()

      if (season) {
        this.form.season_id = { value: season.id, text: season.name }
      }

      this.showFormModal = true
    },

    openEditModal(item: any) {
      this.editMode = true
      this.preselectedSeason = null

      this.form.id = item.id
      this.form.name = item.name
      this.form.amount = item.amount
      this.form.description = item.description || ''
      this.form.currency_id = item.currency ? { value: item.currency.id, text: item.currency.name } : null
      this.form.season_id = item.season ? { value: item.season.id, text: item.season.name } : null
      this.form.hunting_area_id = item.hunting_area
        ? { value: item.hunting_area.id, text: item.hunting_area.name }
        : null
      this.form.charges_per = this.chargesPerOptions.find((opt) => opt.value === item.charges_per) || null

      this.showFormModal = true
    },

    closeFormModal() {
      this.showFormModal = false
      this.resetForm()
    },

    resetForm() {
      this.form.id = null
      this.form.name = ''
      this.form.amount = null
      this.form.currency_id = null
      this.form.season_id = null
      this.form.hunting_area_id = null
      this.form.charges_per = null
      this.form.description = ''
      this.preselectedSeason = null
    },

    async submitForm() {
      const payload = {
        name: this.form.name,
        amount: this.form.amount,
        currency_id: this.form.currency_id?.value,
        season_id: this.form.season_id?.value,
        hunting_area_id: this.form.hunting_area_id?.value,
        charges_per: this.form.charges_per?.value,
        description: this.form.description || '',
      }

      try {
        if (this.editMode) {
          await this.updateExtra(this.form.id, payload)
        } else {
          const response = await this.createSafariExtras(payload)
          if (response.status === 201) {
            this.init({ message: 'Extra service created successfully', color: 'success' })
          }
        }
        await this.loadExtras()
        this.closeFormModal()
      } catch (error: any) {
        console.error(error)
        const errors = handleErrors(error.response)
        this.init({
          message: errors.join(', '),
          color: 'danger',
        })
      }
    },

    async updateExtra(id: number, payload: any) {
      const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_SAFARY_EXTRAS_VSET_URL + id + '/'
      const response = await axios.put(url, payload)
      if (response.status === 200) {
        this.init({ message: 'Extra service updated successfully', color: 'success' })
      }
      return response
    },

    confirmDelete(item: any) {
      this.itemToDelete = item
      this.showDeleteModal = true
    },

    async deleteExtra() {
      if (!this.itemToDelete) return

      this.deleting = true
      try {
        const url =
          import.meta.env.VITE_APP_BASE_URL +
          import.meta.env.VITE_APP_SAFARY_EXTRAS_VSET_URL +
          this.itemToDelete.id +
          '/'
        await axios.delete(url)
        this.init({ message: 'Extra service deleted successfully', color: 'success' })
        await this.loadExtras()
        this.showDeleteModal = false
        this.itemToDelete = null
      } catch (error: any) {
        console.error(error)
        this.init({ message: 'Failed to delete extra service', color: 'danger' })
      } finally {
        this.deleting = false
      }
    },
  },
})
</script>

<style scoped>
.safari-extras-page :deep(.va-collapse__header) {
  background-color: var(--va-background-secondary);
  border-radius: 8px;
  padding: 12px 16px;
}

.safari-extras-page :deep(.va-collapse__body-wrapper) {
  border: 1px solid var(--va-background-border);
  border-top: none;
  border-radius: 0 0 8px 8px;
}
</style>
