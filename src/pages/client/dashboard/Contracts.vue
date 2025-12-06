<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton
            v-if="showDetails || showAddContractForm"
            class="px-2 py-2"
            icon="arrow_back"
            size="small"
            @click="gotBack()"
          >
            Go Back
          </VaButton>
        </div>
        <VaButtonGroup v-if="!showAddContractForm && !showDetails">
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
            >Create Contract</VaButton
          >
        </VaButtonGroup>
      </div>

      <template v-if="!showDetails">
        <template v-if="!showAddContractForm">
          <VaTabs v-model="value" vertical grow>
            <template #tabs>
              <VaTab
                v-for="tab in tabs"
                :key="tab.title"
                :name="tab.title"
                class="px-4 py-2"
                @click="
                  getContracts(currentTab.content === 'componions_contracts' ? 'COMPANION_HUNTER' : 'MAIN_HUNTER')
                "
              >
                <VaIcon :name="tab.icon" size="small" class="mr-2" />
                {{ tab.title }}
              </VaTab>
            </template>
            <VaCard square outlined :stripe="false">
              <VaCardTitle>
                <VaIcon :name="currentTab.icon" size="small" class="mr-2" color="background-element" />
                {{ currentTab.title }}
              </VaCardTitle>
              <VaCardContent>
                <template v-if="currentTab.content === 'main_hunters_contracts'">
                  <VaDataTable :items="contracts" :columns="columns" :loading="loadingContracts">
                    <template #cell(actions)="{ rowData }">
                      <VaButton
                        preset="plain"
                        icon="download"
                        :disabled="!rowData.pdf"
                        @click="downloadPdf(rowData.pdf)"
                      ></VaButton>
                      <VaButton preset="plain" icon="visibility" @click="viewContract(rowData.selfitem)"></VaButton>
                    </template>
                  </VaDataTable>
                </template>
                <template v-if="currentTab.content === 'componions_contracts'">
                  <VaDataTable :items="contracts" :columns="columns" :loading="loadingContracts">
                    <template #cell(actions)="{ rowData }">
                      <VaButton
                        preset="plain"
                        icon="download"
                        :disabled="!rowData.pdf"
                        @click="downloadPdf(rowData.pdf)"
                      ></VaButton>
                      <VaButton preset="plain" icon="visibility" @click="viewContract(rowData.selfitem)"></VaButton>
                    </template>
                  </VaDataTable>
                </template>
              </VaCardContent>
            </VaCard>
          </VaTabs>
        </template>
        <template v-else>
          <ContractForm> </ContractForm>
        </template>
      </template>
      <template v-else>
        <ContractDetails :contract-item="item"></ContractDetails>
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'
import { useContractsStore } from '../../../stores/contracts-store'
import downloadPdf from '../../../utils/pdfDownloader'
import ContractDetails from './components/ContractDetails.vue'
import ContractForm from './components/ContractForm.vue'

export default defineComponent({
  components: {
    ContractDetails,
    ContractForm,
  },
  data() {
    const TABS = [
      { icon: 'feed', title: "Main Hunter's ", content: 'main_hunters_contracts' },
      { icon: 'feed', title: 'Componions ', content: 'componions_contracts' },
    ]
    const columns = [
      { key: 'contract_number', sortable: true },
      { key: 'client_name', sortable: true },
      { key: 'start_date', sortable: true },
      { key: 'end_date', sortable: true },
      { key: 'created_at', sortable: true },
      { key: 'actions', label: 'Actions' },
    ]

    return {
      columns,
      item: null as any,
      showDetails: false,
      showAddContractForm: false,
      tabs: TABS,
      value: TABS[0].title,
    }
  },
  computed: {
    ...mapState(useContractsStore, ['contracts', 'loadingContracts']),
    currentTab(): any {
      return this.tabs.find(({ title }) => title === this.value)
    },
  },
  mounted() {
    this.getContracts()
  },
  methods: {
    ...mapActions(useContractsStore, ['getContracts']),

    async downloadPdf(pdfUrl: string) {
      if (!pdfUrl) {
        alert('PDF is not available for this contract yet.')
        return
      }
      try {
        await downloadPdf(pdfUrl, 'contract.pdf')
      } catch (error: any) {
        console.error('PDF download error:', error)
        const message = error?.message || 'Unknown error'

        if (message.includes('500')) {
          alert(
            'The PDF generation service is temporarily unavailable.\n\nPlease try again in a few moments. If the problem persists, contact support.',
          )
        } else if (message.includes('404')) {
          alert('The PDF file was not found on the server. The contract may not have been processed yet.')
        } else {
          alert('Failed to download PDF. Please try again or contact support.\n\nError: ' + message)
        }
      }
    },

    viewContract(contract: any) {
      this.item = contract
      this.showDetails = true
      this.showAddContractForm = false
    },

    gotBack() {
      this.getContracts()

      this.showDetails = false
      this.showAddContractForm = false
    },

    toggleAddSalesInquiriesForm() {
      this.showDetails = false
      this.showAddContractForm = !this.showAddContractForm
    },
  },
})
</script>
