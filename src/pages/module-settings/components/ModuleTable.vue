<template>
  <div class="module-table-container">
    <StandardDataTable
      :columns="columns"
      :data="items"
      :loading="loading"
      :disable-search="false"
      :disable-pagination="false"
      :selectable="selectable"
    >
      <template #header-actions>
        <slot name="filter-elements-and-download-btn"> </slot>
      </template>
      <template #actions="{ row }">
        <div class="d-flex gap-1">
          <button v-if="showEdit" class="btn btn-warning btn-sm" title="Edit" @click="clickedEdit(row)">
            <i class="fa fa-edit"></i>
          </button>
          <button class="btn btn-info btn-sm" title="View" @click="clickedView(row)">
            <i :class="'fa fa-' + (btnViewicon === 'visibility' ? 'eye' : btnViewicon)"></i>
          </button>
          <button v-if="showDelete" class="btn btn-danger btn-sm" title="Delete" @click="clickedDelete(row)">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </template>
    </StandardDataTable>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import StandardDataTable from '@/components/bootstrap/StandardDataTable.vue'

export default defineComponent({
  name: 'ModuleTable',
  components: {
    StandardDataTable,
  },

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
    selectable: {
      type: Boolean,
      default: false,
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
