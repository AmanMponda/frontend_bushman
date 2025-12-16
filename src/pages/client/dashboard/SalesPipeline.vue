<template>
  <div class="sales-pipeline-page">
    <!-- Header Section -->
    <div class="pipeline-header">
      <div class="header-content">
        <div class="header-title-section">
          <div class="title-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 class="page-title">Sales Pipeline</h1>
            <p class="page-subtitle">Manage your sales inquiries and quotations</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="d-flex gap-2 align-items-center">
            <button
              class="btn btn-sm"
              :class="pipelineView === 'partial' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="pipelineView = 'partial'"
            >
              <i class="fa fa-columns me-1"></i> Partial Pipeline
            </button>
            <button
              class="btn btn-sm"
              :class="pipelineView === 'full' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="pipelineView = 'full'"
            >
              <i class="fa fa-th me-1"></i> Full Pipeline
            </button>
          </div>
          <VaSelect
            v-model="seasonFilter"
            :options="seasonOptions"
            placeholder="All Seasons"
            class="season-select"
            clearable
            @update:modelValue="loadPipeline"
          />
          <VaButton preset="secondary" icon="refresh" :loading="loading" @click="loadPipeline"> Refresh </VaButton>
        </div>
      </div>
    </div>

    <!-- Pipeline Content -->
    <div class="pipeline-content">
      <!-- Loading State -->
      <div v-if="loading && !hasData" class="loading-container py-8">
        <VaProgressBar indeterminate />
        <p class="text-center mt-4 text-gray-600">Loading pipeline...</p>
      </div>

      <!-- Partial Pipeline View (4 columns) -->
      <div v-else-if="pipelineView === 'partial'" class="pipeline-columns pipeline-columns-partial">
        <!-- Column 1: Canceled & New Inquiries -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">cancel</i>
              <span>Inquiries</span>
            </div>
            <span class="badge bg-secondary">
              {{ counts.cancelled + counts.new_inquiries }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.cancelled.length === 0 && pipeline.new_inquiries.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">inbox</i>
              <span>No items</span>
            </div>
            <PipelineCard
              v-for="item in [...pipeline.cancelled, ...pipeline.new_inquiries]"
              :key="`col1-${item.id}`"
              :item="item"
              @createProposal="handleCreateProposal(item)"
              @view="handleViewProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 2: Quotations/Pending -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">description</i>
              <span>Quotations</span>
            </div>
            <span class="badge bg-warning">
              {{ counts.pending }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.pending.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">hourglass_empty</i>
              <span>No pending items</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.pending"
              :key="`col2-${item.id}`"
              :item="item"
              @view="handleViewProposal(item)"
              @edit="handleEditProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 3: Provisional Sales & Confirmed -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">check_circle</i>
              <span>Provisional Sales</span>
            </div>
            <span class="badge bg-info">
              {{ counts.provision_sales + counts.confirmed }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.provision_sales.length === 0 && pipeline.confirmed.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">check_circle</i>
              <span>No items</span>
            </div>
            <PipelineCard
              v-for="item in [...pipeline.provision_sales, ...pipeline.confirmed]"
              :key="`col3-${item.id}`"
              :item="item"
              @view="handleViewProposal(item)"
              @edit="handleEditProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 4: Completed -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">task_alt</i>
              <span>Completed</span>
            </div>
            <span class="badge bg-success">
              {{ counts.completed }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.completed.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">task_alt</i>
              <span>No completed items</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.completed"
              :key="`col4-${item.id}`"
              :item="item"
              @view="handleViewProposal(item)"
              @edit="handleEditProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>
      </div>

      <!-- Full Pipeline View (6 columns) -->
      <div v-else class="pipeline-columns pipeline-columns-full">
        <!-- Column 1: Canceled -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">cancel</i>
              <span>Canceled</span>
            </div>
            <span class="badge bg-secondary">
              {{ counts.cancelled }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.cancelled.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">cancel</i>
              <span>No canceled items</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.cancelled"
              :key="`canceled-${item.id}`"
              :item="item"
              @createProposal="handleCreateProposal(item)"
              @view="handleViewProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 2: New Inquiries -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">fiber_new</i>
              <span>New Inquiries</span>
            </div>
            <span class="badge bg-warning">
              {{ counts.new_inquiries }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.new_inquiries.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">inbox</i>
              <span>No new inquiries</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.new_inquiries"
              :key="`new-${item.id}`"
              :item="item"
              @createProposal="handleCreateProposal(item)"
              @view="handleViewProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 3: Quotations/Pending -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">description</i>
              <span>Quotations</span>
            </div>
            <span class="badge bg-warning">
              {{ counts.pending }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.pending.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">hourglass_empty</i>
              <span>No quotations</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.pending"
              :key="`pending-${item.id}`"
              :item="item"
              @view="handleViewProposal(item)"
              @edit="handleEditProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 4: Provision Sales -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">shopping_cart</i>
              <span>Provision Sales</span>
            </div>
            <span class="badge bg-info">
              {{ counts.provision_sales }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.provision_sales.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">shopping_cart</i>
              <span>No provision sales</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.provision_sales"
              :key="`provision-${item.id}`"
              :item="item"
              @view="handleViewProposal(item)"
              @edit="handleEditProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 5: Confirmed -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">check_circle</i>
              <span>Confirmed</span>
            </div>
            <span class="badge bg-success">
              {{ counts.confirmed }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.confirmed.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">check_circle</i>
              <span>No confirmed items</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.confirmed"
              :key="`confirmed-${item.id}`"
              :item="item"
              @view="handleViewProposal(item)"
              @edit="handleEditProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>

        <!-- Column 6: Completed -->
        <div class="pipeline-column">
          <div class="column-header">
            <div class="column-title">
              <i class="material-icons" style="font-size: 18px; vertical-align: middle">task_alt</i>
              <span>Completed</span>
            </div>
            <span class="badge bg-success">
              {{ counts.completed }}
            </span>
          </div>
          <div class="column-content">
            <div v-if="pipeline.completed.length === 0" class="empty-column">
              <i class="material-icons" style="font-size: 48px; color: #9b9fb5">task_alt</i>
              <span>No completed items</span>
            </div>
            <PipelineCard
              v-for="item in pipeline.completed"
              :key="`completed-${item.id}`"
              :item="item"
              @view="handleViewProposal(item)"
              @edit="handleEditProposal(item)"
              @click="handleCardClick(item)"
            />
          </div>
        </div>
      </div>

      <!-- Proposal Form Modal -->
      <VaModal
        v-model="showFormModal"
        size="large"
        :hide-default-actions="true"
        :title="isEditMode ? 'Edit Quotation' : 'Create Quotation'"
      >
        <ProposalForm
          :proposal="editingProposal"
          :is-edit="isEditMode"
          :preselected-inquiry="preselectedInquiry"
          @save="handleSaveProposal"
          @cancel="showFormModal = false"
        />
      </VaModal>
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
import PipelineCard from './components/PipelineCard.vue'
import ProposalForm from './components/ProposalForm.vue'
import { useGlobalStore } from '../../../stores/global-store'

export default defineComponent({
  name: 'SalesPipeline',
  components: {
    PipelineCard,
    ProposalForm,
  },
  setup() {
    const { init } = useToast()
    const globalStore = useGlobalStore()
    const router = useRouter()
    return { init, globalStore, router }
  },
  data() {
    return {
      seasonFilter: null as number | null,
      seasonOptions: [] as { value: number; text: string }[],
      showFormModal: false,
      editingProposal: null as any,
      isEditMode: false,
      preselectedInquiry: null as any,
      pipelineView: 'partial' as 'partial' | 'full',
    }
  },
  computed: {
    ...mapState(useProposalStore, ['pipeline', 'pipelineCounts', 'currentProposal', 'loading', 'saving']),
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
    hasData(): boolean {
      return Object.values(this.counts).reduce((sum: number, count: any) => sum + count, 0) > 0
    },
  },
  mounted() {
    // Collapse sidebar to show full pipeline without horizontal scroll
    this.globalStore.isSidebarMinimized = true
    this.loadPipeline()
    this.loadSeasons()
  },
  methods: {
    ...mapActions(useProposalStore, [
      'fetchPipeline',
      'fetchProposalById',
      'createProposal',
      'updateProposal',
      'updateProposalStatus',
      'clearCurrentProposal',
    ]),

    async loadPipeline() {
      try {
        await this.fetchPipeline(undefined, this.seasonFilter || undefined)
      } catch (error) {
        this.init({
          message: 'Failed to load pipeline',
          color: 'danger',
        })
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

    handleCardClick(item: any) {
      if (item.type === 'proposal') {
        this.handleViewProposal(item)
      }
    },

    async handleViewProposal(item: any) {
      try {
        const proposalId = item.proposal_id || item.confirmation_id || item.id
        if (proposalId) {
          // Navigate to the view page
          const type = item.type === 'inquiry' ? 'inquiry' : 'proposal'
          this.router.push({
            name: 'pipeline-item-view',
            params: { id: proposalId.toString() },
            query: { type },
          })
        } else {
          this.init({
            message: 'No quotation found for this item',
            color: 'warning',
          })
        }
      } catch (error) {
        this.init({
          message: 'Failed to load quotation details',
          color: 'danger',
        })
      }
    },

    handleEditProposal(item: any) {
      const proposalId = item.proposal_id || item.confirmation_id
      if (proposalId) {
        this.fetchProposalById(proposalId).then(() => {
          this.editingProposal = this.currentProposal
          this.isEditMode = true
          this.preselectedInquiry = null
          this.showFormModal = true
        })
      }
    },

    handleCreateProposal(inquiry: any) {
      this.editingProposal = null
      this.isEditMode = false
      this.preselectedInquiry = inquiry
      this.showFormModal = true
    },

    async handleSaveProposal(data: any) {
      try {
        if (this.isEditMode && this.editingProposal?.id) {
          await this.updateProposal(this.editingProposal.id, data)
          this.init({
            message: 'Quotation updated successfully',
            color: 'success',
          })
        } else {
          await this.createProposal(data)
          this.init({
            message: 'Quotation created successfully',
            color: 'success',
          })
        }
        this.showFormModal = false
        this.loadPipeline()
      } catch (error: any) {
        this.init({
          message: error.response?.data?.message || 'Failed to save quotation',
          color: 'danger',
        })
      }
    },

    async handleStatusChange(data: { id: number; status: string }) {
      try {
        await this.updateProposalStatus(data.id, data.status)
        this.init({
          message: `Proposal status changed to ${data.status}`,
          color: 'success',
        })
        await this.fetchProposalById(data.id)
        this.loadPipeline()
      } catch (error) {
        this.init({
          message: 'Failed to update proposal status',
          color: 'danger',
        })
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.sales-pipeline-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
}

.pipeline-header {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #dee2e6;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 40px;
  height: 40px;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #212529;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 13px;
  color: #6c757d;
  margin: 4px 0 0 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-end;
  height: 40px;
}

.header-actions > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions .btn {
  height: 32px;
  padding: 4px 10px;
  font-size: 13px;
  display: flex;
  align-items: center;
  line-height: 1;
  white-space: nowrap;
}

.header-actions .btn i {
  font-size: 12px;
}

.season-select {
  min-width: 140px;
  flex-shrink: 0;
  height: 32px !important;
  align-self: flex-start;
  margin-top: 4px;
}

.season-select :deep(.va-input) {
  height: 32px !important;
}

.season-select :deep(.va-input__container) {
  height: 32px !important;
  min-height: 32px !important;
  padding: 0 !important;
}

.season-select :deep(.va-input__field) {
  height: 32px !important;
  min-height: 32px !important;
  display: flex !important;
  align-items: center !important;
  padding: 4px 8px !important;
}

.season-select :deep(input) {
  height: 32px !important;
  line-height: 32px !important;
}

.pipeline-content {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
}

/* Pipeline Columns - Partial (4 columns) and Full (6 columns) */
.pipeline-columns {
  display: grid;
  gap: 16px;
  align-items: start;
  padding-bottom: 24px;
}

/* Partial Pipeline - 4 columns in a single horizontal row */
.pipeline-columns-partial {
  grid-template-columns: repeat(4, minmax(280px, 1fr));
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: fit-content;
}

/* Full Pipeline - horizontally scrollable */
.pipeline-columns-full {
  grid-template-columns: repeat(6, minmax(280px, auto));
  width: max-content;
  min-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

/* Scrollbar styling for pipeline views */
.pipeline-columns-partial::-webkit-scrollbar,
.pipeline-columns-full::-webkit-scrollbar {
  height: 8px;
}

.pipeline-columns-partial::-webkit-scrollbar-track,
.pipeline-columns-full::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.pipeline-columns-partial::-webkit-scrollbar-thumb,
.pipeline-columns-full::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.pipeline-columns-partial::-webkit-scrollbar-thumb:hover,
.pipeline-columns-full::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.pipeline-column {
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  border: 1px solid #dee2e6;
  min-height: 400px;
  transition: all 0.3s ease;
}

/* Ensure full pipeline columns maintain minimum width for scrolling */
.pipeline-columns-full .pipeline-column {
  min-width: 280px;
  width: 280px;
}

.column-header {
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #212529;
}

.column-header .badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.column-content {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: visible;
  overflow-x: hidden;
  min-height: 100px;
}

.table-content {
  padding: 0;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    thead {
      background: #f8fafc;
      position: sticky;
      top: 0;
      z-index: 5;

      th {
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 13px;
        color: #475569;
        border-bottom: 2px solid #e2e8f0;
        white-space: nowrap;
      }
    }

    tbody {
      tr {
        border-bottom: 1px solid #f1f5f9;
        transition: background 0.2s ease;

        &:hover {
          background: #f8fafc;
        }

        td {
          padding: 12px;
          font-size: 13px;
          color: #64748b;
        }
      }
    }
  }
}

.empty-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #6c757d;
  text-align: center;
  gap: 12px;
  min-height: 200px;

  i.material-icons {
    color: #9b9fb5;
  }

  span {
    font-size: 14px;
    font-weight: normal;
    color: #6c757d;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

/* Remove column-specific styling for simple look */

/* Responsive Design */
@media (max-width: 1400px) {
  .pipeline-columns-partial {
    grid-template-columns: repeat(4, minmax(260px, 1fr));
    overflow-x: auto;
  }
  .pipeline-columns-full {
    grid-template-columns: repeat(6, minmax(280px, auto));
    width: max-content;
    min-width: 100%;
  }
  .pipeline-columns-full .pipeline-column {
    min-width: 280px;
    width: 280px;
  }
}

@media (max-width: 1024px) {
  .sales-pipeline-page {
    padding: 16px;
  }

  .pipeline-columns-partial {
    grid-template-columns: repeat(4, minmax(240px, 1fr));
    overflow-x: auto;
  }
  .pipeline-columns-full {
    grid-template-columns: repeat(6, minmax(280px, auto));
    width: max-content;
    min-width: 100%;
  }
  .pipeline-columns-full .pipeline-column {
    min-width: 280px;
    width: 280px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .pipeline-columns-partial {
    grid-template-columns: repeat(4, minmax(220px, 1fr));
    overflow-x: auto;
  }
  .pipeline-columns-full {
    grid-template-columns: repeat(6, minmax(280px, auto));
    width: max-content;
    min-width: 100%;
  }
  .pipeline-columns-full .pipeline-column {
    min-width: 280px;
    width: 280px;
  }

  .table-content {
    overflow-x: auto;

    table {
      min-width: 800px;
    }
  }

  .page-title {
    font-size: 24px;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;

    .season-select {
      width: 100%;
    }
  }
}

/* Scrollbar styling for table */
.table-content::-webkit-scrollbar {
  height: 8px;
}

.table-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.table-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
