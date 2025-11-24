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
                :rules="[(value: any) => value || 'Companion is required']"
                placeholder="Select companion"
                label="Choose companion"
              />
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
    return {
      packages,
      installments: [] as any,
      regulatoryPackages: [] as any,
      proposalOptions: [] as any,
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
      console.log(value)
      this.salesItem = value.selfitem
      console.log(value.selfitem)
      this.getCompanions(value.selfitem.sales_inquiry.id, true)
    },
    async onSubmit() {
      const data = {
        sales_confirmation_proposal_id: this.form.proposal.value,
        entity_id: this.currentTab?.content === 'companion_contract' ? this.form.enity_id.value : null,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        contractor_type: this.currentTab?.content === 'companion_contract' ? 'COMPANION_HUNTER' : 'MAIN_HUNTER',
        description: this.form.description,
      }
      try {
        const response: any = await this.createContract(data)
        if (response.status === 201) {
          this.init({ message: 'Contract created successfully', color: 'success' })
        }
      } catch (error: any) {
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    // getCompanions(proposalId: any) {
    //   // TODO: Implement this method
    //   //
    // },

    async getSalesProposalOptions() {
      this.loadingSales = true
      const response: any = await this.getallSalesConfirmation()
      if (response.status === 200) {
        this.loadingSales = false
        this.proposalOptions = response.data.map((item: any) => {
          // Corrected: added arrow function
          //   this.salesItem = item.selfitem
          return {
            text: `sales confirmation for ${item.sales_inquiry.entity.full_name}`,
            value: item.id,
            selfitem: item,
          }
        })
      } else {
        this.loadingSales = false // Handle case when response status is not 200
      }
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
