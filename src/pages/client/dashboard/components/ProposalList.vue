<template>
  <div class="proposal-list">
    <!-- Search and Filter -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <VaInput v-model="searchText" placeholder="Search proposals..." class="flex-1" clearable>
        <template #prependInner>
          <VaIcon name="search" />
        </template>
      </VaInput>
      <VaSelect v-model="statusFilter" :options="statusOptions" placeholder="Filter by status" class="w-48" clearable />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <VaProgressBar indeterminate />
      <div class="text-center mt-4 text-gray-600">Loading proposals...</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProposals.length === 0" class="empty-state">
      <VaIcon name="description" size="4rem" color="secondary" />
      <h3 class="text-xl font-semibold text-gray-600 mt-4">No Proposals Found</h3>
      <p class="text-gray-500 mt-2">
        {{
          searchText || statusFilter
            ? 'Try adjusting your search or filter'
            : 'Create your first proposal to get started'
        }}
      </p>
    </div>

    <!-- Proposals Table -->
    <VaDataTable
      v-else
      :items="filteredProposals"
      :columns="columns"
      hoverable
      clickable
      striped
      @row:click="onRowClick"
    >
      <!-- Client Column -->
      <template #cell(client)="{ rowData }">
        <div class="flex flex-col">
          <span class="font-semibold">{{ rowData.client?.full_name || 'N/A' }}</span>
          <span class="text-xs text-gray-500">{{ rowData.sales_inquiry?.code || '' }}</span>
        </div>
      </template>

      <!-- Hunting Area Column -->
      <template #cell(hunting_area)="{ rowData }">
        <span>{{ rowData.hunting_trip?.hunting_area || 'N/A' }}</span>
      </template>

      <!-- Dates Column -->
      <template #cell(dates)="{ rowData }">
        <div class="flex flex-col">
          <span class="text-sm">{{ rowData.hunting_trip?.dates || 'N/A' }}</span>
          <span class="text-xs text-gray-500">{{ rowData.hunting_trip?.no_of_days || 0 }} days</span>
        </div>
      </template>

      <!-- Total Amount Column -->
      <template #cell(total_amount)="{ rowData }">
        <span class="font-semibold text-primary">
          {{ formatCurrency(rowData.pricing?.total_amount) }}
        </span>
      </template>

      <!-- Status Column -->
      <template #cell(status)="{ rowData }">
        <VaChip :color="getStatusColor(rowData.status)" size="small" class="status-chip">
          {{ formatStatus(rowData.status) }}
        </VaChip>
      </template>

      <!-- Actions Column -->
      <template #cell(actions)="{ rowData }">
        <div class="flex gap-2 justify-center" @click.stop>
          <VaButton
            preset="plain"
            color="primary"
            size="small"
            icon="visibility"
            title="View Details"
            @click="$emit('view', rowData)"
          />
          <VaButton
            preset="plain"
            color="info"
            size="small"
            icon="edit"
            title="Edit Proposal"
            @click="$emit('edit', rowData)"
          />
        </div>
      </template>
    </VaDataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'ProposalList',
  props: {
    proposals: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['view', 'edit'],
  data() {
    return {
      searchText: '',
      statusFilter: null as string | null,
      columns: [
        { key: 'client', label: 'Client', sortable: true },
        { key: 'hunting_area', label: 'Hunting Area', sortable: true },
        { key: 'dates', label: 'Trip Dates', sortable: true },
        { key: 'total_amount', label: 'Total Amount', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', width: 120 },
      ],
      statusOptions: [
        { value: 'pending', text: 'Pending' },
        { value: 'provision_sales', text: 'Provisional' },
        { value: 'confirmed', text: 'Confirmed' },
        { value: 'declined', text: 'Declined' },
        { value: 'cancelled', text: 'Cancelled' },
        { value: 'completed', text: 'Completed' },
      ],
    }
  },
  computed: {
    filteredProposals(): any[] {
      let result = this.proposals

      // Filter by status
      if (this.statusFilter) {
        result = result.filter((p) => p.status === this.statusFilter)
      }

      // Filter by search text
      if (this.searchText) {
        const search = this.searchText.toLowerCase()
        result = result.filter(
          (p) =>
            p.client?.full_name?.toLowerCase().includes(search) ||
            p.hunting_trip?.hunting_area?.toLowerCase().includes(search) ||
            p.sales_inquiry?.code?.toLowerCase().includes(search),
        )
      }

      return result
    },
  },
  methods: {
    onRowClick(row: any) {
      const data = row.source || row
      this.$emit('view', data)
    },

    formatCurrency(amount: number | undefined): string {
      if (!amount) return '$0'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    },

    getStatusColor(status: string): string {
      const colors: Record<string, string> = {
        pending: 'warning',
        provision_sales: 'info',
        confirmed: 'success',
        declined: 'danger',
        cancelled: 'secondary',
        completed: 'primary',
      }
      return colors[status] || 'secondary'
    },

    formatStatus(status: string): string {
      if (!status) return 'N/A'
      return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    },
  },
})
</script>

<style scoped>
.proposal-list {
  padding: 0;
}

.loading-container {
  padding: 60px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.status-chip {
  text-transform: capitalize;
  min-width: 100px;
  justify-content: center;
}

:deep(.va-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.va-data-table__table-thead th) {
  background-color: #f8f9fa;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

:deep(.va-data-table__table-tbody tr) {
  cursor: pointer;
  transition: background-color 0.2s;
}

:deep(.va-data-table__table-tbody tr:hover) {
  background-color: #f0f7ff;
}
</style>
