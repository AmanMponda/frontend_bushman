<template>
  <VaCard class="w-full">
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-3 mb-6 justify-between items-center py-4 px-2 bg-gray-50 rounded-lg">
        <div class="flex flex-col md:flex-row gap-3 justify-start">
          <VaButton
            v-if="showAddSalesInquiriesForm || showDetailsPage"
            class="px-6"
            icon="arrow_back"
            size="large"
            @click="gotBack()"
          >
            Go Back
          </VaButton>
        </div>
        <VaButtonGroup v-if="!showAddSalesInquiriesForm && !showDetailsPage">
          <VaButton
            class="px-6"
            color="primary"
            label="Add New Quota"
            round
            present="secondary"
            border-color="primary"
            icon="add"
            size="large"
            @click="toggleAddSalesInquiriesForm()"
            >Create Enquiry</VaButton
          >
        </VaButtonGroup>
      </div>
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
        <VaForm v-else ref="formRef" class="space-y-6">
          <div class="p-6 bg-white rounded-lg">
            <!-- Package Selection Section -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <VaIcon name="inventory_2" color="primary" size="large" />
                <h3 class="text-xl font-bold text-gray-800">Package Selection</h3>
              </div>
              <div class="flex gap-6 mb-4">
              <VaRadio
                v-model="packageSelectionType"
                option="standard"
                label="Use Standard Package"
                @update:modelValue="onPackageTypeChange"
              />
              <VaRadio
                v-model="packageSelectionType"
                option="custom"
                label="Create Custom Package"
                @update:modelValue="onPackageTypeChange"
              />
            </div>

            <template v-if="packageSelectionType === 'standard'">
              <div class="grid grid-cols-1 gap-4 mb-4">
                <VaSelect
                  v-model="form.priceListId"
                  placeholder="Select Standard Price List"
                  label="Sales Package"
                  :rules="[(v: any) => v || 'Price List is required']"
                  :options="packagesOptions"
                  searchable
                  highlight-matched-text
                  @update:modelValue="populateSpeciesList"
                >
                  <template #content="{ value }">
                    <div v-if="value" class="flex flex-col">
                      <span class="font-semibold">{{ value.text }}</span>
                      <span class="text-sm text-gray-500">
                        {{ value.selfItem?.area || value.selfItem?.area_package || 'N/A' }} • {{ value.selfItem?.hunting_type || 'N/A' }} • {{ value.selfItem?.duration || 0 }} days
                      </span>
                    </div>
                  </template>
                </VaSelect>

                <!-- Display selected package details -->
                <VaCard v-if="form.priceListId && form.priceListId.selfItem" outlined class="mb-4">
                  <VaCardTitle class="text-sm font-semibold">Package Details</VaCardTitle>
                  <VaCardContent>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span class="text-gray-600">Area:</span>
                        <span class="ml-1 font-medium">{{ form.priceListId.selfItem?.area || form.priceListId.selfItem?.sales_package?.area?.name || 'N/A' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Hunting Type:</span>
                        <span class="ml-1 font-medium">{{ form.priceListId.selfItem?.hunting_type || form.priceListId.selfItem?.price_list_type?.hunting_type?.name || 'N/A' }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Duration:</span>
                        <span class="ml-1 font-medium">{{ form.priceListId.selfItem?.duration || form.priceListId.selfItem?.price_list_type?.duration || 0 }} days</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Base Amount:</span>
                        <span class="ml-1 font-medium">{{ form.priceListId.selfItem?.amount || formatCurrency(form.priceListId.selfItem?.price_list_type?.amount) }}</span>
                      </div>
                    </div>

                    <!-- Additional details from detailed API -->
                    <template v-if="form.priceListId.selfItem?.safari_extras">
                      <div class="mt-3 pt-3 border-t">
                        <div class="text-xs font-semibold text-gray-700 mb-2">Safari Extras Available:</div>
                        <div class="flex flex-wrap gap-1">
                          <VaBadge
                            v-for="extra in form.priceListId.selfItem.safari_extras"
                            :key="extra.id"
                            :text="`${extra.name} (${extra.currency?.symbol}${extra.amount})`"
                            color="info"
                            size="small"
                          />
                        </div>
                      </div>
                    </template>

                    <template v-if="form.priceListId.selfItem?.componions_hunter && form.priceListId.selfItem.componions_hunter.length > 0">
                      <div class="mt-2">
                        <span class="text-xs text-gray-600">Companion Rate:</span>
                        <span class="ml-1 text-xs font-medium">${{ form.priceListId.selfItem.componions_hunter[0].amount }}</span>
                      </div>
                    </template>

                    <template v-if="form.priceListId.selfItem?.observer && form.priceListId.selfItem.observer.length > 0">
                      <div class="mt-1">
                        <span class="text-xs text-gray-600">Observer Rate:</span>
                        <span class="ml-1 text-xs font-medium">${{ form.priceListId.selfItem.observer[0].amount }}</span>
                      </div>
                    </template>
                  </VaCardContent>
                </VaCard>
              </div>
            </template>

            <template v-else-if="packageSelectionType === 'custom'">
              <VaAlert color="info" class="mb-4">
                <template #title>Custom Package</template>
                You can create a custom package by selecting species and quantities below. This will create a unique price list for this inquiry.
              </VaAlert>
            </template>

            <h3 class="font-bold text-lg mb-2 mt-4">Species Included in Package</h3>
            <template v-if="packageSelectionType === 'standard' && salesPackagesSpecies.length > 0">
              <VaCard outlined class="mb-4">
                <VaCardContent>
                  <div class="va-table-responsive">
                    <table class="va-table va-table--striped">
                      <thead>
                        <tr>
                          <th>Species Name</th>
                          <th>Scientific Name</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="item in salesPackagesSpecies" :key="item.id">
                          <tr>
                            <td class="font-medium">{{ item.name }}</td>
                            <td class="text-sm text-gray-600">{{ item.scientific_name || 'N/A' }}</td>
                            <td>
                              <VaBadge :color="item.quantity > 0 ? 'success' : 'danger'" size="medium">
                                {{ item.quantity }}
                              </VaBadge>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </VaCardContent>
              </VaCard>

              <!-- Safari Extras Details -->
              <template v-if="form.priceListId.selfItem?.safari_extras && form.priceListId.selfItem.safari_extras.length > 0">
                <h3 class="font-bold text-lg mb-2 mt-4">Safari Extras</h3>
                <VaCard outlined class="mb-4">
                  <VaCardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div
                        v-for="extra in form.priceListId.selfItem.safari_extras"
                        :key="extra.id"
                        class="p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <div class="font-semibold text-base capitalize">{{ extra.name }}</div>
                            <div class="text-xs text-gray-600 mt-1">{{ extra.description }}</div>
                            <div class="mt-2 flex items-center gap-2">
                              <VaBadge color="primary" size="small">
                                {{ extra.currency?.symbol }}{{ extra.amount }}
                              </VaBadge>
                              <span class="text-xs text-gray-500">{{ formatChargesPer(extra.charges_per) }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VaCardContent>
                </VaCard>
              </template>

              <!-- Trophy Fees Details -->
              <template v-if="form.priceListId.selfItem?.trophy_fees && form.priceListId.selfItem.trophy_fees.length > 0">
                <h3 class="font-bold text-lg mb-2 mt-4">Trophy Fees</h3>
                <VaCard outlined class="mb-4">
                  <VaCardContent>
                    <div class="va-table-responsive">
                      <table class="va-table va-table--striped">
                        <thead>
                          <tr>
                            <th>Species</th>
                            <th>Scientific Name</th>
                            <th>Sequence</th>
                            <th>Price (USD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <template v-for="fee in form.priceListId.selfItem.trophy_fees" :key="fee.id">
                            <tr>
                              <td class="font-medium">{{ fee.species?.name }}</td>
                              <td class="text-sm text-gray-600">{{ fee.species?.scientific_name || 'N/A' }}</td>
                              <td>
                                <VaBadge color="info" size="small">
                                  {{ getSequenceLabel(fee.sequence_order) }}
                                </VaBadge>
                              </td>
                              <td class="font-semibold">${{ fee.price_usd }}</td>
                            </tr>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </VaCardContent>
                </VaCard>
              </template>

              <!-- Companion and Observer Rates -->
              <template v-if="(form.priceListId.selfItem?.componions_hunter && form.priceListId.selfItem.componions_hunter.length > 0) || (form.priceListId.selfItem?.observer && form.priceListId.selfItem.observer.length > 0)">
                <h3 class="font-bold text-lg mb-2 mt-4">Additional Rates</h3>
                <VaCard outlined class="mb-4">
                  <VaCardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <template v-if="form.priceListId.selfItem.componions_hunter && form.priceListId.selfItem.componions_hunter.length > 0">
                        <div class="p-4 bg-blue-50 rounded-lg">
                          <div class="flex items-center gap-2 mb-2">
                            <VaIcon name="group" size="small" color="primary" />
                            <span class="font-semibold text-base">Companion Hunter</span>
                          </div>
                          <div class="text-2xl font-bold text-primary">
                            ${{ form.priceListId.selfItem.componions_hunter[0].amount }}
                          </div>
                          <div class="text-xs text-gray-600 mt-1">per companion</div>
                        </div>
                      </template>
                      <template v-if="form.priceListId.selfItem.observer && form.priceListId.selfItem.observer.length > 0">
                        <div class="p-4 bg-green-50 rounded-lg">
                          <div class="flex items-center gap-2 mb-2">
                            <VaIcon name="visibility" size="small" color="success" />
                            <span class="font-semibold text-base">Observer</span>
                          </div>
                          <div class="text-2xl font-bold text-success">
                            ${{ form.priceListId.selfItem.observer[0].amount }}
                          </div>
                          <div class="text-xs text-gray-600 mt-1">per observer</div>
                        </div>
                      </template>
                    </div>
                  </VaCardContent>
                </VaCard>
              </template>
            </template>

            <!-- Custom Package Species Selection -->
            <template v-if="packageSelectionType === 'custom'">
              <h3 class="font-bold text-lg mb-2 mt-4">Preferred Species</h3>
              <VaCard outlined class="mb-4">
                <VaCardContent>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <VaSelect
                      v-model="form.species"
                      label="Species"
                      :options="speciesOptions"
                      placeholder="Select Species"
                      :rules="[(v: any) => !!v || 'Species is required']"
                      searchable
                      highlight-matched-text
                    />

                    <VaCounter
                      v-model="form.quantity"
                      label="Quantity"
                      manual-input
                      :min="1"
                      :max="100"
                      :rules="[(v: any) => v || 'Quantity is required']"
                    />
                    
                    <div class="flex items-end">
                      <VaButton
                        color="primary"
                        icon="add"
                        @click="addNewSpeciesItemToStorage()"
                      >
                        Add Species
                      </VaButton>
                    </div>
                  </div>

                  <VaDivider class="my-4" />

                  <div class="mt-4">
                    <div class="text-sm font-semibold mb-3">Selected Species</div>
                    <VaList v-if="speciesObjects.length > 0" class="space-y-2">
                      <VaListItem v-for="(s, index) in speciesObjects" :key="index" class="border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <VaListItemSection>
                          <VaListItemLabel class="flex justify-between items-center">
                            <div>
                              <span class="font-semibold">{{ s.name }}</span>
                              <span class="ml-3 text-sm text-gray-600">Qty: {{ s.quantity }}</span>
                            </div>
                            <VaButton
                              preset="plain"
                              icon="delete"
                              color="danger"
                              size="small"
                              @click="deleteFromStorage(index)"
                            />
                          </VaListItemLabel>
                        </VaListItemSection>
                      </VaListItem>
                    </VaList>
                    <VaAlert v-else color="secondary" border="left" class="mb-0">
                      No species selected yet. Add species using the form above.
                    </VaAlert>
                  </div>
                </VaCardContent>
              </VaCard>
            </template>
            </div>

            <!-- Basic Information Section -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <VaIcon name="person" color="primary" size="large" />
                <h3 class="text-xl font-bold text-gray-800">Basic Information</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <VaInput
                  v-model="form.full_name"
                  type="text"
                  placeholder="Enter your Full name"
                  :rules="[(value: any) => (value && value.length > 0) || 'Full name is required']"
                  label="Full name"
                />
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
              </div>
            </div>

            <!-- Contact Information Section -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <VaIcon name="contact_mail" color="primary" size="large" />
                <h3 class="text-xl font-bold text-gray-800">Contact Information</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <VaInput
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                :rules="[validators.required, validators.email]"
                label="Email"
              />

              <VaInput
                v-model="form.phone"
                type="text"
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
            </div>

            <!-- Participants and Hunting Days Section -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <VaIcon name="groups" color="primary" size="large" />
                <h3 class="text-xl font-bold text-gray-800">Participants and Hunting Days</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                :rules="[(v: any) => packageSelectionType === 'custom' ? (v || 'This field is required') : true]"
                :disabled="packageSelectionType === 'standard' && !!form.priceListId"
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
                :rules="[(v: any) => packageSelectionType === 'custom' ? (v || 'Hunting area is required') : true]"
                :options="areasOptions"
                :disabled="packageSelectionType === 'standard' && !!form.priceListId"
                searchable
                highlight-matched-text
              />
            </div>
            </div>

            <!-- Season and Tentative Date Section -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <VaIcon name="event" color="primary" size="large" />
                <h3 class="text-xl font-bold text-gray-800">Season and Tentative Date</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <VaSelect
                v-model="form.season"
                placeholder="Select Season"
                label="Season"
                :rules="[(v: any) => packageSelectionType === 'custom' ? (v || 'Season is required') : true]"
                :options="seasonsOptions"
                :disabled="packageSelectionType === 'standard' && !!form.priceListId"
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
            </div>
          </div>

          <VaDivider class="my-6" />

          <div class="flex justify-end gap-3 p-4">
            <VaButton
              preset="secondary"
              @click="gotBack()"
            >
              Cancel
            </VaButton>
            <VaButton
              :loading="saving"
              icon="save"
              :disabled="!isValidForm"
              @click="validateForm() && submit()"
            >
              Submit Enquiry
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
import { VaForm, VaInput, VaSelect, VaButton, VaCard, VaCardTitle, VaCardContent, VaBadge, VaAlert, VaRadio, VaDivider, VaIcon } from 'vuestic-ui'
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

    const packageSelectionType = ref('standard')

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
      try {
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
      } catch (error) {
        // Endpoint not available - categories not used in current form
        console.warn('Categories endpoint not available')
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
      try {
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
      } catch (error) {
        // Endpoint not available - contact types not used in current form
        console.warn('Contact types endpoint not available')
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
      packageSelectionType,
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
    this.getSpecies()
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
    ...mapActions(usePriceListStore, ['getPriceList', 'getPriceListById']),

    async submit() {
      this.saving = true
      
      // Validate required fields
      if (!this.form.full_name || !this.form.country || !this.form.nationality || !this.form.email) {
        this.init({
          message: 'Please fill in all required fields (Name, Country, Nationality, Email).',
          color: 'warning',
        })
        this.saving = false
        return
      }

      // Validate based on package selection type
      if (this.packageSelectionType === 'standard') {
        if (!this.form.priceListId) {
          this.init({
            message: 'Please select a standard price list.',
            color: 'warning',
          })
          this.saving = false
          return
        }
        // For standard packages, no need to check species quantities
        // The package already has predefined species
      } else if (this.packageSelectionType === 'custom') {
        if (this.speciesObjects.length === 0) {
          this.init({
            message: 'Please add at least one species for custom package.',
            color: 'warning',
          })
          this.saving = false
          return
        }
      }

      if (this.form.no_of_hunters <= 0) {
        this.init({
          message: 'Number of hunters must be greater than zero.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      // Prepare entity data
      const entityData = {
        full_name: this.form.full_name,
        country_id: this.form.country?.value,
        nationality_id: this.form.nationality?.value,
      }

      // Prepare contacts with proper contact type IDs
      const contacts = [
        {
          contact_type_id: 1, // email type from contact_types table
          contact: this.form.email,
          contactable: true,
        },
        {
          contact_type_id: 2, // phone_number type from contact_types table
          contact: this.form.phone,
          contactable: true,
        },
        {
          contact_type_id: 3, // address type from contact_types table
          contact: this.form.address,
          contactable: false,
        },
      ]

      // Prepare species data based on selection type
      let speciesData = []
      if (this.packageSelectionType === 'custom') {
        // Only send species for custom packages
        speciesData = this.speciesObjects
      }
      // For standard packages, species come from the price list, so we don't send them

      // Prepare sales inquiry preferences
      const preferences = {
        preferred_date: this.form.preferred_date,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        no_of_observers: this.form.no_of_observers || 0,
        no_of_companions: this.form.no_of_companions || 0,
        // For standard packages, no_of_hunters is companions, no_of_days comes from price list
        no_of_hunters: this.packageSelectionType === 'standard' ? this.form.no_of_companions : this.form.no_of_hunters,
        no_of_days: this.packageSelectionType === 'standard' ? null : this.form.no_of_days, // null for standard, backend gets it from price list
      }

      const requestdata: any = {
        // Entity and contacts
        entity: entityData,
        contacts: contacts,
        
        // Sales inquiry basic info
        inquiry_type: this.packageSelectionType, // 'standard' or 'custom'
        
        // Preferences
        preferences: preferences,
      }

      // Add fields based on package type
      if (this.packageSelectionType === 'standard') {
        // Standard package: include price_list_id and default season_id
        requestdata.price_list_id = this.form.priceListId?.value
        requestdata.season_id = 6 // Default season ID
      } else {
        // Custom package: include species, area_id, and season_id
        // Do NOT send price_list_id for custom packages
        requestdata.species = speciesData
        requestdata.area_id = this.form.area?.value
        requestdata.season_id = this.form.season?.value || null
      }
      
      console.log('Request payload:', JSON.stringify(requestdata, null, 2))
      
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
        console.error('Error creating sales inquiry:', error)
        
        // Handle errors with server response
        if (error.response) {
          const errors = handleErrors(error.response)
          this.init({
            message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
            color: 'danger',
          })
        } else if (error.request) {
          // Request was made but no response received
          this.init({
            message: 'No response from server. Please check your network connection.',
            color: 'danger',
          })
        } else {
          // Something else happened
          this.init({
            message: error.message || 'An unexpected error occurred',
            color: 'danger',
          })
        }
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

    async getSpecies() {
      try {
        const response = await this.getSpeciesList()
        if (response.status === 200) {
          this.speciesOptions = response.data.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
        }
      } catch (error) {
        console.error('Error loading species:', error)
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

    async getPL() {
      const response = await this.getPriceList()

      if (response.status === 200) {
        this.packagesOptions = response.data.data.map((item: any) => ({
          value: item.id,
          text: item.package_name || `Package ${item.id}`,
          selfItem: item,
        }))

        console.log('packagesOptions:', this.packagesOptions)
      } else {
        console.log('Error getting price list')
      }
    },

    async populateSpeciesList() {
      const settingsStore = useSettingsStore()

      if (!this.form.priceListId || !this.form.priceListId.value) {
        settingsStore.salesPackagesSpecies = []
        return
      }

      try {
        // Fetch detailed price list information
        const response = await this.getPriceListById(this.form.priceListId.value)
        console.log('Price list detail response:', response)

        if (response.status === 200 && response.data.success) {
          const priceListData = response.data.data

          // Update form with price list details
          this.form.priceListId.selfItem = priceListData

          // Auto-populate form fields from package data
          if (this.packageSelectionType === 'standard') {
            // Set hunting area
            if (priceListData.sales_package?.area?.name) {
              const areaOption = this.areasOptions.find(
                (a: any) => a.text === priceListData.sales_package.area.name
              )
              if (areaOption) {
                this.form.area = areaOption
              }
            }

            // Set duration (number of days)
            if (priceListData.price_list_type?.duration) {
              this.form.no_of_days = priceListData.price_list_type.duration
            }

            // Set season based on date range
            if (priceListData.price_list_type?.price_list?.start_date) {
              const startDate = new Date(priceListData.price_list_type.price_list.start_date)
              const seasonOption = this.seasonsOptions.find((s: any) => {
                if (s.selfItem?.start_date) {
                  const seasonStart = new Date(s.selfItem.start_date)
                  return seasonStart.getFullYear() === startDate.getFullYear()
                }
                return false
              })
              if (seasonOption) {
                this.form.season = seasonOption
              }
            }
          }

          // Extract species from sales_package.species
          if (priceListData.sales_package?.species && Array.isArray(priceListData.sales_package.species)) {
            const speciesList = priceListData.sales_package.species.map((item: any) => ({
              id: item.species?.id || item.id,
              name: item.species?.name || item.name || 'Unknown',
              scientific_name: item.species?.scientific_name || item.scientific_name || 'N/A',
              quantity: item.quantity || 0,
              requested_quantity: 0,
            }))

            // Update store directly
            settingsStore.salesPackagesSpecies = speciesList

            console.log('Populated species:', speciesList)

            this.init({
              message: `Loaded ${speciesList.length} species from the selected package.`,
              color: 'success',
              position: 'bottom-right',
            })
          } else {
            console.log('No species array found. Response structure:', priceListData.sales_package)
            settingsStore.salesPackagesSpecies = []
            this.init({
              message: 'No species found in the selected package.',
              color: 'warning',
              position: 'bottom-right',
            })
          }
        }
      } catch (error) {
        console.error('Error fetching price list details:', error)
        this.init({
          message: 'Failed to load package details. Please try again.',
          color: 'danger',
          position: 'bottom-right',
        })
        settingsStore.salesPackagesSpecies = []
      }
    },

    onChange(id: any, newValue: any) {
      console.log('Quantity changed:', id, newValue)

      const updatedItem = this.salesPackagesSpecies.find((item: any) => item.id === id)
      if (updatedItem) {
        updatedItem.requested_quantity = newValue
        // then update list
        this.salesPackagesSpecies = [...this.salesPackagesSpecies]

        // Validate against available quantity
        if (newValue > updatedItem.quantity) {
          this.init({
            message: `Warning: Requested quantity (${newValue}) exceeds available quantity (${updatedItem.quantity}) for ${updatedItem.name}.`,
            color: 'warning',
            position: 'bottom-right',
          })
        } else if (newValue > 0) {
          this.init({
            message: `Quantity for ${updatedItem.name} has been set to ${newValue}.`,
            color: 'success',
            position: 'bottom-right',
          })
        }
      }
    },

    onPackageTypeChange() {
      const settingsStore = useSettingsStore()

      // Reset species selections when switching package types
      if (this.packageSelectionType === 'standard') {
        this.form.priceListId = null
        this.salesPackagesSpecies.forEach((s: any) => {
          s.requested_quantity = 0
        })
      } else {
        // Reset to custom mode - clear package selection and re-enable fields
        this.form.priceListId = null
        this.form.area = null
        this.form.no_of_days = 0
        this.form.season = null
        settingsStore.salesPackagesSpecies = []
        this.speciesObjects = []
      }
    },

    formatDateRange(startDate: string, endDate: string) {
      if (!startDate || !endDate) return 'N/A'
      const start = new Date(startDate)
      const end = new Date(endDate)
      const startFormatted = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const endFormatted = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      return `${startFormatted} - ${endFormatted}`
    },

    formatCurrency(amount: number) {
      if (!amount) return '$0.00'
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    },

    formatChargesPer(chargesPer: string) {
      if (!chargesPer) return ''
      return chargesPer.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    },

    getSequenceLabel(sequence: number) {
      const labels: { [key: number]: string } = {
        1: '1st',
        2: '2nd',
        3: '3rd',
      }
      return labels[sequence] || `${sequence}th`
    },
  },
})
</script>
