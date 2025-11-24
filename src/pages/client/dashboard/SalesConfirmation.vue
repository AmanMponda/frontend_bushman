<template>
  <VaCard>
    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="viewDetails" class="px-2 py-2" icon="arrow_back" size="small" @click="gotBack()">
          Go Back
        </VaButton>
      </div>
    </div>

    <template v-if="viewDetails">
      <SalesConfirmationClientDetails :sales-data="item"> </SalesConfirmationClientDetails>
    </template>

    <template v-else>
      <!-- <div v-if="results?.length > 0"> -->

      <VaDataTable :items="results" :columns="columns" :loading="loadingresults" @onView="onRowClick">
        <template #cell(status)="{ value }">
          <VaChip :color="getStatusColorForModal(value)" size="small">
            {{ value }}
          </VaChip>
        </template>

        <template #cell(actions)="{ rowData }">
          <div class="flex justify-center items-center">
            <VaButton plain color="primary" class="mr-2" @click="onRowClick(rowData)">
              {{ getbuttonTextBasedOnStatus(rowData.status) }}
            </VaButton>
            <VaButton plain icon="download" @click="downloadPdf(rowData.selfitem.pdf)"> </VaButton>
          </div>
        </template>
      </VaDataTable>
    </template>
  </VaCard>
</template>

<script lang="ts">
import { useSalesInquiriesStore } from '../../../stores/sales-store'
import { mapActions, mapState } from 'pinia'
import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'
import downloadPdf from '../../../utils/pdfDownloader'

export default {
  components: {
    // ModuleTable,
    SalesConfirmationClientDetails,
  },
  data() {
    return {
      items: [] as Array<any>,
      searchText: null as any,
      columns: [
        // { key: 'code', label: 'Code', width: 80 },
        { key: 'name', label: 'Client', width: 120 },
        { key: 'area', label: 'Area', width: 120 },
        { key: 'airport_name', label: 'Airport', width: 50 },
        { key: 'arrival', label: 'Arrival', width: 120 },
        { key: 'charter_in', label: 'Charter In', width: 120 },
        { key: 'charter_out', label: 'Charter Out', width: 80 },
        { key: 'status', label: 'Status', width: 120 },
        { key: 'actions', width: 80 },
      ],

      viewDetails: false,
      item: null as any,
      buttondisables: true,
      downloadPdf,
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['results', 'loadingresults']),
  },
  mounted() {
    this.getSalesConfirmations()
  },
  methods: {
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation']),

    async getSalesConfirmations() {
      await this.getallSalesConfirmation()
    },

    onRowClick(row: any) {
      // Do something with the row data
      // console.log(row)
      this.item = row.selfitem
      this.viewDetails = true
    },

    gotBack() {
      this.viewDetails = false
      this.getSalesConfirmations()
      // this.item = null
    },

    getStatusColorForModal(status: any) {
      switch (status) {
        case 'pending':
          return 'warning'
        case 'provision_sales':
          return 'warning' // Adjust as needed
        case 'confirmed':
          return 'success'
        case 'declined':
          return 'danger' // Corresponds to VaBadge color
        case 'cancelled':
          return 'danger' // or appropriate color
        case 'completed':
          return 'primary' // or appropriate color
        default:
          return 'default' // fallback color
      }
    },

    getbuttonTextBasedOnStatus(status: any) {
      switch (status) {
        case 'pending':
          return 'confirm'
        case 'provision_sales':
          return 'confirm' // Adjust as needed
        case 'confirmed':
          return 'view'
        case 'declined':
          this.buttondisables = true
          return 'View' // Corresponds to VaBadge color
        case 'cancelled':
          return 'view' // or appropriate color
        case 'completed':
          return 'View' // or appropriate color
        default:
          return 'default' // fallback color
      }
    },
  },
}

// Define your methods here if you have any to implement
</script>

<style scoped>
/* Add any styles specific to this component */
</style>
