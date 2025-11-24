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
          this.salesInquiryItems = response.data.map((item: any) => {
            // Get first preference (or empty if none)
            const pref = item?.preferences?.[0] || {}
            return {
              id: item.id,
              selfitem: item,
              name: item?.entity?.full_name,
              country: item?.entity?.country?.name || 'N/A',
              nationality: item?.entity?.nationality?.name || 'N/A',
              contacts: item?.entity?.contacts?.map((contact: any) => ({
                id: contact.id,
                name: contact?.contact,
                contactable: contact?.contactable,
              })) || [],
              preference: {
                no_of_hunters: pref?.no_of_hunters || 0,
                no_of_observers: pref?.no_of_observers || 0,
                no_of_days: pref?.no_of_days || 0,
                no_of_companions: pref?.no_of_companions || 0,
                special_requests: pref?.special_requests || '',
                start_date: pref?.start_date ? formatDateTime(pref.start_date) : '',
                end_date: pref?.end_date ? formatDateTime(pref.end_date) : '',
                budget_estimation: pref?.budget_estimation || '',
                prev_experience: pref?.prev_experience || '',
                preferred_date: pref?.preferred_date ? formatDateTime(pref.preferred_date) : '',
                accommodation_type: pref?.accommodation_type || '',
                payment_method: pref?.payment_method || '',
              },
              preferred_species: item?.preferred_species?.map((species: any) => ({
                id: species?.id,
                name: species?.species?.name,
                quantity: species?.quantity,
              })) || [],
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
