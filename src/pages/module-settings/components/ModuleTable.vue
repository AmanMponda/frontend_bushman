<template>
  <!-- filter elements and download btn slot -->
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
      <div class="flex gap-1">
        <VaButton
          v-if="showEdit"
          preset="plain"
          icon="edit"
          color="warning"
          size="small"
          @click="clickedEdit(rowData)"
        />
        <VaButton preset="plain" :icon="btnViewicon" size="small" @click="clickedView(rowData)" />
        <VaButton
          v-if="showDelete"
          preset="plain"
          icon="delete"
          color="danger"
          size="small"
          @click="clickedDelete(rowData)"
        />
      </div>
    </template>
  </VaDataTable>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ModuleTable',

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
    showEdit: {
      type: Boolean,
      default: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['onView', 'onEdit', 'onDelete', 'on-download'],
  data() {
    return {
      sortBy: 'id',
      sortingOrder: 'desc',
    }
  },

  mounted() {
    console.log('ModuleTable mounted with items:', this.items)
  },

  methods: {
    sortByOptions() {
      return this.columns.map(({ name, key, sortable }) => sortable && (name || key)).filter(Boolean)
    },

    clickedView(rowData) {
      console.log('ModuleTable: View clicked for:', rowData)
      this.$emit('onView', rowData)
    },

    clickedEdit(rowData) {
      console.log('ModuleTable: Edit clicked for:', rowData)
      this.$emit('onEdit', rowData)
    },

    clickedDelete(rowData) {
      console.log('ModuleTable: Delete clicked for:', rowData)
      this.$emit('onDelete', rowData)
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
