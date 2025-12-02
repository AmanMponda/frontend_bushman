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
            @click="handleGoBack"
          >
            Go Back
          </VaButton>
        </div>
        <div v-if="!showAddSalesInquiriesForm && !showDetailsPage" class="flex gap-3">
          <VaButton class="px-6" color="secondary" round icon="download" size="large" @click="downloadAllInquiriesPdf()"
            >Download PDF</VaButton
          >
          <VaButton class="px-6" color="primary" round icon="add" size="large" @click="toggleAddSalesInquiriesForm()"
            >Create Enquiry</VaButton
          >
        </div>
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
          @editBtnPressed="editInquiry"
        >
        </Salesinquirieslist>
        <!-- <VaStepper v-else v-model="step" :steps="steps" vertical controls-hidden> -->
        <!-- <template #step-content-0> -->
        <VaForm v-else ref="formRef" class="space-y-6">
          <div class="p-6 bg-white rounded-lg">
            <!-- Package Reference Section -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-4">
                <VaIcon name="inventory_2" color="primary" size="large" />
                <h3 class="text-xl font-bold text-gray-800">Package Reference</h3>
              </div>

              <VaAlert color="info" class="mb-4" border="left">
                <template #title>Select a Package as Reference</template>
                Select a package to auto-fill the form with its details. You can then customize all fields to tailor the
                inquiry to your client's specific needs.
              </VaAlert>

              <div class="grid grid-cols-1 gap-4 mb-4">
                <VaSelect
                  v-model="form.priceListId"
                  placeholder="Select a Package for Reference (Optional)"
                  label="Reference Package"
                  :options="packagesOptions"
                  searchable
                  highlight-matched-text
                  clearable
                  @update:modelValue="populateFormFromPackage"
                >
                  <template #content="{ value }">
                    <div v-if="value" class="flex flex-col">
                      <span class="font-semibold">{{ value.text }}</span>
                      <span class="text-sm text-gray-500">
                        {{ value.selfItem?.area || value.selfItem?.area_package || 'N/A' }} •
                        {{ value.selfItem?.hunting_type || 'N/A' }} • {{ value.selfItem?.duration || 0 }} days
                      </span>
                    </div>
                  </template>
                </VaSelect>

                <!-- Display selected price list details -->
                <VaCard v-if="form.priceListId && form.priceListId.selfItem" outlined class="mb-4 bg-gray-50">
                  <VaCardTitle class="text-sm font-semibold flex items-center gap-2">
                    <VaIcon name="info" size="small" color="info" />
                    Price List Details - {{ form.priceListId.selfItem?.sales_package?.name || 'N/A' }}
                  </VaCardTitle>
                  <VaCardContent>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                      <div>
                        <span class="text-gray-600">Area:</span>
                        <span class="ml-1 font-medium">{{
                          form.priceListId.selfItem?.sales_package?.area?.name || 'N/A'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Hunting Type:</span>
                        <span class="ml-1 font-medium">{{
                          form.priceListId.selfItem?.price_list_type?.hunting_type?.name || 'N/A'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Regulatory Package:</span>
                        <span class="ml-1 font-medium">{{
                          form.priceListId.selfItem?.sales_package?.regulatory_package?.name || 'N/A'
                        }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Duration:</span>
                        <span class="ml-1 font-medium"
                          >{{ form.priceListId.selfItem?.price_list_type?.duration || 0 }} days</span
                        >
                      </div>
                      <div>
                        <span class="text-gray-600">Base Amount:</span>
                        <span class="ml-1 font-medium">
                          {{ form.priceListId.selfItem?.price_list_type?.currency?.symbol || '$'
                          }}{{ form.priceListId.selfItem?.price_list_type?.amount || 'N/A' }}
                        </span>
                      </div>
                      <div>
                        <span class="text-gray-600">Status:</span>
                        <VaBadge
                          :text="form.priceListId.selfItem?.price_list_type?.is_active ? 'Active' : 'Inactive'"
                          :color="form.priceListId.selfItem?.price_list_type?.is_active ? 'success' : 'warning'"
                          size="small"
                        />
                      </div>
                    </div>

                    <!-- Date Range -->
                    <div v-if="form.priceListId.selfItem?.price_list_type?.price_list?.start_date" class="mt-2 text-sm">
                      <span class="text-gray-600">Valid Period:</span>
                      <span class="ml-1 font-medium">
                        {{
                          formatDateRange(
                            form.priceListId.selfItem.price_list_type.price_list.start_date,
                            form.priceListId.selfItem.price_list_type.price_list.end_date,
                          )
                        }}
                      </span>
                    </div>

                    <!-- Companion Hunter Costs -->
                    <template
                      v-if="
                        form.priceListId.selfItem?.companion_hunter_costs &&
                        form.priceListId.selfItem.companion_hunter_costs.length > 0
                      "
                    >
                      <div class="mt-2">
                        <span class="text-xs text-gray-600">Companion Hunter:</span>
                        <span class="ml-1 text-xs font-medium">
                          {{ form.priceListId.selfItem?.price_list_type?.currency?.symbol || '$'
                          }}{{ form.priceListId.selfItem.companion_hunter_costs[0].amount }} ({{
                            form.priceListId.selfItem.companion_hunter_costs[0].days
                          }}
                          days)
                        </span>
                      </div>
                    </template>

                    <!-- Trophy Fees Table -->
                    <template
                      v-if="form.priceListId.selfItem?.trophy_fees && form.priceListId.selfItem.trophy_fees.length > 0"
                    >
                      <div class="mt-3 pt-3 border-t">
                        <div class="text-xs font-semibold text-gray-700 mb-2">Trophy Fees:</div>
                        <div class="va-table-responsive">
                          <table class="va-table va-table--hoverable w-full text-sm">
                            <thead>
                              <tr>
                                <th class="text-left">Species</th>
                                <th class="text-center">Sequence</th>
                                <th class="text-right">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(fee, index) in form.priceListId.selfItem.trophy_fees"
                                :key="`trophy-${fee.id}-${index}`"
                              >
                                <td class="font-medium">{{ fee.species?.name || 'Unknown' }}</td>
                                <td class="text-center">
                                  <VaBadge :text="getSequenceLabel(fee.sequence_order)" color="primary" size="small" />
                                </td>
                                <td class="text-right font-semibold">
                                  {{ form.priceListId.selfItem?.price_list_type?.currency?.symbol || '$'
                                  }}{{ fee.amount }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </template>

                    <!-- Upgrade Fees -->
                    <template
                      v-if="
                        form.priceListId.selfItem?.upgrade_fees && form.priceListId.selfItem.upgrade_fees.length > 0
                      "
                    >
                      <div class="mt-3 pt-3 border-t">
                        <div class="text-xs font-semibold text-gray-700 mb-2">Upgrade Fees:</div>
                        <div class="flex flex-wrap gap-1">
                          <VaBadge
                            v-for="fee in form.priceListId.selfItem.upgrade_fees"
                            :key="fee.id"
                            :text="`${fee.species_name} (${fee.currency_symbol || '$'}${fee.amount})`"
                            color="warning"
                            size="small"
                          />
                        </div>
                      </div>
                    </template>
                  </VaCardContent>
                </VaCard>
              </div>

              <!-- Species Selection Section -->
              <h3 class="font-bold text-lg mb-2 mt-4">
                <VaIcon name="pets" size="small" class="mr-1" />
                Preferred Species
              </h3>
              <VaCard outlined class="mb-4">
                <VaCardContent>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <VaSelect
                      v-model="form.species"
                      label="Species"
                      :options="speciesOptions"
                      placeholder="Select Species"
                      searchable
                      highlight-matched-text
                    />

                    <VaCounter v-model="form.quantity" label="Quantity" manual-input :min="1" :max="100" />

                    <div class="flex items-end">
                      <VaButton color="primary" icon="add" @click="addNewSpeciesItemToStorage()">
                        Add Species
                      </VaButton>
                    </div>
                  </div>

                  <VaDivider class="my-4" />

                  <div class="mt-4">
                    <div class="text-sm font-semibold mb-3">Selected Species</div>
                    <VaList v-if="speciesObjects.length > 0" class="space-y-2">
                      <VaListItem
                        v-for="(s, index) in speciesObjects"
                        :key="index"
                        class="border rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <VaListItemSection>
                          <VaListItemLabel class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                              <span class="font-semibold">{{ s.name }}</span>
                              <VaBadge v-if="s.fromPackage" color="info" size="small" text="from Price List" />
                            </div>
                            <div class="flex items-center gap-2">
                              <VaButton
                                preset="plain"
                                icon="remove"
                                color="primary"
                                size="small"
                                :disabled="s.quantity <= 1"
                                @click="decrementQuantity(index)"
                              />
                              <span class="text-sm font-medium min-w-[30px] text-center">{{ s.quantity }}</span>
                              <VaButton
                                preset="plain"
                                icon="add"
                                color="primary"
                                size="small"
                                @click="incrementQuantity(index)"
                              />
                              <VaButton
                                preset="plain"
                                icon="delete"
                                color="danger"
                                size="small"
                                class="ml-2"
                                @click="deleteFromStorage(index)"
                              />
                            </div>
                          </VaListItemLabel>
                        </VaListItemSection>
                      </VaListItem>
                    </VaList>
                    <VaAlert v-else color="secondary" border="left" class="mb-0">
                      No species selected yet. Add species using the form above or select a reference package.
                    </VaAlert>
                  </div>
                </VaCardContent>
              </VaCard>

              <!-- Safari Extras from Reference Package -->
              <template
                v-if="form.priceListId?.selfItem?.safari_extras && form.priceListId.selfItem.safari_extras.length > 0"
              >
                <h3 class="font-bold text-lg mb-2 mt-4">Safari Extras (from Price List)</h3>
                <VaCard outlined class="mb-4 bg-gray-50">
                  <VaCardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div
                        v-for="extra in form.priceListId.selfItem.safari_extras"
                        :key="extra.id"
                        class="p-3 border rounded-lg bg-white"
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

              <!-- Companion and Observer Rates from Reference Package -->
              <template
                v-if="
                  (form.priceListId?.selfItem?.componions_hunter &&
                    form.priceListId.selfItem.componions_hunter.length > 0) ||
                  (form.priceListId?.selfItem?.observer && form.priceListId.selfItem.observer.length > 0)
                "
              >
                <h3 class="font-bold text-lg mb-2 mt-4">Additional Rates (from Price List)</h3>
                <VaCard outlined class="mb-4 bg-gray-50">
                  <VaCardContent>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <template
                        v-if="
                          form.priceListId.selfItem.componions_hunter &&
                          form.priceListId.selfItem.componions_hunter.length > 0
                        "
                      >
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
                      <template
                        v-if="form.priceListId.selfItem.observer && form.priceListId.selfItem.observer.length > 0"
                      >
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
                  :rules="[(v: any) => v || 'Number of days is required']"
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
                  :rules="[(v: any) => v || 'Season is required']"
                  :options="seasonsOptions"
                  disabled
                  readonly
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
                  :allowed-days="checkDateAllowed"
                  required
                />
                <VaDateInput
                  v-model="form.start_date"
                  label="Start Date"
                  placeholder="Select Start Date"
                  :rules="[(v: any) => v || 'Start Date is required']"
                  :allowed-days="checkDateAllowed"
                  required
                />
                <VaDateInput
                  v-model="form.end_date"
                  label="End Date"
                  placeholder="Select End Date"
                  :rules="[(v: any) => v || 'End Date is required']"
                  :allowed-days="checkDateAllowed"
                  required
                />
              </div>
            </div>
          </div>

          <VaDivider class="my-6" />

          <div class="flex justify-end gap-3 p-4">
            <VaButton preset="secondary" @click="handleGoBack"> Cancel </VaButton>
            <VaButton :loading="saving" icon="save" :disabled="!isValidForm" @click="validateForm() && submit()">
              {{ isEditMode ? 'Update Enquiry' : 'Submit Enquiry' }}
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

      // Season date range constraints
      seasonMinDate: null as Date | null,
      seasonMaxDate: null as Date | null,

      // Edit mode
      isEditMode: false,
      editingInquiryId: null as number | null,
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['logo', 'salesPackagesSpecies']),
    speciesList() {
      return this.salesPackagesSpecies
    },
    // Get the month (0-11) of the season start date for calendar view
    seasonStartMonth(): number {
      if (this.seasonMinDate) {
        return this.seasonMinDate.getMonth()
      }
      return new Date().getMonth()
    },
    // Get the year of the season start date for calendar view
    seasonStartYear(): number {
      if (this.seasonMinDate) {
        return this.seasonMinDate.getFullYear()
      }
      return new Date().getFullYear()
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
    ...mapActions(useSalesInquiriesStore, ['createSalesInquiry', 'updateSalesInquiry']),
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

      // Validate species - at least one species should be selected
      if (this.speciesObjects.length === 0) {
        this.init({
          message: 'Please add at least one species.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      // Validate area and season
      if (!this.form.area) {
        this.init({
          message: 'Please select a hunting area.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      if (!this.form.season) {
        this.init({
          message: 'Please select a season.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      if (!this.form.no_of_days || this.form.no_of_days <= 0) {
        this.init({
          message: 'Please enter the number of days.',
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

      // Prepare sales inquiry preferences
      const preferences = {
        preferred_date: this.form.preferred_date,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        no_of_observers: this.form.no_of_observers || 0,
        no_of_companions: this.form.no_of_companions || 0,
        no_of_hunters: this.form.no_of_hunters || 1,
        no_of_days: this.form.no_of_days,
      }

      const requestdata: any = {
        // Entity and contacts
        entity: entityData,
        contacts: contacts,

        // Preferences
        preferences: preferences,

        // Species data (user can always edit)
        species: this.speciesObjects,

        // Area and Season
        area_id: this.form.area?.value,
        season_id: this.form.season?.value,
      }

      // Include reference price_list_id if a package was selected as reference
      if (this.form.priceListId?.value) {
        requestdata.reference_price_list_id = this.form.priceListId.value
      }

      console.log('Request payload:', JSON.stringify(requestdata, null, 2))

      try {
        let response: any

        if (this.isEditMode && this.editingInquiryId) {
          // Update existing inquiry
          response = await this.updateSalesInquiry(this.editingInquiryId, requestdata)

          if (response.status === 200) {
            this.saving = false
            this.init({ message: 'Sales inquiry updated successfully', color: 'success' })
            this.resetForm()
            this.resetValidationContactForm()
            this.speciesObjects = []
            this.isEditMode = false
            this.editingInquiryId = null
            this.showAddSalesInquiriesForm = false
          }
        } else {
          // Create new inquiry
          response = await this.createSalesInquiry(requestdata)

          if (response.status === 201) {
            this.saving = false
            this.init({ message: response.data.message, color: 'success' })
            this.resetForm()
            this.resetValidationContactForm()
            this.speciesObjects = []
          }
        }
      } catch (error: any) {
        this.saving = false
        console.error('Error saving sales inquiry:', error)

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

    resetEditMode() {
      this.isEditMode = false
      this.editingInquiryId = null
      this.speciesObjects = []
    },

    handleGoBack() {
      this.resetEditMode()
      this.gotBack()
    },

    getSpeciesNameById(speciesId: number): string | null {
      if (!speciesId) return null
      const species = this.speciesOptions.find((s: any) => s.value === speciesId)
      return species ? species.text : null
    },

    editInquiry(rowData: any) {
      // Set edit mode
      this.isEditMode = true
      this.editingInquiryId = rowData.id

      // Show the form
      this.showAddSalesInquiriesForm = true

      // Populate form with existing data
      const item = rowData.selfitem || rowData

      // Basic Information
      this.form.full_name = item.entity?.full_name || rowData.name || ''

      // Find and set country
      const countryName = item.entity?.country?.name || item.entity?.country_name
      if (countryName) {
        const countryOption = this.countries.find((c: any) => c.text === countryName)
        if (countryOption) this.form.country = countryOption
      }

      // Find and set nationality
      const nationalityName = item.entity?.nationality?.name || item.entity?.nationality_name
      if (nationalityName) {
        const nationalityOption = this.nationality.find((n: any) => n.text === nationalityName)
        if (nationalityOption) this.form.nationality = nationalityOption
      }

      // Contact Information from entity contacts
      if (item.entity?.contacts && Array.isArray(item.entity.contacts)) {
        item.entity.contacts.forEach((contact: any) => {
          if (contact.contact_type?.name === 'email' || contact.contact_type_id === 1) {
            this.form.email = contact.contact || ''
          } else if (contact.contact_type?.name === 'phone_number' || contact.contact_type_id === 2) {
            this.form.phone = contact.contact || ''
          } else if (contact.contact_type?.name === 'address' || contact.contact_type_id === 3) {
            this.form.address = contact.contact || ''
          }
        })
      }

      // Preferences
      const prefs = item.formatted_preferences || rowData.preference || {}
      this.form.no_of_hunters = prefs.no_of_hunters || 1
      this.form.no_of_observers = prefs.no_of_observers || 0
      this.form.no_of_days = prefs.no_of_days || 0
      this.form.no_of_companions = prefs.no_of_companions || 0

      // Dates
      if (prefs.preferred_date) this.form.preferred_date = new Date(prefs.preferred_date)
      if (prefs.start_date) this.form.start_date = new Date(prefs.start_date)
      if (prefs.end_date) this.form.end_date = new Date(prefs.end_date)

      // Area
      const areaName = item.inquiry_areas?.[0]?.area?.name || rowData.area
      if (areaName) {
        const areaOption = this.areasOptions.find((a: any) => a.text === areaName)
        if (areaOption) this.form.area = areaOption
      }

      // Season
      if (item.season) {
        const seasonOption = this.seasonsOptions.find(
          (s: any) => s.value === item.season.id || s.text === item.season.name,
        )
        if (seasonOption) this.form.season = seasonOption
      }

      // Reference Price List
      if (item.reference_price_list) {
        const priceListOption = this.packagesOptions.find((p: any) => p.value === item.reference_price_list.id)
        if (priceListOption) this.form.priceListId = priceListOption
      }

      // Species
      this.speciesObjects = []
      const speciesArray = item.inquiry_species || rowData.inquiry_species || []
      console.log('Species array from API:', JSON.stringify(speciesArray, null, 2))
      speciesArray.forEach((speciesItem: any) => {
        // Try multiple paths to get the species name
        const speciesName =
          speciesItem.species_name ||
          speciesItem.species?.name ||
          speciesItem.name ||
          this.getSpeciesNameById(speciesItem.species_id) ||
          'Unknown'
        this.speciesObjects.push({
          species_id: speciesItem.species_id || speciesItem.species?.id || speciesItem.id,
          name: speciesName,
          quantity: speciesItem.quantity || 1,
          fromPackage: false,
        })
      })

      this.init({
        message: 'Loaded inquiry data for editing',
        color: 'info',
      })
    },

    async downloadAllInquiriesPdf() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}sales/sales-inquiries-pdf`, {
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.data.success && response.data.pdf) {
          // Decode base64 PDF and download
          const pdfData = response.data.pdf
          const byteCharacters = atob(pdfData)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })

          // Create download link
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `sales-inquiries-${new Date().toISOString().split('T')[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          this.init({
            message: `PDF downloaded successfully. Total records: ${response.data.total_records}`,
            color: 'success',
          })
        } else {
          this.init({
            message: 'Failed to generate PDF',
            color: 'danger',
          })
        }
      } catch (error) {
        console.error('Error downloading PDF:', error)
        this.init({
          message: 'Error downloading PDF',
          color: 'danger',
        })
      }
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
          fromPackage: false,
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

    incrementQuantity(index: number) {
      if (this.speciesObjects[index]) {
        this.speciesObjects[index].quantity++
      }
    },

    decrementQuantity(index: number) {
      if (this.speciesObjects[index] && this.speciesObjects[index].quantity > 1) {
        this.speciesObjects[index].quantity--
      }
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
        this.seasonsOptions = response.data.map((item: any) => {
          return {
            value: item.id,
            text: item.name,
            selfItem: item, // Include full item data for date range access
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
          text: `${item.package_name || `Package ${item.id}`} - ${item.hunting_type || 'N/A'} (${
            item.season_name || 'No Season'
          })`,
          selfItem: item,
        }))

        console.log('packagesOptions:', this.packagesOptions)
      } else {
        console.log('Error getting price list')
      }
    },

    async populateFormFromPackage() {
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

          // Auto-populate form fields from package data (all fields are editable)
          // Set hunting area
          if (priceListData.sales_package?.area?.name) {
            const areaOption = this.areasOptions.find((a: any) => a.text === priceListData.sales_package.area.name)
            if (areaOption) {
              this.form.area = areaOption
            }
          }

          // Set duration (number of days)
          if (priceListData.price_list_type?.duration) {
            this.form.no_of_days = priceListData.price_list_type.duration
          }

          // Set season date range from price list and populate season dropdown
          if (priceListData.price_list_type?.price_list) {
            const priceList = priceListData.price_list_type.price_list

            // Set the date range constraints for the calendar
            if (priceList.start_date) {
              this.seasonMinDate = new Date(priceList.start_date)
            }
            if (priceList.end_date) {
              this.seasonMaxDate = new Date(priceList.end_date)
            }

            // Create a season display based on the price list dates
            const startDate = new Date(priceList.start_date)
            const endDate = new Date(priceList.end_date)
            const seasonName = `${startDate.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })} - ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`

            // Get the actual season_id from the API response
            const seasonId = priceListData.season_id

            // Try to find matching season in options
            let seasonOption = this.seasonsOptions.find((s: any) => {
              if (s.selfItem?.start_date) {
                const seasonStart = new Date(s.selfItem.start_date)
                return seasonStart.getFullYear() === startDate.getFullYear()
              }
              return false
            })

            // If no match found, create a temporary option for display with actual ID
            if (!seasonOption) {
              seasonOption = {
                value: seasonId,
                text: seasonName,
                selfItem: {
                  start_date: priceList.start_date,
                  end_date: priceList.end_date,
                },
              }
              // Add to options so it can be displayed
              this.seasonsOptions.push(seasonOption)
            }

            this.form.season = seasonOption

            // Pre-populate dates with season start date so calendar opens at the correct month
            if (priceList.start_date) {
              const seasonStartDate = new Date(priceList.start_date)
              this.form.preferred_date = seasonStartDate
              this.form.start_date = seasonStartDate
              this.form.end_date = seasonStartDate
            }
          }

          // Extract species from sales_package.species and add to speciesObjects for editing
          if (priceListData.sales_package?.species && Array.isArray(priceListData.sales_package.species)) {
            // Clear existing species and populate from package
            // Use species_id from the pivot table, or species.id from the nested object
            console.log('Raw species data:', JSON.stringify(priceListData.sales_package.species, null, 2))
            this.speciesObjects = priceListData.sales_package.species.map((item: any) => {
              // Try multiple ways to get the species ID
              const speciesId = item.species_id || item.species?.id || item.id
              console.log('Species item:', item, 'Using species_id:', speciesId)
              return {
                species_id: speciesId,
                name: item.species?.name || item.name || 'Unknown',
                quantity: item.quantity || 0,
                fromPackage: true,
              }
            })

            // Also update store for display purposes
            const speciesList = priceListData.sales_package.species.map((item: any) => ({
              id: item.species_id || item.species?.id || item.id,
              name: item.species?.name || item.name || 'Unknown',
              scientific_name: item.species?.scientific_name || item.scientific_name || 'N/A',
              quantity: item.quantity || 0,
              requested_quantity: 0,
            }))

            settingsStore.salesPackagesSpecies = speciesList

            console.log('Populated species:', this.speciesObjects)

            this.init({
              message: `Loaded ${speciesList.length} species from the selected package. You can now customize all fields.`,
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

    // Function to check if date is allowed (for VaDateInput allowed-days prop)
    checkDateAllowed(date: Date): boolean {
      // If no range is set, allow all dates
      if (!this.seasonMinDate && !this.seasonMaxDate) {
        return true
      }

      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      let isAllowed = true

      if (this.seasonMinDate) {
        const minDate = new Date(this.seasonMinDate)
        minDate.setHours(0, 0, 0, 0)
        if (checkDate < minDate) {
          isAllowed = false
        }
      }

      if (this.seasonMaxDate && isAllowed) {
        const maxDate = new Date(this.seasonMaxDate)
        maxDate.setHours(0, 0, 0, 0)
        if (checkDate > maxDate) {
          isAllowed = false
        }
      }

      return isAllowed
    },

    // Check if a date is within the season date range
    isDateInSeasonRange(date: Date): boolean {
      // If no range is set, allow all dates
      if (!this.seasonMinDate && !this.seasonMaxDate) {
        return true
      }

      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      if (this.seasonMinDate) {
        const minDate = new Date(this.seasonMinDate)
        minDate.setHours(0, 0, 0, 0)
        if (checkDate < minDate) {
          return false
        }
      }

      if (this.seasonMaxDate) {
        const maxDate = new Date(this.seasonMaxDate)
        maxDate.setHours(0, 0, 0, 0)
        if (checkDate > maxDate) {
          return false
        }
      }

      return true
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
      return chargesPer
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
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
