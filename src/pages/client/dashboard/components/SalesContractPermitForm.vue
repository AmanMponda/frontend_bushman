<template>
  <VaInnerLoading :loading="loadingContracts">
    <VaForm ref="iformRef">
      <!-- permit number -->

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <VaSelect
          v-model="form.enity_contract"
          :options="proposalOptions"
          :rules="[(value: any) => value || 'Contract is required']"
          placeholder="Select contract"
          label="Choose contract"
          @update:modelValue="onValueChange"
        />

        <VaSelect
          v-model="form.package_type"
          :options="packageOptions"
          :rules="[(value: any) => value || 'Package type is required']"
          placeholder="Select package type"
          label="Choose package type"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <VaInput
          v-model="form.permit_number"
          type="text"
          placeholder="Enter permit number"
          :rules="[(value: any) => (value && value.length > 0) || ' Permit number is required']"
          label="Permit Number"
        />
        <!-- Issued Date -->
        <VaDateInput
          v-model="form.issued_date"
          placeholder="Choose issued date"
          :rules="[(value: any) => value || 'Issued date is required']"
          label="Issued Date"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- Start Date -->
        <VaDateInput
          v-model="form.start_date"
          placeholder="Choose start date"
          :rules="[(value: any) => value || 'Start date is required']"
          label="Start Date"
        />
        <!-- Charter In Date -->
        <VaDateInput
          v-model="form.end_date"
          placeholder="Choose enddate"
          :rules="[(value: any) => value || 'End Date is required']"
          label="End Date"
        />
      </div>
      <!-- Description -->
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
        <VaButton :disabled="!isValidForm" @click="validateForm() && onSubmit()">Submit</VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts">
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { defineComponent, ref, reactive } from 'vue'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { mapActions } from 'pinia'
import { useContractsStore } from '../../../../stores/contracts-store'
import handleErrors from '../../../../utils/errorHandler'
import { useRegulatoryPackageStore } from '../../../../stores/regulatrory-store'

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
      enity_contract: null as any,
      permit_number: '',
      issued_date: null as any,
      package_type: null as any,
      description: '',
      start_date: null as any,
      end_date: null as any,
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
    const packages = [] as any
    return {
      packages,
      installments: [] as any,
      regulatoryPackages: [] as any,
      proposalOptions: [] as any,
      loadingContracts: false,
      salesItem: null as any,
      packageOptions: [] as any,
    }
  },
  computed: {},

  mounted() {
    this.getContractsOptions()
    this.getRegulatoryPackagesOptions()
  },

  methods: {
    ...mapActions(useContractsStore, ['getContracts', 'createPermit']),
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation']),
    ...mapActions(useRegulatoryPackageStore, ['getRegulatoryPackages']),
    onValueChange(value: any) {
      console.log(value)
      this.form.package_type = {
        value: value.regulatoryPackages.id,
        text: value.regulatoryPackages.name,
      }
    },
    async onSubmit() {
      const data = {
        entity_contract_id: this.form.enity_contract.value,
        permit_number: this.form.permit_number,
        issued_date: this.form.issued_date,
        package_type: this.form.package_type.value,
        description: this.form.description,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
      }
      console.log(data)
      try {
        const response: any = await this.createPermit(data)
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

    async getContractsOptions() {
      this.loadingContracts = true
      const response: any = await this.getContracts()
      if (response.status === 200) {
        this.loadingContracts = false
        this.proposalOptions = response.data.map((item: any) => {
          // Corrected: added arrow function
          //   this.salesItem = item.selfitem

          return {
            text: `sales contract for ${item.sales_confirmation_proposal.sales_inquiry.entity.full_name}-${item.contract_number}`,
            value: item.id,
            regulatoryPackages: item.sales_confirmation_proposal.regulatory_package,
          }
        })
      } else {
        this.loadingContracts = false // Handle case when response status is not 200
      }
    },

    async getRegulatoryPackagesOptions() {
      const response: any = await this.getRegulatoryPackages()
      if (response.status === 200) {
        this.regulatoryPackages = response.data.map((item: any) => {
          return {
            text: item.name,
            value: item.id,
          }
        })
        this.packageOptions = this.regulatoryPackages
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
