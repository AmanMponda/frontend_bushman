<template>
  <VaCard class="w-full p-2">
    <div class="grid md:grid-cols-4 gap-6 mb-6">
      <!-- <VaInput v-model="filter" placeholder="Filter Area" class="w-full" /> -->
      <!-- <img src="/logo.png" alt="logo" width="100" height="100" /> -->
      <VaSelect
        v-model="area"
        placeholder="Filter by Area"
        :options="areasOptions"
        searchable
        value-by="value"
        lable="Area"
        @update:modelValue="getAllSpeces()"
      />

      <VaSelect
        v-model="quota"
        placeholder="Filter by Quota year"
        :options="yearOptions"
        value-by="value"
        lable="Quota year"
        @update:modelValue="getAllSpeces()"
      />

      <VaSelect
        v-model="species"
        placeholder="Filter by Species"
        :options="speciesOptions"
        value-by="value"
        lable="Species"
        @update:modelValue="getAllSpeces()"
      />
      <VaButton icon="download" @click="downloadPdf(base64Pdf)"> Download </VaButton>
    </div>
    <!-- :filter-method="" -->
    <VaDataTable :items="speciesItems" :columns="columns" :filter="filter" :loading="loading">
      <template #cell(provision_sales)="{ value }">
        <VaChip color="warning" size="small">
          {{ value }}
        </VaChip>
      </template>

      <template #cell(confirmed)="{ value }">
        <VaChip color="success" size="small">
          {{ value }}
        </VaChip>
      </template>

      <template #cell(canceled)="{ value }">
        <VaChip color="danger" size="small">
          {{ value }}
        </VaChip>
      </template>

      <template #cell(taken)="{ value }">
        <VaChip color="primary" size="small">
          {{ value }}
        </VaChip>
      </template>
    </VaDataTable>
  </VaCard>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { defineComponent, ref } from 'vue'
import { useToast } from 'vuestic-ui'
// import pdfMake from 'pdfmake/build/pdfmake'
// import { pdfMake as pdfFonts } from 'pdfmake/build/vfs_fonts' // Use named import
import downloadPdf from '../../../utils/pdfDownloader'
// pdfMake.vfs = pdfFonts.vfs // Assign VFS directly
export default defineComponent({
  setup() {
    const columns = [
      { key: 'id', sortable: true },
      { key: 'area', sortable: true },
      { key: 'name', sortable: true },
      { key: 'scientific_name', sortable: true },
      { key: 'no_of_species', sortable: true },
      { key: 'provision_sales', sortable: true },
      { key: 'confirmed', sortable: true },
      { key: 'canceled', sortable: true },
      { key: 'taken', sortable: true },
    ]

    const filter = ref('')

    return {
      filter,
      columns,
    }
  },
  data() {
    const { init } = useToast()

    const area: any = null
    const quota: any = null
    const species: any = null
    const logo = '/logo.png'
    const selectQuota = null as any
    return {
      speciesItems: [],
      area,
      quota,
      species,
      currentQuota: null as any,
      areasOptions: [] as any,
      yearOptions: [] as any,
      speciesOptions: [] as any,
      init,
      logo,
      selectQuota,
      with: 12,
      height: 100,
      loading: false,
      base64Pdf: '' as any,
      loadingQuota: false,
      downloadPdf,
    }
  },
  mounted() {
    this.getAllSpeces()
    this.getQuota()
    this.getSpeciesItems()
    this.getAreas()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['generateQuotaYear']),

    // downloadPdf(base64Pdf: string) {
    //   const link = document.createElement('a')
    //   link.href = `data:application/pdf;base64,${base64Pdf}`
    //   link.download = 'download.pdf' // Specify the name of the file to download
    //   link.click()
    // },

    async getAllSpeces() {
      this.loading = true
      try {
        this.currentQuota = this.yearOptions.find((item: any) => item.value === this.quota)
        const response: any = await this.getAllSpeciesPerQuotaPerArea(this.quota, this.area, this.species)

        if (response.status === 200) {
          this.loading = false

          if (response?.data?.pdf !== null) this.base64Pdf = response?.data?.pdf

          if (response?.data?.data?.length > 0) {
            this.loading = false

            this.speciesItems = []
          }
          this.speciesItems = response?.data?.data?.map((item: any) => {
            return {
              id: item.id,
              name: item.species.name,
              area: item.area.name,
              scientific_name: item.species.scientific_name,
              no_of_species: item.quantity,
              provision_sales: item.provision_quantity,
              confirmed: item.confirmed_quantity,
              canceled: item.declined_quantity || item.cancelled_quantity,
              taken: item.completed_quantity,
            }
          })
        } else {
          this.init({ message: response.message, color: 'danger' })
          this.loading = false
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    async getQuota() {
      this.loadingQuota = true
      try {
        const response = await this.getQuotas(null)

        // current select quota
        if (response.status === 200) {
          this.loadingQuota = false
          const currentQuota = response.data[0]

          this.quota = currentQuota.id
          this.currentQuota = currentQuota
          this.yearOptions = response.data.map((item: any) => {
            const result = this.generateQuotaYear(item.start_date, item.end_date)

            return {
              value: item.id,
              text: `${result} - ${item.name}`,
              name: item.name,
              start_date: item.start_date,
              end_date: item.end_date,
            }
          })
        }
      } catch (error) {
        this.loadingQuota = false
        console.log(error)
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        // Start with the default option
        this.speciesOptions = [
          {
            value: 'all',
            text: 'All',
          },
        ]

        // Add the species items from the response
        const speciesItems = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        // Combine default option with species items
        this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()

        if (response.status === 200) {
          this.areasOptions = [
            {
              value: 'all',
              text: 'All',
            },
          ]
          const _areasOptions = response.data.map((item: any) => {
            return {
              value: item.id,
              text: item.name,
            }
          })
          this.areasOptions = this.areasOptions.concat(_areasOptions)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})
</script>

<style scoped>
/* Add your styles here if needed */
</style>
