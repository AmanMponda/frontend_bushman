<template>
  <div class="flex justify-end">
    <VaButton preset="primary" class="mr-2 mb-2" round icon="add" size="small" @click="_showChartersPriceModal()">
      Add Charters Costs
    </VaButton>
    <VaButton preset="primary" class="mr-2 mb-2" round icon="add" size="small" @click="_showAccommodationModal()">
      Add accommodation
    </VaButton>
    <VaButton preset="primary" class="mr-2 mb-2" round icon="add" size="small" @click="_showSafariExtrasModal()">
      Add Safari Extras Services
    </VaButton>
    <VaButton
      preset="primary"
      class="mr-2 mb-2"
      round
      icon="arrow_downward"
      size="small"
      @click="scrollTo(observerScollRef)"
    >
      Add Observers
    </VaButton>
    <VaButton
      preset="primary"
      class="mr-2 mb-2"
      round
      icon="arrow_downward"
      size="small"
      @click="scrollTo(companionsScollRef)"
    >
      Add Companions
    </VaButton>
  </div>
  <VaSplit
    class="split-demo h-[40rem]"
    :limits="[
      ['30px', '20rem'],
      [5 as any, 'any'],
    ]"
  >
    <template #start>
      <div class="p-4 bg-gray-100 rounded-lg shadow-md">
        <VaTitle class="font-bold text-xl mb-2">Sales Inquiry Details</VaTitle>

        <h2 class="text-lg">Inquiry Code: {{ item?.code }}</h2>
        <VaTitle class="text-gray-600">Created on: {{ formatDate(item?.create_date) }}</VaTitle>

        <VaDivider class="my-4" />
        <div class="flex flex-col">
          <VaTitle class="font-bold">Client Information</VaTitle>
          <p><strong>Full Name:</strong> {{ safeString(item?.entity?.full_name) }}</p>
          <p><strong>Nationality:</strong> {{ safeString(item?.entity?.nationality?.name) }}</p>
          <p><strong>Country:</strong> {{ safeString(item?.entity?.country?.name) }}</p>

          <VaTitle class="font-bold mt-4">Contacts:</VaTitle>
          <VaList>
            <VaListItem v-for="(contact, index) in safeArray(item.entity?.contacts)" :key="index">
              <VaListItemContent>{{ contact.contact }}</VaListItemContent>
            </VaListItem>
          </VaList>

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">Preference Information</VaTitle>
          <p><strong>Preferred Date:</strong> {{ formatDate(item?.preference?.preferred_date) }}</p>
          <p><strong>No of Companions:</strong> {{ safeString(item?.preference?.no_of_companions.toString()) }}</p>
          <p><strong>No of Observers:</strong> {{ safeString(item?.preference?.no_of_observers.toString()) }}</p>
          <p><strong>Number of Days:</strong> {{ safeString(item?.preference?.no_of_days.toString()) }}</p>

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">Preferred Species</VaTitle>
          <table class="table-auto w-full mb-4 border-collapse">
            <thead>
              <tr>
                <th class="px-4 py-2 border-b">Species Name</th>
                <th class="px-4 py-2 border-b">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="safeArray(item?.preferred_species).length === 0">
                <td colspan="2" class="text-center">No preferred species listed.</td>
              </tr>
              <tr v-for="(species, index) in safeArray(item?.preferred_species)" :key="index">
                <td class="border px-4 py-2">{{ safeString(species.species?.name) }}</td>
                <td class="border px-4 py-2">{{ safeString(species?.quantity?.toString()) }}</td>
              </tr>
            </tbody>
          </table>

          <VaTitle class="font-bold">Area Information</VaTitle>
          <table class="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th class="px-4 py-2 border-b">Area ID</th>
                <th class="px-4 py-2 border-b">Area Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="safeArray(item.area).length === 0">
                <td colspan="2" class="text-center">No area information available.</td>
              </tr>
              <tr v-for="(area, index) in safeArray(item.area)" :key="index">
                <td class="border px-4 py-2">{{ safeString(area.id.toString()) }}</td>
                <td class="border px-4 py-2">{{ safeString(area.area?.name || 'Unnamed') }}</td>
              </tr>
            </tbody>
          </table>

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">Price List Summary</VaTitle>
          <p><strong>Package Name:</strong> {{ item?.price_list?.price_list?.sales_package?.name }}</p>

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">License Package</VaTitle>
          <p><strong>Name:</strong> {{ item?.price_list?.price_list?.sales_package.regulatory_package?.name }}</p>
          <p>
            <strong>Duration:</strong>
            {{ item?.price_list?.price_list?.sales_package?.regulatory_package?.duration }} days
          </p>

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">Package Area Information</VaTitle>
          <p><strong>Area Name:</strong> {{ item?.price_list?.price_list?.sales_package?.area?.name }}</p>
          <p><strong>Description:</strong> {{ item?.price_list?.price_list?.sales_package?.area?.description }}</p>

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">Hunting Type</VaTitle>
          <p><strong>Name:</strong> {{ item?.price_list?.price_list?.price_list_type?.hunting_type?.name }}</p>
          <p>
            <strong>Price:</strong> {{ item?.price_list?.price_list?.price_list_type?.currency }}
            {{ item?.price_list?.price_list?.price_list_type?.amount }}
          </p>

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">Companions</VaTitle>
          <VaDataTable :items="companions" />

          <VaDivider class="my-4" />

          <p><strong>Observers</strong></p>
          <VaDataTable :items="observers" />
          <p><strong>Other Safari Extras</strong></p>
          <VaDataTable :items="clientSafariExtras" />

          <VaDivider class="my-4" />

          <VaTitle class="font-bold">Accommodation</VaTitle>
          <VaDataTable :items="accommodations" />

          <VaDivider class="my-4" />
          <VaTitle class="font-bold">Charters Price</VaTitle>
          <VaDataTable :items="chartersPrices" />
        </div>
      </div>
    </template>

    <template #grabber>
      <div class="custom-grabber">
        <VaIcon name="swap_horiz" />
      </div>
    </template>

    <template #end>
      <div class="p-6">
        <SalesProposalForm :item="item" />
      </div>

      <section ref="observerScollRef">
        <ObserversForm :sales-inquiry-id="item.id" />
      </section>
      <section ref="companionsScollRef">
        <CompanionForm :sales-inquiry-id="item.id" />
      </section>
    </template>
  </VaSplit>

  <VaModal v-model="_shM" width="60%" height="80%">
    <SalesClientSafariExtrasForm :table-selectable="true" :item="item" />
  </VaModal>

  <VaModal v-model="_shAM" width="60%" height="80%">
    <AccommodationForm :item="item" />
  </VaModal>

  <VaModal v-model="_shCM" width="60%" height="80%">
    <ChartersPriceForm :item="item" />
  </VaModal>
</template>

<script lang="ts">
import { useForm, useToast } from 'vuestic-ui'
import { defineComponent, ref, reactive } from 'vue'
import { useSettingsStore } from '../../../../stores/settings-store'
import SalesProposalForm from './SalesProposalForm.vue'
import ObserversForm from './ObserversForm.vue'
import CompanionForm from './CompanionForm.vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import SalesClientSafariExtrasForm from './SalesClientSafariExtrasForm.vue'
import { mapState, mapActions, mapWritableState } from 'pinia'
import AccommodationForm from './AccommodationForm.vue'
import ChartersPriceForm from './ChartersPriceForm.vue'

export default defineComponent({
  name: 'SalesConfirmationClientDetails',
  components: {
    SalesProposalForm,
    ObserversForm,
    CompanionForm,
    SalesClientSafariExtrasForm,
    AccommodationForm,
    ChartersPriceForm,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const { init } = useToast()

    const observerScollRef = ref<HTMLDivElement | null>(null)
    const companionsScollRef = ref<HTMLDivElement | null>(null)
    const safariExtrasRef = ref<HTMLDivElement | null>(null)

    const scrollTo = (view: any) => {
      console.log('Scroll View:', view) // For debugging
      console.log('Section Ref El:', observerScollRef.value) // For debugging
      if (view) {
        view.scrollIntoView({ behavior: 'smooth' })
      } else {
        console.error('View is null or undefined')
      }
    }

    return {
      observerScollRef,
      companionsScollRef,
      safariExtrasRef,
      scrollTo,
      init,
    }
  },

  data() {
    const formRef = ref()

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const form = reactive({
      id: null as any,
      package_id: null as any,
      airport: null as any,
      departure: null as any,
      charters: null as any,
      arrival: null as any,
      hotel_booking: null as any,
    })

    return {
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      formRef,
      form,
      searchText: '',
      // showSafariExtrasModal: false,
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, [
      'observers',
      'companions',
      'clientSafariExtras',
      'accommodations',
      'chartersPrices',
    ]),
    ...mapWritableState(useSalesInquiriesStore, {
      _shM: 'showSafariExtrasModal',
    }),
    ...mapWritableState(useSalesInquiriesStore, {
      _shAM: 'showAccommodationModal',
    }),

    ...mapWritableState(useSalesInquiriesStore, {
      _shCM: 'showChartersPriceModal',
    }),

    logo() {
      return useSettingsStore().logo // Get the logo from the store
    },
  },
  mounted() {
    this.getObservers(this.item.id)
    this.getCompanions(this.item.id)
    this.getClienSafariExtras(this.item.id)
    this.getAccommodation(this.item.id)
    this.getChartersPrice(this.item.id)
  },
  methods: {
    ...mapActions(useSalesInquiriesStore, ['getObservers', 'getCompanions']),
    ...mapActions(useSalesInquiriesStore, [
      'createsafariExtras',
      'getClienSafariExtras',
      'getAccommodation',
      'getChartersPrice',
    ]),

    formatDate(dateString: string | number | Date) {
      return dateString ? new Date(dateString).toLocaleDateString() : 'Not provided'
    },
    safeArray(arr: any) {
      return arr || []
    },
    safeString(str: any, fallback = 'Not provided') {
      return str || fallback
    },
    gotBack() {
      // Your logic to go back to the previous view
    },
    getOrsearchSalesInquiry() {},
    _showSafariExtrasModal() {
      this._shM = true
    },
    _showAccommodationModal() {
      this._shAM = true
    },
    _showChartersPriceModal() {
      this._shCM = true
    },
    // async submitSelectedItems(selectedItems: any) {
  },
})
</script>

<style lang="scss" scoped>
.sales-inquiry {
  margin: 20px;
}
.split-demo {
  & .custom-grabber {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: var(--va-background-element);
  }
}
</style>
