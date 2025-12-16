<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton
            v-if="showDetail || showCreateForm"
            class="px-2 py-2"
            icon="arrow_back"
            size="small"
            @click="goBack()"
          >
            Go Back
          </VaButton>
        </div>
        <VaButtonGroup v-if="!showCreateForm">
          <VaButton
            class="px-2 py-2"
            color="primary"
            label="Add New Quota"
            icon="add"
            size="small"
            @click="_showCreateForm()"
            >Create Approval Chain</VaButton
          >
        </VaButtonGroup>
      </div>
      <template v-if="!showCreateForm">
        <template v-if="showDetail">
          <ApprovalChainDetails :item="selectedItem" />
        </template>
        <template v-else>
          <VaDataTable
            :items="approvalChainModules"
            :loading="loadingApprovalChain"
            :columns="columns"
            hoverable
            striped
          >
            <template #cell(is_active)="{ value }">
              <VaChip size="small" :color="statusColor(value)">
                {{ statusText(value) }}
              </VaChip>
            </template>

            <template #cell(actions)="{ rowData }">
              <VaButton preset="plain" icon="visibility" class="px-2" @click="_showDetails(rowData)"> </VaButton>
            </template>
          </VaDataTable>
        </template>
      </template>
      <template v-if="showCreateForm">
        <ApprovalchainForm></ApprovalchainForm>
      </template>
    </VaCardContent>
  </VaCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useApprovalChainStore } from '../../stores/approval-store'
import ApprovalChainDetails from './components/ApprovalChain/ApprovalChainDetails.vue'
import ApprovalchainForm from './components/ApprovalChain/ApprovalchainForm.vue'

export default defineComponent({
  name: 'ManageApprovalChain',
  components: {
    ApprovalChainDetails,
    ApprovalchainForm,
  },
  setup() {
    return {}
  },

  data() {
    const columns = [
      {
        key: 'name',
        label: 'Name',
      },
      {
        key: 'is_active',
        label: 'status',
      },
      {
        key: 'actions',
        label: 'Actions',
      },
    ]

    return {
      showDetail: false,
      columns,
      showCreateForm: false,
      selectedItem: null as any,
    }
  },
  computed: {
    ...mapState(useApprovalChainStore, [
      'approvalChainModules',
      'loadingApprovalChain',
      'approvalChainLevels',
      'loadingApprovalChainLevels',
    ]),
  },

  mounted() {
    this.getRequisitionsApprovalChain(false)
  },

  methods: {
    ...mapActions(useApprovalChainStore, ['getRequisitionsApprovalChain']),
    goBack() {
      this.showDetail = false
      this.selectedItem = null
      this.showCreateForm = false
      this.getRequisitionsApprovalChain(false)
    },

    _showCreateForm() {
      this.showCreateForm = true
    },

    _showDetails(data: any) {
      this.showDetail = true
      this.selectedItem = data.selfitem
    },

    statusColor(isActive: string) {
      if (isActive) return 'success'
      else return 'danger'
    },

    statusText(isActive: string) {
      if (isActive) return 'Active'
      else return 'Inactive'
    },
  },
})
</script>
<style scoped></style>
