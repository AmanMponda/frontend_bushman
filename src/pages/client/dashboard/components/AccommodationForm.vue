<template>
  <div>
    <VaForm ref="formRef" @submit.prevent="submitForm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <VaSelect
            v-model="form.entity_id"
            :options="salesInquiryEntities"
            label="Accommodation For?"
            placeholder="Select client"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          >
          </VaSelect>
        </div>
        <div>
          <VaSelect
            v-model="form.type_id"
            :options="accommodationTypes"
            label="Accommodation Type "
            placeholder="Enter type"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          >
            <template #append> <VaIcon name="add" class="ml-2" @click="_showModal()" /> </template>
          </VaSelect>
        </div>
        <div>
          <VaInput
            v-model="form.address_street"
            label="Accommodation Street Address"
            placeholder="Enter street address"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          />
        </div>
        <div>
          <VaInput
            v-model="form.address_city"
            label="Accommodation City"
            placeholder="Enter city"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          />
        </div>
        <div>
          <VaInput
            v-model="form.address_zipcode"
            label="Accommodation Zip Code"
            placeholder="Enter zip code"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          />
        </div>
        <div>
          <VaInput v-model="form.booking_number" label="Booking Number (Optional)" placeholder="Enter booking number" />
        </div>
        <div>
          <VaInput
            v-model="form.check_in"
            label="Check In"
            placeholder="Select check-in date"
            type="datetime-local"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          />
        </div>
        <div>
          <VaInput
            v-model="form.check_out"
            label="Check Out"
            placeholder="Select check-out date"
            type="datetime-local"
            required
            required-mark
            :rules="[
              (v: any) => !!v || 'This field is required',
              (v: any) => new Date(v) > new Date(form.check_in) || 'Check out date must be after check-in date',
            ]"
          />
        </div>
        <div>
          <VaSelect
            v-model="form.account_id"
            :options="companyAccounts"
            label="Account"
            placeholder="Select account"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          />
        </div>
        <div>
          <VaInput
            v-model="form.amount"
            label="Amount"
            placeholder="Enter amount"
            type="number"
            required
            required-mark
            :rules="[(value: any) => (value && value > 0) || 'Amount must be greater than zero']"
          />
        </div>
        <div>
          <VaSelect
            v-model="form.currency"
            label="Currency"
            :options="currencies"
            required
            required-mark
            :rules="[(v: any) => !!v || 'This field is required']"
          />
        </div>
      </div>
      <VaButton icon="save" :disabled="!isValidForm" @click="validateForm() && submitForm()">Save</VaButton>
    </VaForm>
  </div>
  <VaModal v-model="_shtyMd" title="Accommodation Type" width="600px" :show-default-actions="false">
    <AccomodationTypeForm></AccomodationTypeForm>
  </VaModal>
</template>

<script lang="ts">
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { defineComponent, ref, reactive } from 'vue'
import { useSettingsStore } from '../../../../stores/settings-store'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { useAccountsStore } from '../../../../stores/account-store'
import { format } from 'date-fns'
import handleErrors from '../../../../utils/errorHandler'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import AccomodationTypeForm from '../../../module-settings/components/AccomodationTypeForm.vue'

export default defineComponent({
  components: {
    AccomodationTypeForm,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const { init } = useToast()

    const formRef = ref(null as any)
    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    const form = reactive({
      type_id: null as any,
      address_street: '',
      address_city: '',
      address_zipcode: '',
      entity_id: null as any,
      booking_number: '',
      check_in: '',
      check_out: '',
      account_id: null as any,
      amount: '',
      currency: null as any,
    })
    return {
      init,
      form,
      formRef,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(useSettingsStore, ['salesInquiryEntities', 'currencies', 'accommodationTypes']),
    ...mapState(useAccountsStore, ['companyAccounts']),
    ...mapWritableState(useSettingsStore, {
      _shtyMd: 'showAccommodationTypeModal',
    }),
  },
  mounted() {
    this.getSalesInquiryEntities(this.item.id)
    this.getCompanyAccounts()
    this.getCurrencies()
    this.getAccommodationTypes(true)
  },
  methods: {
    ...mapActions(useSettingsStore, ['getSalesInquiryEntities', 'getCurrencies', 'getAccommodationTypes']),
    ...mapActions(useAccountsStore, ['getCompanyAccounts']),
    ...mapActions(useSalesInquiriesStore, ['createAccommodation']),

    async submitForm() {
      const checkInDate = new Date(this.form.check_in)
      const checkOutDate = new Date(this.form.check_out)
      const payload = {
        type_id: this.form.type_id.value,
        address_street: this.form.address_street,
        address_city: this.form.address_city,
        address_zipcode: this.form.address_zipcode,
        entity_id: this.form.entity_id.value,
        sales_inquiry_id: this.item.id,
        booking_number: this.form.booking_number,
        check_in: format(checkInDate, 'yyyy-MM-dd HH:mm:ss'),
        check_out: format(checkOutDate, 'yyyy-MM-dd HH:mm:ss'),
        account_id: this.form.account_id.value,
        amount: this.form.amount,
        currency: this.form.currency.value,
      }

      try {
        const response: any = await this.createAccommodation(payload)
        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
        }
      } catch (error: any) {
        console.error(error)
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    _showModal() {
      this._shtyMd = true
    },
  },
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
