<template>
  <div class="sales-confirmation">
    <!-- Header with Back Button -->
    <div class="card mb-4">
      <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-secondary btn-sm" @click="$emit('go-back')">
            <i class="fa fa-arrow-left me-1"></i> Back
          </button>
          <h1 class="h4 mb-0">SALES CONFIRMATION</h1>
        </div>
        <div class="action-buttons">
          <VaButton
            roud
            preset="secondary"
            class="px-2 py-2 px-md-4 py-md-4 mr-2"
            icon="file_download"
            size="small"
            border-color="primary"
            @click="downloadPdf(salesData.pdf)"
            >Download</VaButton
          >

          <template v-if="salesData?.status?.status === 'pending' || salesData?.status?.status === 'provision_sales'">
            <VaButton
              roud
              preset="secondary"
              border-color="primary"
              class="px-2 py-2"
              icon="check_circle"
              :disabled="disabledConfirmButton"
              size="small"
              @click="showModal"
              >{{ confirmText }}</VaButton
            >
          </template>

          <template v-else-if="salesData?.status?.status === 'confirmed'">
            <VaButton
              roud
              :color="buttonColor"
              class="px-2 py-2 mr-2"
              :disabled="disabledConfirmButton"
              size="small"
              @click="cancel()"
              >{{ confirmText }}</VaButton
            >

            <!-- <VaButton
          roud
          color="success"
          class="px-2 py-2"
          :loading="completingSales"
          :disabled="disabledConfirmButton"
          size="small"
          @click="complete()"
          >Complete</VaButton
        > -->
          </template>
        </div>
      </div>
    </div>

    <!-- Content Card -->
    <div class="card">
      <div class="card-body">
        <!-- Sales Inquiry -->
        <section class="section">
          <h2>Sales Inquiry</h2>
          <div class="details-grid">
            <div><strong>ID:</strong> {{ salesData?.id ?? 'N/A' }}</div>
            <div><strong>Code:</strong> {{ salesData?.sales_inquiry?.code ?? 'N/A' }}</div>
            <div><strong>Created Date:</strong> {{ formatDate(salesData?.created_date) ?? 'N/A' }}</div>
            <div><strong>Remarks:</strong> {{ salesData?.sales_inquiry?.remarks ?? 'None' }}</div>
          </div>
        </section>

        <!-- Status Information -->
        <section class="section">
          <h2>Status Information</h2>
          <div class="details-grid">
            <div><strong>Status ID:</strong> {{ salesData?.status?.id ?? 'N/A' }}</div>
            <div>
              <strong>Status:</strong>
              <VaBadge
                :text="salesData?.status?.status ?? 'N/A'"
                :color="getStatusColor(salesData?.status?.status)"
                class="mr-2"
              />
            </div>
            <div><strong>Created At:</strong> {{ formatDate(salesData?.status?.created_at) ?? 'N/A' }}</div>
            <div><strong>Updated At:</strong> {{ formatDate(salesData?.status?.updated_at) ?? 'N/A' }}</div>
          </div>
        </section>

        <!-- Client Information -->
        <section class="section">
          <h2>Client Information</h2>
          <div class="details-grid">
            <div><strong>Full Name:</strong> {{ salesData?.sales_inquiry?.entity?.full_name ?? 'N/A' }}</div>
            <div><strong>Email:</strong> {{ getContactByType(1)?.contact ?? 'N/A' }}</div>
            <div><strong>Phone:</strong> {{ getContactByType(4)?.contact ?? 'N/A' }}</div>
            <div><strong>Address:</strong> {{ getContactByType(3)?.contact ?? 'N/A' }}</div>
            <div><strong>Nationality:</strong> {{ salesData?.sales_inquiry?.entity?.nationality?.name ?? 'N/A' }}</div>
            <div><strong>Country:</strong> {{ salesData?.sales_inquiry?.entity?.country?.name ?? 'N/A' }}</div>
            <div><strong>Category:</strong> {{ salesData?.sales_inquiry?.entity?.category?.name ?? 'N/A' }}</div>
            <div>
              <strong>Sub-category:</strong> {{ salesData?.sales_inquiry?.entity?.sub_category?.name ?? 'N/A' }}
            </div>
          </div>
        </section>

        <!-- Client Preferences -->
        <section class="section">
          <h2>Client Preferences</h2>
          <div class="details-grid">
            <div>
              <strong>No. of Hunters:</strong> {{ salesData?.sales_inquiry?.preference?.no_of_hunters ?? 'N/A' }}
            </div>
            <div>
              <strong>No. of Observers:</strong> {{ salesData?.sales_inquiry?.preference?.no_of_observers ?? 'N/A' }}
            </div>
            <div><strong>No. of Days:</strong> {{ salesData?.sales_inquiry?.preference?.no_of_days ?? 'N/A' }}</div>
            <div>
              <strong>No. of Companions:</strong> {{ salesData?.sales_inquiry?.preference?.no_of_companions ?? 'N/A' }}
            </div>
            <div>
              <strong>Preferred Date:</strong>
              {{ formatDate(salesData?.sales_inquiry?.preference?.preferred_date) ?? 'N/A' }}
            </div>
            <div>
              <strong>Special Requests:</strong> {{ salesData?.sales_inquiry?.preference?.special_requests ?? 'None' }}
            </div>
          </div>
        </section>

        <!-- Preferred Species Table -->
        <section class="section">
          <h2>Preferred Species</h2>
          <div class="va-table-responsive">
            <table class="va-table va-table--hoverable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Scientific Name</th>
                  <th>Quantity</th>
                  <!-- <th>Description</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="species in salesData?.sales_inquiry?.preferred_species ?? []" :key="species.id">
                  <td>{{ species.species?.name ?? 'N/A' }}</td>
                  <td>{{ species.species?.scientific_name ?? 'N/A' }}</td>
                  <td>{{ species.quantity ?? 'N/A' }}</td>
                  <!-- <td>{{ species.species?.description ?? 'N/A' }}</td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Area Information -->
        <section class="section">
          <h2>Area Information</h2>
          <div class="details-grid">
            <div><strong>Area Name:</strong> {{ salesData?.sales_inquiry?.area[0]?.area?.name ?? 'N/A' }}</div>
            <div><strong>Description:</strong> {{ salesData?.sales_inquiry?.area[0]?.area?.description ?? 'N/A' }}</div>
          </div>
        </section>

        <!-- Itinerary -->
        <section class="section">
          <h2>Itinerary</h2>
          <div class="details-grid">
            <div><strong>Airport Name:</strong> {{ salesData?.itinerary?.airport_name ?? 'N/A' }}</div>
            <div><strong>Arrival:</strong> {{ formatDate(salesData?.itinerary?.arrival) ?? 'N/A' }}</div>
            <div><strong>Charter In:</strong> {{ formatDate(salesData?.itinerary?.charter_in) ?? 'N/A' }}</div>
            <div><strong>Charter Out:</strong> {{ formatDate(salesData?.itinerary?.charter_out) ?? 'N/A' }}</div>
          </div>
        </section>

        <!-- Installments -->
        <section class="section">
          <h2>Installments</h2>
          <VaDataTable :items="salesData?.installments ?? []" :columns="columns" hoverable striped />
        </section>

        <!-- Proposed Package -->
        <section class="section">
          <h2>Proposed Package</h2>
          <div class="details-grid">
            <div><strong>Name:</strong> {{ salesData?.proposed_package?.sales_package?.name ?? 'N/A' }}</div>
            <div>
              <strong>Description:</strong> {{ salesData?.proposed_package?.sales_package?.description ?? 'N/A' }}
            </div>
            <div><strong>Amount:</strong> {{ salesData?.proposed_package?.price_list_type?.amount ?? 'N/A' }}</div>
            <div>
              <strong>Duration (days):</strong> {{ salesData?.proposed_package?.price_list_type?.duration ?? 'N/A' }}
            </div>
            <div>
              <strong>Hunting Type:</strong>
              {{ salesData?.proposed_package?.price_list_type?.hunting_type?.name ?? 'N/A' }}
            </div>
          </div>
          <h3>Species Included</h3>
          <ul class="species-list">
            <li v-for="species in salesData?.proposed_package?.sales_package?.species ?? []" :key="species.id">
              {{ species.species?.name ?? 'N/A' }} ({{ species.species?.scientific_name ?? 'N/A' }}):
              <strong>{{ species.amount ?? 'N/A' }}</strong>
            </li>
          </ul>
        </section>

        <!-- Price Breakdown -->
        <section class="section">
          <h2>Price Breakdown</h2>
          <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
            <div>
              <strong>Total Amount:</strong>
              {{ salesData?.price_break_down?.total_amount?.currency?.symbol ?? 'N/A' }}
              {{ salesData?.price_break_down?.total_amount?.amount ?? 'N/A' }}
            </div>
            <div>
              <strong>Companion Cost:</strong>
              <div>
                Number of Companions:
                {{ salesData?.price_break_down?.companion_cost_details?.number_of_companions ?? 'N/A' }}
              </div>
              <div>
                Cost per Companion:
                {{ salesData?.price_break_down?.companion_cost_details?.cost_per_companion?.currency?.symbol ?? 'N/A' }}
                {{ salesData?.price_break_down?.companion_cost_details?.cost_per_companion?.amount ?? 'N/A' }}
              </div>
              <div>
                Total Companion Cost:
                {{
                  salesData?.price_break_down?.companion_cost_details?.total_companion_cost?.currency?.symbol ?? 'N/A'
                }}
                {{ salesData?.price_break_down?.companion_cost_details?.total_companion_cost?.amount ?? 'N/A' }}
              </div>
            </div>
            <div>
              <strong>Observer Cost:</strong>
              <div>
                Number of Observers:
                {{ salesData?.price_break_down?.observer_cost_details?.number_of_observers ?? 'N/A' }}
              </div>
              <div>
                Cost per Observer:
                {{ salesData?.price_break_down?.observer_cost_details?.cost_per_observer?.currency?.symbol ?? 'N/A' }}
                {{ salesData?.price_break_down?.observer_cost_details?.cost_per_observer?.amount ?? 'N/A' }}
              </div>
              <div>
                Total Observer Cost:
                {{ salesData?.price_break_down?.observer_cost_details?.total_observer_cost?.currency?.symbol ?? 'N/A' }}
                {{ salesData?.price_break_down?.observer_cost_details?.total_observer_cost?.amount ?? 'N/A' }}
              </div>
            </div>
          </div>
          <!-- more information -->
          <!-- h2 -->
          <VaDivider class="my-4" />

          <h2 class="text-center text-lg font-bold">MORE INFORMATION</h2>

          <VaDivider class="my-4" />
          <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
            <div class="flex flex-col md:flex-row gap-2 justify-start">
              <VaTitle class="font-bold">Companions</VaTitle>
            </div>
            <VaButton size="small" preset="secondary" round border-color="primary" @click="_shCMd = !_shCMd">
              Add companions
            </VaButton>
          </div>
          <VaDataTable :items="companions" hoverable striped />

          <VaDivider class="my-4" />

          <h2 class="text-center text-lg font-bold">Safari Extras</h2>
          <VaDivider class="my-4 va-divider--dashed" />
          <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
            <div class="flex flex-col md:flex-row gap-2 justify-start">
              <p><strong>Observers</strong></p>
            </div>
            <VaButton size="small" round preset="secondary" border-color="primary" @click="_shOMd = !_shOMd">
              Add observers
            </VaButton>
          </div>
          <VaDataTable :items="observers" hoverable striped />
          <VaDivider class="my-4" />
          <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
            <div class="flex flex-col md:flex-row gap-2 justify-start">
              <p><strong>Safari Extras services</strong></p>
            </div>

            <VaButton
              preset="primary"
              class="mr-2 mb-2"
              border-color="primary"
              round
              icon="add"
              size="small"
              @click="_showSafariExtrasModal()"
            >
              Add Extras
            </VaButton>
          </div>

          <VaDataTable :items="clientSafariExtras" hoverable striped />
        </section>
      </div>
    </div>

    <!-- <VaInnerLoading :loading="loading"> -->
    <VaModal
      v-model="isOpened"
      :overlay="true"
      size="large"
      no-outside-dismiss
      :hide-default-actions="true"
      :close-button="true"
    >
      <VaProgressBar v-if="loading" :indeterminate="loading" class="mb-4 mt-6" />

      <template v-if="salesData?.status?.status == 'pending'">
        <div class="flex flex-row">
          <VaCheckbox
            v-model="selection"
            :disabled="true"
            array-value="provision_sales"
            label="Signed Contract"
            class="mb-6"
          />
          <VaCheckbox v-model="selection" array-value="confirm" label="Payment Document" class="mb-6" />
        </div>

        <div class="flex flex-col">
          <div class="flex flex-row mb-4">
            <template v-if="selection.includes('provision_sales')">
              <div class="flex-1">
                <VaFileUpload
                  v-model="file"
                  dropzone
                  upload-button-text="Upload Signed Contract"
                  drop-zone-text=""
                  color="secondary"
                  file-types="application/pdf"
                  :max-size="1000000"
                  :max-files="1"
                />
              </div>
            </template>

            <template v-if="selection.includes('confirm')">
              <div class="flex-1">
                <VaFileUpload
                  v-model="payfile"
                  upload-button-text="Upload Payment Document"
                  dropzone
                  color="secondary"
                  drop-zone-text=""
                  file-types="application/pdf"
                  :max-size="1000000"
                  :max-files="1"
                />
              </div>
            </template>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="selection.includes('confirm')" class="mb-2">
              <VaDateInput v-model="paymentForm.date" label="Transaction Date" placeholder="Enter Transaction Date" />
            </div>

            <div v-if="selection.includes('confirm')" class="mb-2">
              <VaSelect
                v-model="paymentForm.accountType"
                :options="accountsOption"
                label="Account"
                placeholder="Select Account"
              />
            </div>

            <div v-if="selection.includes('confirm')" class="mb-2">
              <VaInput
                v-model="paymentForm.reference_number"
                label="Reference Number"
                type="text"
                placeholder="Enter Reference Number"
              />
            </div>

            <div class="mb-3">
              <VaInput v-model="paymentForm.amount" label="Amount" type="text" placeholder="Enter Amount" />
            </div>
            <div class="mb-2">
              <VaSelect
                v-model="paymentForm.currency_id"
                :options="currencyOptions"
                label="Currency"
                placeholder="Select Currency"
              />
            </div>
          </div>

          <VaTextarea
            v-model="paymentForm.narration"
            label="Narration"
            type="text"
            placeholder="Enter Narration"
            class="w-full h-full"
          />
        </div>
      </template>

      <template v-else-if="salesData?.status?.status == 'provision_sales'">
        <VaFileUpload
          v-model="payfile"
          upload-button-text="Upload Payment Document"
          dropzone
          color="secondary"
          drop-zone-text=""
          file-types="application/pdf"
          :max-size="1000000"
          :max-files="1"
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="mb-2">
            <VaSelect
              v-model="paymentForm.accountType"
              :options="accountsOption"
              label="Account"
              placeholder="Select Account"
            />
          </div>

          <div class="mb-3">
            <VaInput v-model="paymentForm.amount" label="Amount" type="text" placeholder="Enter Amount" />
          </div>
          <div class="mb-2">
            <VaSelect
              v-model="paymentForm.currency_id"
              :options="currencyOptions"
              label="Currency"
              placeholder="Select Currency"
            />
          </div>

          <div class="mb-2">
            <VaDateInput v-model="paymentForm.date" label="Transaction Date" placeholder="Enter Transaction Date" />
          </div>

          <div class="mb-2">
            <VaInput
              v-model="paymentForm.reference_number"
              label="Reference Number"
              type="text"
              placeholder="Enter Reference Number"
            />
          </div>
          <VaTextarea
            v-model="paymentForm.narration"
            label="Narration"
            type="text"
            placeholder="Enter Narration"
            class="w-full h-full"
          />
        </div>
      </template>

      <div>
        <VaButton :disabled="loading" class="mt-2" @click="submit">Save</VaButton>
      </div>
    </VaModal>

    <VaModal v-model="_shCMd" :close-button="true" :hide-default-actions="true">
      <!-- <ObserversForm :sales-inquiry-id="item.id"> </ObserversForm>
      </section> -->

      <CompanionForm :sales-inquiry-id="salesData?.sales_inquiry.id"> </CompanionForm>
    </VaModal>

    <VaModal v-model="_shOMd" :close-button="true" :hide-default-actions="true">
      <ObserversForm :sales-inquiry-id="salesData?.sales_inquiry.id"> </ObserversForm>
    </VaModal>

    <VaModal v-model="_shM" width="60%" height="80%" :hide-default-actions="true">
      <SafariExtrasList :table-selectable="true" :item="salesData.sales_inquiry" />
    </VaModal>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState, mapWritableState } from 'pinia'
import { defineComponent } from 'vue'
import { useSettingsStore } from '../../../../stores/settings-store'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import handleErrors from '../../../../utils/errorHandler'
import getStatusColor from '../../../../utils/status_color'
import { useAccountsStore } from '../../../../stores/account-store'
import { format } from 'date-fns'
import downloadPdf from '../../../../utils/pdfDownloader'
import CompanionForm from './CompanionForm.vue'
import ObserversForm from './ObserversForm.vue'
import SafariExtrasList from './SalesClientSafariExtrasForm.vue'

export default defineComponent({
  components: {
    CompanionForm,
    ObserversForm,
    SafariExtrasList,
  },

  props: {
    salesData: {
      type: Object,
      required: true,
    },
  },
  emits: ['download-confirmation', 'go-back'],
  data() {
    // Description, Amount Due, Days, Due Limit, and Status Columns
    const columns = [
      { key: 'narration', label: 'Description' },
      { key: 'amount_due', label: 'Amount Due (USD)' },
      { key: 'due_days', label: 'Days' }, // Added days
      { key: 'amount_due_type', label: 'Due Type' },
      { key: 'due_days_type', label: 'Due Type' },
    ]

    return {
      columns,
      isOpened: false,
      file: [],
      payfile: [],
      docType: null as any,
      docTypes: [],
      confirmText: 'Confirm',
      disabledConfirmButton: false,
      selection: ['provision_sales'],
      paymentForm: {
        currency_id: null as any,
        date: null as any,
        accountType: null as any,
        reference_number: null as any,
        amount: this.salesData?.price_break_down?.total_amount?.amount,
        narration: '',
      },
      buttonColor: 'primary',
      createDRTransaction: false,
      createCRTransaction: false,
      completingSales: false,
      // showComModal: false,
      // showObModal: false,

      downloadPdf,

      statusOptions: [
        { value: 'provision_sales', text: 'Confirmed, but no disposit yet' },
        { value: 'confirmed', text: 'Confirmed, With a disposit' },
        { value: 'declined', text: 'Declined' },
        { value: 'cancelled', text: 'Cancelled' },
        { value: 'completed', text: 'Completed' },
      ],
      getStatusColor,
      files: [] as any[],
      status: '',
      loading: false,
      transaction_type: '',
      accountsOption: [
        {
          value: 'CASH_IN_HAND',
          text: 'Cash in Hand',
        },
        {
          value: 'BANK',
          text: 'Bank trasfer',
        },
        // {
        //   value: 'DEBTOR_ACCOUNT',
        //   text: 'Debtor Account',
        // },
      ] as any,
      currencyOptions: [
        {
          value: 1,
          text: 'USD',
        },
        {
          value: 2,
          text: 'Tsh',
        },
      ],
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['observers', 'companions', 'clientSafariExtras']),
    ...mapWritableState(useSalesInquiriesStore, {
      _shM: 'showSafariExtrasModal',
    }),

    ...mapWritableState(useSalesInquiriesStore, { _shOMd: 'showObserversModal' }),
    ...mapWritableState(useSalesInquiriesStore, { _shCMd: 'showCompanionsModal' }),
  },
  mounted() {
    // this.getDocTypeOptions()
    this.showConfirmButtonTextByStatus()
    this.getObservers(this.salesData.sales_inquiry.id)
    this.getCompanions(this.salesData.sales_inquiry.id)
    this.getClienSafariExtras(this.salesData.sales_inquiry.id)
  },
  methods: {
    ...mapActions(useSettingsStore, ['getDocTypes']),
    ...mapActions(useSalesInquiriesStore, ['updatesalesConfirmationStatus']),
    ...mapActions(useAccountsStore, ['createCRDRTransaction', 'createDRCRTransaction']),
    ...mapActions(useSalesInquiriesStore, ['getObservers', 'getCompanions']),
    ...mapActions(useSalesInquiriesStore, ['createsafariExtras', 'getClienSafariExtras']),

    getContactByType(type: any) {
      return this.salesData.sales_inquiry.entity.contacts.find((contact: any) => contact.contact_type === type)
    },
    formatDate(dateString: any) {
      const options: any = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },
    _showSafariExtrasModal() {
      this._shM = true
    },

    downloadConfirmation() {
      this.$emit('download-confirmation', this.salesData)
    },

    async complete() {
      this.status = 'completed'
      this.completingSales = true
      await this.completeOrCancel('Sales Confirmation Completed.')
    },

    async completeOrCancel(displayMessage: any) {
      const payload = {
        entityId: this.salesData.sales_inquiry.entity.id,
        contractDoc: this.file[0],
        paymentDoc: this.payfile[0],
        salesConfirmationProposalId: this.salesData.id,
        statusId: this.status,
        quotaId: this.salesData?.proposed_package?.sales_package?.sales_quota?.id,
        areaId: this.salesData.sales_inquiry.area[0].area.id,
      }
      try {
        const response = await this.updatesalesConfirmationStatus(payload)
        if (response.status === 200) {
          this.isOpened = false
          this.loading = false
          this.$vaToast.init({
            message: displayMessage,
            color: 'success',
          })
          this.completingSales = false
        } else {
          this.$vaToast.init({
            message: 'Failed to process the request',
            color: 'danger',
          })
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        if (errors.length > 0) {
          this.loading = false
          this.completingSales = true

          this.$vaToast.init({
            message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
            color: 'danger',
          })
        }
      }
    },

    async cancel() {
      const confirm = await this.$vaModal.confirm('Are you sure you want to cancel this sales?')
      if (confirm) {
        this.status = 'cancelled'
        await this.completeOrCancel('Sales Confirmation Cancelled.')
      }
    },

    handleTransactionTypeStatus(selection: string[], file: any, payfile: any): void {
      this.loading = true

      const fileExists = (fileToCheck: any) => this.files.some((existingFile: any) => existingFile.file === fileToCheck)
      if (this.salesData.status.status === 'pending') {
        // Check for both provision sales and payment document selection
        if (selection.includes('provision_sales') && selection.includes('confirm') && selection.length === 2) {
          this.status = 'confirmed'
          this.transaction_type = 'RECEIPT'

          this.createCRTransaction = true

          if (file[0] === undefined && payfile[0] === undefined) {
            // this.paymentDocRequired = true
            this.$vaToast.init({
              message: 'Please upload both Signed Contract and Payment Document',
              color: 'danger',
            })
            this.loading = false
            throw new Error('Please upload both Signed Contract and Payment Document')
          }

          // Check for only provision sales selection
        } else if (selection.includes('provision_sales') && selection.length === 1) {
          this.status = 'provision_sales'
          this.transaction_type = 'SALES_INVOICE'
          this.createDRTransaction = true

          //  console all files
          console.log('File:', file[0])
          console.log('Payfile:', payfile[0])

          if (file[0] === undefined) {
            this.$vaToast.init({
              message: 'Please upload Signed Contract',
              color: 'danger',
            })
            this.loading = false

            throw new Error('Please upload Signed Contract')
          }

          // Check for only payment confirmation selection
        } else if (selection.includes('confirm') && selection.length === 1) {
          this.status = 'confirmed'
          this.transaction_type = 'RECEIPT'
          this.createCRTransaction = true

          if (payfile[0] === undefined) {
            this.$vaToast.init({
              message: 'Please upload Payment Document',
              color: 'danger',
            })
            this.loading = false

            throw new Error('Please upload Payment Document')
          }
        }

        // Handle if the status is already provision_sales
      } else if (this.salesData.status.status === 'provision_sales' && !fileExists(payfile[0])) {
        this.status = 'confirmed'
        this.transaction_type = 'RECEIPT'
        this.createCRTransaction = true

        if (payfile[0] === undefined) {
          this.$vaToast.init({
            message: 'Please upload Payment Document',
            color: 'danger',
          })
          this.loading = false

          throw new Error('Please upload Payment Document')
        }
      }
    },

    async submit() {
      try {
        this.handleTransactionTypeStatus(this.selection, this.file, this.payfile)
      } catch (error: any) {
        console.error('Error:', error)
        this.loading = false
        return
      }

      const transactionPayload = {
        // optional for  Dr transaction
        date: format(this.paymentForm.date, 'yyyy-MM-dd') ?? null,
        account_type: this.paymentForm?.accountType?.value ?? 'SALES_ACCOUNT',
        reference_number: this.paymentForm.reference_number ?? null,

        currency_id: this.paymentForm.currency_id.value,
        transaction_type: this.transaction_type,
        amount: this.paymentForm.amount,
        narration: this.paymentForm.narration,
        accountable_id: this.salesData.sales_inquiry.entity.id,
        accountable_type_id: this.salesData.sales_inquiry.entity.category.id,
        sales_confirmation_id: this.salesData.id,
      }

      const payload = {
        entityId: this.salesData.sales_inquiry.entity.id,
        contractDoc: this.file[0],
        paymentDoc: this.payfile[0],
        salesConfirmationProposalId: this.salesData.id,
        statusId: this.status,
        // quotaId: this.salesData.proposed_package.sales_package.sales_quota?.id,
        areaId: this.salesData.sales_inquiry.area[0].area.id,
      }

      try {
        if (this.createCRTransaction) {
          const response = await this.updatesalesConfirmationStatus(payload)

          if (response.status === 200) {
            // Create the transaction
            const transactionResponse = await this.createCRDRTransaction(transactionPayload)
            // Wait for this API call to finish

            // Now check if the transaction was successful
            if (transactionResponse.status === 201) {
              this.isOpened = false
              this.loading = false
              this.$vaToast.init({
                message: transactionResponse.data.message,
                color: 'success',
              })

              // Optional additional API call here if needed
              // e.g. await this.callAnotherAPI();
            } else {
              this.$vaToast.init({
                message: 'Failed to create transaction',
                color: 'danger',
              })
            }
          } else {
            this.$vaToast.init({
              message: 'Failed to update Sales',
              color: 'danger',
            })
          }
        } else if (this.createDRTransaction) {
          // Similar logic for DR transaction creation
          const response = await this.updatesalesConfirmationStatus(payload)

          if (response.status === 200) {
            const drcrResponse = await this.createDRCRTransaction(transactionPayload)

            await this.delay(1000) // Optional delay before creating transaction if needed
            if (drcrResponse.status === 201) {
              this.isOpened = false
              this.loading = false
              this.$vaToast.init({
                message: drcrResponse.data.message,
                color: 'success',
              })
              // Optional additional API call here if needed
              // e.g. await this.callAnotherAPI();
            } else {
              this.$vaToast.init({
                message: 'Failed to create transaction',
                color: 'danger',
              })
            }
          } else {
            this.$vaToast.init({
              message: 'Failed to update Sales',
              color: 'danger',
            })
          }
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        this.loading = false
        if (errors.length > 0) {
          this.$vaToast.init({
            message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
            color: 'danger',
          })
        } else {
          error.message &&
            this.$vaToast.init({
              message: error.message,
              color: 'danger',
            })
        }
      }
    },

    // Helper function to create a delay
    delay(ms: any) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },

    // Function to call another API

    showConfirmButtonTextByStatus() {
      switch (this.salesData.status.status) {
        case 'confirmed':
          this.confirmText = 'Cancel Now'
          this.disabledConfirmButton = false
          this.buttonColor = 'danger'
          break
        case 'completed':
          this.confirmText = 'Sales Done'
          this.disabledConfirmButton = true
          break
        case 'declined':
          this.confirmText = 'Confirm and Decline'
          this.disabledConfirmButton = false
          break
        case 'cancelled':
          this.confirmText = 'Confirm and Cancel'
          this.disabledConfirmButton = false
          break
        case 'provision_sales':
          this.confirmText = 'Confirm a Provision Sales'
          this.disabledConfirmButton = false
          break
        default:
          this.confirmText = 'Confirm'
          break

        // case 'provision_sales':
        //   this.confirmText = 'Confirm and Provision Sales'
      }
    },

    async getDocTypeOptions() {
      try {
        const response = await this.getDocTypes()

        // Log the response to see the structure
        console.log('Response from getDocTypes:', response)

        if (response.status === 200) {
          // Update the docTypes array
          const docTypesArray = response.data.map((docType: any) => ({
            value: docType.id,
            text: docType.name,
          }))

          // Log the docTypes array to verify the mapping
          console.log('Mapped docTypes:', docTypesArray)

          // Update the component's data property
          this.docTypes = docTypesArray
        } else {
          console.error('Failed to fetch document types: ', response)
        }
      } catch (error) {
        console.error('Error fetching document types: ', error)
      }
    },

    showModal() {
      this.isOpened = true
    },

    // getStatus(
  },
})
</script>

<style scoped>
.sales-confirmation {
  font-family: 'Arial', sans-serif;
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  /* background-color: #f9f9f9; */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.action-buttons {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  margin-bottom: 20px;
}

.section {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

h2 {
  font-size: 20px;
  color: #444;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.va-table-responsive {
  overflow-x: auto;
}

.va-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.va-table th,
.va-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.va-table th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: bold;
}

.installments-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.installments-table th,
.installments-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.installments-table th {
  background-color: #f2f2f2;
  color: #333;
  font-weight: bold;
}

.installments-table tr:hover {
  background-color: #f1f1f1;
}
</style>
