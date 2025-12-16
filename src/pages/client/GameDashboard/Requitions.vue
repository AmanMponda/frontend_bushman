<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <!-- v-if="showDetails || showAddForm" -->
          <VaButton
            v-if="showDetails || showAddForm"
            class="px-2 py-2"
            icon="arrow_back"
            size="small"
            @click="goBack()"
          >
            Go Back to Requisitions
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
            >Create Requisition</VaButton
          >
        </VaButtonGroup>
      </div>
      <template v-if="showDetails">
        <RequistionDetails :rq-item="item"> </RequistionDetails>
      </template>
      <template v-else>
        <template v-if="!showAddForm">
          <VaDataTable :items="requisitions" :columns="columns" :loading="loadingRequisitions" hoverable striped>
            <template #cell(status)="{ value }">
              <VaChip size="small" :color="statusColor(value)">
                {{ value }}
              </VaChip>
            </template>
            <template #cell(requested_by)="{ value }">
              <strong>{{ value }}</strong>
            </template>
            <template #cell(actions)="{ rowData }">
              <VaButton preset="plain" icon="visibility" class="px-2" @click="_showDetails(rowData)"> </VaButton>
              <VaButton
                v-if="rowData.main_status === 'PENDING'"
                preset="plain"
                icon="published_with_changes"
                @click="_shM(rowData)"
              >
              </VaButton>
            </template>
          </VaDataTable>
        </template>
        <template v-else>
          <RequistionsForm> </RequistionsForm>
        </template>
      </template>
    </VaCardContent>
  </VaCard>

  <VaModal v-model="shM" ok-text="Apply" close-button size="small" :hide-default-actions="true">
    <UpdateRequistionForm :item="item"> </UpdateRequistionForm>
  </VaModal>
</template>

<script lang="ts">
import { mapActions, mapState, mapWritableState } from 'pinia'
import { defineComponent } from 'vue'
import { useRequisitionStore } from '../../../stores/requistions-store'
import RequistionDetails from './components/RequistionDetails.vue'
import RequistionsForm from './components/RequistionsForm.vue'
import UpdateRequistionForm from './components/UpdateRequistionForm.vue'

export default defineComponent({
  components: {
    RequistionDetails,
    UpdateRequistionForm,
    RequistionsForm,
  },
  data() {
    const items = [] as any[]

    const columns = [
      { key: 'type', label: 'Requisition Type' },
      { key: 'requested_by' },
      { key: 'requested_at' },
      { key: 'required_date' },
      { key: 'status', name: 'status', label: 'Status' },
      { key: 'actions', label: 'Actions', sortable: false },
    ]

    return {
      items,
      columns,
      showDetails: false,
      showAddForm: false,
      item: {} as any,
    }
  },
  computed: {
    ...mapState(useRequisitionStore, ['requisitions', 'loadingRequisitions']),
    ...mapWritableState(useRequisitionStore, {
      shM: 'showApprovalModal',
    }),
  },

  mounted() {
    this.getRequisitions()
  },

  methods: {
    ...mapActions(useRequisitionStore, ['getRequisitions', 'getRequistionItems']),
    statusColor(status: string) {
      switch (status) {
        case 'APPROVED':
          return 'success'
        case 'REJECTED':
          return 'danger'
        default:
          return 'warning'
      }
    },

    _showDetails(row: any) {
      console.log(row)
      this.getRequistionItems(row.selfItem.id)
      this.item = row.selfItem
      this.showDetails = true
    },

    setShowAddForm(show: boolean) {
      this.showAddForm = show
    },

    _shM(row: any) {
      this.item = row.selfItem
      this.shM = true
    },

    goBack() {
      this.showDetails = false
      this.showAddForm = false
      this.getRequisitions()
    },
  },
})
</script>
