<template>
  <div class="pipeline-board">
    <!-- Header with filters -->
    <div class="board-header">
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-bold text-gray-800">Sales Confirmation Pipeline</h2>
        <VaBadge :text="String(totalItems)" color="primary" />
      </div>
      <div class="flex gap-3">
        <VaSelect
          v-model="seasonFilter"
          :options="seasonOptions"
          placeholder="All Seasons"
          class="w-48"
          clearable
          @update:modelValue="onSeasonChange"
        />
        <VaButton preset="secondary" icon="refresh" :loading="loading" @click="refreshPipeline"> Refresh </VaButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !hasData" class="loading-container">
      <VaProgressBar indeterminate />
      <p class="text-center mt-4 text-gray-600">Loading pipeline...</p>
    </div>

    <!-- Pipeline Columns -->
    <div v-else class="pipeline-columns">
      <!-- New Inquiries Column -->
      <div class="pipeline-column new-inquiries">
        <div class="column-header" :style="{ borderColor: stageColors.new_inquiries }">
          <div class="column-title">
            <VaIcon name="fiber_new" :color="stageColors.new_inquiries" />
            <span>New Inquiries</span>
          </div>
          <VaBadge :text="String(counts.new_inquiries)" :color="stageColors.new_inquiries" />
        </div>
        <div class="column-content">
          <div v-if="pipeline.new_inquiries.length === 0" class="empty-column">
            <VaIcon name="inbox" size="2rem" color="secondary" />
            <span>No new inquiries</span>
          </div>
          <PipelineCard
            v-for="item in pipeline.new_inquiries"
            :key="`new-${item.id}`"
            :item="item"
            @createProposal="$emit('create-proposal', item)"
            @click="handleCardClick(item)"
          />
        </div>
      </div>

      <!-- Pending Column -->
      <div class="pipeline-column pending">
        <div class="column-header" :style="{ borderColor: stageColors.pending }">
          <div class="column-title">
            <VaIcon name="hourglass_empty" :color="stageColors.pending" />
            <span>Pending</span>
          </div>
          <VaBadge :text="String(counts.pending)" :color="stageColors.pending" />
        </div>
        <div class="column-content">
          <div v-if="pipeline.pending.length === 0" class="empty-column">
            <VaIcon name="hourglass_empty" size="2rem" color="secondary" />
            <span>No pending items</span>
          </div>
          <PipelineCard
            v-for="item in pipeline.pending"
            :key="`pending-${item.id}`"
            :item="item"
            @view="$emit('view-proposal', item)"
            @edit="$emit('edit-proposal', item)"
            @click="handleCardClick(item)"
          />
        </div>
      </div>

      <!-- Provision Sales Column -->
      <div class="pipeline-column provision-sales">
        <div class="column-header" :style="{ borderColor: stageColors.provision_sales }">
          <div class="column-title">
            <VaIcon name="pending_actions" :color="stageColors.provision_sales" />
            <span>Provision Sales</span>
          </div>
          <VaBadge :text="String(counts.provision_sales)" :color="stageColors.provision_sales" />
        </div>
        <div class="column-content">
          <div v-if="pipeline.provision_sales.length === 0" class="empty-column">
            <VaIcon name="pending_actions" size="2rem" color="secondary" />
            <span>No provisional sales</span>
          </div>
          <PipelineCard
            v-for="item in pipeline.provision_sales"
            :key="`provision-${item.id}`"
            :item="item"
            @view="$emit('view-proposal', item)"
            @edit="$emit('edit-proposal', item)"
            @click="handleCardClick(item)"
          />
        </div>
      </div>

      <!-- Confirmed Column -->
      <div class="pipeline-column confirmed">
        <div class="column-header" :style="{ borderColor: stageColors.confirmed }">
          <div class="column-title">
            <VaIcon name="check_circle" :color="stageColors.confirmed" />
            <span>Confirmed</span>
          </div>
          <VaBadge :text="String(counts.confirmed)" :color="stageColors.confirmed" />
        </div>
        <div class="column-content">
          <div v-if="pipeline.confirmed.length === 0" class="empty-column">
            <VaIcon name="check_circle" size="2rem" color="secondary" />
            <span>No confirmed items</span>
          </div>
          <PipelineCard
            v-for="item in pipeline.confirmed"
            :key="`confirmed-${item.id}`"
            :item="item"
            @view="$emit('view-proposal', item)"
            @edit="$emit('edit-proposal', item)"
            @click="handleCardClick(item)"
          />
        </div>
      </div>

      <!-- Cancelled Column -->
      <div class="pipeline-column cancelled">
        <div class="column-header" :style="{ borderColor: stageColors.cancelled }">
          <div class="column-title">
            <VaIcon name="cancel" :color="stageColors.cancelled" />
            <span>Cancelled</span>
          </div>
          <VaBadge :text="String(counts.cancelled)" :color="stageColors.cancelled" />
        </div>
        <div class="column-content">
          <div v-if="pipeline.cancelled.length === 0" class="empty-column">
            <VaIcon name="cancel" size="2rem" color="secondary" />
            <span>No cancelled items</span>
          </div>
          <PipelineCard
            v-for="item in pipeline.cancelled"
            :key="`cancelled-${item.id}`"
            :item="item"
            @view="$emit('view-proposal', item)"
            @edit="$emit('edit-proposal', item)"
            @click="handleCardClick(item)"
          />
        </div>
      </div>

      <!-- Completed Column -->
      <div class="pipeline-column completed">
        <div class="column-header" :style="{ borderColor: stageColors.completed }">
          <div class="column-title">
            <VaIcon name="task_alt" :color="stageColors.completed" />
            <span>Completed</span>
          </div>
          <VaBadge :text="String(counts.completed)" :color="stageColors.completed" />
        </div>
        <div class="column-content">
          <div v-if="pipeline.completed.length === 0" class="empty-column">
            <VaIcon name="task_alt" size="2rem" color="secondary" />
            <span>No completed items</span>
          </div>
          <PipelineCard
            v-for="item in pipeline.completed"
            :key="`completed-${item.id}`"
            :item="item"
            @view="$emit('view-proposal', item)"
            @edit="$emit('edit-proposal', item)"
            @click="handleCardClick(item)"
          />
        </div>
      </div>
    </div>

    <!-- Stage Change Modal -->
    <VaModal v-model="showStageModal" title="Move to Stage" size="small" :hide-default-actions="true">
      <div class="p-4">
        <p class="mb-4">
          Move <strong>{{ selectedItem?.code }}</strong> to:
        </p>
        <VaSelect v-model="targetStage" :options="availableStages" label="Select Stage" class="mb-4" />
        <div class="flex justify-end gap-3">
          <VaButton preset="secondary" @click="showStageModal = false"> Cancel </VaButton>
          <VaButton color="primary" :loading="saving" :disabled="!targetStage" @click="confirmStageChange">
            Move
          </VaButton>
        </div>
      </div>
    </VaModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import PipelineCard from './PipelineCard.vue'

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
  total_amount: number | null
}

interface PipelineData {
  new_inquiries: PipelineItem[]
  pending: PipelineItem[]
  provision_sales: PipelineItem[]
  confirmed: PipelineItem[]
  cancelled: PipelineItem[]
  completed: PipelineItem[]
}

interface PipelineCounts {
  new_inquiries: number
  pending: number
  provision_sales: number
  confirmed: number
  cancelled: number
  completed: number
}

export default defineComponent({
  name: 'PipelineBoard',
  components: {
    PipelineCard,
  },
  props: {
    pipeline: {
      type: Object as PropType<PipelineData>,
      required: true,
    },
    counts: {
      type: Object as PropType<PipelineCounts>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    saving: {
      type: Boolean,
      default: false,
    },
    seasonOptions: {
      type: Array as PropType<{ value: number; text: string }[]>,
      default: () => [],
    },
  },
  emits: ['refresh', 'season-change', 'create-proposal', 'view-proposal', 'edit-proposal', 'stage-change'],
  data() {
    return {
      seasonFilter: null as number | null,
      showStageModal: false,
      selectedItem: null as PipelineItem | null,
      targetStage: null as string | null,
      stageColors: {
        new_inquiries: 'warning',
        pending: 'warning',
        provision_sales: 'info',
        confirmed: 'success',
        cancelled: 'secondary',
        completed: 'primary',
      } as Record<string, string>,
      stageOptions: [
        { value: 'pending', text: 'Pending' },
        { value: 'provision_sales', text: 'Provision Sales' },
        { value: 'confirmed', text: 'Confirmed' },
        { value: 'cancelled', text: 'Cancelled' },
        { value: 'completed', text: 'Completed' },
      ],
    }
  },
  computed: {
    totalItems(): number {
      return Object.values(this.counts).reduce((sum, count) => sum + count, 0)
    },

    hasData(): boolean {
      return this.totalItems > 0
    },

    availableStages(): { value: string; text: string }[] {
      if (!this.selectedItem) return this.stageOptions
      // Filter out current stage
      const currentStage = this.selectedItem.stage === 'new' ? 'new_inquiries' : this.selectedItem.stage
      return this.stageOptions.filter((opt) => opt.value !== currentStage)
    },
  },
  methods: {
    refreshPipeline() {
      this.$emit('refresh')
    },

    onSeasonChange(seasonId: number | null) {
      this.$emit('season-change', seasonId)
    },

    handleCardClick(item: PipelineItem) {
      // For proposals, open stage change modal on double-click or via context menu
      // For now, single click opens view for proposals
      if (item.type === 'proposal') {
        this.$emit('view-proposal', item)
      }
    },

    openStageModal(item: PipelineItem) {
      this.selectedItem = item
      this.targetStage = null
      this.showStageModal = true
    },

    confirmStageChange() {
      if (this.selectedItem && this.targetStage) {
        this.$emit('stage-change', {
          inquiryId: this.selectedItem.id,
          newStage: this.targetStage,
        })
        this.showStageModal = false
        this.selectedItem = null
        this.targetStage = null
      }
    },
  },
})
</script>

<style scoped>
.pipeline-board {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.loading-container {
  padding: 60px 20px;
  text-align: center;
}

.pipeline-columns {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
  flex: 1;
  min-height: 500px;
}

.pipeline-column {
  flex: 0 0 280px;
  min-width: 280px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 280px);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px 8px 0 0;
  border-bottom: 3px solid;
  position: sticky;
  top: 0;
  z-index: 1;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
}

.column-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #9ca3af;
  text-align: center;
  gap: 8px;
}

.empty-column span {
  font-size: 0.85rem;
}

/* Column-specific colors */
.pipeline-column.new-inquiries .column-header {
  border-color: #f59e0b;
}

.pipeline-column.pending .column-header {
  border-color: #f59e0b;
}

.pipeline-column.provision-sales .column-header {
  border-color: #3b82f6;
}

.pipeline-column.confirmed .column-header {
  border-color: #10b981;
}

.pipeline-column.cancelled .column-header {
  border-color: #6b7280;
}

.pipeline-column.completed .column-header {
  border-color: #8b5cf6;
}

/* Scrollbar styling */
.column-content::-webkit-scrollbar {
  width: 6px;
}

.column-content::-webkit-scrollbar-track {
  background: transparent;
}

.column-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.column-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .pipeline-column {
    flex: 0 0 250px;
    min-width: 250px;
  }
}
</style>
