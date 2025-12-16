<template>
  <div class="form-proposal-container">
    <VaCard class="w-full">
      <VaCardContent>
        <VaForm ref="iformRef">
          <!-- <h3 class="font-bold text-lg mb-2">Package Details</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaSelect
        v-model="form.regulatory_package_id"
        :options="regulatoryPackages"
        :rules="[(value: any) => value || 'Regulatory Package is required']"
        placeholder="Select Regulatory Package"
        label="Regulatory Package"
      />
      <VaSelect
        v-model="form.package_id"
        :options="packages"
        :rules="[(value: any) => value || 'Package is required']"
        placeholder="Select Package"
        label="Sales Package"
      />
    </div> -->
          <h3 class="font-bold text-lg mb-2">Main Hunter safari information</h3>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <VaInput
              v-model="form.airport_name"
              type="text"
              placeholder=" Enter Airport Name"
              :rules="[(value: any) => (value && value.length > 0) || ' Airport Name is required']"
              label="Airport Name"
            />

            <!-- arrival -->
            <VaDateInput
              v-model="form.arrival"
              placeholder="Select Arrival Date"
              :rules="[(value: any) => value || 'Arrival Date is required']"
              label="Arrival Date"
            />
            <VaDateInput
              v-model="form.charter_in"
              placeholder="Choose charter in date"
              :rules="[(value: any) => value || 'Arrival Date is required']"
              label="Charter In Date"
            />
            <VaDateInput
              v-model="form.charter_out"
              placeholder="Choose charter out date"
              :rules="[(value: any) => value || 'Arrival Date is required']"
              label="Charter Out Date"
            />
          </div>

          <h3 class="font-bold text-lg mb-2">
            Create Client Installment plan
            <!-- <span v-if="priceBreakDown">
        - <b>{{ priceBreakDown.total_amount.currency.symbol }}{{ priceBreakDown.total_amount.amount }}</b>
      </span> -->
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <VaTextarea
              v-model="form.installment_narration"
              type="text"
              placeholder="Description"
              :rules="[(value: any) => (value && value.length > 0) || ' Installment Description is required']"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <VaInput
              v-model="form.installment_due_amount"
              type="number"
              label="Amount"
              placeholder="Amount"
              :rules="[(value: any) => (value && value > 0) || ' Installment Amount is required']"
            />

            <VaSelect
              v-model="form.installment_amount_type"
              :options="[
                // up on Booking
                { value: 'PERCENT', text: 'PERCENT' },
                { value: 'LAPS', text: `LAPS ` },
              ]"
              label="Amount type"
              :rules="[(value: any) => value || 'Due amoun type is required']"
              placeholder="Select Due amount type"
              @update:modelValue="onInputChange"
            />

            <!-- limit -->

            <VaInput
              v-model="form.installment_due_days"
              type="number"
              label="Days"
              :rules="[(value: any) => (value && value > 0) || ' Installment Days is required']"
              placeholder="Days"
            />

            <VaSelect
              v-model="form.due_days_type"
              label="Due days type"
              :options="[
                // up on Booking
                { value: 'UPON_SALES_CONFIRMATION', text: 'UPON_SALES_CONFIRMATION' },
                { value: 'PRIOR_SAFARI', text: `PRIOR_SAFARI ` },
              ]"
              :rules="[(value: any) => value || 'Due days type is required']"
              placeholder="Select Due days type"
              @update:modelValue="onInputChange"
            />

            <!-- installment_amount_type -->

            <VaButton icon="add" @click="createInstallmentList()"> </VaButton>
          </div>

          <div v-if="installments.length > 0" class="mb-4">
            <h3 class="font-bold text-lg mb-2">Installment Plans</h3>
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <div class="flex items-center">
                <div class="va-table-responsive">
                  <table class="va-table va-table--striped">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>installment In (PERCENT/LAPS)</th>
                        <th>Days</th>
                        <th>Due Days Limit</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="i in installments" :key="i.id">
                        <td>{{ i.narration }}</td>
                        <td>{{ i.amount }}</td>
                        <td>{{ i.amount_type }}</td>

                        <td>{{ i.days }}</td>
                        <td>{{ i.due_days_type }}</td>

                        <td><VaButton plain icon="delete" @click="deleteInstallment(i.id)"> </VaButton></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </VaForm>
      </VaCardContent>
    </VaCard>

    <!-- Floating Sticky Footer Navigation -->
    <div class="floating-footer-wrapper">
      <div class="floating-footer bg-white border-top shadow-lg">
        <div class="d-flex justify-content-end align-items-center py-3 px-4">
          <VaButton
            save
            icon="save"
            :loading="saving"
            :disabled="!isValidForm || saving || installments.length < 0"
            @click="validateForm() && onSubmit()"
          >
            save</VaButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { defineComponent, ref, reactive } from 'vue'
import { mapActions, mapState } from 'pinia'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { usePriceListStore } from '../../../../stores/price-list-store'
import handleErrors from '../../../../utils/errorHandler'
import { useRegulatoryPackageStore } from '../../../../stores/regulatrory-store'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

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
      // package_id: null as any,
      airport_name: null as any,
      charter_in: null as any,
      charter_out: null as any,
      arrival: null as any,
      installment_narration: null as any,
      installment_due_amount: null as any,
      installment_amount_type: null as any,
      installment_due_days: 0,
      due_days_type: null as any,
      // installment_due_limit: null as any,
      // regulatory_package_id: null as any,
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
      saving: false,
    }
  },
  computed: {
    ...mapState(useSalesInquiriesStore, ['priceBreakDown']),
  },

  mounted() {
    this.getPL()
    this.getLicencePackages()
  },

  methods: {
    ...mapActions(useSalesInquiriesStore, ['createSalesConfirmationFinalization']),
    ...mapActions(usePriceListStore, ['getPriceList', 'getSalesPackageList']),
    ...mapActions(useSalesInquiriesStore, ['getSalesPriceBreakdown', 'getObservers']),
    ...mapActions(useRegulatoryPackageStore, ['getRegulatoryPackages']),

    async getPL() {
      const response = await this.getPriceList()

      if (response.status === 200) {
        this.packages = response.data.data.map((item: any) => ({
          value: item.sales_package.id,
          text: item?.sales_package.name + ' - ' + item.price_list_type.hunting_type.name,
        }))
      } else {
        console.log('Error getting price list')
      }
    },

    createInstallmentList() {
      if (this.form.installment_narration && this.form.installment_due_amount) {
        this.installments.push({
          narration: this.form.installment_narration,
          amount: this.form.installment_due_amount,
          amount_type: this.form.installment_amount_type.value,
          days: this.form.installment_due_days,
          due_days_type: this.form.due_days_type.value,
        })
      } else {
        this.init({ message: 'Add at least one installment plan', color: 'warning' })
      }
    },

    deleteInstallment(index: number) {
      this.installments.splice(index, 1)
    },

    async getSalesPriceBreakdownForClient() {
      const payLoad = {
        salesInquiryId: this.item.id,
        packageId: this.item.price_list.price_list.sales_package.id,
      }
      await this.getSalesPriceBreakdown(payLoad)
    },

    async onSubmit() {
      this.saving = true
      const requestDate = {
        charterIn: this.form.charter_in,
        charterOut: this.form.charter_out,
        arrival: this.form.arrival,
        airportName: this.form.airport_name,
        packageId: this.item.price_list.price_list.sales_package.id,
        salesInquiryId: this.item.id,
        regulatoryPackageId: this.item.price_list.price_list.sales_package.regulatory_package.id,
        installments: this.installments,
      }

      try {
        const response = await this.createSalesConfirmationFinalization(requestDate)

        if (response.status === 201) {
          this.saving = false
          this.init({ message: response.data.message, color: 'success' })
          this.resetForm()
          this.resetValidationForm()
          this.installments = []
        } else {
          this.init({ message: response.data.message, color: 'danger' })
        }
      } catch (error: any) {
        this.saving = false
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
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

    // async getSalesPackages() {
    //   try {
    //     const response = await this.getSalesPackageList()
    //     this.packages = response.data.map((item: { id: any; name: any }) => {
    //       return {
    //         value: item.id,
    //         text: item.name,
    //       }
    //     })
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
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

/* Form Proposal Container - wraps card and footer */
.form-proposal-container {
  position: relative;
}

/* Floating Footer Wrapper - matches card width and adds margins */
.floating-footer-wrapper {
  position: sticky;
  bottom: 1rem;
  z-index: 1050;
  padding: 0 1rem;
  margin-top: 1rem;
}

/* Floating Footer - matches card width, rounded corners, shadow, doesn't touch sides */
.floating-footer {
  width: 100%;
  max-width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 0 auto;
}

/* Add padding to card content to prevent content from being hidden behind sticky footer */
.form-proposal-container .va-card__content {
  padding-bottom: 100px;
}
</style>
