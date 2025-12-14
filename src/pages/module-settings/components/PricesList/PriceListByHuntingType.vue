<template>
  <VaCard class="mb-6">
    <VaCardContent>
      <h2 class="page-sub-title">Other packages by hunting type</h2>
      <template v-for="(item, index) in itemsByHuntingType" :key="item.id">
        <div class="flex items-center justify-between md:justify-items-stretch">
          <div class="flex items-center w-48">
            {{ item.sales_package.name }}
          </div>
          <div class="w-20">
            {{ item.sales_package.sales_quota.name }}/{{ item.price_list_type.price_list.area.name }}
          </div>

          <div>
            <VaButton preset="primary" @click="download">Download</VaButton>
          </div>
        </div>

        <VaDivider v-if="index !== itemsByHuntingType.length - 1" />
      </template>
    </VaCardContent>
    <VaCardActions vertical class="flex flex-wrap content-center mt-4">
      <VaButton v-if="numberOfInvoicesInView < maxNumberOfInvoices" preset="primary" @click="increaseNumberOfInvoices">
        Show more
      </VaButton>
      <VaButton v-else preset="primary" @click="numberOfInvoicesInView = minNumberOfInvoices">Show less</VaButton>
    </VaCardActions>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from '@/composables/useToast'
import { mapState } from 'pinia'
import { usePriceListStore } from '../../../../stores/price-list-store'

export default defineComponent({
  data() {
    return {
      minNumberOfInvoices: 7,
      maxNumberOfInvoices: 20,
      numberOfInvoicesInView: 7,
    }
  },

  computed: {
    ...mapState(usePriceListStore, ['itemsByHuntingType']),
  },

  created() {
    const { itemsByHuntingType } = usePriceListStore()
    console.log(itemsByHuntingType)
  },

  methods: {
    initToast() {
      const { init } = useToast()
      return init
    },

    increaseNumberOfInvoices(step = 10) {
      this.numberOfInvoicesInView = Math.min(this.numberOfInvoicesInView + step, this.maxNumberOfInvoices)
    },

    download() {
      const init = this.initToast()
      init({
        message: "Request received. We'll email your invoice once we've completed data collection.",
        color: 'success',
      })
    },
  },
})
</script>
