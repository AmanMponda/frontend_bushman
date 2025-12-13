<template>
  <div class="sales-confirmation-proposals-page">
    <!-- Breadcrumb -->
    <div class="d-flex align-items-center mb-3">
      <div>
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Sales</a></li>
          <li class="breadcrumb-item active">Sales Confirmation Proposals</li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <!-- Table View -->
    <div class="row layout-top-spacing bg-white rounded">
      <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
        <div class="panel br-6 p-0">
          <div class="custom-table p-3">
            <div v-if="!loading && dataFetched.length === 0" class="empty-state-message text-center py-5">
              <i class="fa fa-inbox fa-3x text-muted mb-3"></i>
              <p class="text-muted">No confirmed or completed deals found</p>
              <button class="btn btn-primary btn-sm" @click="loadConfirmations">
                <i class="fa fa-refresh me-1"></i> Refresh
              </button>
            </div>
            <StandardDataTable
              v-else
              :columns="columns"
              :data="dataFetched"
              :loading="loading"
              :filters="tableFilters"
              :default-page-size="tableFilters.pageSize"
              :disable-pagination="false"
              :show-date-filters="false"
              :action-buttons="pageActions"
              :custom-filters="customFilters"
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
                  <button class="btn btn-info btn-sm" title="View Details" @click="viewDetails((row as any).selfitem)">
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

export default defineComponent({
  name: 'SalesConfirmationList',
  components: {
    StandardDataTable,
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
      confirmations: [] as any[],
      dataFetched: [] as any[],
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
    counts(): any {
      return (
        this.pipelineCounts || {
          new_inquiries: 0,
          pending: 0,
          provision_sales: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
        }
      )
    },

    // Combine confirmed and completed items
    allConfirmations(): any[] {
      const confirmed = this.pipeline?.confirmed || []
      const completed = this.pipeline?.completed || []
      return [...confirmed, ...completed]
    },

    // Apply search filter
    filteredConfirmations(): any[] {
      let items = this.allConfirmations

      if (this.searchText) {
        const search = this.searchText.toLowerCase()
        items = items.filter((item: any) => {
          return (
            item.code?.toLowerCase().includes(search) ||
            item.client?.full_name?.toLowerCase().includes(search) ||
            item.hunting_details?.areas?.toLowerCase().includes(search) ||
            item.hunting_details?.season?.toLowerCase().includes(search)
          )
        })
      }

      if (this.statusFilter) {
        items = items.filter((item: any) => item.stage === this.statusFilter)
      }

      return items
    },

    totalConfirmations(): number {
      return (this.pipelineCounts?.confirmed || 0) + (this.pipelineCounts?.completed || 0)
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
        this.$nextTick(() => {
          this.formatDataForTable()
        })
      },
      immediate: true,
      deep: true,
    },
    statusFilter: {
      handler() {
        this.$nextTick(() => {
          this.formatDataForTable()
        })
      },
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
        // formatDataForTable will be called by the watcher when pipeline updates
      } catch (error) {
        console.error('Error loading confirmations:', error)
        this.toast.init({
          message: 'Failed to load confirmations',
          color: 'danger',
        })
      }
    },

    formatDataForTable() {
      const items = this.allConfirmations || []
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

    async viewDetails(item: any) {
      try {
        const proposalId = item.proposal_id || item.confirmation_id || item.id
        if (proposalId) {
          // Navigate to the view page
          this.router.push({
            name: 'pipeline-item-view',
            params: { id: proposalId.toString() },
            query: { type: 'proposal' },
          })
        } else {
          this.toast.init({
            message: 'No details found for this item',
            color: 'warning',
          })
        }
      } catch (error) {
        this.toast.init({
          message: 'Failed to load details',
          color: 'danger',
        })
      }
    },

    async markAsCompleted(item: any) {
      try {
        const proposalId = item.proposal_id || item.confirmation_id
        if (proposalId) {
          await this.updateProposalStatus(proposalId, 'completed')
          this.toast.init({
            message: 'Marked as completed successfully',
            color: 'success',
          })
          this.loadConfirmations()
        }
      } catch (error) {
        this.toast.init({
          message: 'Failed to update status',
          color: 'danger',
        })
      }
    },

    async handleStatusChange(data: { id: number; status: string }) {
      try {
        await this.updateProposalStatus(data.id, data.status)
        this.toast.init({
          message: `Status changed to ${data.status}`,
          color: 'success',
        })
        await this.fetchProposalById(data.id)
        this.loadConfirmations()
      } catch (error) {
        this.toast.init({
          message: 'Failed to update status',
          color: 'danger',
        })
      }
    },

    formatDate(dateStr: string | undefined): string {
      if (!dateStr) return 'N/A'
      try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } catch {
        return dateStr
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

    formatStatus(stage: string): string {
      if (!stage) return 'Unknown'
      return stage.charAt(0).toUpperCase() + stage.slice(1).replace(/_/g, ' ')
    },

    getStatusColor(stage: string): string {
      switch (stage) {
        case 'confirmed':
          return 'success'
        case 'completed':
          return 'primary'
        default:
          return 'secondary'
      }
    },

    getStatusIcon(stage: string): string {
      switch (stage) {
        case 'confirmed':
          return 'check_circle'
        case 'completed':
          return 'task_alt'
        default:
          return 'help'
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-state-message {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.client-cell {
  line-height: 1.3;
}

:deep(.table-simple) {
  width: 100%;
  margin: 0;

  .va-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0;
  }

  th,
  td {
    padding: 0.5rem;
    border-bottom: 1px solid #dee2e6;
    text-align: left;
    background: transparent;
  }

  th {
    font-weight: 600;
    border-bottom: 2px solid #dee2e6;
    background: transparent;
  }

  tbody tr {
    background: transparent;

    &:hover {
      background-color: #f8f9fa;
    }
  }

  // Remove all colors, badges, and icons
  .va-badge,
  .badge,
  .va-chip {
    background: transparent !important;
    color: inherit !important;
    padding: 0;
    border: none;
    font-weight: normal;
  }

  // Remove icon colors
  .va-icon,
  i.material-icons {
    color: inherit;
  }

  // Remove text colors
  .text-success,
  .text-green-600,
  .text-primary,
  .text-warning,
  .text-danger,
  .text-gray-900,
  .text-gray-700 {
    color: inherit !important;
  }

  // Remove font weights
  .font-semibold,
  .font-bold {
    font-weight: normal;
  }
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
