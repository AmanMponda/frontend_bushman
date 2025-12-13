<template>
  <VaCard class="p-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
      <div>
        <h2 v-if="showTrophyFeesList" class="text-2xl font-semibold">Trophy Fees Management</h2>
        <h2 v-else class="text-2xl font-semibold">{{ editMode ? 'Edit Trophy Fee' : 'Add New Trophy Fee' }}</h2>
        <p v-if="showTrophyFeesList" class="text-secondary text-sm mt-1">
          Manage trophy fees for different species and hunting areas
        </p>
      </div>

      <div class="flex gap-2">
        <VaButton v-if="!showTrophyFeesList" icon="arrow_back" preset="secondary" @click="toggleFormAndList()">
          Back to List
        </VaButton>
        <VaButton v-if="showTrophyFeesList" color="primary" icon="add" @click="toggleFormAndList()">
          Add Trophy Fee
        </VaButton>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div v-if="showTrophyFeesList && !loading" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <VaCard stripe>
        <VaCardContent class="flex items-center gap-4">
          <VaIcon name="military_tech" size="large" color="primary" />
          <div>
            <div class="text-2xl font-bold">{{ items.length }}</div>
            <div class="text-sm text-secondary">Total Trophy Fees</div>
          </div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe>
        <VaCardContent class="flex items-center gap-4">
          <VaIcon name="pets" size="large" color="success" />
          <div>
            <div class="text-2xl font-bold">{{ uniqueSpeciesCount }}</div>
            <div class="text-sm text-secondary">Unique Species</div>
          </div>
        </VaCardContent>
      </VaCard>

      <VaCard stripe>
        <VaCardContent class="flex items-center gap-4">
          <VaIcon name="location_on" size="large" color="warning" />
          <div>
            <div class="text-2xl font-bold">{{ uniqueAreasCount }}</div>
            <div class="text-sm text-secondary">Hunting Areas</div>
          </div>
        </VaCardContent>
      </VaCard>
    </div>

    <!-- Table View -->
    <ModuleTable
      v-if="showTrophyFeesList"
      :items="items"
      :columns="columns"
      :loading="loading"
      @onView="editTrophyFee"
      @onDelete="deleteTrophyFee"
    >
      <template #filter-elements-and-download-btn>
        <VaCard stripe stripe-color="primary" class="mb-4">
          <VaCardContent>
            <div class="flex items-center gap-2 mb-3">
              <VaIcon name="filter_list" />
              <span class="font-semibold">Filter Trophy Fees</span>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <VaSelect
                v-model="selectedSpecies"
                :options="speciesOptions"
                label="Filter by Species"
                placeholder="All Species"
                clearable
                searchable
                @update:modelValue="getTrophyFees"
              >
                <template #prepend>
                  <VaIcon name="pets" size="small" />
                </template>
              </VaSelect>
              <VaSelect
                v-model="selectedArea"
                :options="areaOptions"
                label="Filter by Hunting Area"
                placeholder="All Areas"
                clearable
                searchable
                @update:modelValue="getTrophyFees"
              >
                <template #prepend>
                  <VaIcon name="location_on" size="small" />
                </template>
              </VaSelect>
              <div class="flex items-end">
                <VaButton v-if="selectedSpecies || selectedArea" preset="plain" icon="clear" @click="clearFilters">
                  Clear Filters
                </VaButton>
              </div>
            </div>
          </VaCardContent>
        </VaCard>
      </template>
    </ModuleTable>

    <!-- Form View -->
    <div v-else>
      <VaForm ref="trophyFeeFormRef">
        <VaCard stripe stripe-color="primary" class="mb-4">
          <VaCardTitle>Species & Area Information</VaCardTitle>
          <VaCardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VaSelect
                v-model="trophyFeeForm.species"
                :options="speciesOptions"
                label="Species"
                placeholder="Select a species"
                :rules="[(v: any) => !!v || 'Species is required']"
                searchable
                highlight-matched-text
                required-mark
              >
                <template #prepend>
                  <VaIcon name="pets" />
                </template>
              </VaSelect>

              <VaSelect
                v-model="trophyFeeForm.area"
                :options="areaOptions"
                label="Hunting Area"
                placeholder="Select a hunting area"
                :rules="[(v: any) => !!v || 'Hunting area is required']"
                searchable
                highlight-matched-text
                required-mark
              >
                <template #prepend>
                  <VaIcon name="location_on" />
                </template>
              </VaSelect>
            </div>
          </VaCardContent>
        </VaCard>

        <VaCard stripe stripe-color="success" class="mb-4">
          <VaCardTitle>Season & Currency</VaCardTitle>
          <VaCardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VaSelect
                v-model="trophyFeeForm.season"
                :options="seasonOptions"
                label="Season"
                placeholder="Select a season"
                :rules="[(v: any) => !!v || 'Season is required']"
                searchable
                highlight-matched-text
                required-mark
              >
                <template #prepend>
                  <VaIcon name="date_range" />
                </template>
              </VaSelect>

              <VaSelect
                v-model="trophyFeeForm.currency"
                :options="currencyOptions"
                label="Currency"
                placeholder="Select a currency"
                :rules="[(v: any) => !!v || 'Currency is required']"
                searchable
                highlight-matched-text
                required-mark
              >
                <template #prepend>
                  <VaIcon name="payments" />
                </template>
              </VaSelect>
            </div>
          </VaCardContent>
        </VaCard>

        <VaCard stripe stripe-color="info" class="mb-4">
          <VaCardTitle>Pricing Details</VaCardTitle>
          <VaCardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VaInput
                v-model="trophyFeeForm.sequence_order"
                label="Sequence Order"
                type="number"
                min="1"
                placeholder="Enter sequence number"
                :rules="[(v: any) => v > 0 || 'Sequence must be greater than 0']"
                required-mark
              >
                <template #prepend>
                  <VaIcon name="format_list_numbered" />
                </template>
                <template #appendInner>
                  <VaPopover
                    message="Sequence order represents the trophy number (1st, 2nd, 3rd, etc.). Different sequences can have different prices for the same species."
                    placement="top"
                  >
                    <VaIcon name="info" size="small" color="info" />
                  </VaPopover>
                </template>
              </VaInput>

              <VaInput
                v-model="trophyFeeForm.amount"
                label="Amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                :rules="[(v: any) => v > 0 || 'Amount must be greater than 0']"
                required-mark
              >
                <template #prepend>
                  <VaIcon name="attach_money" />
                </template>
              </VaInput>
            </div>
          </VaCardContent>
        </VaCard>

        <!-- Action Buttons -->
        <div class="flex gap-3 justify-end">
          <VaButton v-if="editMode" preset="secondary" icon="close" @click="cancelEdit"> Cancel </VaButton>
          <VaButton
            :disabled="!isValidTrophyFeeForm"
            color="primary"
            icon="save"
            :loading="saving"
            @click="validateTrophyFeeForm() && saveTrophyFee()"
          >
            {{ editMode ? 'Update Trophy Fee' : 'Save Trophy Fee' }}
          </VaButton>
        </div>
      </VaForm>
    </div>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { mapActions } from 'pinia'
import { useToast, useForm } from 'vuestic-ui'
import handleErrors from '../../utils/errorHandler'
import ModuleTable from './components/ModuleTable.vue'
import { useTrophyFeesStore } from '../../stores/trophy-fees-store'
import { useQuotaStore } from '../../stores/quota-store'
import { useSettingsStore } from '../../stores/settings-store'

export default defineComponent({
  name: 'ManageTrophyFeesPage',
  components: {
    ModuleTable,
  },

  setup() {
    const trophyFeeFormRef = ref(null) as any

    const {
      isValid: isValidTrophyFeeForm,
      validate: validateTrophyFeeForm,
      resetValidation: resetValidationTrophyFeeForm,
      reset: resetTrophyFeeForm,
    } = useForm(trophyFeeFormRef)

    const columns = [
      { key: 'id', label: 'ID', sortable: true, width: 80 },
      { key: 'species_name', label: 'Species Name', sortable: true },
      { key: 'area_name', label: 'Hunting Area', sortable: true },
      { key: 'season_name', label: 'Season', sortable: true },
      { key: 'sequence_order', label: 'Sequence', sortable: true, width: 100 },
      { key: 'amount', label: 'Amount', sortable: true, width: 130 },
      { key: 'actions', label: 'Actions', width: 120 },
    ]

    return {
      isValidTrophyFeeForm,
      validateTrophyFeeForm,
      resetValidationTrophyFeeForm,
      resetTrophyFeeForm,
      trophyFeeFormRef,
      columns,
    }
  },

  data() {
    const items: any[] = []

    const trophyFeeForm = reactive({
      id: null as any,
      species: null as any,
      area: null as any,
      season: null as any,
      currency: null as any,
      sequence_order: 1,
      amount: null as any,
    })

    return {
      items,
      trophyFeeForm,
      showTrophyFeesList: true,
      loading: false,
      saving: false,
      editMode: false,
      toast: useToast(),
      speciesOptions: [] as any[],
      areaOptions: [] as any[],
      seasonOptions: [] as any[],
      currencyOptions: [] as any[],
      selectedSpecies: null as any,
      selectedArea: null as any,
      selectedSeason: null as any,
    }
  },

  computed: {
    uniqueSpeciesCount() {
      const speciesIds = new Set(this.items.map((item: any) => item._raw?.species_id))
      return speciesIds.size
    },
    uniqueAreasCount() {
      const areaIds = new Set(this.items.map((item: any) => item._raw?.area_id))
      return areaIds.size
    },
  },

  mounted() {
    this.getTrophyFees()
    this.loadSpecies()
    this.loadAreas()
    this.loadSeasons()
    this.loadCurrencies()
  },

  methods: {
    ...mapActions(useTrophyFeesStore, ['fetchTrophyFees', 'createTrophyFee', 'updateTrophyFee', 'deleteTrophyFeeById']),
    ...mapActions(useQuotaStore, ['getSpeciesList', 'getAreaList']),
    ...mapActions(useSettingsStore, ['getSeasons', 'getCurrencies']),

    async getTrophyFees() {
      this.loading = true
      try {
        const params: any = {}
        if (this.selectedSpecies) {
          params.species_id = this.selectedSpecies.value
        }
        if (this.selectedArea) {
          params.area_id = this.selectedArea.value
        }
        if (this.selectedSeason) {
          params.season_id = this.selectedSeason.value
        }

        const response = await this.fetchTrophyFees(params)

        if (response.status === 200) {
          const data = response.data.data || response.data

          this.items = data.map((item: any) => ({
            id: item.id,
            species_name: item.species?.name || 'N/A',
            area_name: item.area?.name || 'N/A',
            season_name: item.season?.name || 'N/A',
            sequence_order: this.getSequenceLabel(item.sequence_order),
            amount: `${item.currency?.symbol || '$'}${parseFloat(item.amount).toFixed(2)}`,
            _raw: item,
          }))
        }
      } catch (error) {
        handleErrors(error)
        this.toast.init({
          message: 'Failed to load trophy fees',
          color: 'danger',
        })
      } finally {
        this.loading = false
      }
    },

    async loadSpecies() {
      try {
        const response = await this.getSpeciesList()
        this.speciesOptions = response.data.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      } catch (error) {
        console.error('Failed to load species', error)
      }
    },

    async loadAreas() {
      try {
        const response = await this.getAreaList()
        this.areaOptions = response.data.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      } catch (error) {
        console.error('Failed to load areas', error)
      }
    },

    clearFilters() {
      this.selectedSpecies = null
      this.selectedArea = null
      this.selectedSeason = null
      this.getTrophyFees()
    },

    getSequenceLabel(sequence: number) {
      const suffixes = ['th', 'st', 'nd', 'rd']
      const value = sequence % 100
      return sequence + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0])
    },

    async loadSeasons() {
      try {
        const response = await this.getSeasons()
        this.seasonOptions = response.data.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      } catch (error) {
        console.error('Failed to load seasons', error)
      }
    },

    async loadCurrencies() {
      try {
        const response = await this.getCurrencies()
        this.currencyOptions = response.data.map((item: any) => ({
          value: item.id,
          text: item.name,
          symbol: item.symbol,
        }))
      } catch (error) {
        console.error('Failed to load currencies', error)
      }
    },

    toggleFormAndList() {
      this.showTrophyFeesList = !this.showTrophyFeesList
      if (this.showTrophyFeesList) {
        this.resetForm()
      }
    },

    editTrophyFee(rowData: any) {
      this.editMode = true
      this.showTrophyFeesList = false

      const raw = rowData._raw
      this.trophyFeeForm.id = raw.id
      this.trophyFeeForm.species = this.speciesOptions.find(
        (s: any) => s.value === raw.species_id || s.value === raw.species?.id,
      )
      this.trophyFeeForm.area = this.areaOptions.find((a: any) => a.value === raw.area_id || a.value === raw.area?.id)
      this.trophyFeeForm.season = this.seasonOptions.find(
        (s: any) => s.value === raw.season_id || s.value === raw.season?.id,
      )
      this.trophyFeeForm.currency = this.currencyOptions.find(
        (c: any) => c.value === raw.currency_id || c.value === raw.currency?.id,
      )
      this.trophyFeeForm.sequence_order = raw.sequence_order
      this.trophyFeeForm.amount = raw.amount
    },

    async saveTrophyFee() {
      this.saving = true
      try {
        const payload: any = {
          species_id: this.trophyFeeForm.species.value,
          area_id: this.trophyFeeForm.area.value,
          season_id: this.trophyFeeForm.season.value,
          currency_id: this.trophyFeeForm.currency.value,
          sequence_order: this.trophyFeeForm.sequence_order,
          amount: this.trophyFeeForm.amount,
        }

        let response
        if (this.editMode) {
          response = await this.updateTrophyFee(this.trophyFeeForm.id, payload)
        } else {
          response = await this.createTrophyFee(payload)
        }

        if (response.status === 200 || response.status === 201) {
          this.toast.init({
            message: this.editMode ? 'Trophy fee updated successfully' : 'Trophy fee created successfully',
            color: 'success',
          })
          this.toggleFormAndList()
          this.getTrophyFees()
        }
      } catch (error) {
        handleErrors(error)
        this.toast.init({
          message: 'Failed to save trophy fee',
          color: 'danger',
        })
      } finally {
        this.saving = false
      }
    },

    async deleteTrophyFee(rowData: any) {
      if (!confirm('Are you sure you want to delete this trophy fee?')) {
        return
      }

      try {
        const response = await this.deleteTrophyFeeById(rowData.id)
        if (response.status === 200 || response.status === 204) {
          this.toast.init({
            message: 'Trophy fee deleted successfully',
            color: 'success',
          })
          this.getTrophyFees()
        }
      } catch (error) {
        handleErrors(error)
        this.toast.init({
          message: 'Failed to delete trophy fee',
          color: 'danger',
        })
      }
    },

    cancelEdit() {
      this.resetForm()
      this.toggleFormAndList()
    },

    resetForm() {
      this.editMode = false
      this.trophyFeeForm.id = null
      this.trophyFeeForm.species = null
      this.trophyFeeForm.area = null
      this.trophyFeeForm.season = null
      this.trophyFeeForm.currency = null
      this.trophyFeeForm.sequence_order = 1
      this.trophyFeeForm.amount = null
      this.resetValidationTrophyFeeForm()
    },
  },
})
</script>

<style lang="scss" scoped></style>
