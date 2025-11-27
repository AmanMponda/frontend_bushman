<template>
  <div class="grid sm:grid-cols-3 gap-6 mb-6">
    <VaSelect
      v-model="seasonValue"
      :options="seasonOptions"
      placeholder="Filter By Season"
      @update:modelValue="getSalesInquiryList"
    />
    <!-- <Date
      v-model="dateValue"
      :options="aOptions"
      placeholder="Filter By Area"
      @update:modelValue="getPriceLists"
    /> -->
    <VaDateInput v-model="dateValue" placeholder="Filter By Date" clearable @update:modelValue="getSalesInquiryList" />
    <VaInput v-model="filter" placeholder="Search" clearable @update:modelValue="getSalesInquiryList" />

    <!-- </div> -->
  </div>
  <VaDataTable
    striped
    :loading="loading"
    :items="salesInquiryItems"
    :columns="columns"
    :per-page="perPage"
    :current-page="currentPage"
    :filter="filter"
    @filtered="filtered = $event.items"
  >
    <template #cell(actions)="{ rowData }">
      <VaButton preset="plain" icon="visibility" class="mr-2" @click="btnViewClicked(rowData)"> </VaButton>

      <VaButton preset="plain" icon="download" @click="btnDownloadClicked(rowData)"></VaButton>
    </template>
    <template #bodyAppend>
      <tr>
        <td colspan="6">
          <div class="flex justify-center mt-4">
            <VaPagination v-model="currentPage" :pages="pages" />
          </div>
        </td>
      </tr>
    </template>
  </VaDataTable>
</template>

<script lang="ts">
import { mapActions } from 'pinia'
import { defineComponent, ref } from 'vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { formatDateTime } from '../../../../services/utils'
import { useSettingsStore } from '../../../../stores/settings-store'

export default defineComponent({
  name: 'SalesInquiriesList',
  emits: ['download-btn-pressed', 'view-btn-pressed'],
  data() {
    return {
      loading: ref(false),
      columns: [
        { key: 'id', label: 'ID', width: 80 },
        { key: 'name' },
        { key: 'country' },
        { key: 'nationality' },

        { key: 'preference.preferred_date', label: 'Preferred date', width: 80 },

        { key: 'preference.start_date', label: 'Start date', width: 80 },
        { key: 'preference.end_date', label: 'End date', width: 80 },

        { key: 'actions', width: 80 },
      ],
      salesInquiryItems: [],
      perPage: 10,
      currentPage: 1,
      filter: '',
      filtered: [],
      seasonValue: null as any,
      seasonOptions: [] as any,
      dateValue: null as any,
      mothValue: null as any,
    }
  },
  computed: {
    pages() {
      return this.perPage && this.perPage !== 0 ? Math.ceil(this.filtered.length / this.perPage) : this.filtered.length
    },
  },
  mounted() {
    this.getSalesInquiryList()
    this.getSeasonOptions()
  },

  methods: {
    // getSalesInquiries()
    ...mapActions(useSalesInquiriesStore, ['getSalesInquiries']),
    ...mapActions(useSettingsStore, ['getSeasons']),

    async getSalesInquiryList() {
      this.loading = true

      try {
        const response: any = await this.getSalesInquiries(
          // seasonId: number, preferredDate: string
          this.seasonValue?.value ?? '',
          this.dateValue ?? '',
        )
        if (response.status === 200) {
          this.loading = false
          // Handle paginated response - data is inside response.data.data
          const dataArray = Array.isArray(response.data) ? response.data : (response.data.data || [])
          this.salesInquiryItems = dataArray.map((item: any) => {
            return {
              id: item.id,
              selfitem: item,
              code: item?.code || '',
              inquiry_type: item?.inquiry_type || '',
              name: item?.entity?.full_name || 'N/A',
              country: item?.entity?.country?.name || 'N/A',
              nationality: item?.entity?.nationality?.name || 'N/A',
              contacts:
                item?.entity?.contacts?.map((contact: any) => ({
                  id: contact.id,
                  name: contact?.contact,
                  contactable: contact?.contactable,
                  type: contact?.contact_type?.name || '',
                })) || [],
              preference: {
                no_of_hunters: item?.formatted_preferences?.no_of_hunters || 0,
                no_of_observers: item?.formatted_preferences?.no_of_observers || 0,
                no_of_days: item?.formatted_preferences?.no_of_days || 0,
                no_of_companions: item?.formatted_preferences?.no_of_companions || 0,
                special_requests: item?.formatted_preferences?.special_requests || '',
                start_date: item?.formatted_preferences?.start_date || '',
                end_date: item?.formatted_preferences?.end_date || '',
                budget_estimation: item?.formatted_preferences?.budget_estimation || '',
                preferred_date: item?.formatted_preferences?.preferred_date || '',
              },
              // For standard packages
              package_details: item?.package_details || null,
              // For custom packages
              custom_details: item?.custom_details || null,
              // Season info
              season: item?.season?.name || 'N/A',
            }
          })

          this.filtered = this.salesInquiryItems

          // Add more fields here
        }
      } catch (error) {
        this.loading = false
        console.log(error)
        // this.$toast.error(error.message)
      }
    },

    async getSeasonOptions() {
      const response: any = await this.getSeasons()
      if (response.status === 200) {
        this.seasonOptions = response.data.map((item: any) => ({
          value: item.id,
          text: item.name,
        }))
      }
    },

    btnDownloadClicked(rowData: any) {
      console.log(rowData)
      this.$emit('download-btn-pressed', rowData)
    },
    btnViewClicked(rowData: any) {
      console.log(rowData)
      this.$emit('view-btn-pressed', rowData)
    },
  },
})
</script>
