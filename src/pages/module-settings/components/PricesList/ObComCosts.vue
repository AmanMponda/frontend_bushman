<template>
  <h2 class="page-sub-title">{{ title }}</h2>
  <ModuleTable :items="companionItems" :columns="columns" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useToast } from 'vuestic-ui'
import { mapState } from 'pinia'
import { usePriceListStore } from '../../../../stores/price-list-store'
import ModuleTable from '../ModuleTable.vue'

export default defineComponent({
  name: 'PricesSpeciesList',
  components: {
    ModuleTable,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    companionItems: {
      type: Array as any,
      required: true,
    },
  },

  data() {
    const columns = [
      { key: 'amount', label: 'Amount(per head)', sortable: true },
      //   actions
      // { key: 'actions', label: 'Actions', sortable: false },
    ]

    return {
      minNumberOfInvoices: 7,
      maxNumberOfInvoices: 20,
      numberOfInvoicesInView: 7,
      columns,
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
