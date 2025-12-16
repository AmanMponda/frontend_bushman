<template>
  <div>
    <VaForm ref="formRef">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <VaInput
          v-model="requisitionItemForm.item_name"
          label="Main Item Name"
          placeholder="Item category Name"
          type="text"
          required
          :rules="[(v: any) => !!v || 'Item Name is required']"
        />
        <VaSelect
          v-model="requisitionItemForm.source_type"
          placeholder="Source Type"
          label="Source Type"
          :options="sourceTypeOptions"
          required
          :rules="[(v: any) => !!v || 'Source Type is required']"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <VaSelect
          v-model="requisitionItemForm.account_id"
          placeholder="Account ID"
          :options="companyAccounts"
          label="Account ID"
          type="number"
          required
          :rules="[(v: any) => !!v || 'Account ID is required']"
        />
        <!-- amount -->
        <VaInput
          v-model="requisitionItemForm.amount"
          label="Total items Amount"
          placeholder="Total items Amount"
          type="number"
          required
          :rules="[(v: any) => !!v || 'Amount is required']"
        />

        <VaSelect
          v-model="requisitionItemForm.mode_of_payment_id"
          label="Mode of Payment"
          placeholder="Mode of Payment"
          :options="paymentOptions"
          required
          :rules="[(v: any) => !!v || 'Mode of Payment is required']"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <VaSelect
          v-model="requisitionItemForm.currency_id"
          placeholder="Currency"
          label="Currency"
          :options="currencies"
          required
          :rules="[(v: any) => !!v || 'Currency is required']"
        />
        <VaTextarea
          v-model="requisitionItemForm.remarks"
          label="Remarks"
          type="textarea"
          :rows="3"
          placeholder="Remarks"
          required
          :rules="[(v: any) => !!v || 'Remarks is required']"
        />
      </div>
    </VaForm>
    <VaForm ref="iformRef">
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4 bordered-items-form">
        <!-- item items -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <VaInput
            v-model="itemsForm.name"
            label="Sub Item Name"
            :rules="[(v: any) => !!v || 'Sub Item Name is required']"
            placeholder="Sub Item Name"
          />

          <VaInput
            v-model="itemsForm.exchange_rate"
            label="Exchange Rate"
            placeholder="Exchange Rate"
            type="number"
            required
            :rules="[(v: any) => !!v || 'Exchange Rate is required']"
          />
          <VaInput v-model="itemsForm.rate" label="Rate" placeholder="Rate" type="number" required />
          <VaSelect
            v-model="itemsForm.currency_id"
            placeholder="Currency"
            label="Currency"
            :options="currencies"
            required
            :rules="[(v: any) => !!v || 'Currency is required']"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <VaSelect
            v-model="itemsForm.unit_of_measurement_id"
            label="Unit of Measurement"
            :options="units"
            placeholder="Unit of Measurement"
            required
            :rules="[(v: any) => !!v || 'Unit of Measurement is required']"
          />
          <VaInput
            v-model="itemsForm.quantity"
            label="Quantity"
            placeholder="Quantity"
            type="number"
            required
            :rules="[(v: any) => !!v || 'Quantity is required']"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
          <VaTextarea
            v-model="itemsForm.descriptions"
            label="Descriptions"
            type="textarea"
            :rows="2"
            placeholder="Descriptions"
            :rules="[(v: any) => !!v || 'Descriptions is required']"
          ></VaTextarea>
        </div>
        <VaButton border-color="primary" round preset="secondary" @click="addTempSubItemList()">Add Item</VaButton>

        <VaDataTable :items="addingitems" :columns="itemsFormColumns">
          <template #cell(actions)="{ rowData }">
            <VaButton preset="plain" icon="delete" @click="deleteTempSubItemList(rowData.index)"></VaButton>
          </template>
        </VaDataTable>
      </div>
    </VaForm>

    <VaButton
      type="submit"
      icon="save"
      :loading="saving"
      :disabled="!isValidForm || addingitems.length === 0 || saving"
      @click="validateForm() && submit()"
      >Save</VaButton
    >
  </div>
</template>
<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { useSettingsStore } from '../../../../stores/settings-store'
import { useAccountsStore } from '../../../../stores/account-store'
import { useRequisitionStore } from '../../../../stores/requistions-store'
import handleErrors from '../../../../utils/errorHandler'

export default defineComponent({
  components: {},
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { init } = useToast()

    const formRef = ref()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const iformRef = ref() // Used in template as ref="iformRef"

    const requisitionItemForm = reactive({
      source_type: null as any,
      currency_id: null as any,
      account_id: null as any,
      mode_of_payment_id: null as any,
      remarks: '',
      item_name: '',
      amount: null as any,
    })

    const itemsForm = reactive({
      name: '',
      exchange_rate: null as any,
      unit_of_measurement_id: null as any,
      quantity: 1,
      currency_id: null as any,
      rate: null as any,
      descriptions: '',
    })

    const {
      isValid: isValidIform,
      validate: validateIform,
      resetValidation: resetValidationIform,
      reset: resetIform,
    } = useForm()

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()
    const sourceTypeOptions = [
      { value: 'CASH', text: 'CASH' },
      { value: 'STORE', text: 'STORE' },
      { value: 'VENDOR', text: 'VENDOR' },
    ]

    const paymentOptions = [
      { value: 'CASH', text: 'CASH' },
      { value: 'TT', text: 'TT' },
      { value: 'CREDIT', text: 'CREDIT' },
    ]

    return {
      requisitionItemForm,
      formRef,
      isValidForm,
      validateForm,
      resetValidationForm,
      sourceTypeOptions,
      paymentOptions,
      init,
      resetForm,
      itemsForm,

      isValidIform,
      validateIform,
      resetValidationIform,
      resetIform,
    }
  },
  data() {
    const itemsFormColumns = [
      {
        label: 'Item Name',
        key: 'name',
        sortable: true,
      },
      {
        label: 'Currency',
        key: 'currency_id',
        sortable: true,
      },
      {
        label: 'Exchange Rate',
        key: 'exchange_rate',
        sortable: true,
      },
      {
        label: 'Unit of Measurement',
        key: 'unit_of_measurement_text',
        sortable: true,
      },
      {
        label: 'Quantity',
        key: 'quantity',
        sortable: true,
      },
      {
        label: 'Rate',
        key: 'rate',
        sortable: true,
      },
      {
        label: 'Descriptions',
        key: 'descriptions',
        sortable: true,
      },
      {
        label: 'Actions',
        key: 'actions',
        sortable: false,
      },
    ]
    return {
      addingitems: [] as any,
      itemsFormColumns,
      saving: false,
      currencyOptions: [],
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['currencies', 'units']),
    ...mapState(useAccountsStore, ['companyAccounts']),
  },
  mounted() {
    this.getCurrencies()
    this.getUnits()
    this.getCompanyAccounts()
  },

  methods: {
    ...mapActions(useSettingsStore, ['getCurrencies', 'getUnits']),
    ...mapActions(useAccountsStore, ['getCompanyAccounts']),
    ...mapActions(useRequisitionStore, ['createRequisitionItem']),
    async submit() {
      const payload = {
        requisition_id: this.item.id,
        currency_id: this.requisitionItemForm.currency_id.value,
        account_id: this.requisitionItemForm.account_id.value,
        source_type: this.requisitionItemForm.source_type.value,
        mode_of_payment_id: this.requisitionItemForm.mode_of_payment_id.value,
        remarks: this.requisitionItemForm.remarks,
        item_name: this.requisitionItemForm.item_name,
        items: this.addingitems,
        amount: this.requisitionItemForm.amount,
      }
      this.saving = true
      try {
        const response = await this.createRequisitionItem(payload)
        if (response.status === 201) {
          this.saving = false

          this.init({ message: 'Requisition Item Created', color: 'success' })
          this.resetForm()
          this.resetIform()
          this.resetValidationForm()
          this.resetValidationIform()
          this.addingitems = []
        } else {
          this.saving = false
          this.init({ message: 'Something went wrong', color: 'danger' })
        }
      } catch (error: any) {
        this.saving = false

        this.saving = false
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    addTempSubItemList() {
      this.addingitems.push({
        name: this.itemsForm.name,
        exchange_rate: this.itemsForm.exchange_rate,
        unit_of_measurement_id: this.itemsForm.unit_of_measurement_id.value,
        unit_of_measurement_text: this.itemsForm.unit_of_measurement_id.text,
        quantity: this.itemsForm.quantity,
        rate: this.itemsForm.rate,
        currency_id: this.itemsForm.currency_id.value,
        descriptions: this.itemsForm.descriptions,
      })
    },

    deleteTempSubItemList(index: number) {
      this.addingitems.splice(index, 1)
    },
  },
})
</script>

<style scoped>
/* Add any relevant styles here */
.bordered-items-form {
  border-color: #5c4033;
  border-width: 2px !important;
  border-style: solid !important;
  border-radius: 10px !important;
  padding: 10px !important;
  /* shadow
   */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
}
</style>
