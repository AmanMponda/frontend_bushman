<template>
  <VaModal
    :model-value="modelValue"
    title="Record Payment"
    size="medium"
    :hide-default-actions="true"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <div class="payment-modal-content">
      <!-- Installment Info -->
      <div class="installment-info mb-6">
        <div class="info-header">
          <VaIcon name="receipt_long" color="primary" />
          <span>{{ installment?.narration || 'Payment' }}</span>
        </div>
        <div class="info-amount">
          <span class="label">Amount Due:</span>
          <span class="amount">{{ formatCurrency(installment?.amount_due || 0) }}</span>
        </div>
        <!-- Show partial payment info if applicable -->
        <div v-if="hasPartialPayment" class="partial-payment-info mt-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Already Paid:</span>
            <span class="text-green-600 font-medium">{{ formatCurrency(installment?.amount_paid || 0) }}</span>
          </div>
          <div class="flex justify-between text-sm mt-1">
            <span class="text-gray-600">Remaining Balance:</span>
            <span class="text-orange-600 font-semibold">{{ formatCurrency(remainingBalance) }}</span>
          </div>
        </div>
      </div>

      <!-- Stage Change Warning -->
      <div v-if="triggersStage && willCompleteInstallment" class="stage-warning mb-6">
        <VaIcon name="flash_on" color="warning" />
        <span>
          This payment will move the sale to
          <strong>{{ formatStageName(triggersStage) }}</strong> stage
        </span>
      </div>

      <!-- Partial Payment Notice -->
      <div v-if="!willCompleteInstallment && form.amount_paid" class="partial-notice mb-6">
        <VaIcon name="info" color="info" />
        <span>This is a partial payment.</span>
      </div>

      <!-- Payment Form -->
      <div class="payment-form">
        <VaInput
          v-model.number="form.amount_paid"
          type="number"
          label="Amount Paid"
          placeholder="Enter amount"
          class="mb-4"
          :rules="[requiredRule, positiveAmountRule]"
        >
          <template #prependInner>
            <span class="text-gray-500">$</span>
          </template>
        </VaInput>

        <VaInput
          v-model="form.payment_reference"
          label="Payment Reference"
          placeholder="e.g., TRX-2025-001"
          class="mb-4"
        />

        <VaDateInput v-model="form.paid_at" label="Payment Date" class="mb-4" :clearable="false" />
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <VaButton preset="secondary" @click="handleCancel"> Cancel </VaButton>
        <VaButton color="primary" :loading="loading" :disabled="!isFormValid" @click="handleSubmit">
          Record Payment
        </VaButton>
      </div>
    </div>
  </VaModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

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
}

export default defineComponent({
  name: 'PaymentModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    installment: {
      type: Object as PropType<Installment | null>,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      form: {
        amount_paid: null as number | null,
        payment_reference: '',
        paid_at: new Date(),
      },
    }
  },
  computed: {
    isFormValid(): boolean {
      return !!this.form.amount_paid && this.form.amount_paid > 0
    },

    hasPartialPayment(): boolean {
      if (!this.installment) return false
      return this.installment.payment_status === 'partial' || (this.installment.amount_paid || 0) > 0
    },

    remainingBalance(): number {
      if (!this.installment) return 0
      if (this.installment.remaining_balance !== undefined) {
        return this.installment.remaining_balance
      }
      return (this.installment.amount_due || 0) - (this.installment.amount_paid || 0)
    },

    willCompleteInstallment(): boolean {
      if (!this.installment || !this.form.amount_paid) return false
      return this.form.amount_paid >= this.remainingBalance
    },

    triggersStage(): string | null {
      if (!this.installment) return null

      // Check explicit triggers_stage from API
      if (this.installment.triggers_stage) {
        return this.installment.triggers_stage
      }

      // Determine from narration/type
      const narration = this.installment.narration?.toLowerCase() || ''
      const type = this.installment.installment_type?.toLowerCase() || ''

      if (type.includes('deposit_booking') || (narration.includes('deposit') && narration.includes('booking'))) {
        return 'provision_sales'
      }
      if (type.includes('final_payment') || (narration.includes('final') && narration.includes('90'))) {
        return 'confirmed'
      }
      if (type.includes('trophy_deposit') || (narration.includes('trophy') && narration.includes('45'))) {
        return 'completed'
      }

      return null
    },

    requiredRule() {
      return (v: any) => !!v || 'Amount is required'
    },

    positiveAmountRule() {
      return (v: any) => (v && Number(v) > 0) || 'Amount must be positive'
    },
  },
  watch: {
    modelValue(newVal) {
      if (newVal && this.installment) {
        // Reset form without pre-filling amount
        this.form.amount_paid = null
        this.form.payment_reference = ''
        this.form.paid_at = new Date()
      }
    },
  },
  methods: {
    formatCurrency(amount: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    },

    formatStageName(stage: string): string {
      const names: Record<string, string> = {
        pending: 'PENDING',
        provision_sales: 'PROVISION SALES',
        confirmed: 'CONFIRMED',
        completed: 'COMPLETED',
      }
      return names[stage] || stage.replace(/_/g, ' ').toUpperCase()
    },

    handleCancel() {
      this.$emit('update:modelValue', false)
    },

    handleSubmit() {
      if (!this.installment || !this.isFormValid) return

      const payload = {
        installment_id: this.installment.id,
        amount_paid: this.form.amount_paid!,
        payment_reference: this.form.payment_reference || undefined,
        paid_at: this.form.paid_at ? this.formatDateForApi(this.form.paid_at) : undefined,
      }

      this.$emit('submit', payload)
    },

    formatDateForApi(date: Date): string {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
  },
})
</script>

<style scoped>
.payment-modal-content {
  padding: 16px;
}

.installment-info {
  background: #f3f4f6;
  border-radius: 8px;
  padding: 16px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.info-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-amount .label {
  color: #6b7280;
}

.info-amount .amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.stage-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #fff9c4;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
  font-size: 0.9rem;
  color: #856404;
}

.stage-warning strong {
  color: #1f2937;
}

.partial-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #e0f2fe;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
  font-size: 0.9rem;
  color: #0369a1;
}

.partial-payment-info {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

.payment-form {
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}
</style>
