<template>
  <VaInnerLoading :loading="loadingSales">
    <VaTabs v-model="value" vertical grow>
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab.title" :name="tab.title">
          <VaIcon :name="tab.icon" size="small" class="mr-2" />
          {{ tab.title }}
        </VaTab>
      </template>

      <VaCard square outlined>
        <VaCardTitle class="mb-4">
          {{ currentTab.title }}
        </VaCardTitle>
        <VaCardContent>
          <VaForm ref="iformRef">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <VaSelect
                v-model="form.proposal"
                :options="proposalOptions"
                :rules="[(value: any) => value || 'Sales confirmation is required']"
                placeholder="Select confirmation "
                label="Choose sales confirmation"
                @update:modelValue="onValueChange"
              />
              <VaSelect
                v-if="currentTab.content === 'companion_contract'"
                v-model="form.enity_id"
                :options="companions"
                placeholder="Select companion (optional)"
                label="Choose companion"
                clearable
              />
              <div
                v-if="currentTab.content === 'companion_contract' && companions.length === 0"
                class="text-sm text-warning italic"
              >
                Companion list unavailable. The contract will use the main client from the sales confirmation.
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- arrival -->
              <VaDateInput
                v-model="form.start_date"
                placeholder="Choose start date"
                :rules="[(value: any) => value || 'Start date is required']"
                label="Start Date"
              />
              <VaDateInput
                v-model="form.end_date"
                placeholder="Choose End date"
                :rules="[(value: any) => value || 'End date is required']"
                label="End  Date"
              />
            </div>
            <!-- description -->
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <VaTextarea
                v-model="form.description"
                max-length="125"
                label="Short text about something"
                counter
                required-mark
                :rules="[(v: any) => (v && v.length > 0) || 'Required', (v: any) => v && v.length < 125]"
              />
            </div>

            <!-- Document Upload Section -->
            <div class="mb-4 border-t pt-4">
              <h3 class="text-lg font-semibold mb-4">Supporting Documents</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <VaSelect
                  v-model="form.doc_type"
                  :options="documentTypes"
                  placeholder="Select document type"
                  label="Document Type"
                  searchable
                  highlight-matched-text
                />
                <VaFileUpload
                  v-model="form.documents"
                  upload-button-text="Upload Document"
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
                size="small"
                color="secondary"
                :disabled="!form.doc_type || form.documents.length === 0"
                @click="addDocument"
              >
                Add Document
              </VaButton>

              <!-- List of Added Documents -->
              <div v-if="form.uploadedDocuments.length > 0" class="mt-4">
                <h4 class="font-semibold mb-2">Added Documents:</h4>
                <div class="space-y-2">
                  <div
                    v-for="(doc, index) in form.uploadedDocuments"
                    :key="index"
                    class="flex items-center justify-between bg-gray-100 p-3 rounded"
                  >
                    <span>{{ doc.type }}: {{ doc.file.name }}</span>
                    <VaButton preset="plain" icon="delete" size="small" color="danger" @click="removeDocument(index)" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <VaButton :disabled="!isValidForm" @click="validateForm() && onSubmit()"> Submit</VaButton>
            </div>
          </VaForm>
        </VaCardContent>
      </VaCard>
    </VaTabs>
  </VaInnerLoading>
</template>

<script lang="ts">
import { useForm, useToast } from 'vuestic-ui'
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
    } = useForm(iformRef)

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
      start_date: null as any,
      end_date: null as any,
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
    const TABS = [
      { icon: 'feed', title: 'Main Hunter ', content: 'main_hunter_contract' },
      { icon: 'feed', title: 'Companion Hunter ', content: 'companion_contract' },
    ]
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
      tabs: TABS,
      value: TABS[0].title,
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['companions']),

    currentTab(): any {
      return this.tabs.find(({ title }) => title === this.value)
    },
  },

  mounted() {
    this.getSalesProposalOptions()
  },

  methods: {
    ...mapActions(useContractsStore, ['createContract']),
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation']),

    ...mapActions(useSalesInquiriesStore, ['getCompanions']),
    onValueChange(value: any) {
      if (!value) return

      // Handle both direct object and option structure
      const selectedItem = value.selfitem || value
      console.log('Selected proposal full object:', selectedItem)

      this.salesItem = selectedItem

      // Try to fetch companions, but handle gracefully if endpoint fails
      if (selectedItem?.id) {
        console.log('Fetching companions for sales_confirmation_id:', selectedItem.id)
        this.getCompanions(selectedItem.id, true)
          .then((response: any) => {
            // Check if this was an error response
            if (response?.response?.status === 404) {
              console.warn('Companions endpoint returned 404 - no companions available or endpoint not found')
              this.init({
                message: 'Could not load companions list. You can still create a contract without a companion.',
                color: 'warning',
              })
            }
          })
          .catch((error: any) => {
            console.warn('Error fetching companions:', error)
            // Don't show error to user, just log it
          })
      } else {
        console.warn('Missing proposal ID for fetching companions')
      }
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

      let entityValue = null
      if (this.currentTab?.content === 'companion_contract') {
        // For companion contracts, companion selection is optional (endpoint not available)
        // Try to use the selected companion if provided
        if (this.form.enity_id) {
          if (typeof this.form.enity_id === 'object' && this.form.enity_id.value) {
            entityValue = this.form.enity_id.value
          } else if (typeof this.form.enity_id === 'number') {
            entityValue = this.form.enity_id
          }
        } else {
          // If no companion selected, use the main client entity
          entityValue = selectedProposal?.sales_inquiry?.entity?.id || null
        }
      } else {
        // For main hunter contracts, use the entity from the sales inquiry
        entityValue = selectedProposal?.sales_inquiry?.entity?.id || null
      }

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

      if (!this.form.start_date || !this.form.end_date) {
        this.init({ message: 'Start date and end date are required', color: 'warning' })
        return
      }

      if (!entityValue) {
        this.init({
          message: 'Entity information is missing. Please select a valid sales confirmation.',
          color: 'warning',
        })
        return
      }

      // Verify the dates are valid
      if (new Date(this.form.start_date) >= new Date(this.form.end_date)) {
        this.init({ message: 'End date must be after start date', color: 'warning' })
        return
      }

      const data = {
        sales_confirmation_proposal_id: proposalValue,
        entity_id: entityValue,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        contractor_type: this.currentTab?.content === 'companion_contract' ? 'COMPANION_HUNTER' : 'MAIN_HUNTER',
        description: this.form.description,
      }

      console.log('Form submission data:', data)
      console.log('Selected proposal object:', selectedProposal)

      try {
        const response: any = await this.createContract(data)
        if (response.status === 201) {
          this.init({ message: 'Contract created successfully', color: 'success' })
          // Reset form after successful submission
          this.resetForm()
          this.resetValidationForm()
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)

        // Check if it's a foreign key constraint error
        if (error.response?.data?.error && error.response.data.error.includes('FOREIGN KEY')) {
          this.init({
            message:
              'The selected sales confirmation is no longer available. Please refresh and select a different one.',
            color: 'danger',
          })
          // Reload proposals
          this.getSalesProposalOptions()
        } else {
          this.init({
            message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
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
      const response: any = await this.getallSalesConfirmation()
      if (response && response.status === 200) {
        this.loadingSales = false
        const data = Array.isArray(response.data) ? response.data : response.data?.data || []
        this.proposalOptions = data
          .filter((item: any) => item && item.id && item.sales_inquiry?.entity?.full_name)
          .map((item: any) => {
            return {
              text: `Sales confirmation for ${item.sales_inquiry.entity.full_name}`,
              value: item.id,
              selfitem: item,
            }
          })
      } else {
        this.loadingSales = false
      }
    },

    addDocument() {
      if (this.form.doc_type && this.form.documents.length > 0) {
        const docType = this.form.doc_type.text || this.form.doc_type
        this.form.uploadedDocuments.push({
          type: docType,
          file: this.form.documents[0],
        })
        // Reset the upload fields
        this.form.doc_type = null
        this.form.documents = []
        this.init({ message: 'Document added successfully', color: 'success' })
      }
    },

    removeDocument(index: number) {
      this.form.uploadedDocuments.splice(index, 1)
      this.init({ message: 'Document removed', color: 'info' })
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
</style>
