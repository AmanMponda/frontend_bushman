<template>
  <VaCard class="w-full">
    <VaCardContent>
      <VaForm ref="formRef">
        <div class="p-1">
          <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> -->
          <h3 class="font-bold text-lg mb-2">Companion Basic Information</h3>
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

            <VaInput
              v-model="form.address"
              type="text"
              :max-length="30"
              placeholder="Enter your address"
              :rules="[(value: any) => (value && value.length > 0) || 'Address is required']"
              label="Address"
            />
          </div>

          <!-- "charter_in": request.data.get("charter_in"),
          "charter_out": request.data.get("charter_out"), -->
          <h3 class="font-bold text-lg mb-2">Charters</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-6">
            <VaInput
              v-model="form.charter_in"
              placeholder="Charter in"
              type="datetime-local"
              :rules="[(v: any) => !!v || 'This field is required']"
              label="Charter in"
            />
            <VaInput
              v-model="form.charter_out"
              type="datetime-local"
              placeholder="Charter out"
              :rules="[
                (v: any) => !!v || 'This field is required',
                (v: any) => new Date(v) > new Date(form.charter_in) || 'Check out date must be after check-in date',
              ]"
              label="Charter out"
            />
            <!-- arrival_airport
              -->
            <VaInput
              v-model="form.arrival_airport"
              type="text"
              placeholder="Arrival airport"
              :rules="[(v: any) => !!v || 'This field is required']"
              label="Arrival airport"
            />
          </div>

          <h3 class="font-bold text-lg mb-2">Licence</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <VaSelect
              v-model="form.regulatory_package_id"
              :options="regulatoryPackages"
              :rules="[(value: any) => value || 'Licence is required']"
              placeholder="Select Licence"
              label="Licence"
            />
          </div>

          <!-- Experience and Date Group -->
          <!-- 
  
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
            </div> -->
        </div>

        <div class="mt-4 d-flex p-2 flex justify-end">
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
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
// Va* components are globally registered Bootstrap components - no import needed

import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { mapActions, mapState } from 'pinia'
import { validators } from '../../../../services/utils'
import downloadPdf from '../../../../utils/pdfDownloader'
import { useQuotaStore } from '../../../../stores/quota-store'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { useSettingsStore } from '../../../../stores/settings-store'
import handleErrors from '../../../../utils/errorHandler'
import { useRegulatoryPackageStore } from '../../../../stores/regulatrory-store'
import { format } from 'date-fns'

export default defineComponent({
  components: {
    // Salesinquirieslist,
    // Va* components are globally registered
    // SalesInquiryDetails,
    // SalesConfirmationClientDetails,
  },
  props: {
    salesInquiryId: {
      type: String,
      required: true,
    },
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
    } = useForm()

    const {
      isValid: isValidContactForm,
      validate: validateContactForm,
      resetValidation: resetValidationContactForm,
      reset: resetContactForm,
    } = useForm()

    const { init } = useToast()
    const showDetailsPage = ref(false)

    const form = reactive({
      id: null as any,
      full_name: '',
      // nick_name: '',
      country: null as any,
      nationality: null as any,
      email: '',
      phone: '',
      address: '',
      arrival_airport: '',
      charter_in: null as any,
      charter_out: null as any,
      regulatory_package_id: null as any,
      // no_of_hunters: 1,
      // no_of_observers: 0,
      // no_of_days: 0,
      // no_of_companions: 0,
      // species: null as any,
      // quantity: 0,
      // area: null as any,
      // season: null as any,
      // preferred_date: null as any,
      id_number: '',
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
      // getCategories()
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
      preferred_species: [] as any,
      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      seasonsOptions: [] as any,
      selectedInquiryItem: null as any,
      downloadPdf,
      saving: false,
      regulatoryPackages: [] as any,
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['logo']),
  },

  mounted() {
    // this.getSpeciesItems()
    this.getAreas()
    this.getSeasonList()
    this.getLicencePackages()
  },
  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useSalesInquiriesStore, [
      'createSalesInquiry',
      'createSalesConfirmationProposalObservers',
      'createSalesConfirmationCompanion',
      'getCompanions',
    ]),

    ...mapActions(useSettingsStore, ['getSeasons']),
    ...mapActions(useRegulatoryPackageStore, ['getRegulatoryPackages']),

    async submit() {
      this.saving = true

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
        nationalityId: this.form.nationality.value,
        countryId: this.form.country.value,
        salesInquiryId: this.salesInquiryId,
        regulatoryPackageId: this.form.regulatory_package_id.value,
        identityNumber: this.form.id_number,
        arrival_airport: this.form.arrival_airport,
        charter_in: format(this.form.charter_in, 'yyyy-MM-dd HH:mm:ss'),
        charter_out: format(this.form.charter_in, 'yyyy-MM-dd HH:mm:ss'),
      }
      try {
        const response: any = await this.createSalesConfirmationCompanion(requestdata)

        if (response.status === 201) {
          this.saving = false
          this.init({ message: response.data.message, color: 'success' })

          this.resetForm()
          this.resetValidationContactForm()
          this.speciesObjects = []
          this.getCompanions(this.salesInquiryId)
        }
      } catch (error: any) {
        this.saving = false
        const errors = handleErrors(error.response)
        console.log(error)
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

    // addNewSpeciesItemToStorage() {
    //   // Check if all required fields in this.sform are not null
    //   if (!this.form.species || !this.form.quantity) {
    //     this.init({
    //       message: 'Please fill all required fields.',
    //       color: 'warning',
    //     })
    //     return // Exit the method if any field is null
    //   }

    //   // Ensure quantity is a positive number
    //   if (Number(this.form.quantity) <= 0) {
    //     // Uncomment the toast message if needed
    //     // this.toast.init({
    //     //   message: 'Quantity must be greater than zero.',
    //     //   color: 'warning',
    //     // });

    //     this.init({
    //       message: 'Quantity must be greater than zero.',
    //       color: 'warning',
    //     })

    //     return
    //   }

    //   // Check if the species item already exists
    //   const exists = this.speciesObjects.some(
    //     (species: { species_id: any }) => species.species_id === this.form.species.value,
    //   )

    //   if (!exists) {
    //     this.speciesObjects.push({
    //       species_id: this.form.species.value,
    //       name: this.form.species.text,
    //       quantity: this.form.quantity,
    //     })
    //     // console.log('New species item added:', this.speciesObjects)
    //   } else {
    //     console.log('Species item already exists:', this.form.species.value)
    //   }

    //   // this.resetSForm()
    // },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    async getLicencePackages() {
      try {
        const response = await this.getRegulatoryPackages()
        if (response.status === 200) {
          const data = response.data
          this.regulatoryPackages = data.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
        }
      } catch (error) {
        console.log(error)
      }
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
  },
})
</script>
s
