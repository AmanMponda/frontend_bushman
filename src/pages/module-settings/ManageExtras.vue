<template>
  <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between py-2">
    <div class="flex flex-col md:flex-row gap-2 justify-start">
      <!-- v-if="showDetails || showAddForm" -->
      <VaButton v-if="showDetails || showAddForm" class="px-2 py-2" icon="arrow_back" size="small" @click="gotoBack()">
        Go Back
      </VaButton>
    </div>
    <VaButtonGroup>
      <VaButton
        v-if="!showAddForm && !showDetails"
        class="px-2 py-2"
        color="primary"
        label="Add New Quota"
        round
        present="secondary"
        border-color="primary"
        icon="add"
        size="small"
        @click="() => setShowAddForm(true)"
        >Create extra service</VaButton
      >
    </VaButtonGroup>
  </div>
  <template v-if="showAddForm"> <SafariExtrasForm @submitSelectedItemsEvent="setShowAddForm(false)" /> </template>

  <template v-else>
    <VaDataTable :items="safariExtras" :columns="columns" :loading="loadingExtras">
      <!-- <template #cell(actions)="{ rowData }">
        <VaButton preset="plain" icon="edit" @click="() => console.log(rowData)"s></VaButton>
      </template> -->
    </VaDataTable>
  </template>
</template>

<script lang="ts">
import { useSettingsStore } from '../../stores/settings-store'
import { defineComponent } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useToast } from 'vuestic-ui'
import SafariExtrasForm from './components/SafariExtrasForm.vue'

export default defineComponent({
  components: {
    SafariExtrasForm,
  },

  emits: ['submitSelectedItemsEvent'],

  setup() {
    const { init } = useToast()

    return {
      init,
    }
  },

  data() {
    const columns = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
      },
      {
        key: 'name',
        label: 'Service name',
        sortable: true,
      },
      {
        key: 'amount',
        label: 'Amount',
        sortable: true,
      },
      {
        key: 'description',
        label: 'Description',
        sortable: true,
      },
      // {
      //   key: 'actions',
      //   label: 'Actions',
      //   sortable: false,
      // },
    ]
    return {
      selectedItems: null as any,
      columns,
      shoeAddForm: false,
      showDetails: false,
      showAddForm: false,
    }
  },

  computed: {
    ...mapState(useSettingsStore, ['safariExtras', 'loadingExtras']),
  },
  mounted() {
    this.getSafariExtras(false)
  },

  methods: {
    ...mapActions(useSettingsStore, ['getSafariExtras']),
    gotoBack() {
      this.getSafariExtras(false)

      this.showDetails = false
      this.showAddForm = false
    },

    setShowAddForm(value: boolean) {
      this.showAddForm = value
      this.showDetails = false
    },

    showDetailsHandler(item: any) {
      this.showDetails = true
      this.showAddForm = false
      this.selectedItems = item
    },
  },
})
</script>
