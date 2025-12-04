<template>
  <VaCard class="w-full">
    <VaCardContent>
      <!-- Header with Actions -->
      <div class="flex flex-col md:flex-row gap-3 mb-6 justify-between items-center py-4 px-2 bg-gray-50 rounded-lg">
        <div class="flex flex-col md:flex-row gap-3 justify-start">
          <VaButton v-if="currentView !== 'pipeline'" class="px-6" icon="arrow_back" size="large" @click="handleGoBack">
            Go Back
          </VaButton>
        </div>
      </div>

      <!-- Pipeline Board View (Main) -->
      <template v-if="currentView === 'pipeline'">
        <PipelineBoard
          :pipeline="pipeline"
          :counts="pipelineCounts"
          :loading="loading"
          :saving="saving"
          :season-options="seasonOptions"
          @refresh="loadPipeline"
          @seasonChange="onSeasonChange"
          @createProposal="handleCreateFromInquiry"
          @viewProposal="viewProposal"
          @editProposal="editProposal"
          @stageChange="handleStageChange"
        />
      </template>

      <!-- View/Details -->
      <template v-else-if="currentView === 'view' && currentProposal">
        <ProposalView
          :proposal="currentProposal"
          @edit="editProposal"
          @statusChange="handleStatusChange"
          @paymentRecorded="handlePaymentRecorded"
        />
      </template>

      <!-- Create/Edit Form -->
      <template v-else-if="currentView === 'form'">
        <ProposalForm
          :proposal="editingProposal"
          :is-edit="isEditMode"
          :preselected-inquiry="preselectedInquiry"
          @save="handleSave"
          @cancel="handleGoBack"
        />
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useProposalStore } from '../../../stores/proposal-store'
import PipelineBoard from './components/PipelineBoard.vue'
import ProposalView from './components/ProposalView.vue'
import ProposalForm from './components/ProposalForm.vue'
import { useToast } from 'vuestic-ui'
import axios from 'axios'

export default defineComponent({
  name: 'SalesConfirmationProposals',
  components: {
    PipelineBoard,
    ProposalView,
    ProposalForm,
  },
  setup() {
    const { init } = useToast()
    return { init }
  },
  data() {
    return {
      currentView: 'pipeline' as 'pipeline' | 'view' | 'form',
      editingProposal: null as any,
      isEditMode: false,
      preselectedInquiry: null as any,
      seasonOptions: [] as { value: number; text: string }[],
      currentSeasonId: null as number | null,
    }
  },
  computed: {
    ...mapState(useProposalStore, [
      'pipeline',
      'pipelineCounts',
      'currentProposal',
      'paymentStatus',
      'loading',
      'saving',
      'error',
    ]),
  },
  mounted() {
    this.loadPipeline()
    this.loadSeasons()
  },
  methods: {
    ...mapActions(useProposalStore, [
      'fetchPipeline',
      'updatePipelineStage',
      'fetchProposalById',
      'createProposal',
      'updateProposal',
      'updateProposalStatus',
      'clearCurrentProposal',
      'clearPaymentStatus',
    ]),

    async loadPipeline() {
      try {
        await this.fetchPipeline(undefined, this.currentSeasonId || undefined)
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

    onSeasonChange(seasonId: number | null) {
      this.currentSeasonId = seasonId
      this.loadPipeline()
    },

    async viewProposal(item: any) {
      try {
        const proposalId = item.proposal_id || item.confirmation_id
        if (proposalId) {
          await this.fetchProposalById(proposalId)
          this.currentView = 'view'
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

    editProposal(item: any) {
      // If it's a pipeline item, we need to fetch the full proposal first
      if (item.proposal_id || item.confirmation_id) {
        const proposalId = item.proposal_id || item.confirmation_id
        this.fetchProposalById(proposalId).then(() => {
          this.editingProposal = this.currentProposal
          this.isEditMode = true
          this.preselectedInquiry = null
          this.currentView = 'form'
        })
      } else {
        this.editingProposal = item
        this.isEditMode = true
        this.preselectedInquiry = null
        this.currentView = 'form'
      }
    },

    handleCreateFromInquiry(inquiry: any) {
      this.editingProposal = null
      this.isEditMode = false
      this.preselectedInquiry = inquiry
      this.currentView = 'form'
    },

    showCreateForm() {
      this.editingProposal = null
      this.isEditMode = false
      this.preselectedInquiry = null
      this.currentView = 'form'
    },

    handleGoBack() {
      this.currentView = 'pipeline'
      this.editingProposal = null
      this.isEditMode = false
      this.preselectedInquiry = null
      this.clearCurrentProposal()
      this.clearPaymentStatus()
      this.loadPipeline()
    },

    async handleSave(data: any) {
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
        this.handleGoBack()
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
        // Refresh the current proposal
        await this.fetchProposalById(data.id)
      } catch (error) {
        this.init({
          message: 'Failed to update proposal status',
          color: 'danger',
        })
      }
    },

    async handleStageChange(data: { inquiryId: number; newStage: string }) {
      try {
        await this.updatePipelineStage(data.inquiryId, data.newStage)
        this.init({
          message: `Moved to ${data.newStage.replace(/_/g, ' ')}`,
          color: 'success',
        })
      } catch (error: any) {
        this.init({
          message: error.response?.data?.message || 'Failed to update stage',
          color: 'danger',
        })
      }
    },

    async handlePaymentRecorded(result: any) {
      // If stage changed due to payment, show additional message and refresh
      if (result.stage_changed) {
        this.init({
          message: `Stage updated: ${result.old_stage} → ${result.new_stage}`,
          color: 'info',
        })
        // Refresh the current proposal to get updated status
        if (this.currentProposal?.id) {
          await this.fetchProposalById(this.currentProposal.id)
        }
      }
    },
  },
})
</script>
