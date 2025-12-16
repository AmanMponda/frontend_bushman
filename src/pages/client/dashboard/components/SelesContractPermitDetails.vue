<template>
  <div class="contract-permit-details">
    <h1 class="permit-title">Contract Permit Details</h1>
    <div class="permit-info">
      <div class="info-item"><strong>Permit Number:</strong> {{ item?.permit_number ?? 'N/A' }}</div>
      <div class="info-item"><strong>Issued Date:</strong> {{ formatDateTime(item?.issued_date) ?? 'N/A' }}</div>
      <div class="info-item"><strong>Description:</strong> {{ item?.description ?? 'N/A' }}</div>
      <div class="info-item"><strong>Created At:</strong> {{ formatDateTime(item?.created_at) ?? 'N/A' }}</div>
      <div class="info-item"><strong>Updated At:</strong> {{ formatDateTime(item?.updated_at) ?? 'N/A' }}</div>
    </div>

    <section v-if="item?.dates?.length > 0" class="dates-info">
      <h2>Contract Dates</h2>
      <div class="info-item"><strong>Start Date:</strong> {{ formatDateTime(item.dates[0]?.start_date) ?? 'N/A' }}</div>
      <div class="info-item"><strong>End Date:</strong> {{ formatDateTime(item.dates[0]?.end_date) ?? 'N/A' }}</div>
    </section>

    <section v-if="item?.entity_contract?.entity" class="client-info">
      <h2>Client Information</h2>
      <div class="info-item"><strong>Full Name:</strong> {{ item.entity_contract.entity.full_name ?? 'N/A' }}</div>
      <div class="info-item"><strong>Country:</strong> {{ item.entity_contract.entity.country?.name ?? 'N/A' }}</div>
      <div class="info-item">
        <strong>Email:</strong> {{ item.entity_contract.entity.contacts?.[0]?.contact ?? 'N/A' }}
      </div>
    </section>

    <section v-if="item?.entity_contract?.price_break_down" class="price-breakdown">
      <h2>Price Breakdown</h2>
      <div>
        <strong>Total Amount:</strong>
        {{ item.entity_contract.price_break_down.total_amount.currency?.symbol
        }}{{ item.entity_contract.price_break_down.total_amount.amount ?? 'N/A' }}
      </div>
      <div>
        <strong>Number of Companions:</strong>
        {{ item.entity_contract.price_break_down.companion_cost_details?.number_of_companions ?? 'N/A' }}
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDateTime } from '../../../../services/utils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<any>, // Specify the correct type of the item based on your data structure
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
.contract-permit-details {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.permit-title {
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

.dates-info,
.client-info,
.price-breakdown {
  margin-top: 20px;
}

strong {
  color: #555;
}
</style>
