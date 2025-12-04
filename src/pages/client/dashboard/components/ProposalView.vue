<template>
  <div class="proposal-view">
    <!-- Header with Logo and Title -->
    <div class="proposal-header">
      <div class="flex justify-between items-start mb-6">
        <div class="logo-section">
          <img v-if="logoUrl" :src="logoUrl" alt="Company Logo" class="h-16" />
          <h2 v-else class="text-xl font-bold text-primary">Bushman Safari Trackers Limited</h2>
        </div>
        <div class="text-right">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">SALES CONFIRMATION</h1>
          <p class="text-gray-600">
            Date: {{ proposal.confirmation_date_formatted || formatDate(proposal.confirmation_date) }}
          </p>
          <VaChip :color="getStatusColor(proposal.status)" size="small" class="mt-2">
            {{ formatStatus(proposal.status) }}
          </VaChip>
        </div>
      </div>
    </div>

    <!-- Stage Indicator -->
    <StageIndicator
      v-if="proposal.status"
      :current-stage="proposal.status"
      :installments="paymentInstallments"
      class="mb-6"
    />

    <!-- Action Buttons -->
    <div class="action-buttons mb-6 flex flex-wrap justify-end gap-3">
      <VaButton preset="secondary" icon="print" @click="printProposal"> Print </VaButton>
      <VaButton preset="secondary" icon="download" @click="downloadPdf"> Download PDF </VaButton>
      <VaButton color="primary" icon="edit" @click="$emit('edit', proposal)"> Edit </VaButton>

      <!-- Manual Cancel Button (only available before completion) -->
      <VaButton v-if="canBeCancelled" color="secondary" icon="cancel" @click="changeToStage('cancelled')">
        Cancel
      </VaButton>
    </div>

    <!-- Sales Agent & Client Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Sales Agent -->
      <VaCard outlined>
        <VaCardTitle class="flex items-center gap-2">
          <VaIcon name="support_agent" color="primary" />
          Sales Agent
        </VaCardTitle>
        <VaCardContent>
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">{{ proposal.sales_agent?.name || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ proposal.sales_agent?.email || 'N/A' }}</span>
          </div>
        </VaCardContent>
      </VaCard>

      <!-- Client Info -->
      <VaCard outlined>
        <VaCardTitle class="flex items-center gap-2">
          <VaIcon name="person" color="primary" />
          Client Information
        </VaCardTitle>
        <VaCardContent>
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value font-semibold">{{ proposal.client?.full_name || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Address:</span>
            <span class="value">{{ proposal.client?.address || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Home Tel:</span>
            <span class="value">{{ proposal.client?.home_tel || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Work Tel:</span>
            <span class="value">{{ proposal.client?.work_tel || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Cell:</span>
            <span class="value">{{ proposal.client?.cell || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ proposal.client?.email || 'N/A' }}</span>
          </div>
        </VaCardContent>
      </VaCard>
    </div>

    <!-- Hunting Trip Details -->
    <VaCard outlined class="mb-6">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="landscape" color="primary" />
        Hunting Trip Details
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="info-row">
            <span class="label">Type of Safari:</span>
            <span class="value">{{ proposal.hunting_trip?.type || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Hunting Area:</span>
            <span class="value">{{ proposal.hunting_trip?.hunting_area || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Outfitter:</span>
            <span class="value">{{ proposal.hunting_trip?.outfitter || 'Bushman Safari Trackers Limited' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Dates:</span>
            <span class="value">{{ proposal.hunting_trip?.dates || 'N/A' }}</span>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Details of Trip -->
    <VaCard outlined class="mb-6">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="groups" color="primary" />
        Details of Trip
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="stat-card">
            <div class="stat-value">{{ proposal.trip_details?.no_of_hunters || 0 }}</div>
            <div class="stat-label">Hunters</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ proposal.trip_details?.no_of_observers || 0 }}</div>
            <div class="stat-label">Observers</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ proposal.trip_details?.no_of_companions || 0 }}</div>
            <div class="stat-label">Companions</div>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Hunt Combination (Species) -->
    <VaCard outlined class="mb-6">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="pets" color="primary" />
        Hunt Combination
      </VaCardTitle>
      <VaCardContent>
        <VaDataTable :items="proposal.hunt_combination || []" :columns="speciesColumns" hoverable striped>
          <template #cell(species_name)="{ rowData }">
            <div class="flex flex-col">
              <span class="font-semibold">{{ rowData.species_name }}</span>
              <span class="text-xs text-gray-500 italic">{{ rowData.scientific_name }}</span>
            </div>
          </template>
          <template #cell(quantity)="{ rowData }">
            <VaBadge :text="String(rowData.quantity)" color="primary" />
          </template>
        </VaDataTable>
      </VaCardContent>
    </VaCard>

    <!-- Pricing / Payment Schedule -->
    <PaymentTable
      :installments="paymentInstallments"
      :summary="paymentSummary"
      :total-amount="proposal.pricing?.total_amount || 0"
      :loading="loadingPayments"
      :allow-unpay="true"
      @recordPayment="openPaymentModal"
      @unpay="handleUnpay"
    />

    <!-- Sales Inquiry Reference -->
    <VaCard outlined class="mb-6 bg-gray-50">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="link" color="info" />
        Linked Sales Inquiry
      </VaCardTitle>
      <VaCardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="info-row">
            <span class="label">Inquiry Code:</span>
            <span class="value font-mono">{{ proposal.sales_inquiry?.code || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Created Date:</span>
            <span class="value">{{ proposal.sales_inquiry?.created_date || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Season:</span>
            <span class="value">{{ proposal.sales_inquiry?.season || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Hunting License:</span>
            <span class="value">{{ proposal.hunting_license || 'N/A' }}</span>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- Remarks -->
    <VaCard v-if="proposal.remarks" outlined class="mb-6">
      <VaCardTitle class="flex items-center gap-2">
        <VaIcon name="notes" color="primary" />
        Remarks
      </VaCardTitle>
      <VaCardContent>
        <p class="text-gray-700">{{ proposal.remarks }}</p>
      </VaCardContent>
    </VaCard>

    <!-- Payment Modal -->
    <PaymentModal
      v-model="showPaymentModal"
      :installment="selectedInstallment"
      :loading="savingPayment"
      @submit="handlePaymentSubmit"
    />

    <!-- Status Change Modal -->
    <VaModal v-model="showStatusModal" title="Change Proposal Status" :hide-default-actions="true">
      <div class="p-4">
        <VaSelect v-model="newStatus" :options="statusOptions" label="Select New Status" class="mb-4" />
        <div class="flex justify-end gap-3">
          <VaButton preset="secondary" @click="showStatusModal = false">Cancel</VaButton>
          <VaButton color="primary" @click="changeStatus">Confirm</VaButton>
        </div>
      </div>
    </VaModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useSettingsStore } from '../../../../stores/settings-store'
import { useProposalStore } from '../../../../stores/proposal-store'
import StageIndicator from './StageIndicator.vue'
import PaymentTable from './PaymentTable.vue'
import PaymentModal from './PaymentModal.vue'

interface Installment {
  id: number
  narration: string
  amount_due: number
  amount_paid?: number
  remaining_balance?: number
  payment_status?: 'paid' | 'partial' | 'unpaid'
  installment_type?: string
  triggers_stage?: string | null
  is_paid: boolean
  paid_at?: string | null
  payment_reference?: string | null
  payments?: Array<{
    id: number
    amount: number
    payment_reference: string | null
    paid_at: string
  }>
}

export default defineComponent({
  name: 'ProposalView',
  components: {
    StageIndicator,
    PaymentTable,
    PaymentModal,
  },
  props: {
    proposal: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  emits: ['edit', 'status-change', 'payment-recorded'],
  data() {
    return {
      showStatusModal: false,
      showPaymentModal: false,
      selectedInstallment: null as Installment | null,
      newStatus: null as string | null,
      loadingPayments: false,
      savingPayment: false,
      speciesColumns: [
        { key: 'species_name', label: 'Species', sortable: true },
        { key: 'quantity', label: 'Quantity', sortable: true, width: 120 },
      ],
      statusOptions: [
        { value: 'pending', text: 'Pending' },
        { value: 'provision_sales', text: 'Provisional Sale' },
        { value: 'confirmed', text: 'Confirmed' },
        { value: 'declined', text: 'Declined' },
        { value: 'cancelled', text: 'Cancelled' },
        { value: 'completed', text: 'Completed' },
      ],
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['logo']),
    ...mapState(useProposalStore, ['paymentStatus']),

    logoUrl(): string | null {
      return this.logo || null
    },

    canBeCancelled(): boolean {
      const status = this.proposal.status
      return status === 'pending' || status === 'provision_sales' || status === 'confirmed'
    },

    paymentInstallments(): Installment[] {
      // Use payment status from API if available, otherwise fall back to proposal installments
      if (this.paymentStatus?.installments) {
        return this.paymentStatus.installments
      }
      // Map proposal installments with default is_paid status
      return (this.proposal.pricing?.installments || []).map((inst: any) => ({
        ...inst,
        is_paid: inst.is_paid || false,
        paid_at: inst.paid_at || null,
        amount_paid: inst.amount_paid || null,
        payment_reference: inst.payment_reference || null,
      }))
    },

    paymentSummary() {
      if (this.paymentStatus?.summary) {
        return this.paymentStatus.summary
      }
      // Calculate from installments
      const installments = this.paymentInstallments
      const total_due = installments.reduce((sum: number, i: Installment) => sum + (i.amount_due || 0), 0)
      const total_paid = installments.reduce(
        (sum: number, i: Installment) => sum + (i.is_paid ? i.amount_paid || i.amount_due : 0),
        0,
      )
      const paid_count = installments.filter((i: Installment) => i.is_paid).length
      return {
        total_due,
        total_paid,
        total_unpaid: total_due - total_paid,
        paid_count,
        unpaid_count: installments.length - paid_count,
      }
    },
  },
  watch: {
    'proposal.id': {
      handler() {
        this.loadPaymentStatus()
      },
    },
  },
  mounted() {
    this.loadPaymentStatus()
  },
  methods: {
    ...mapActions(useProposalStore, ['fetchPayments', 'recordPayment', 'unpayInstallment']),

    async loadPaymentStatus() {
      if (!this.proposal?.id) return
      this.loadingPayments = true
      try {
        await this.fetchPayments(this.proposal.id)
      } catch (error) {
        console.error('Error loading payment status:', error)
      } finally {
        this.loadingPayments = false
      }
    },

    formatDate(dateString: string | undefined): string {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch {
        return dateString
      }
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

    printProposal() {
      window.print()
    },

    async downloadPdf() {
      if (!this.proposal?.id) {
        this.$vaToast?.init({
          message: 'No proposal selected',
          color: 'warning',
        })
        return
      }

      try {
        this.$vaToast?.init({
          message: 'Generating PDF...',
          color: 'info',
        })

        const response = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}sales-confirmation/proposals/${this.proposal.id}/pdf`,
        )
        const data = await response.json()

        if (data.success) {
          // Convert base64 to blob and download
          const byteCharacters = atob(data.pdf)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })

          // Create download link
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `Sales_Confirmation_${data.client_name || this.proposal.client?.full_name || 'Proposal'}.pdf`
          a.click()

          // Clean up
          window.URL.revokeObjectURL(url)

          this.$vaToast?.init({
            message: 'PDF downloaded successfully',
            color: 'success',
          })
        } else {
          this.$vaToast?.init({
            message: data.message || 'Failed to generate PDF',
            color: 'danger',
          })
        }
      } catch (error) {
        console.error('Error downloading PDF:', error)
        this.$vaToast?.init({
          message: 'Failed to download PDF',
          color: 'danger',
        })
      }
    },

    confirmProposal() {
      this.newStatus = 'confirmed'
      this.showStatusModal = true
    },

    changeToStage(stage: string) {
      this.$emit('status-change', {
        id: this.proposal.id,
        status: stage,
      })
    },

    changeStatus() {
      if (this.newStatus) {
        this.$emit('status-change', {
          id: this.proposal.id,
          status: this.newStatus,
        })
        this.showStatusModal = false
        this.newStatus = null
      }
    },

    // Payment methods
    openPaymentModal(installment: Installment) {
      this.selectedInstallment = installment
      this.showPaymentModal = true
    },

    async handlePaymentSubmit(payload: {
      installment_id: number
      amount_paid: number
      payment_reference?: string
      paid_at?: string
    }) {
      this.savingPayment = true
      try {
        const result = await this.recordPayment(payload.installment_id, {
          amount_paid: payload.amount_paid,
          payment_reference: payload.payment_reference,
          paid_at: payload.paid_at,
        })

        this.showPaymentModal = false
        this.selectedInstallment = null

        // Build success message based on payment status
        let message = 'Payment recorded successfully'
        if (result.stage_changed) {
          message = result.message || `Payment recorded. Stage updated to ${this.formatStatus(result.new_stage || '')}`
        } else if (result.data?.payment_status === 'partial') {
          const remaining = this.formatCurrency(result.data.remaining_balance)
          message = `Partial payment recorded. Remaining balance: ${remaining}`
        }

        this.$vaToast?.init({
          message,
          color: 'success',
        })

        // Emit event for parent to refresh if needed
        this.$emit('payment-recorded', result)

        // Reload payment status
        await this.loadPaymentStatus()
      } catch (error: any) {
        this.$vaToast?.init({
          message: error.response?.data?.message || 'Failed to record payment',
          color: 'danger',
        })
      } finally {
        this.savingPayment = false
      }
    },

    async handleUnpay(installment: Installment) {
      if (!confirm(`Are you sure you want to reverse the payment for "${installment.narration}"?`)) {
        return
      }

      this.savingPayment = true
      try {
        await this.unpayInstallment(installment.id)

        this.$vaToast?.init({
          message: 'Payment reversed successfully',
          color: 'success',
        })

        // Reload payment status
        await this.loadPaymentStatus()
      } catch (error: any) {
        this.$vaToast?.init({
          message: error.response?.data?.message || 'Failed to reverse payment',
          color: 'danger',
        })
      } finally {
        this.savingPayment = false
      }
    },
  },
})
</script>

<style scoped>
.proposal-view {
  max-width: 1000px;
  margin: 0 auto;
}

.proposal-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.info-row .label {
  color: #6b7280;
  min-width: 100px;
}

.info-row .value {
  color: #1f2937;
}

.stat-card {
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--va-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-row {
  background: linear-gradient(135deg, var(--va-primary), var(--va-primary-darken));
}

@media print {
  .action-buttons {
    display: none !important;
  }

  .proposal-view {
    max-width: 100%;
  }

  :deep(.va-card) {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
  }
}
</style>
