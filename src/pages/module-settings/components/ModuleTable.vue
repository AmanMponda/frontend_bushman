<template>
  <!-- fiter elemenets  and download btn slot -->
  <!-- create a slot for filter elements -->
  <slot name="filter-elements-and-download-btn"> </slot>
  <VaDataTable
    v-model:sort-by="sortBy"
    v-model:sorting-order="sortingOrder"
    :items="items"
    :columns="columns"
    hoverable
    :loading="loading"
    striped
  >
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2">
        <!-- View Icon -->
        <VaButton preset="plain" :icon="btnViewicon" @click="clickedView(rowData)"> </VaButton>
        <!-- Download Icon -->
        <VaButton preset="plain" icon="download" @click="clickedDownload(rowData)"> </VaButton>
      </div>
    </template>
  </VaDataTable>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'List',

  props: {
    items: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    btnViewicon: {
      type: String,
      default: 'visibility',
    },
  },
  emits: ['on-view', 'on-download'],
  data() {
    const sortingOrderOptions = [
      { text: 'asc', value: 'asc' },
      { text: 'desc', value: 'desc' },
      { text: 'no sorting', value: null },
    ]
    return {
      sortBy: 'username',
      sortingOrder: 'asc',
      sortingOrderOptions,
    }
  },

  mounted() {
    console.log('mounted')
    console.log(this.items)
  },

  methods: {
    sortByOptions() {
      return this.columns.map(({ name, key, sortable }) => sortable && (name || key)).filter(Boolean)
    },

    clickedView(rowData) {
      // Emit the expected structure
      this.$emit('on-view', {
        item: rowData,
        id: rowData.id,
      })
    },

    clickedDownload(rowData) {
      // Emit the download event with the same structure
      this.$emit('on-download', {
        item: rowData,
        id: rowData.id,
      })
    },
  },
})
</script>
