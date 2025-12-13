<template>
  <div class="contracts-page">
    <!-- Breadcrumb -->
    <div class="d-flex align-items-center mb-2">
      <div>
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">SALES</a></li>
          <li class="breadcrumb-item active">CONTRACTS</li>
        </ul>
      </div>
    </div>

    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="d-flex align-items-center gap-3">
        <button v-if="showDetails || showAddContractForm" class="btn btn-outline-secondary btn-sm" @click="gotBack()">
          <i class="fa fa-arrow-left mr-1"></i>
          Go Back
        </button>
      </div>
    </div>

    <template v-if="!showDetails">
      <template v-if="!showAddContractForm">
        <!-- Contracts List Table -->
        <div class="row bg-white rounded">
          <div class="col-xl-12 col-lg-12 col-sm-12">
            <div class="panel br-6 p-0">
              <!-- Data Table -->
              <div class="custom-table p-2">
                <StandardDataTable
                  :columns="columns"
                  :data="dataFetched"
                  :loading="loadingContracts"
                  :filters="tableFilters"
                  :default-page-size="tableFilters.pageSize"
                  :disable-pagination="false"
                  :show-date-filters="false"
                  :action-buttons="pageActions"
                  @update:filters="handleFiltersUpdate"
                >
                  <template #contract_number="{ row }">
                    {{ (row as any).contract_number }}
                  </template>
                  <template #client_name="{ row }">
                    {{ (row as any).client_name }}
                  </template>
                  <template #start_date="{ row }">
                    {{ (row as any).start_date }}
                  </template>
                  <template #end_date="{ row }">
                    {{ (row as any).end_date }}
                  </template>
                  <template #created_at="{ row }">
                    {{ (row as any).created_at }}
                  </template>
                  <template #actions="{ row }">
                    <div class="d-flex gap-1">
                      <button
                        class="btn btn-primary btn-sm"
                        :disabled="!(row as any).hasPdf"
                        :title="(row as any).hasPdf ? 'Download PDF' : 'PDF not available'"
                        @click="downloadPdfHandler((row as any).pdf)"
                      >
                        <i class="fa fa-download"></i>
                      </button>
                      <button
                        class="btn btn-info btn-sm"
                        title="View Contract"
                        @click="viewContract((row as any).selfitem)"
                      >
                        <i class="fa fa-eye"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        title="Delete Contract"
                        @click="deleteContract((row as any).selfitem)"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </template>
                </StandardDataTable>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <ContractForm></ContractForm>
      </template>
    </template>
    <template v-else>
      <ContractDetails
        :contract-item="item"
        :is-edit-mode="isEditMode"
        @close="gotBack"
        @edit="handleEditContract"
        @delete="handleDeleteFromDetails"
      ></ContractDetails>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useContractsStore } from '../../../stores/contracts-store'
import downloadPdf from '../../../utils/pdfDownloader'
import ContractDetails from './components/ContractDetails.vue'
import ContractForm from './components/ContractForm.vue'
import StandardDataTable from '@/components/bootstrap/StandardDataTable.vue'

// Columns configuration
const columns = [
  { key: 'contract_number', label: 'Contract Number', sortable: true, visible: true },
  { key: 'client_name', label: 'Client Name', sortable: true, visible: true },
  { key: 'start_date', label: 'Start Date', sortable: true, visible: true },
  { key: 'end_date', label: 'End Date', sortable: true, visible: true },
  { key: 'created_at', label: 'Created At', sortable: true, visible: true },
  { key: 'actions', label: 'Actions', sortable: false, visible: true },
]

// Reactive state
const item = ref<any>(null)
const showDetails = ref(false)
const showAddContractForm = ref(false)
const isEditMode = ref(false)
const dataFetched = ref<any[]>([])

// Table filters
const tableFilters = ref({
  search: '',
  pageSize: 10,
  currentPage: 1,
  sortField: '',
  sortDirection: 'asc',
  showAdvancedFilters: false,
})

// Pinia store
const contractsStore = useContractsStore()
const { contracts, loadingContracts } = storeToRefs(contractsStore)

// Page actions
const pageActions = computed(() => [
  {
    label: 'Create Contract',
    icon: 'fa fa-plus',
    class: 'btn btn-primary',
    method: () => toggleAddSalesInquiriesForm(),
  },
  {
    label: 'Refresh',
    icon: 'fa fa-refresh',
    class: 'btn btn-secondary',
    method: () => contractsStore.getContracts(),
  },
])

// Helper function - must be defined before use
const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'N/A'

  // If it's already a formatted date string (contains /), return as is
  if (typeof date === 'string' && date.includes('/')) {
    return date
  }

  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'N/A'
  }
}

// Format data function - must be defined before watch
const formatDataForTable = () => {
  const items = contracts.value || []
  dataFetched.value = items.map((contract: any) => {
    return {
      id: contract.id,
      selfitem: contract,
      contract_number: contract.contract_number || 'N/A',
      client_name: contract.client_name || 'N/A',
      start_date: formatDate(contract.start_date),
      end_date: formatDate(contract.end_date),
      created_at: formatDate(contract.created_at),
      pdf: contract.pdf,
      hasPdf: !!contract.pdf,
    }
  })
}

// Watch contracts and format data
watch(
  () => contracts.value,
  () => {
    formatDataForTable()
  },
  { immediate: true, deep: true },
)

const handleFiltersUpdate = (filters: any) => {
  tableFilters.value = { ...tableFilters.value, ...filters }
}

const deleteContract = async (contract: any) => {
  if (!contract?.id) {
    alert('Contract ID is missing')
    return
  }

  const contractNumber = contract.contract_number || `Contract #${contract.id}`
  if (!confirm(`Are you sure you want to delete ${contractNumber}? This action cannot be undone.`)) {
    return
  }

  try {
    const response = await contractsStore.deleteContractById(contract.id)
    if (response.status === 200 || response.status === 204) {
      alert('Contract deleted successfully')
      contractsStore.getContracts()
    }
  } catch (error: any) {
    console.error('Full delete error:', error)
    let errorMsg = 'Failed to delete contract'

    if (error.response?.status === 500) {
      errorMsg = 'Server error (500). Please check the backend logs for details.'
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error.response?.data?.error) {
      errorMsg = error.response.data.error
    } else if (error.message) {
      errorMsg = error.message
    }

    alert(`Error: ${errorMsg}`)
  }
}

const downloadPdfHandler = async (pdfUrl: string) => {
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
}

const viewContract = (contract: any) => {
  item.value = contract
  showDetails.value = true
  isEditMode.value = false
  showAddContractForm.value = false
}

const gotBack = () => {
  // Refresh contracts list
  contractsStore.getContracts()

  showDetails.value = false
  showAddContractForm.value = false
  isEditMode.value = false
}

const toggleAddSalesInquiriesForm = () => {
  showDetails.value = false
  showAddContractForm.value = !showAddContractForm.value
}

const handleEditContract = () => {
  isEditMode.value = true
  showDetails.value = true
  showAddContractForm.value = false
}

const handleDeleteFromDetails = async () => {
  if (!item.value?.id) {
    alert('Contract ID is missing')
    return
  }

  try {
    const response = await contractsStore.deleteContractById(item.value.id)
    if (response.status === 200 || response.status === 204) {
      alert('Contract deleted successfully')
      gotBack()
    }
  } catch (error: any) {
    console.error('Full delete error:', error)
    let errorMsg = 'Failed to delete contract'

    if (error.response?.status === 500) {
      errorMsg = 'Server error (500). Please check the backend logs for details.'
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error.response?.data?.error) {
      errorMsg = error.response.data.error
    } else if (error.message) {
      errorMsg = error.message
    }

    alert(`Error: ${errorMsg}`)
  }
}

// Lifecycle
onMounted(() => {
  contractsStore.getContracts()
})
</script>

<style scoped>
.contracts-page {
  padding: 0;
}

.empty-state-message {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.breadcrumb {
  text-transform: uppercase !important;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0 !important;

  .breadcrumb-item {
    text-transform: uppercase !important;

    &::before {
      content: ' / ' !important;
      color: #9ca3af !important;
      padding: 0 0.5rem;
    }

    &:first-child::before {
      display: none !important;
    }

    a {
      text-transform: uppercase !important;
      color: #374151 !important;
      font-weight: 600;
      text-decoration: none !important;

      &:hover {
        color: #1f2937 !important;
      }
    }

    &.active {
      color: #9ca3af !important;
      text-transform: uppercase !important;
    }
  }
}
</style>
