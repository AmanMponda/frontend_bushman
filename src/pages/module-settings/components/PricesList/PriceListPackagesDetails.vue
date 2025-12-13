<template>
  <h2 class="page-sub-title">Package Infos</h2>
  <!-- <template v-for="(plan, index) in plans" :key="plan.id"> -->
  <div class="flex items-center justify-between md:justify-items-stretch">
    <div
      class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
    >
      <div class="flex items-center md:w-48">
        <div class="font-bold">Name: {{ preceListItem.sales_package.name }}</div>
      </div>

      <div class="md:w-48">
        <p class="mb-1">
          Status:<VaBadge v-if="preceListItem.price_list_type.is_active" class="ml-2" color="success" text="active" />
        </p>
        <p>{{ preceListItem.sales_package.descrption }}&nbsp;</p>
      </div>
      <div class="md:w-48">
        <template v-if="preceListItem.price_list_type">
          <p class="mb-1">
            {{ preceListItem.price_list_type.currency }}{{ preceListItem.price_list_type.amount }}&nbsp;/{{
              preceListItem.price_list_type.duration
            }}days
          </p>
          <p>Hunting type: {{ preceListItem.price_list_type.hunting_type.name }}</p>
        </template>
        <!-- <p v-else>Free</p> -->
      </div>
    </div>
    <div class="md:w-48 flex justify-end">
      <!-- <div v-if="plan.type === 'current'" class="font-bold">{{ plan.padletsUsed }} padlets used</div> -->
      <!-- <VaButton>Upgrade</VaButton> -->
      <!-- <VaButton v-else preset="primary" @click="switchPlan(plan.id)">Downgrade</VaButton> -->
    </div>
  </div>

  <VaDivider />
  <!-- </template> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    preceListItem: {
      type: Object,
      required: true,
    },
  },
})
</script>
