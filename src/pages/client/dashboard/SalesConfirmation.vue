<template>
  <div class="sales-confirmation-page">
    <!-- Breadcrumb -->
    <div class="d-flex align-items-center mb-3">
      <div>
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Sales</a></li>
          <li class="breadcrumb-item active">Sales Confirmation</li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <template v-if="!viewDetails">
      <!-- Sales Confirmation List View - Confirmed and Completed Deals Only -->
      <div class="row layout-top-spacing bg-white rounded">
        <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
          <div class="panel br-6 p-0">
            <div class="custom-table p-3">
              <StandardDataTable
                :columns="columns"
                :data="dataFetched"
                :loading="loading"
                :filters="tableFilters"
                :default-page-size="tableFilters.pageSize"
                :disable-pagination="false"
                :show-date-filters="false"
                :action-buttons="pageActions"
                :custom-filters="customFilters"
                :selectable="true"
                @update:filters="handleFiltersUpdate"
              >
                <template #code="{ row }">
                  {{ (row as any).code }}
                </template>
                <template #client="{ row }">
                  {{ (row as any).client }}
                </template>
                <template #season="{ row }">
                  {{ (row as any).season }}
                </template>
                <template #area="{ row }">
                  {{ (row as any).area }}
                </template>
                <template #dates="{ row }">
                  {{ (row as any).dates }}
                </template>
                <template #amount="{ row }">
                  {{ (row as any).amount }}
                </template>
                <template #status="{ row }">
                  <span class="badge" :class="'bg-' + getStatusColor((row as any).status)">
                    {{ formatStatus((row as any).status) }}
                  </span>
                </template>
                <template #actions="{ row }">
                  <div class="d-flex gap-1">
                    <button
                      class="btn btn-info btn-sm"
                      title="View Details"
                      @click="handleViewDetails((row as any).selfitem)"
                    >
                      <i class="fa fa-eye"></i>
                    </button>
                    <button
                      v-if="(row as any).status === 'confirmed'"
                      class="btn btn-success btn-sm"
                      title="Complete"
                      @click="markAsCompleted((row as any).selfitem)"
                    >
                      <i class="fa fa-check"></i>
                    </button>
                  </div>
                </template>
              </StandardDataTable>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Detail View -->
    <template v-else>
      <SalesConfirmationClientDetails v-if="selectedItem" :sales-data="selectedItem" @goBack="gotBack" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { mapActions, mapState } from 'pinia'
import { useProposalStore } from '../../../stores/proposal-store'
import { useToast } from '@/composables/useToast'
import axios from 'axios'
import StandardDataTable from '@/components/bootstrap/StandardDataTable.vue'
import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'

export default defineComponent({
  name: 'SalesConfirmationList',
  components: {
    StandardDataTable,
    SalesConfirmationClientDetails,
  },
  setup() {
    const toast = useToast()
    const router = useRouter()
    return { toast, router }
  },
  data() {
    return {
      searchText: '',
      seasonFilter: null as number | null,
      statusFilter: null as string | null,
      seasonOptions: [] as { value: number; text: string }[],
      statusFilterOptions: [
        { value: 'confirmed', text: 'Confirmed' },
        { value: 'completed', text: 'Completed' },
      ],
      dataFetched: [] as any[],
      viewDetails: false,
      selectedItem: {} as Record<string, any>,
      columns: [
        { key: 'code', label: 'Code', sortable: true, visible: true },
        { key: 'client', label: 'Client', sortable: true, visible: true },
        { key: 'season', label: 'Season', sortable: true, visible: true },
        { key: 'area', label: 'Area', sortable: true, visible: true },
        { key: 'dates', label: 'Dates', sortable: true, visible: true },
        { key: 'amount', label: 'Amount', sortable: true, visible: true },
        { key: 'status', label: 'Status', sortable: true, visible: true },
        { key: 'actions', label: 'Actions', sortable: false, visible: true },
      ],
      tableFilters: {
        search: '',
        pageSize: 10,
        currentPage: 1,
        sortField: '',
        sortDirection: 'asc',
        showAdvancedFilters: false,
        season_id: '',
        status: '',
      } as any,
    }
  },
  computed: {
    ...mapState(useProposalStore, ['pipeline', 'pipelineCounts', 'currentProposal', 'loading']),

    // Combine confirmed and completed items only
    allConfirmations(): any[] {
      return [...(this.pipeline.confirmed || []), ...(this.pipeline.completed || [])]
    },

    pageActions(): any[] {
      return [
        {
          label: 'Refresh',
          icon: 'fa fa-refresh',
          class: 'btn btn-secondary',
          method: () => this.loadConfirmations(),
        },
      ]
    },

    customFilters(): any[] {
      return [
        {
          key: 'season_id',
          label: 'Season',
          type: 'select',
          placeholder: 'Select Season',
          options: this.seasonOptions.map((opt: any) => ({
            value: opt.value,
            label: opt.text,
          })),
          defaultValue: '',
        },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          placeholder: 'Select Status',
          options: this.statusFilterOptions.map((opt: any) => ({
            value: opt.value,
            label: opt.text,
          })),
          defaultValue: '',
        },
      ]
    },
  },
  watch: {
    allConfirmations: {
      handler() {
        this.formatDataForTable()
      },
      immediate: true,
    },
  },
  mounted() {
    this.loadConfirmations()
    this.loadSeasons()
  },
  methods: {
    ...mapActions(useProposalStore, [
      'fetchPipeline',
      'fetchProposalById',
      'updateProposalStatus',
      'clearCurrentProposal',
    ]),

    async loadConfirmations() {
      try {
        await this.fetchPipeline(undefined, this.seasonFilter || undefined)
        this.formatDataForTable()
      } catch (error) {
        this.toast.init({
          message: 'Failed to load confirmations',
          color: 'danger',
        })
      }
    },

    formatDataForTable() {
      let items = this.allConfirmations || []

      // Apply status filter if set
      if (this.statusFilter) {
        items = items.filter((item: any) => item.stage === this.statusFilter)
      }

      this.dataFetched = items.map((item: any) => {
        return {
          id: item.id || item.proposal_id || item.confirmation_id,
          selfitem: item,
          code: item.code || 'N/A',
          client: item.client?.full_name || 'N/A',
          season: item.hunting_details?.season || 'N/A',
          area: item.hunting_details?.areas || 'N/A',
          dates: `${this.formatDate(item.hunting_details?.start_date)} to ${this.formatDate(
            item.hunting_details?.end_date,
          )}`,
          amount: this.formatCurrency(item.total_amount),
          status: item.stage || 'N/A',
        }
      })
    },

    handleFiltersUpdate(filters: any) {
      this.tableFilters = { ...this.tableFilters, ...filters }
      if (filters.season_id !== undefined) {
        this.seasonFilter = filters.season_id || null
        this.loadConfirmations()
      }
      if (filters.status !== undefined) {
        this.statusFilter = filters.status || null
        this.formatDataForTable()
      }
    },

    async loadSeasons() {
      try {
        const url = `${import.meta.env.VITE_APP_BASE_URL}settings/seasons`
        const response = await axios.get(url)
        if (response.data) {
          const seasons = Array.isArray(response.data) ? response.data : response.data.data || []
          this.seasonOptions = seasons.map((s: any) => ({
            value: s.id,
            text: s.name,
          }))
        }
      } catch (error) {
        console.error('Error loading seasons:', error)
      }
    },

    formatDate(dateString: string | null | undefined): string {
      if (!dateString) return 'N/A'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } catch {
        return 'N/A'
      }
    },

    formatCurrency(amount: number | null | undefined): string {
      if (!amount) return '$0'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    },

    formatStatus(status: string | undefined): string {
      if (!status) return 'N/A'
      return status.replace(/_/g, ' ').toUpperCase()
    },

    getStatusColor(status: string | undefined): string {
      const statusLower = status?.toLowerCase() || ''
      switch (statusLower) {
        case 'confirmed':
          return 'success'
        case 'completed':
          return 'primary'
        default:
          return 'secondary'
      }
    },

    handleViewDetails(item: any) {
      const proposalId = item.proposal_id || item.confirmation_id || item.id
      if (proposalId) {
        this.router.push({
          name: 'pipeline-item-view',
          params: { id: proposalId.toString() },
          query: { type: 'proposal' },
        })
      }
    },

    async markAsCompleted(item: any) {
      try {
        const proposalId = item.proposal_id || item.confirmation_id
        if (proposalId) {
          await this.updateProposalStatus(proposalId, 'completed')
          this.toast.init({
            message: 'Proposal marked as completed',
            color: 'success',
          })
          await this.loadConfirmations()
        }
      } catch (error) {
        this.toast.init({
          message: 'Failed to update proposal status',
          color: 'danger',
        })
      }
    },

    gotBack() {
      this.viewDetails = false
      this.selectedItem = {}
      this.loadConfirmations()
    },
  },
})
</script>

<style scoped>
.sales-confirmation-page {
  position: relative;
}
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
</style>
