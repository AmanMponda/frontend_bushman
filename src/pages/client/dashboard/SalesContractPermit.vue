<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton
            v-if="showDetails || showAddForm"
            class="px-2 py-2"
            icon="arrow_back"
            size="small"
            @click="gotBack()"
          >
            Go Back
          </VaButton>
        </div>
        <VaButtonGroup v-if="!showAddForm && !showDetails">
          <VaButton
            class="px-2 py-2"
            color="primary"
            label="Add New Quota"
            round
            present="secondary"
            border-color="primary"
            icon="add"
            size="small"
            @click="toggleAddSalesInquiriesForm()"
            >Add add Permit</VaButton
          >
        </VaButtonGroup>
      </div>

      <template v-if="!showDetails">
        <template v-if="!showAddForm">
          <VaDataTable :items="permits" :columns="columns" :loading="loadingPermits">
            <template #cell(actions)="{ rowData }">
              <VaButton preset="plain" icon="download" @click="downloadPdf(rowData.pdf)"></VaButton>
              <VaButton preset="plain" icon="visibility" @click="viewContract(rowData.selfitem)"></VaButton>
            </template>
          </VaDataTable>
        </template>
        <template v-else>
          <ContractForm> </ContractForm>
        </template>
      </template>
      <template v-else>
        <ContractDetails :item="item"></ContractDetails>
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'
import { useContractsStore } from '../../../stores/contracts-store'
import downloadPdf from '../../../utils/pdfDownloader'
import ContractDetails from './components/SelesContractPermitDetails.vue'
import ContractForm from './components/SalesContractPermitForm.vue'

export default defineComponent({
  components: {
    ContractDetails,
    ContractForm,
  },
  data() {
    const columns = [
      { key: 'permit_number', sortable: true },
      { key: 'issued_date', sortable: true },
      { key: 'start_date', sortable: true },
      { key: 'expiry_date', sortable: true },
      { key: 'actions', label: 'Actions' },
    ]

    return {
      columns,
      downloadPdf,
      item: null as any,
      showDetails: false,
      showAddForm: false,
    }
  },
  computed: {
    ...mapState(useContractsStore, ['permits', 'loadingPermits']),
  },
  mounted() {
    this.getContractPermits()
  },
  methods: {
    ...mapActions(useContractsStore, ['getContractPermits']),

    viewContract(contract: any) {
      this.item = contract
      this.showDetails = true
      this.showAddForm = false
    },

    gotBack() {
      this.getContractPermits()

      this.showDetails = false
      this.showAddForm = false
    },

    toggleAddSalesInquiriesForm() {
      this.showDetails = false
      this.showAddForm = !this.showAddForm
    },
  },
})
</script>
