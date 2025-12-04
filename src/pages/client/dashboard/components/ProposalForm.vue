<template>
  <div class="proposal-form">
    <h2 class="text-2xl font-bold mb-6">
      {{ isEdit ? 'Edit Quotation' : 'Create New Quotation' }}
    </h2>

    <VaForm ref="formRef">
      <!-- Sales Inquiry Selection (only for new proposals) -->
      <VaCard v-if="!isEdit" outlined class="mb-6">
        <VaCardTitle class="flex items-center gap-2">
          <VaIcon name="search" color="primary" />
          Select Sales Inquiry
        </VaCardTitle>
        <VaCardContent>
          <VaAlert color="info" class="mb-4" border="left">
            <template #title>Link to Sales Inquiry</template>
            Select a sales inquiry to create a quotation. Client and hunting details will be automatically populated.
          </VaAlert>

          <VaSelect
            v-model="form.sales_inquiry_id"
            :options="salesInquiryOptions"
            :loading="loadingInquiries"
            label="Sales Inquiry"
            placeholder="Search and select a sales inquiry..."
            searchable
            highlight-matched-text
            :rules="[(v: any) => !!v || 'Sales inquiry is required']"
            @update:modelValue="onInquirySelected"
          >
            <template #content="{ value }">
              <div v-if="value" class="flex flex-col">
                <span class="font-semibold">{{ value.text }}</span>
                <span class="text-xs text-gray-500">{{ value.subtitle }}</span>
              </div>
            </template>
          </VaSelect>

          <!-- Selected Inquiry Preview -->
          <div v-if="selectedInquiry" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold mb-2">Selected Inquiry Details</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Client:</span>
                <span class="ml-1 font-medium">{{ selectedInquiry.client_name }}</span>
              </div>
              <div>
                <span class="text-gray-500">Area:</span>
                <span class="ml-1 font-medium">{{ selectedInquiry.area }}</span>
              </div>
              <div>
                <span class="text-gray-500">Days:</span>
                <span class="ml-1 font-medium">{{ selectedInquiry.no_of_days }}</span>
              </div>
              <div>
                <span class="text-gray-500">Season:</span>
                <span class="ml-1 font-medium">{{ selectedInquiry.season }}</span>
              </div>
            </div>
            <div v-if="selectedInquiry.species" class="mt-2">
              <span class="text-gray-500">Species:</span>
              <span class="ml-1 font-medium">{{ selectedInquiry.species }}</span>
            </div>
          </div>
        </VaCardContent>
      </VaCard>

      <!-- Quotation Details -->
      <VaCard outlined class="mb-6">
        <VaCardTitle class="flex items-center gap-2">
          <VaIcon name="description" color="primary" />
          Quotation Details
        </VaCardTitle>
        <VaCardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VaDateInput v-model="form.confirmation_date" label="Confirmation Date" placeholder="Select date" />
            <VaInput
              v-model="form.hunting_license"
              label="Hunting License"
              placeholder="Enter license number (optional)"
            />
          </div>
          <VaTextarea
            v-model="form.remarks"
            label="Remarks"
            placeholder="Add any additional notes or remarks..."
            class="mt-4"
            :min-rows="3"
          />
        </VaCardContent>
      </VaCard>

      <!-- Payment Installments -->
      <VaCard outlined class="mb-6">
        <VaCardTitle class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <VaIcon name="payments" color="primary" />
            Payment Installments
          </div>
          <VaButton preset="secondary" size="small" icon="add" @click="addInstallment"> Add Installment </VaButton>
        </VaCardTitle>
        <VaCardContent>
          <VaAlert v-if="form.installments.length === 0" color="warning" class="mb-4" border="left">
            <template #title>Required</template>
            At least one payment installment is required to create a quotation.
          </VaAlert>

          <div v-if="form.installments.length === 0" class="text-center text-gray-500 py-4">
            No installments added. Click "Add Installment" to create payment schedule.
          </div>

          <div
            v-for="(installment, index) in form.installments"
            :key="index"
            class="installment-row mb-4 p-4 border rounded-lg"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="font-semibold text-gray-700">Installment {{ index + 1 }}</span>
              <VaButton preset="plain" color="danger" size="small" icon="delete" @click="removeInstallment(index)" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <VaInput
                v-model="installment.narration"
                label="Description"
                placeholder="e.g., Deposit Due upon booking"
                :rules="[(v: any) => !!v || 'Description is required']"
              />
              <VaInput
                v-model="installment.amount_due"
                label="Amount (USD)"
                type="number"
                placeholder="5000"
                :rules="[(v: any) => v > 0 || 'Amount must be greater than 0']"
              />
              <VaSelect
                v-model="installment.due_days_type"
                :options="dueDaysTypeOptions"
                label="Due Type"
                placeholder="Select when due"
                value-by="value"
                text-by="text"
              />
              <VaInput
                v-model="installment.due_days"
                :label="installment.due_days_type === 'before_arrival' ? 'Days Before Arrival' : 'Due Days'"
                type="number"
                placeholder="e.g., 90"
                :disabled="installment.due_days_type === 'upon_booking'"
              />
            </div>
          </div>

          <!-- Total -->
          <div v-if="form.installments.length > 0" class="mt-4 p-4 bg-primary rounded-lg text-white">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">TOTAL</span>
              <span class="text-2xl font-bold">{{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>
        </VaCardContent>
      </VaCard>

      <!-- Status (only for edit mode) -->
      <VaCard v-if="isEdit" outlined class="mb-6">
        <VaCardTitle class="flex items-center gap-2">
          <VaIcon name="flag" color="primary" />
          Status
        </VaCardTitle>
        <VaCardContent>
          <VaSelect
            v-model="form.status"
            :options="statusOptions"
            label="Quotation Status"
            placeholder="Select status"
          />
        </VaCardContent>
      </VaCard>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <VaButton preset="secondary" @click="$emit('cancel')"> Cancel </VaButton>
        <VaButton color="primary" :loading="saving" :disabled="!canSubmit" @click="submitForm">
          {{ isEdit ? 'Update Quotation' : 'Create Quotation' }}
        </VaButton>
      </div>
    </VaForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useForm } from 'vuestic-ui'
import { mapState } from 'pinia'
import { useProposalStore } from '../../../../stores/proposal-store'
import { format } from 'date-fns'
import axios from 'axios'

interface Installment {
  narration: string
  amount_due: number
  due_days: number | null
  amount_due_type: string
  due_days_type: string
}

interface PipelineInquiry {
  id: number
  code: string
  client?: {
    full_name: string
    country: string
  }
  hunting_details?: {
    areas: string
    species: string
    no_of_days: number
    season: string
    no_of_hunters: number
  }
}

export default defineComponent({
  name: 'ProposalForm',
  props: {
    proposal: {
      type: Object as PropType<any>,
      default: null,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    preselectedInquiry: {
      type: Object as PropType<PipelineInquiry | null>,
      default: null,
    },
  },
  emits: ['save', 'cancel'],
  setup() {
    const { validate, reset } = useForm('formRef')
    return { validate, reset }
  },
  data() {
    return {
      form: {
        sales_inquiry_id: null as any,
        confirmation_date: new Date(),
        hunting_license: '',
        remarks: '',
        status: 'pending',
        installments: [] as Installment[],
      },
      salesInquiryOptions: [] as any[],
      loadingInquiries: false,
      selectedInquiry: null as any,
      dueDaysTypeOptions: [
        { value: 'upon_booking', text: 'Upon Booking' },
        { value: 'before_arrival', text: 'Days Before Arrival' },
        { value: 'upon_completion', text: 'Upon Completion' },
      ],
      statusOptions: [
        { value: 'pending', text: 'Pending' },
        { value: 'provision_sales', text: 'Provisional Sale' },
        { value: 'confirmed', text: 'Confirmed' },
        { value: 'declined', text: 'Declined' },
        { value: 'cancelled', text: 'Cancelled' },
        { value: 'completed', text: 'Completed' },
      ],
      defaultInstallments: [
        {
          narration: 'Deposit Due upon booking',
          amount_due: 5000,
          due_days: 0,
          amount_due_type: 'fixed',
          due_days_type: 'upon_booking',
        },
        {
          narration: '2nd Deposit Due one year prior',
          amount_due: 10000,
          due_days: 365,
          amount_due_type: 'fixed',
          due_days_type: 'before_arrival',
        },
        {
          narration: 'Final Payment Due 90 days prior',
          amount_due: 15000,
          due_days: 90,
          amount_due_type: 'fixed',
          due_days_type: 'before_arrival',
        },
        {
          narration: 'Trophy Deposit Due 45 days prior',
          amount_due: 2500,
          due_days: 45,
          amount_due_type: 'fixed',
          due_days_type: 'before_arrival',
        },
      ],
    }
  },
  computed: {
    ...mapState(useProposalStore, ['saving']),

    totalAmount(): number {
      return this.form.installments.reduce((sum, inst) => sum + (Number(inst.amount_due) || 0), 0)
    },

    canSubmit(): boolean {
      if (this.isEdit) {
        return true
      }
      // Require sales inquiry and at least one installment
      return !!this.form.sales_inquiry_id && this.form.installments.length > 0
    },
  },
  mounted() {
    this.loadNewInquiries()
    if (this.isEdit && this.proposal) {
      this.populateForm()
    } else {
      // Start with empty installments for new proposals
      this.form.installments = []

      // Handle preselected inquiry from pipeline
      if (this.preselectedInquiry) {
        this.handlePreselectedInquiry()
      }
    }
  },
  methods: {
    async loadNewInquiries() {
      this.loadingInquiries = true
      try {
        // Fetch only NEW inquiries from the pipeline API
        const url = `${import.meta.env.VITE_APP_BASE_URL}sales-confirmation/pipeline?stage=new_inquiries`
        const response = await axios.get(url)

        if (response.data.success) {
          const newInquiries = response.data.data?.new_inquiries || []
          this.salesInquiryOptions = newInquiries.map((item: PipelineInquiry) => ({
            value: item.id,
            text: `${item.code} - ${item.client?.full_name || 'Unknown'}`,
            subtitle: `${item.hunting_details?.areas || 'N/A'} | ${item.hunting_details?.no_of_days || 0} days | ${
              item.hunting_details?.no_of_hunters || 0
            } hunter(s)`,
            selfItem: {
              id: item.id,
              code: item.code,
              client_name: item.client?.full_name,
              country: item.client?.country,
              area: item.hunting_details?.areas,
              species: item.hunting_details?.species,
              no_of_days: item.hunting_details?.no_of_days,
              no_of_hunters: item.hunting_details?.no_of_hunters,
              season: item.hunting_details?.season,
            },
          }))
        }
      } catch (error) {
        console.error('Error loading new inquiries:', error)
      } finally {
        this.loadingInquiries = false
      }
    },

    handlePreselectedInquiry() {
      const inquiry = this.preselectedInquiry
      if (!inquiry) return

      // Set the selected inquiry details
      this.selectedInquiry = {
        id: inquiry.id,
        code: inquiry.code,
        client_name: inquiry.client?.full_name,
        country: inquiry.client?.country,
        area: inquiry.hunting_details?.areas,
        species: inquiry.hunting_details?.species,
        no_of_days: inquiry.hunting_details?.no_of_days,
        no_of_hunters: inquiry.hunting_details?.no_of_hunters,
        season: inquiry.hunting_details?.season,
      }

      // Create the option object for the select
      const option = {
        value: inquiry.id,
        text: `${inquiry.code} - ${inquiry.client?.full_name || 'Unknown'}`,
        subtitle: `${inquiry.hunting_details?.areas || 'N/A'} | ${inquiry.hunting_details?.no_of_days || 0} days`,
        selfItem: this.selectedInquiry,
      }

      // Add to options if not already there
      const exists = this.salesInquiryOptions.find((opt) => opt.value === inquiry.id)
      if (!exists) {
        this.salesInquiryOptions.unshift(option)
      }

      // Set the form value
      this.form.sales_inquiry_id = option
    },

    onInquirySelected(selected: any) {
      if (selected?.selfItem) {
        this.selectedInquiry = selected.selfItem
      } else {
        this.selectedInquiry = null
      }
    },

    populateForm() {
      if (!this.proposal) return

      this.form.confirmation_date = this.proposal.confirmation_date
        ? new Date(this.proposal.confirmation_date)
        : new Date()
      this.form.hunting_license = this.proposal.hunting_license || ''
      this.form.remarks = this.proposal.remarks || ''
      this.form.status = this.proposal.status || 'pending'

      if (this.proposal.pricing?.installments) {
        this.form.installments = this.proposal.pricing.installments.map((inst: any) => ({
          narration: inst.narration,
          amount_due: inst.amount_due,
          due_days: inst.due_days,
          amount_due_type: inst.amount_due_type || 'fixed',
          due_days_type: inst.due_days_type || 'upon_booking',
        }))
      }

      if (this.proposal.sales_inquiry) {
        this.selectedInquiry = {
          id: this.proposal.sales_inquiry.id,
          code: this.proposal.sales_inquiry.code,
          client_name: this.proposal.client?.full_name,
          area: this.proposal.hunting_trip?.hunting_area,
          no_of_days: this.proposal.hunting_trip?.no_of_days,
          season: this.proposal.sales_inquiry.season,
        }
      }
    },

    addInstallment() {
      this.form.installments.push({
        narration: '',
        amount_due: 0,
        due_days: null,
        amount_due_type: 'fixed',
        due_days_type: 'upon_booking',
      })
    },

    removeInstallment(index: number) {
      this.form.installments.splice(index, 1)
    },

    formatCurrency(amount: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    },

    async submitForm() {
      const isValid = await this.validate()
      if (!isValid) return

      const payload: any = {
        confirmation_date: this.form.confirmation_date
          ? format(new Date(this.form.confirmation_date), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd'),
        hunting_license: this.form.hunting_license || null,
        remarks: this.form.remarks || null,
        installments: this.form.installments.map((inst) => {
          // Handle VaSelect returning object instead of string
          let dueType = inst.due_days_type
          if (typeof dueType === 'object' && dueType !== null) {
            dueType = (dueType as any).value || 'upon_booking'
          }
          let amountType = inst.amount_due_type
          if (typeof amountType === 'object' && amountType !== null) {
            amountType = (amountType as any).value || 'fixed'
          }

          return {
            narration: inst.narration,
            amount_due: Number(inst.amount_due),
            due_days: inst.due_days ? Number(inst.due_days) : null,
            amount_due_type: String(amountType || 'fixed'),
            due_days_type: String(dueType || 'upon_booking'),
          }
        }),
      }

      if (!this.isEdit) {
        payload.sales_inquiry_id = this.form.sales_inquiry_id?.value || this.form.sales_inquiry_id
      }

      if (this.isEdit) {
        payload.status = this.form.status
      }

      this.$emit('save', payload)
    },
  },
})
</script>

<style scoped>
.proposal-form {
  max-width: 900px;
  margin: 0 auto;
}

.installment-row {
  background-color: #fafafa;
  transition: background-color 0.2s;
}

.installment-row:hover {
  background-color: #f0f7ff;
}
</style>
