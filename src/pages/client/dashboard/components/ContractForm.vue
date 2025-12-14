<template>
  <VaInnerLoading :loading="loadingSales">
    <VaCard square outlined class="contract-form-card">
      <div class="form-header flex items-start gap-4 p-4">
        <div
          class="header-icon bg-primary-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 8H21L16.5 12L18.5 18L12 14L5.5 18L7.5 12L3 8H9L12 2Z" fill="currentColor" />
          </svg>
        </div>
        <div class="header-text">
          <div class="text-2xl font-semibold">Create Contract</div>
          <div class="text-sm text-muted">
            Create a contract for a completed sales confirmation. Upload required documents below.
          </div>
        </div>
      </div>
      <VaCardContent class="p-6">
        <VaForm ref="iformRef" class="space-y-6">
          <!-- Sales Confirmation Selection -->
          <div class="mb-6">
            <VaSelect
              v-model="form.proposal"
              :options="proposalOptions"
              :rules="[(value: any) => value || 'Sales confirmation is required']"
              placeholder="Select sales confirmation"
              label="Sales Confirmation"
              class="mb-4"
              @update:modelValue="onValueChange"
            />

            <!-- Enhanced Proposal Details Card -->
            <div v-if="salesItem" class="proposal-details-card mt-4">
              <div class="details-header">
                <h3 class="details-title">Sales Confirmation Details</h3>
                <div class="status-badge" :class="getStatusClass(salesItem)">
                  {{ getStatusText(salesItem) }}
                </div>
              </div>

              <div class="details-content">
                <!-- Client Information Section -->
                <div class="info-section">
                  <h4 class="section-title">
                    <svg
                      class="section-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                    Client Information
                  </h4>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Full Name:</span>
                      <span class="info-value">{{ salesItem.client?.full_name || '-' }}</span>
                    </div>
                    <div v-if="salesItem.client?.email" class="info-item">
                      <span class="info-label">Email:</span>
                      <span class="info-value">{{ salesItem.client.email }}</span>
                    </div>
                    <div v-if="salesItem.client?.country" class="info-item">
                      <span class="info-label">Country:</span>
                      <span class="info-value">{{ salesItem.client.country }}</span>
                    </div>
                    <div v-if="salesItem.client?.nationality" class="info-item">
                      <span class="info-label">Nationality:</span>
                      <span class="info-value">{{ salesItem.client.nationality }}</span>
                    </div>
                    <div v-if="salesItem.client?.cell" class="info-item">
                      <span class="info-label">Phone:</span>
                      <span class="info-value">{{ salesItem.client.cell }}</span>
                    </div>
                  </div>
                </div>

                <!-- Hunting Trip Information Section -->
                <div class="info-section">
                  <h4 class="section-title">
                    <svg
                      class="section-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    Hunting Trip Details
                  </h4>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Hunting Area:</span>
                      <span class="info-value">{{ salesItem.hunting_trip?.hunting_area || '-' }}</span>
                    </div>
                    <div v-if="salesItem.hunting_trip?.type" class="info-item">
                      <span class="info-label">Safari Type:</span>
                      <span class="info-value">{{ salesItem.hunting_trip.type }}</span>
                    </div>
                    <div v-if="salesItem.hunting_trip?.outfitter" class="info-item">
                      <span class="info-label">Outfitter:</span>
                      <span class="info-value">{{ salesItem.hunting_trip.outfitter }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Dates:</span>
                      <span class="info-value">{{
                        salesItem.hunting_trip?.dates || salesItem.confirmation_date_formatted || '-'
                      }}</span>
                    </div>
                    <div
                      v-if="salesItem.hunting_trip?.start_date && salesItem.hunting_trip?.end_date"
                      class="info-item"
                    >
                      <span class="info-label">Start Date:</span>
                      <span class="info-value">{{ formatDate(salesItem.hunting_trip.start_date) }}</span>
                    </div>
                    <div v-if="salesItem.hunting_trip?.end_date" class="info-item">
                      <span class="info-label">End Date:</span>
                      <span class="info-value">{{ formatDate(salesItem.hunting_trip.end_date) }}</span>
                    </div>
                    <div v-if="salesItem.hunting_trip?.no_of_days" class="info-item">
                      <span class="info-label">Duration:</span>
                      <span class="info-value">{{ salesItem.hunting_trip.no_of_days }} days</span>
                    </div>
                  </div>
                </div>

                <!-- Species & Participants Section -->
                <div class="info-section">
                  <h4 class="section-title">
                    <svg
                      class="section-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                      <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="currentColor" />
                    </svg>
                    Species & Participants
                  </h4>
                  <div class="info-grid">
                    <div v-if="getSpeciesList().length > 0" class="info-item">
                      <span class="info-label">Species:</span>
                      <div class="species-tags">
                        <span v-for="(species, idx) in getSpeciesList()" :key="idx" class="species-tag">
                          {{ species }}
                        </span>
                      </div>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Hunters:</span>
                      <span class="info-value">{{ salesItem.trip_details?.no_of_hunters || '-' }}</span>
                    </div>
                    <div
                      v-if="salesItem.companion_observer?.no_of_companions || salesItem.trip_details?.no_of_companions"
                      class="info-item"
                    >
                      <span class="info-label">Companions:</span>
                      <span class="info-value">{{
                        salesItem.companion_observer?.no_of_companions ||
                        salesItem.trip_details?.no_of_companions ||
                        '-'
                      }}</span>
                    </div>
                    <div
                      v-if="salesItem.companion_observer?.no_of_observers || salesItem.trip_details?.no_of_observers"
                      class="info-item"
                    >
                      <span class="info-label">Observers:</span>
                      <span class="info-value">{{
                        salesItem.companion_observer?.no_of_observers || salesItem.trip_details?.no_of_observers || '-'
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Pricing Information Section -->
                <div v-if="salesItem.pricing" class="info-section">
                  <h4 class="section-title">
                    <svg
                      class="section-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 10.65 8.2 11.96 11 12.58C13.5 13.11 14.2 13.85 14.2 14.9C14.2 15.91 13.36 16.75 11.5 16.75C9.45 16.75 8.7 15.81 8.6 14.5H6.39C6.5 16.47 7.88 17.9 10 18.29V21H13V18.33C14.95 17.9 16.5 16.66 16.5 14.7C16.5 12.36 14.47 11.1 11.8 10.9Z"
                        fill="currentColor"
                      />
                    </svg>
                    Pricing Information
                  </h4>
                  <div class="info-grid">
                    <div class="info-item pricing-highlight">
                      <span class="info-label">Total Amount:</span>
                      <span class="info-value price-value">
                        {{ salesItem.pricing.currency || '' }} {{ formatNumber(salesItem.pricing.total_amount) }}
                      </span>
                    </div>
                    <div
                      v-if="salesItem.pricing.installments && salesItem.pricing.installments.length > 0"
                      class="info-item"
                    >
                      <span class="info-label">Installments:</span>
                      <span class="info-value">{{ salesItem.pricing.installments.length }} payment(s)</span>
                    </div>
                  </div>
                </div>

                <!-- Additional Information -->
                <div
                  v-if="salesItem.sales_inquiry || salesItem.confirmation_date_formatted || salesItem.hunting_license"
                  class="info-section"
                >
                  <h4 class="section-title">
                    <svg
                      class="section-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z"
                        fill="currentColor"
                      />
                    </svg>
                    Additional Information
                  </h4>
                  <div class="info-grid">
                    <div v-if="salesItem.sales_inquiry?.code" class="info-item">
                      <span class="info-label">Sales Inquiry Code:</span>
                      <span class="info-value">{{ salesItem.sales_inquiry.code }}</span>
                    </div>
                    <div v-if="salesItem.sales_inquiry?.season" class="info-item">
                      <span class="info-label">Season:</span>
                      <span class="info-value">{{ salesItem.sales_inquiry.season }}</span>
                    </div>
                    <div v-if="salesItem.confirmation_date_formatted" class="info-item">
                      <span class="info-label">Confirmation Date:</span>
                      <span class="info-value">{{ salesItem.confirmation_date_formatted }}</span>
                    </div>
                    <div v-if="salesItem.hunting_license" class="info-item">
                      <span class="info-label">Hunting License:</span>
                      <span class="info-value">{{ salesItem.hunting_license }}</span>
                    </div>
                    <div v-if="salesItem.remarks" class="info-item">
                      <span class="info-label">Remarks:</span>
                      <span class="info-value">{{ salesItem.remarks }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contract Description Section -->
          <div class="description-section">
            <div class="section-header">
              <h3 class="section-title-large">
                <svg
                  class="section-icon-large"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z"
                    fill="currentColor"
                  />
                </svg>
                Contract Description
              </h3>
              <p class="section-description">
                Provide a detailed description for this contract. This will be pre-filled with sales confirmation
                details, but you can edit it as needed.
              </p>
            </div>

            <div class="description-input-area">
              <VaTextarea
                v-model="form.description"
                label="Description"
                placeholder="Enter contract description..."
                :min-rows="6"
                :max-rows="12"
                counter
                autosize
                required-mark
                :rules="[(v: any) => (v && v.length > 0) || 'Description is required']"
                class="description-textarea"
              />
            </div>
          </div>

          <!-- Document Upload Section - COMMENTED OUT FOR NOW -->
          <!--
            <div class="document-section">
              <div class="section-header">
                <h3 class="section-title-large">
                  <svg class="section-icon-large" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                  </svg>
                  Supporting Documents
                  <span class="required-badge">Required</span>
              </h3>
                <p class="section-description">Upload required documents for contract creation. At least one document must be provided.</p>
              </div>
              
              <div class="document-upload-area">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <VaSelect
                  v-model="form.doc_type"
                  :options="documentTypes"
                  placeholder="Select document type"
                  label="Document Type"
                  searchable
                  highlight-matched-text
                  :rules="[]"
                />
                <VaFileUpload
                  v-model="form.documents"
                    upload-button-text="Choose File"
                  color="secondary"
                  label="Upload Document"
                  dropzone
                  undo
                  size="50mb"
                  file-types="image/jpeg, image/png, image/pdf, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  undo-duration="500"
                  :max-files="1"
                />
              </div>
              <VaButton
                icon="add"
                  size="medium"
                color="secondary"
                :disabled="!form.doc_type || form.documents.length === 0"
                @click="addDocument"
                  class="add-doc-button"
              >
                Add Document
              </VaButton>
              </div>

              <div v-if="form.uploadedDocuments.length > 0" class="documents-list">
                <h4 class="documents-list-title">Added Documents ({{ form.uploadedDocuments.length }})</h4>
                <div class="documents-grid">
                  <div
                    v-for="(doc, index) in form.uploadedDocuments"
                    :key="index"
                    class="document-item"
                  >
                    <div class="document-item-content">
                      <svg class="document-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                      </svg>
                      <div class="document-info">
                        <div class="document-type">{{ doc.type }}</div>
                        <div class="document-name">{{ doc.file.name }}</div>
                        <div class="document-size">{{ formatFileSize(doc.file.size) }}</div>
                  </div>
                </div>
                    <VaButton 
                      preset="plain" 
                      icon="delete" 
                      size="small" 
                      color="danger" 
                      @click="removeDocument(index)"
                      class="remove-doc-button"
                    />
              </div>
              </div>
            </div>
              <div v-else class="documents-warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
                <span>At least one document is required to create the contract</span>
              </div>
            </div>
            -->

          <div class="form-actions">
            <VaButton preset="outline" color="danger" size="medium" class="action-button" @click="handleReset">
              Cancel
            </VaButton>
            <VaButton
              color="primary"
              size="large"
              :disabled="!isValidForm"
              class="action-button primary-action"
              @click="validateForm() && onSubmit()"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="margin-right: 8px"
              >
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor" />
              </svg>
              Create Contract
            </VaButton>
          </div>
        </VaForm>
      </VaCardContent>
    </VaCard>
  </VaInnerLoading>
</template>

<script lang="ts">
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { defineComponent, ref, reactive } from 'vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { mapActions, mapState } from 'pinia'
import { useContractsStore } from '../../../../stores/contracts-store'
import handleErrors from '../../../../utils/errorHandler'

export default defineComponent({
  setup() {
    const { init } = useToast()

    const iformRef = ref(null as any)
    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    const isNotUpBookingSelected = ref(true)

    const onInputChange = (event: any) => {
      console.log(event)
      if (event.value == 'prior' || event.value == 'after') {
        isNotUpBookingSelected.value = false
      }
    }

    const form = reactive({
      proposal: null as any,
      enity_id: null as any,
      description: '',
      doc_type: null as any,
      documents: [] as any,
      uploadedDocuments: [] as any,
    })

    return {
      iformRef,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      form,
      init,
      onInputChange,
      isNotUpBookingSelected,
    }
  },

  data() {
    // Tabs removed - unified contract creation per sales confirmation
    const packages = [] as any
    const documentTypes = [
      {
        text: 'Travel Packet (Passport Copy)',
        value: 'Passport_Copy',
      },
      {
        text: 'Travel Packet (Passport Photo)',
        value: 'Passport_Photo',
      },
      {
        text: 'Visa',
        value: 'Visa',
      },
      {
        text: 'Gun Permits',
        value: 'Gun_Permits',
      },
      {
        text: 'CITES Documentation',
        value: 'CITES_Documentation',
      },
      {
        text: 'Sales Invoice',
        value: 'sales_invoice',
      },
      {
        text: 'Receipt',
        value: 'receipt',
      },
    ]
    return {
      packages,
      installments: [] as any,
      regulatoryPackages: [] as any,
      proposalOptions: [] as any,
      documentTypes,
      loadingSales: false,
      salesItem: null as any,
      // no tabs or value needed
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['companions']),
  },

  mounted() {
    this.getSalesProposalOptions()
  },

  methods: {
    ...mapActions(useContractsStore, ['createContract']),
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation', 'getSalesConfirmationProposals']),

    ...mapActions(useSalesInquiriesStore, ['getCompanions']),
    onValueChange(value: any) {
      if (!value) return

      // The VaSelect may return either the option object or just the value (id).
      // Normalize to an option object so we can read the underlying proposal (`selfitem`).
      let selectedOption: any = null
      // If the select gives us the full option object
      if (typeof value === 'object' && (value.selfitem || value.value)) {
        selectedOption = value
      } else if (typeof value === 'number' || typeof value === 'string') {
        // Find the matching option by value
        selectedOption = this.proposalOptions.find((opt: any) => String(opt.value) === String(value)) || null
      }

      const selectedItem = selectedOption?.selfitem || selectedOption || null
      console.log('Selected proposal full object:', selectedItem)
      console.log('Entity ID locations - sales_inquiry.entity.id:', selectedItem?.sales_inquiry?.entity?.id)
      console.log('Entity ID locations - entity.id:', selectedItem?.entity?.id)
      console.log('Entity ID locations - client.id:', selectedItem?.client?.id)

      // Normalize the form's proposal value to the option object for easier later use
      if (selectedOption) {
        this.form.proposal = selectedOption
      }

      this.salesItem = selectedItem

      // Populate form with useful sales confirmation info for creating a contract
      const clientName =
        selectedItem?.client?.full_name ||
        selectedItem?.sales_inquiry?.entity?.full_name ||
        selectedItem?.entity?.full_name ||
        selectedItem?.client_name ||
        ''

      if (clientName) {
        this.form.description = this.buildDetailedDescription(selectedItem, clientName)
      }

      // Derive and store entity id on the form for submit
      this.form.enity_id =
        selectedItem?.sales_inquiry?.entity?.id || selectedItem?.entity?.id || selectedItem?.client?.id || null
      // No companion selection in the unified form. If needed, companions can still be fetched
      // but the form always creates a single contract tied to the sales confirmation.
    },
    async onSubmit() {
      // Extract the actual ID value from the selected proposal
      // The proposal form field contains the entire option object with { text, value, selfitem }
      let proposalValue = null
      let selectedProposal = null

      if (this.form.proposal) {
        // If it's an option object with value property
        if (typeof this.form.proposal === 'object' && this.form.proposal.value) {
          proposalValue = this.form.proposal.value
          selectedProposal = this.form.proposal.selfitem
        }
        // If it's already just the ID
        else if (typeof this.form.proposal === 'number') {
          proposalValue = this.form.proposal
        }
      }

      // For unified contract creation, derive entity from the sales confirmation proposal
      const entityValue =
        selectedProposal?.sales_inquiry?.entity?.id ||
        selectedProposal?.entity?.id ||
        selectedProposal?.client?.id ||
        null

      // Validate required fields
      if (!proposalValue) {
        this.init({ message: 'Sales confirmation is required', color: 'warning' })
        return
      }

      if (!selectedProposal || !selectedProposal.id) {
        this.init({
          message: 'Invalid sales confirmation selected. Please select again from the list.',
          color: 'warning',
        })
        return
      }

      // Start/end dates are taken from the sales inquiry; no local validation required

      if (!entityValue) {
        this.init({
          message: 'Entity information is missing. Please select a valid sales confirmation.',
          color: 'warning',
        })
        return
      }

      // No local date comparison needed - backend derives dates from the sales inquiry

      // Document validation commented out - document upload is disabled for now
      // if (!this.form.uploadedDocuments || this.form.uploadedDocuments.length === 0) {
      //   this.init({
      //     message: 'At least one document is required. Please upload a supporting document.',
      //     color: 'warning',
      //   })
      //   return
      // }

      // Ensure the selected proposal is actually completed (defensive check)
      const selStatus = selectedProposal?.status?.status || selectedProposal?.status || ''
      if (String(selStatus).toLowerCase() !== 'completed') {
        this.init({ message: 'Contracts can only be created for completed sales confirmations.', color: 'warning' })
        return
      }

      // Backend automatically gets start_date and end_date from sales inquiry preferences
      // Only need to send: sales_confirmation_proposal_id, entity_id, and description
      const data = {
        sales_confirmation_proposal_id: proposalValue,
        entity_id: entityValue,
        description: this.form.description,
      }

      console.log('Form submission data:', data)
      console.log('Selected proposal object:', selectedProposal)

      try {
        const response: any = await this.createContract(data)
        if (response.status === 201) {
          // Document upload commented out - disabled for now
          // const createdContractId = response.data?.id || response.data?.data?.id
          // if (createdContractId && this.form.uploadedDocuments.length > 0) {
          //   await this.uploadDocumentsForContract(createdContractId)
          // }

          this.init({ message: 'Contract created successfully', color: 'success' })
          // Reset form after successful submission
          this.resetForm()
          this.resetValidationForm()
        }
      } catch (error: any) {
        console.error('Contract creation error:', error)
        console.error('Error response:', error.response)
        console.error('Error message:', error.message)

        const errorData = error.response?.data
        const errorMessage = errorData?.error || errorData?.message || error.message || ''

        // Check if it's a duplicate entry constraint error
        if (errorMessage.includes('Duplicate entry') || errorMessage.includes('constraint')) {
          this.init({
            message:
              'A contract already exists for this sales confirmation and client combination. Please select a different sales confirmation to create a new contract.',
            color: 'danger',
          })
        }
        // Check if it's a foreign key constraint error
        else if (errorMessage.includes('FOREIGN KEY')) {
          this.init({
            message:
              'The selected sales confirmation is no longer available. Please refresh and select a different one.',
            color: 'danger',
          })
          // Reload proposals
          this.getSalesProposalOptions()
        }
        // Handle validation errors
        else if (error.response && error.response.data) {
          const errors = handleErrors(error.response)
          if (errors.length > 0) {
            this.init({
              message: errors.map((err, index) => `${index + 1}. ${err}`).join('\n'),
              color: 'danger',
            })
          } else {
            this.init({
              message: errorMessage || 'Failed to create contract. Please check the form data and try again.',
              color: 'danger',
            })
          }
        }
        // Handle network or other errors
        else {
          this.init({
            message: errorMessage || 'An unexpected error occurred while creating the contract. Please try again.',
            color: 'danger',
          })
        }
      }
    },

    // getCompanions(proposalId: any) {
    //   // TODO: Implement this method
    //   //
    // },

    async getSalesProposalOptions() {
      this.loadingSales = true
      try {
        const response: any = await this.getSalesConfirmationProposals()
        if (response && response.status === 200) {
          this.loadingSales = false
          const data = Array.isArray(response.data) ? response.data : response.data?.data || []
          console.log('Raw proposal data:', data)
          // Only allow proposals whose status is COMPLETED
          const completedProposals = data.filter((item: any) => {
            const status = item?.status?.status || item?.status || ''
            return String(status).toLowerCase() === 'completed'
          })

          this.proposalOptions = completedProposals
            .filter((item: any) => item && item.id)
            .map((item: any) => {
              console.log('Processing item:', item)
              // The API returns client info in item.client.full_name
              let clientName = ''

              if (item.client?.full_name) {
                clientName = item.client.full_name
              } else if (item.sales_inquiry?.entity?.full_name) {
                clientName = item.sales_inquiry.entity.full_name
              } else if (item.entity?.full_name) {
                clientName = item.entity.full_name
              } else if (typeof item.client_name === 'string') {
                clientName = item.client_name
              } else {
                clientName = 'Proposal'
              }

              const proposalId = item.id
              // Only show client name in the select to keep it simple (remove '#ID -')
              const optionText = clientName || `Proposal ${proposalId}`
              console.log('Option text:', optionText)

              return {
                text: optionText,
                value: item.id,
                selfitem: item,
              }
            })
          console.log('Final proposalOptions:', this.proposalOptions)
        } else {
          this.loadingSales = false
        }
      } catch (error) {
        console.error('Error loading sales proposals:', error)
        this.loadingSales = false
      }
    },

    buildDetailedDescription(item: any, clientName = '') {
      if (!item) return clientName || ''

      // Prefer fields actually present on the proposal object
      const huntingTrip = item.hunting_trip || {}
      const pricing = item.pricing || {}
      const huntCombination = Array.isArray(item.hunt_combination) ? item.hunt_combination : []
      const tripDetails = item.trip_details || {}
      const companionObserver = item.companion_observer || {}

      const title = huntCombination[0]?.title || huntCombination[0]?.name || huntingTrip?.type || ''
      const area = huntingTrip?.hunting_area || (huntingTrip?.hunting_areas && huntingTrip.hunting_areas[0]) || ''
      const safariModel = huntingTrip?.type || ''
      const cost = pricing?.total_amount ? `${pricing.currency || ''} ${pricing.total_amount}`.trim() : ''
      const dates = huntingTrip?.dates || item.confirmation_date_formatted || ''
      const speciesList = huntCombination.map((hc: any) => hc.species || hc.name || hc.title).filter(Boolean)
      const numberToHunt = tripDetails?.no_of_hunters || tripDetails?.no_of_hunters || ''
      const companionCount = companionObserver?.no_of_companions || tripDetails?.no_of_companions || ''
      const observerCount = companionObserver?.no_of_observers || tripDetails?.no_of_observers || ''

      // Try to pick companion/observer costs from pricing breakdown if present
      const companionCost = item.companion_hunter_cost || pricing?.companion_hunter_cost || ''
      const observerFee = item.observer_fee || pricing?.observer_fee || ''

      // Extras and trophy fees may be on huntingTrip or pricing
      const extras = huntingTrip?.extras || item.extras || pricing?.extras || []
      const trophyFees = item.trophy_fees || pricing?.trophy_fees || []

      const lines: string[] = []
      if (title) lines.push(`${title}`)
      if (area) lines.push(`Area: ${area}`)
      if (safariModel) lines.push(`Safari Model: ${safariModel}`)
      if (cost) lines.push(`Cost: ${cost}`)
      if (dates) lines.push(`Dates: ${dates}`)
      if (speciesList.length) lines.push(`Species: ${speciesList.join(', ')}`)
      if (numberToHunt) lines.push(`Number SP to be hunted: ${numberToHunt}`)
      if (companionCount) lines.push(`Companion(s): ${companionCount}`)
      if (companionCost) lines.push(`Companion Hunter Cost: ${companionCost}`)
      if (observerCount) lines.push(`Observers: ${observerCount}`)
      if (observerFee) lines.push(`Observer Fee: ${observerFee}`)

      if (Array.isArray(extras) && extras.length > 0) {
        lines.push('Safari Extras:')
        extras.forEach((ex: any) => {
          const label = ex.label || ex.name || ex.type || JSON.stringify(ex)
          const amount = ex.amount || ex.price || ex.fee || ''
          lines.push(`  - ${label}${amount ? `: ${amount}` : ''}`)
        })
      }

      if (Array.isArray(trophyFees) && trophyFees.length > 0) {
        lines.push('Trophy Fees:')
        trophyFees.forEach((tf: any) => {
          const tlabel = tf.label || tf.name || tf.trophy || ''
          const tamount = tf.amount || tf.price || tf.fee || ''
          lines.push(`  - ${tlabel}${tamount ? `: ${tamount}` : ''}`)
        })
      }

      if (lines.length === 0 && clientName) return clientName
      return lines.join('\n')
    },

    getSpeciesList() {
      if (!this.salesItem || !this.salesItem.hunt_combination) return []
      return this.salesItem.hunt_combination
        .map((h: any) => h.species_name || h.species || h.name || h.title)
        .filter(Boolean)
    },

    getStatusClass(item: any) {
      const status = item?.status?.status || item?.status || ''
      const statusLower = String(status).toLowerCase()
      if (statusLower === 'completed') return 'status-completed'
      if (statusLower === 'confirmed') return 'status-confirmed'
      if (statusLower === 'pending') return 'status-pending'
      return 'status-default'
    },

    getStatusText(item: any) {
      const status = item?.status?.status || item?.status || ''
      return String(status).charAt(0).toUpperCase() + String(status).slice(1).toLowerCase()
    },

    formatDate(dateString: string) {
      if (!dateString) return '-'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      } catch {
        return dateString
      }
    },

    formatNumber(num: number) {
      if (!num && num !== 0) return '-'
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
    },

    formatFileSize(bytes: number) {
      if (!bytes) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    },

    addDocument() {
      if (!this.form.doc_type) {
        this.init({ message: 'Please select a document type', color: 'warning' })
        return
      }

      if (!this.form.documents || this.form.documents.length === 0) {
        this.init({ message: 'Please upload a file', color: 'warning' })
        return
      }

      const docType = this.form.doc_type.text || this.form.doc_type
      this.form.uploadedDocuments.push({
        type: docType,
        file: this.form.documents[0],
      })
      // Reset the upload fields
      this.form.doc_type = null
      this.form.documents = []
      this.init({ message: 'Document added successfully', color: 'success' })
    },

    removeDocument(index: number) {
      this.form.uploadedDocuments.splice(index, 1)
      this.init({ message: 'Document removed', color: 'info' })
    },

    async uploadDocumentsForContract(contractId: number) {
      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL
        const endpoint = `sales-confirmation/contracts/${contractId}/documents`

        // Prepare FormData with documents
        const formData = new FormData()

        this.form.uploadedDocuments.forEach((item: any, index: number) => {
          formData.append('documents[]', item.file)
          formData.append(`doc_types[${index}]`, item.type)
        })

        console.log('Uploading documents for contract:', contractId)

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          body: formData,
        })

        const responseData = await response.json().catch(() => ({}))

        if (response.ok || response.status === 201) {
          console.log('Documents uploaded successfully:', responseData)
          this.init({
            message: `✓ ${this.form.uploadedDocuments.length} document(s) uploaded successfully!`,
            color: 'success',
          })
        } else {
          console.error('Document upload failed:', responseData)
          this.init({
            message: `Warning: Contract created but document upload failed. Please upload documents manually.`,
            color: 'warning',
          })
        }
      } catch (error: any) {
        console.error('Document upload error:', error)
        this.init({
          message: `Warning: Contract created but document upload encountered an error. Please upload documents manually.`,
          color: 'warning',
        })
      }
    },

    handleReset() {
      this.resetForm()
      this.resetValidationForm()
    },
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
    background-color: var(--va-background-element);
  }
}

/* Contract form visual improvements */
.contract-form-card {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.form-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  .header-icon {
    background: linear-gradient(135deg, #4f46e5, #06b6d4);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  .header-text .text-muted {
    color: #64748b;
    line-height: 1.6;
  }
}

/* Proposal Details Card */
.proposal-details-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.details-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.status-completed {
    background: #d1fae5;
    color: #065f46;
  }

  &.status-confirmed {
    background: #dbeafe;
    color: #1e40af;
  }

  &.status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.status-default {
    background: #f1f5f9;
    color: #475569;
  }
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  background: #f8fafc;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: #4f46e5;
  flex-shrink: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.pricing-highlight {
    grid-column: 1 / -1;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #bae6fd;
  }
}

.info-label {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;

  &.price-value {
    font-size: 20px;
    font-weight: 700;
    color: #059669;
  }
}

.species-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.species-tag {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  color: #5b21b6;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #c4b5fd;
}

/* Description Section */
.description-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.description-input-area {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
    background: #ffffff;
  }
}

.description-textarea {
  width: 100%;

  :deep(.va-textarea__textarea) {
    font-size: 14px;
    line-height: 1.6;
    color: #1e293b;
  }
}

/* Document Section */
.document-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.section-header {
  margin-bottom: 20px;
}

.section-title-large {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon-large {
  color: #4f46e5;
}

.required-badge {
  background: #fee2e2;
  color: #991b1b;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  margin-left: auto;
}

.section-description {
  color: #64748b;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}

.document-upload-area {
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #94a3b8;
    background: #f1f5f9;
  }
}

.add-doc-button {
  margin-top: 8px;
}

.documents-list {
  margin-top: 24px;
}

.documents-list-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.document-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.document-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.document-icon {
  color: #6366f1;
  flex-shrink: 0;
}

.document-info {
  flex: 1;
  min-width: 0;
}

.document-type {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.document-name {
  font-size: 13px;
  color: #475569;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.document-size {
  font-size: 12px;
  color: #94a3b8;
}

.remove-doc-button {
  flex-shrink: 0;
  margin-left: 12px;
}

.documents-warning {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #92400e;
  font-size: 14px;
  font-weight: 500;

  svg {
    flex-shrink: 0;
    color: #f59e0b;
  }
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.action-button {
  min-width: 120px;

  &.primary-action {
    background: linear-gradient(135deg, #4f46e5, #06b6d4);
    border: none;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;

    .action-button {
      width: 100%;
    }
  }

  .details-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
