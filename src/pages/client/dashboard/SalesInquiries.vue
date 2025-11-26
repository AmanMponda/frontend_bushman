<template>
  <VaCard class="w-full pt-2">
    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 mt-2">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton
          v-if="showAddSalesInquiriesForm || showDetailsPage"
          class="px-2"
          icon="arrow_back"
          size="small"
          @click="gotBack()"
        >
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup v-if="!showAddSalesInquiriesForm && !showDetailsPage">
        <VaButton
          class="px-2"
          color="primary"
          label="Add New Quota"
          round
          present="secondary"
          border-color="primary"
          icon="add"
          size="small"
          @click="toggleAddSalesInquiriesForm()"
          >Create Enquiry</VaButton
        >
      </VaButtonGroup>
    </div>

    <VaCardContent>
      <template v-if="showDetailsPage">
        <!-- <SalesConfirmationClientDetails :item="selectedInquiryItem"> </SalesConfirmationClientDetails> -->
        <!--  -->
        <SalesInquiryDetails :item="selectedInquiryItem" />
      </template>
      <template v-else>
        <Salesinquirieslist
          v-if="!showAddSalesInquiriesForm"
          @downloadBtnPressed="downloadPdf($event.selfitem.pdf)"
          @viewBtnPressed="viewInquiries"
        >
        </Salesinquirieslist>
        <!-- <VaStepper v-else v-model="step" :steps="steps" vertical controls-hidden> -->
        <!-- <template #step-content-0> -->
        <VaForm v-else ref="formRef">
          <div class="p-1">
            <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> -->
            <h3 class="font-bold text-lg mb-2">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <VaInput
                v-model="form.full_name"
                type="text"
                placeholder="Enter your Full name"
                :rules="[(value: any) => (value && value.length > 0) || 'Full name is required']"
                label="Full name"
              />
              <!-- <VaInput v-model="form.nick_name" placeholder="Nick name" label="Nick name" /> -->
              <VaSelect
                v-model="form.country"
                placeholder="Select Country"
                label="Country"
                :rules="[(v: any) => v || 'Country is required']"
                :options="countries"
                searchable
                highlight-matched-text
              />
              <VaSelect
                v-model="form.nationality"
                placeholder="Select Client nationality"
                label="Client Nationality"
                :rules="[(v: any) => v || 'Nationality is required']"
                :options="nationality"
                searchable
                highlight-matched-text
              />
              <!-- id_number -->
              <VaInput
                v-model="form.id_number"
                type="text"
                placeholder="passport/ID number"
                :rules="[(value: any) => (value && value.length > 0) || 'passport number/id number is required']"
                label="passport/ID number"
              />
            </div>

            <!-- Experience and Date Group -->
            <h3 class="font-bold text-lg mb-2">Contacts</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <VaInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                :rules="[validators.required, validators.email]"
                label="Email"
              />

              <VaInput
                v-model="form.phone"
                type="tell"
                placeholder="eg: +971501234567"
                :rules="[validators.required, validators.tell]"
                label="Phone"
              />
              <!-- <vue-tel-input v-model="form.phone" mode="international" required></vue-tel-input> -->

              <VaInput
                v-model="form.address"
                type="text"
                :max-length="30"
                placeholder="Enter your address"
                :rules="[(value: any) => (value && value.length > 0) || 'Address is required']"
                label="Address"
              />
            </div>

            <h3 class="font-bold text-lg mb-2">Participants and hunting days</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <!-- <VaInput
                v-model="form.no_of_hunters"
                label="Number of Hunters"
                placeholder="Enter Number of Hunters"
                default-value="1"
                type="number"
                required
              /> -->
              <VaInput
                v-model="form.no_of_observers"
                label="Number of Observers(Optional)"
                placeholder="Enter Number of Observers"
                type="number"
                required
              />
              <VaInput
                v-model="form.no_of_days"
                label="Number of Days"
                placeholder="Enter Number of Days"
                type="number"
                :rules="[(v: any) => v || 'This field is required']"
                required
              />
              <VaInput
                v-model="form.no_of_companions"
                label="Number of Companions(Optional)"
                placeholder="Enter Number of Companions"
                type="number"
                required
              />
              <VaSelect
                v-model="form.area"
                placeholder="Select Area"
                label="Hunting area"
                :rules="[(v: any) => v || 'Hunting area is required']"
                :options="areasOptions"
                searchable
                highlight-matched-text
              />
            </div>
            <h3 class="font-bold text-lg mb-2">Season and Tentative Date</h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <VaSelect
                v-model="form.season"
                placeholder="Select Season"
                label="Season"
                :rules="[(v: any) => v || 'Season is required']"
                :options="seasonsOptions"
                searchable
                highlight-matched-text
              />
              <!-- <VaInput
              v-model="form.preferred_date"
              type="date"
              placeholder="Select Preferred Date"
              :rules="[(v: any) => v || 'Preferred Date is required']"
              label="Preferred Date"
            /> -->
              <VaDateInput
                v-model="form.preferred_date"
                label="Preferred Date"
                placeholder="Select Preferred Date"
                :rules="[(v: any) => v || 'Preferred Date is required']"
                required
              />
              <VaDateInput
                v-model="form.start_date"
                label="Start Date"
                placeholder="Select Start Date"
                :rules="[(v: any) => v || 'Start Date is required']"
                required
              />
              <VaDateInput
                v-model="form.end_date"
                label="End Date"
                placeholder="Select End Date"
                :rules="[(v: any) => v || 'End Date is required']"
                required
              />
            </div>

            <!-- price list selection -->
            <h3 class="font-bold text-lg mb-2">Package</h3>
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <VaSelect
                v-model="form.priceListId"
                placeholder="Select Price List"
                label="Sales package"
                :rules="[(v: any) => v || 'Price List is required']"
                :options="packagesOptions"
                searchable
                highlight-matched-text
                @update:modelValue="populateSpeciesList"
              />
            </div>

            <h3 class="font-bold text-lg mb-2">Species</h3>
            <div class="va-table-responsive">
              <table class="va-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in salesPackagesSpecies" :key="item.id">
                    <tr>
                      <td>{{ item.name }}</td>
                      <td>
                        <VaCounter
                          v-model="item.quantity"
                          increase-icon="add_circle_outline"
                          decrease-icon="remove_circle_outline"
                          class="w-100 p-0"
                          manual-input
                          color="#6938D1"
                          max="100"
                          min="0"
                          max-length="3"
                          @update:modelValue="(value) => onChange(item.id, value)"
                        />
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <h3 class="font-bold text-lg mb-2">Preferred Species</h3>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <VaSelect
                  v-model="form.species"
                  label="Species"
                  :options="speciesOptions"
                  placeholder="Select Species"
                  :rules="[(v: any) => !!v || 'Species is required']"
                  required
                />

                <VaCounter
                  v-model="form.quantity"
                  label="Quantity"
                  manual-input
                  :min="1"
                  :max="100"
                  :rules="[(v: any) => v || 'Quantity is required']"
                />
                <VaButtonGroup>
                  <VaButton
                    class="px-0 py-0"
                    color="primary"
                    icon="add"
                    size="small"
                    round
                    @click="addNewSpeciesItemToStorage()"
                  />
                </VaButtonGroup>
              </div>

              <div class="mt-6">
                <VaList>
                  <VaListLabel v-if="speciesObjects.length > 0" class="text-md mb-2 text-left"
                    >Selected Species</VaListLabel
                  >
                  <VaListLabel v-else color="secondary" class="va-text-code mb-2 text-left"
                    >No Species Selected</VaListLabel
                  >

                  <VaListItem v-for="(s, index) in speciesObjects" :key="index" class="list__item">
                    <VaListItemSection>
                      <VaListItemLabel>
                        Name: {{ s.name }}
                        <VaIcon name="delete" size="small" color="primary" @click="deleteFromStorage(index)" />
                      </VaListItemLabel>
                      <VaListItemLabel caption>Quantity: {{ s.quantity }}</VaListItemLabel>
                    </VaListItemSection>
                  </VaListItem>
                </VaList>
              </div>
            </div>
          </div>

          <div class="mt-4 d-flex p-2">
            <VaButton
              v-if="!showDetailsPage"
              :loading="saving"
              icon="save"
              class="mr-3 mb-2"
              :disabled="!isValidForm"
              @click="validateForm() && submit()"
            >
              Save
            </VaButton>
          </div>
        </VaForm>

        <!-- </template> -->
        <!-- </VaStepper> -->
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import handleErrors from '../../../utils/errorHandler'
import { validators } from '../../../services/utils'
// import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'

import Salesinquirieslist from './components/Salesinquirieslist.vue'
import { useForm, useToast } from 'vuestic-ui'
import { mapActions, mapState } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { useSalesInquiriesStore } from '../../../stores/sales-store'
import { useSettingsStore } from '../../../stores/settings-store'
import SalesInquiryDetails from './components/SalesInquiryDetails.vue'
// import pdfMake from 'pdfmake/build/pdfmake'
// import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import downloadPdf from '../../../utils/pdfDownloader'
import { usePriceListStore } from '../../../stores/price-list-store'

// pdfMake.vfs = pdfFonts?.pdfMake?.vfs
// pdfMake.vfs = pdfFonts.pdfMake.vfs
export default defineComponent({
  components: {
    Salesinquirieslist,
    VaForm,
    VaInput,
    VaSelect,
    VaButton,
    SalesInquiryDetails,
    // SalesConfirmationClientDetails,
  },
  setup() {
    const formRef = ref()
    const contactFormRef = ref()
    const showAddSalesInquiriesForm = ref(false)
    const btnIcon = ref('add')

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const {
      isValid: isValidContactForm,
      validate: validateContactForm,
      resetValidation: resetValidationContactForm,
      reset: resetContactForm,
    } = useForm(contactFormRef)

    const { init } = useToast()
    const showDetailsPage = ref(false)

    const form = reactive({
      id: null as any,
      full_name: '',
      nick_name: '',
      country: null as any,
      nationality: null as any,
      category: null,
      email: '',
      phone: '',
      address: '',
      no_of_hunters: 1,
      no_of_observers: 0,
      priceListId: null as any,
      no_of_days: 0,
      no_of_companions: 0,
      species: null as any,
      quantity: 0,
      area: null as any,
      season: null as any,
      preferred_date: null as any,
      id_number: '',
      start_date: null as any,
      end_date: null as any,
    })

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const toggleAddSalesInquiriesForm = () => {
      showAddSalesInquiriesForm.value = true
    }
    const gotBack = () => {
      showAddSalesInquiriesForm.value = false
      showDetailsPage.value = false
      // btnIcon.value = showAddSalesInquiriesForm.value ? 'list_alt' : 'add'
    }

    const countries = ref([]) as any
    const nationality = ref([]) as any
    const categoryOptions = ref([]) as any
    const contactsTypes = ref([]) as any
    const clients = ref([]) as any
    const step = ref(0) as any
    // const salesInquiryItems = ref([]) as any

    const getCountries = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_COUNTRIES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        countries.value.push(
          ...response.data.map((country: { id: any; name: any }) => ({ value: country.id, text: country.name })),
        )
      }
    }

    const getCategories = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_ENTITY_CATEGORIES_VSET_URL,
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        categoryOptions.value.push(
          ...response.data.map((category: { id: any; name: any }) => ({ value: category.id, text: category.name })),
        )
      }
    }

    const getNationalities = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_NATIONALITIES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        nationality.value.push(
          ...response.data.map((nationality: { id: any; name: any }) => ({
            value: nationality.id,
            text: nationality.name,
          })),
        )
      }
    }

    const getContactTypes = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CONTACT_TYPES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        contactsTypes.value.push(
          ...response.data.map((contactType: { id: any; name: any }) => ({
            value: contactType.id,
            text: contactType.name,
          })),
        )
      }
    }

    const contactFieldType = computed(() => {
      let contact_field_type = ''
      const contactType = contactForm.contact_type?.value

      if (contactType === 'email') {
        contact_field_type = 'email'
      } else if (contactType === 'phone_number') {
        contact_field_type = 'phone'
      } else {
        contact_field_type = ''
      }

      return contact_field_type
    })

    onMounted(() => {
      getCountries()
      getCategories()
      getNationalities()
      getContactTypes()
      // getClients()
    })

    return {
      formRef,
      contactFormRef,
      showAddSalesInquiriesForm,
      btnIcon,
      form,
      contactForm,
      showDetailsPage,
      countries,
      nationality,
      categoryOptions,
      contactsTypes,
      clients,
      step,
      // steps,
      init,
      toggleAddSalesInquiriesForm,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      isValidContactForm,
      validateContactForm,
      resetValidationContactForm,
      resetContactForm,

      validators,
      getCountries,
      // deleteSalesInquireItem,
      getCategories,
      getNationalities,
      getContactTypes,
      contactFieldType,
      gotBack,
    }
  },
  data() {
    return {
      // preferred_species: [] as any,

      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      seasonsOptions: [] as any,
      selectedInquiryItem: null as any,

      downloadPdf,
      saving: false,
      packagesOptions: [] as any,
      originalQuantities: reactive({} as any), // to keep track of original quantities
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['logo', 'salesPackagesSpecies']),
    speciesList() {
      return this.salesPackagesSpecies
    },
  },

  mounted() {
    // this.getSpeciesItems()
    this.getAreas()
    this.getSeasonList()
    this.getPL()
  },
  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useSalesInquiriesStore, ['createSalesInquiry']),
    ...mapActions(useSettingsStore, ['getSeasons', 'getSalespackagesSpecies']),
    ...mapActions(usePriceListStore, ['getPriceList']),

    async submit() {
      this.saving = true
      if (this.salesPackagesSpecies.length === 0) {
        this.init({
          message: 'Please select at least one species.',
          color: 'warning',
        })
        return
      }

      if (this.form.no_of_hunters <= 0) {
        this.init({
          message: 'Number of hunters must be greater than zero.',
          color: 'warning',
        })
        return
      }

      const contacts = [
        {
          contact_type: 'email',
          contact: this.form.email,
        },
        {
          contact_type: 'phone',
          contact: this.form.phone,
        },
        {
          contact_type: 'address',
          contact: this.form.address,
        },
      ]

      const requestdata = {
        fullName: this.form.full_name,
        contacts: contacts,
        nationality: this.form.nationality.value,
        country: this.form.country.value,
        noOfHunters: this.form.no_of_hunters,
        noOfDays: this.form.no_of_days,
        noOfCompanions: this.form.no_of_companions,
        noOfObservers: this.form.no_of_observers,
        species: this.salesPackagesSpecies,
        areaId: this.form.area.value,
        season: this.form.season,
        startDate: this.form.start_date,
        endDate: this.form.end_date,
        preferredDate: this.form.preferred_date,
        identityNumber: this.form.id_number,
        priceListId: this.form.priceListId.value,
      }
      try {
        const response: any = await this.createSalesInquiry(requestdata)

        if (response.status === 201) {
          this.saving = false
          this.init({ message: response.data.message, color: 'success' })
          this.resetForm()
          this.resetValidationContactForm()
          this.speciesObjects = []
        }
      } catch (error: any) {
        this.saving = false
        const errors = handleErrors(error.response)
        console.log(errors)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    viewInquiries(i: any) {
      this.showDetailsPage = true
      this.selectedInquiryItem = i.selfitem
    },

    // async getAllSpieces() {
    //   try {
    //     // if (this.form.sales_quota_id?.value || this.form?.area?.value) {
    //     const response = await this.getAllSpeciesPerQuotaPerArea(null, this.form.area?.value ?? null, null)
    //     this.speciesOptions = response.data.data.map((item: any) => {
    //       return {
    //         value: item.species.id,
    //         text: item.species.name,
    //       }
    //     })
    //     // }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },

    addNewSpeciesItemToStorage() {
      // Check if all required fields in this.sform are not null
      if (!this.form.species || !this.form.quantity) {
        this.init({
          message: 'Please fill all required fields.',
          color: 'warning',
        })
        return // Exit the method if any field is null
      }

      // Ensure quantity is a positive number
      if (Number(this.form.quantity) <= 0) {
        // Uncomment the toast message if needed
        // this.toast.init({
        //   message: 'Quantity must be greater than zero.',
        //   color: 'warning',
        // });

        this.init({
          message: 'Quantity must be greater than zero.',
          color: 'warning',
        })

        return
      }

      // Check if the species item already exists
      const exists = this.speciesObjects.some(
        (species: { species_id: any }) => species.species_id === this.form.species.value,
      )

      if (!exists) {
        this.speciesObjects.push({
          species_id: this.form.species.value,
          name: this.form.species.text,
          quantity: this.form.quantity,
        })
        // console.log('New species item added:', this.speciesObjects)
      } else {
        console.log('Species item already exists:', this.form.species.value)
      }

      // this.resetSForm()
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getSeasonList() {
      try {
        const response = await this.getSeasons()
        this.seasonsOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getPL() {
      const response = await this.getPriceList()

      if (response.status === 200) {
        this.packagesOptions = response.data.data.map((item: any) => ({
          value: item.id,
          text:
            item?.sales_package?.regulatory_package?.name +
            '--->' +
            item?.sales_package.name +
            ' ---> ' +
            item.price_list_type.hunting_type.name +
            '---> ' +
            item?.sales_package?.area?.name,

          selfItem: item,
        }))

        console.log('packagesOptions:', this.packagesOptions)
      } else {
        console.log('Error getting price list')
      }
    },

    async populateSpeciesList() {
      const response = await this.getSalespackagesSpecies({ salespackageId: this.form.priceListId.value })
      console.log('response:', response)
    },

    onChange(id: any, newValue: any) {
      console.log('Quantity changed:', id, newValue)
      // this.isChanged = true

      // Set the original value if it hasn't been set yet
      if (!(id in this.originalQuantities)) {
        const item = this.salesPackagesSpecies.find((item: any) => item.id === id)
        this.originalQuantities[id] = item.quantity // Direct assignment
      }

      const updatedItem = this.salesPackagesSpecies.find((item: any) => item.id === id)
      if (updatedItem) {
        updatedItem.quantity = newValue // Update the quantity with newValue
        // then update  list
        this.salesPackagesSpecies = [...this.salesPackagesSpecies]
      }
      this.init({
        message: `Quantity for ${updatedItem.name} has been updated to ${newValue} quantity(s).`,
        color: 'success',
        position: 'bottom-right',
      })

      console.log('updated item list:', this.packagesOptions.selfItem.sales_package?.species)
    },
  },
})
</script>
