<template>
  <h2 class="page-sub-title">Area</h2>

  <template v-if="paymentCard">
    <VaDivider />

    <div class="flex items-center justify-between md:justify-items-stretch">
      <div
        class="flex grow flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-1 justify-between items-start md:items-center"
      >
        <div class="md:w-48">
          <p class="mb-1">Area</p>
          <p class="font-bold capitalize">
            {{ item.sales_package?.area?.name ?? item?.price_list_type?.price_list?.area?.name ?? 'No Area' }}
          </p>
        </div>
      </div>
    </div>
  </template>

  <!-- Uncomment the code below if you want to use the ChangeYourPaymentPlan component -->
  <!-- <ChangeYourPaymentPlan
      v-if="isChangeYourPaymentPlanModalOpen"
      :yearly-plan="paymentPlan.isYearly"
      @confirm="updatePaymentPlan"
      @cancel="togglePaymentPlanModal"
    /> -->
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { usePaymentCardsStore } from '../../../../stores/payment-cards'
// import ChangeYourPaymentPlan from '../..modals/ChangeYourPaymentPlan.vue';

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const paymentPlan = ref({
      id: '1',
      name: 'Gold',
      isYearly: false,
      type: 'current',
      padletsUsed: 19,
      padletsTotal: '20',
      priceMonth: '$6.99',
      priceYear: '$69.99',
      switchToYearlySave: '16%',
      uploadLimit: '100MB',
    })

    const cardStore = usePaymentCardsStore()
    const isChangeYourPaymentPlanModalOpen = ref(false)

    const paymentCard = computed(() => cardStore.currentPaymentCard)

    const togglePaymentPlanModal = () => {
      isChangeYourPaymentPlanModalOpen.value = !isChangeYourPaymentPlanModalOpen.value
    }

    const updatePaymentPlan = () => {
      paymentPlan.value.isYearly = !paymentPlan.value.isYearly
      isChangeYourPaymentPlanModalOpen.value = false
    }

    return {
      paymentPlan,
      paymentCard,
      togglePaymentPlanModal,
      isChangeYourPaymentPlanModalOpen,
      updatePaymentPlan,
    }
  },
})
</script>
