<template>
  <div class="contract-details">
    <h1 class="contract-title">Contract Details</h1>
    <div class="contract-info">
      <div class="info-item"><strong>Contract Number:</strong> {{ contractItem?.contract_number || 'N/A' }}</div>
      <div class="info-item"><strong>Description:</strong> {{ contractItem?.description || 'N/A' }}</div>
      <div class="info-item"><strong>Start Date:</strong> {{ formatDateTime(contractItem?.start_date) || 'N/A' }}</div>
      <div class="info-item"><strong>End Date:</strong> {{ formatDateTime(contractItem?.end_date) || 'N/A' }}</div>
      <div class="info-item"><strong>Created At:</strong> {{ formatDateTime(contractItem?.created_at) || 'N/A' }}</div>
      <div class="info-item"><strong>Updated At:</strong> {{ formatDateTime(contractItem?.updated_at) || 'N/A' }}</div>
    </div>

    <section v-if="contractItem?.sales_confirmation_proposal" class="sales-confirmation">
      <h2>Sales Confirmation Proposal</h2>
      <div class="proposal-info">
        <div class="info-item">
          <strong>Sales Inquiry ID:</strong> {{ contractItem.sales_confirmation_proposal.sales_inquiry?.id || 'N/A' }}
        </div>
        <div class="info-item">
          <strong>Preferred Date:</strong>
          {{ formatDateTime(contractItem.sales_confirmation_proposal.preference?.preferred_date) || 'N/A' }}
        </div>
        <div class="info-item">
          <strong>Area:</strong>
          {{
            contractItem.sales_confirmation_proposal.area?.length > 0
              ? contractItem.sales_confirmation_proposal.area[0]?.area?.name
              : 'N/A'
          }}
        </div>
      </div>
    </section>

    <section v-if="contractItem?.entity" class="client-info">
      <h2>Client Information</h2>
      <div class="info-item"><strong>Full Name:</strong> {{ contractItem.entity.full_name || 'N/A' }}</div>
      <div class="info-item"><strong>Country:</strong> {{ contractItem.entity.country?.name || 'N/A' }}</div>
      <div class="info-item"><strong>Email:</strong> {{ contractItem.entity.contacts?.[0]?.contact || 'N/A' }}</div>
    </section>

    <section v-if="contractItem.price_break_down" class="price-breakdown">
      <h2>Price Breakdown</h2>
      <div>
        <strong>Total Amount:</strong>
        {{ contractItem.price_break_down.total_amount.currency?.symbol
        }}{{ contractItem.price_break_down.total_amount.amount || 'N/A' }}
      </div>
      <div>
        <strong>Number of Companions:</strong>
        {{ contractItem.price_break_down.companion_cost_details?.number_of_companions || 'N/A' }}
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDateTime } from '../../../../services/utils'

export default defineComponent({
  props: {
    contractItem: {
      type: Object as PropType<any>, // Specify the correct type of the contractItem based on your data structure
      required: true,
    },
  },
  setup() {
    return {
      formatDateTime,
    }
  },
})
</script>

<style scoped>
.contract-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contract-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.info-item {
  margin: 10px 0;
}

h2 {
  border-bottom: 2px solid #eee;
  margin-top: 30px;
  padding-bottom: 10px;
}

.sales-confirmation,
.client-info,
.price-breakdown {
  margin-top: 20px;
}

strong {
  color: #555;
}
</style>
