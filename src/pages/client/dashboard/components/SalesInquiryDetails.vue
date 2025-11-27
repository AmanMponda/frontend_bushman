<template>
  <div class="flex justify-between items-center mb-6">
    <div class="flex items-center gap-3">
      <VaBadge :text="item?.inquiry_type === 'standard' ? 'Standard Package' : 'Custom Package'" 
               :color="item?.inquiry_type === 'standard' ? 'success' : 'info'" />
      <VaBadge :text="item?.code" color="primary" />
    </div>
    <div class="flex gap-2">
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
  </div>
  <VaSplit
    class="split-demo h-[40rem]"
    :limits="[
      ['30px', '20rem'],
      [5 as any, 'any'],
    ]"
  >
    <template #start>
      <div class="p-4 bg-gray-100 rounded-lg shadow-md overflow-y-auto">
        <!-- Header -->
        <VaCard class="mb-4">
          <VaCardContent>
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ item?.code }}</h2>
                <p class="text-gray-600">Created: {{ formatDate(item?.create_date) }}</p>
              </div>
              <VaBadge :text="item?.season?.name" color="primary" large />
            </div>
          </VaCardContent>
        </VaCard>

        <!-- Client Information -->
        <VaCard class="mb-4">
          <VaCardContent>
            <div class="flex items-center gap-2 mb-3">
              <VaIcon name="person" color="primary" />
              <h3 class="text-lg font-bold">Client Information</h3>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-sm text-gray-600">Full Name</p>
                <p class="font-semibold">{{ safeString(item?.entity?.full_name) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Nationality</p>
                <p class="font-semibold">{{ safeString(item?.entity?.nationality?.name) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Country</p>
                <p class="font-semibold">{{ safeString(item?.entity?.country?.name) }}</p>
              </div>
            </div>
            
            <VaDivider class="my-3" />
            
            <h4 class="font-semibold mb-2">Contacts</h4>
            <div class="space-y-2">
              <div v-for="(contact, index) in safeArray(item.entity?.contacts)" :key="index" class="flex items-center gap-2">
                <VaIcon :name="getContactIcon(contact.contact_type?.name)" size="small" color="info" />
                <span>{{ contact.contact }}</span>
              </div>
            </div>
          </VaCardContent>
        </VaCard>

        <!-- Preferences Information -->
        <VaCard class="mb-4">
          <VaCardContent>
            <div class="flex items-center gap-2 mb-3">
              <VaIcon name="event" color="primary" />
              <h3 class="text-lg font-bold">Hunting Preferences</h3>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-sm text-gray-600">Preferred Date</p>
                <p class="font-semibold">{{ formatDate(item?.formatted_preferences?.preferred_date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Start Date</p>
                <p class="font-semibold">{{ formatDate(item?.formatted_preferences?.start_date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">End Date</p>
                <p class="font-semibold">{{ formatDate(item?.formatted_preferences?.end_date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Duration</p>
                <p class="font-semibold">{{ item?.formatted_preferences?.no_of_days || 'N/A' }} days</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Hunters</p>
                <p class="font-semibold">{{ item?.formatted_preferences?.no_of_hunters }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Companions</p>
                <p class="font-semibold">{{ item?.formatted_preferences?.no_of_companions }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Observers</p>
                <p class="font-semibold">{{ item?.formatted_preferences?.no_of_observers }}</p>
              </div>
            </div>
          </VaCardContent>
        </VaCard>

        <!-- Standard Package Details -->
        <VaCard v-if="item?.inquiry_type === 'standard' && item?.package_details" class="mb-4">
          <VaCardContent>
            <div class="flex items-center gap-2 mb-3">
              <VaIcon name="inventory_2" color="success" />
              <h3 class="text-lg font-bold">Standard Package Details</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="col-span-2 p-3 bg-green-50 rounded-lg">
                <p class="text-sm text-gray-600">Package Amount</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ item?.package_details?.currency_name }} {{ formatCurrency(item?.package_details?.amount) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Hunting Area</p>
                <p class="font-semibold">{{ item?.package_details?.area_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Hunting Type</p>
                <p class="font-semibold">{{ item?.package_details?.hunting_type_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Duration</p>
                <p class="font-semibold">{{ item?.package_details?.duration }} days</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Package Period</p>
                <p class="font-semibold text-xs">
                  {{ formatDate(item?.package_details?.start_date) }} - {{ formatDate(item?.package_details?.end_date) }}
                </p>
              </div>
            </div>
          </VaCardContent>
        </VaCard>

        <!-- Custom Package Details -->
        <VaCard v-if="item?.inquiry_type === 'custom' && item?.custom_details" class="mb-4">
          <VaCardContent>
            <div class="flex items-center gap-2 mb-3">
              <VaIcon name="tune" color="info" />
              <h3 class="text-lg font-bold">Custom Package Details</h3>
            </div>
            
            <!-- Custom Areas -->
            <div v-if="safeArray(item?.custom_details?.areas).length > 0" class="mb-4">
              <h4 class="font-semibold mb-2">Hunting Areas</h4>
              <div class="flex flex-wrap gap-2">
                <VaChip v-for="(area, index) in item?.custom_details?.areas" :key="index" color="info">
                  {{ area.area_name }}
                </VaChip>
              </div>
            </div>

            <!-- Custom Species -->
            <div v-if="safeArray(item?.custom_details?.species).length > 0">
              <h4 class="font-semibold mb-2">Requested Species</h4>
              <VaDataTable
                :items="item?.custom_details?.species"
                :columns="[
                  { key: 'species_name', label: 'Species', sortable: true },
                  { key: 'quantity', label: 'Quantity', sortable: true }
                ]"
              />
            </div>
          </VaCardContent>
        </VaCard>

        <!-- Additional Species (if added later) -->
        <VaCard v-if="safeArray(item?.species).length > 0" class="mb-4">
          <VaCardContent>
            <div class="flex items-center gap-2 mb-3">
              <VaIcon name="pets" color="warning" />
              <h3 class="text-lg font-bold">{{ item?.inquiry_type === 'custom' ? 'Additional Species' : 'Package Species' }}</h3>
            </div>
            <VaDataTable
              :items="item?.species.map((s: any) => ({
                species_name: s.species?.name,
                scientific_name: s.species?.scientific_name,
                quantity: s.quantity
              }))"
              :columns="[
                { key: 'species_name', label: 'Species', sortable: true },
                { key: 'scientific_name', label: 'Scientific Name', sortable: true },
                { key: 'quantity', label: 'Quantity', sortable: true }
              ]"
            />
          </VaCardContent>
        </VaCard>
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
    formatCurrency(amount: any) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(amount) || 0)
    },
    getContactIcon(contactType: string) {
      const icons: any = {
        'email': 'email',
        'phone_number': 'phone',
        'phone': 'phone',
        'address': 'home',
      }
      return icons[contactType] || 'info'
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
