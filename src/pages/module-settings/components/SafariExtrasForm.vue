<template>
  <VaForm ref="formRef">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaInput
        v-model="form.name"
        type="text"
        placeholder="Service name"
        :rules="[(v: any) => !!v || 'This field is required']"
        label="Service name"
      />
      <VaInput
        v-model="form.amount"
        type="number"
        placeholder="Amount"
        :rules="[(v: any) => !!v || 'This field is required']"
        label="Amount"
      />
      <VaSelect
        v-model="form.currency_id"
        type="text"
        placeholder="Currency"
        :rules="[(v: any) => !!v || 'This field is required']"
        :options="currenciesOptions"
        label="Currency"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <VaSelect
        v-model="form.season_id"
        type="text"
        placeholder="Extra service"
        :rules="[(v: any) => !!v || 'This field is required']"
        :options="seasonsOptions"
        label="Service"
      />
      <VaSelect
        v-model="form.charges_per"
        :options="chargesPerOptions"
        type="number"
        placeholder="Charges per"
        :rules="[(v: any) => !!v || 'This field is required']"
        label="Charges per"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
      <VaTextarea
        v-model="form.description"
        type="text"
        placeholder="Description"
        :rules="[(v: any) => !!v || 'This field is required']"
        label="Description"
      />
    </div>
  </VaForm>

  <VaButton
    icon="save"
    :loading="savingSafariExtra"
    :disabled="!isValidForm || savingSafariExtra"
    @click="submitSelectedItems()"
  >
    Save
  </VaButton>
</template>

<script lang="ts">
import { useSettingsStore } from '../../../stores/settings-store'
import { defineComponent, ref, reactive } from 'vue'
import { mapState, mapActions } from 'pinia'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import handleErrors from '../../../utils/errorHandler'
// import { useAccountsStore } from '../../stores/account-store'
// import { useSalesInquiriesStore } from '../../stores/sales-store'
// import handleErrors from '../../utils/errorHandler'

export default defineComponent({
  emits: ['submitSelectedItemsEvent'],

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
      name: '',
      amount: null as any,
      currency_id: null as any,
      season_id: null as any,
      charges_per: null as any,
      description: '',
    })

    return {
      formRef,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      form,
      init,
    }
  },

  data() {
    const columns = [
      {
        key: 'name',
        label: 'Service name',
        sortable: true,
      },
      {
        key: 'amount',
        label: 'Amount',
        sortable: true,
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
      },
    ]

    const chargesPerOptions = [
      { value: 'PER_HOUR', text: 'PER HOUR' },
      { value: 'PER_DAY', text: 'PER DAY' },
      { value: 'PER_PERSON', text: 'PER PERSON' },
      { value: 'PER_ROUND', text: 'PER ROUND' },
    ]
    return {
      selectedItems: [] as any,
      columns,
      chargesPerOptions,
      seasonsOptions: [],
      currenciesOptions: [],
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['savingSafariExtra']),
  },
  mounted() {
    this.getSeasonList()
    this.getCurrencyList()
  },

  methods: {
    ...mapActions(useSettingsStore, ['getSeasons', 'getCurrencies', 'createSafariExtras']),

    async submitSelectedItems() {
      const payload = {
        name: this.form.name,
        amount: this.form.amount,
        currency_id: this.form.currency_id.value,
        season_id: this.form.season_id.value,
        charges_per: this.form.charges_per.value,
        description: this.form.description,
      }
      try {
        const response: any = await this.createSafariExtras(payload)
        if (response.status === 201) {
          this.$emit('submitSelectedItemsEvent')
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

    async getCurrencyList() {
      try {
        const response = await this.getCurrencies()
        this.currenciesOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
})
</script>
