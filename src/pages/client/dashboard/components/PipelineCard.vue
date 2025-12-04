<template>
  <div class="pipeline-card" :class="{ 'is-new': item.type === 'inquiry' }" @click="handleClick">
    <!-- Header -->
    <div class="card-header">
      <span class="inquiry-code">{{ item.code }}</span>
      <VaChip v-if="item.type === 'proposal'" size="small" color="primary"> Quotation </VaChip>
    </div>

    <!-- Client Info -->
    <div class="client-info">
      <h4 class="client-name">{{ item.client?.full_name || 'Unknown Client' }}</h4>
      <p class="client-meta">
        {{ item.client?.country || 'N/A' }} • {{ item.created_date_formatted || item.created_date }}
      </p>
    </div>

    <!-- Hunting Details -->
    <div class="hunting-details">
      <div class="detail-row">
        <VaIcon name="pets" size="small" color="secondary" />
        <span class="detail-text truncate">{{ truncateSpecies(item.hunting_details?.species) }}</span>
      </div>
      <div class="detail-row">
        <VaIcon name="location_on" size="small" color="secondary" />
        <span class="detail-text">{{ item.hunting_details?.areas || 'N/A' }}</span>
      </div>
      <div class="detail-row">
        <VaIcon name="calendar_today" size="small" color="secondary" />
        <span class="detail-text">{{ formatDateRange }}</span>
      </div>
      <div v-if="item.type === 'proposal' && item.total_amount" class="detail-row amount-row">
        <VaIcon name="payments" size="small" color="success" />
        <span class="detail-text amount">{{ formatCurrency(item.total_amount) }}</span>
      </div>
      <div v-else class="detail-row">
        <VaIcon name="person" size="small" color="secondary" />
        <span class="detail-text">{{ item.hunting_details?.no_of_hunters || 0 }} hunter(s)</span>
      </div>
    </div>

    <!-- Sales Agent (for proposals) -->
    <div v-if="item.sales_agent" class="agent-info">
      <VaIcon name="support_agent" size="small" color="info" />
      <span class="agent-name">{{ item.sales_agent.name }}</span>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <template v-if="item.type === 'inquiry'">
        <VaButton size="small" color="primary" block @click.stop="$emit('create-proposal', item)">
          Create Quotation
        </VaButton>
      </template>
      <template v-else>
        <VaButton size="small" preset="secondary" @click.stop="$emit('view', item)"> View </VaButton>
        <VaButton size="small" preset="plain" color="info" @click.stop="$emit('edit', item)"> Edit </VaButton>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface PipelineItem {
  id: number
  type: 'inquiry' | 'proposal'
  stage: string
  code: string
  created_date: string
  created_date_formatted?: string
  client?: {
    id?: number
    full_name: string
    country: string
    email?: string
    phone?: string
  }
  hunting_details?: {
    season?: string
    areas: string
    species?: string
    start_date?: string
    end_date?: string
    no_of_days?: number
    no_of_hunters?: number
  }
  proposal_id?: number | null
  confirmation_id?: number | null
  sales_agent?: {
    id: number
    name: string
  } | null
  total_amount?: number | null
}

export default defineComponent({
  name: 'PipelineCard',
  props: {
    item: {
      type: Object as PropType<PipelineItem>,
      required: true,
    },
  },
  emits: ['click', 'create-proposal', 'view', 'edit'],
  computed: {
    formatDateRange(): string {
      const details = this.item.hunting_details
      if (!details?.start_date) return 'N/A'

      const formatDate = (dateStr: string) => {
        try {
          const date = new Date(dateStr)
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        } catch {
          return dateStr
        }
      }

      const start = formatDate(details.start_date)
      const end = details.end_date ? formatDate(details.end_date) : ''
      const days = details.no_of_days ? ` (${details.no_of_days}d)` : ''

      return end ? `${start} - ${end}${days}` : `${start}${days}`
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.item)
    },

    truncateSpecies(species: string | undefined): string {
      if (!species) return 'N/A'
      if (species.length > 30) {
        return species.substring(0, 30) + '...'
      }
      return species
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
  },
})
</script>

<style scoped>
.pipeline-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pipeline-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.pipeline-card.is-new {
  border-left: 3px solid var(--va-warning);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.inquiry-code {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  font-family: monospace;
}

.client-info {
  margin-bottom: 12px;
}

.client-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.client-meta {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.hunting-details {
  background: #f9fafb;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-text {
  font-size: 0.8rem;
  color: #4b5563;
}

.detail-text.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.amount-row .amount {
  font-weight: 600;
  color: var(--va-success);
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: #eff6ff;
  border-radius: 4px;
  margin-bottom: 12px;
}

.agent-name {
  font-size: 0.75rem;
  color: #3b82f6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions :deep(.va-button) {
  flex: 1;
}
</style>
