<template>
  <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between py-2">
    <div class="flex flex-col md:flex-row gap-2 justify-start">
      <VaButton
        v-if="showForm"
        class="px-2 py-2"
        border-color="danger"
        round
        preset="secondary"
        icon="close"
        size="small"
        ico
        @click="gotBack()"
        >Cancel</VaButton
      >
    </div>
    <VaButtonGroup v-if="!showForm">
      <VaButton
        class="px-2 py-2"
        label="Add New Quota"
        :border-color="'primary'"
        round
        preset="secondary"
        icon="add"
        size="small"
        @click="showCreateForm"
        >Create Item</VaButton
      >
    </VaButtonGroup>
  </div>
  <template v-if="showForm">
    <ItemsForm :item="rqItem"> </ItemsForm>
  </template>

  <template v-else>
    <template v-if="requistionItems.length != 0">
      <VaList>
        <VaListItem v-for="(item, index) in requistionItems" :key="index" class="list__item">
          <VaListItemSection>
            <VaListItemLabel>
              <b class="py-6 font-bold capitalize">{{ item.item_name }}</b>
            </VaListItemLabel>

            <VaDataTable :items="item.items" :columns="columns" :loading="loadingRequistionItems"> </VaDataTable>
          </VaListItemSection>

          <VaListItemSection icon>
            <VaIcon name="remove_red_eye" color="background-element" />
          </VaListItemSection>
        </VaListItem>
      </VaList>
    </template>
    <template v-else>
      <p class="text-center">No Requistion Items Found</p>
    </template>
  </template>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useRequisitionStore } from '../../../../stores/requistions-store'
import ItemsForm from './ItemsForm.vue'

export default {
  components: {
    ItemsForm,
  },

  props: {
    rqItem: {
      type: Object,
      required: true,
    },
  },

  data() {
    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'quantity' },
      { key: 'unit_of_measurement.name', label: 'Unit' },
      { key: 'exchange_rate' },
      { key: 'rate', label: 'Price' },
    ]

    return {
      isStriped: true,
      isHoverable: true,
      columns,
      showForm: false,
    }
  },
  computed: {
    ...mapState(useRequisitionStore, ['requistionItems', 'loadingRequistionItems']),
  },
  beforeMount() {},
  methods: {
    gotBack() {
      this.showForm = false
    },
    showCreateForm() {
      this.showForm = true
    },

    setShowAddForm(showAddForm: boolean) {
      console.log(showAddForm)
    },
  },
}
</script>

<style lang="scss">
.capitalize {
  text-transform: capitalize;
}
</style>
