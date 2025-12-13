<template>
  <VaForm ref="formRef">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <VaInput
        v-model="form.name"
        label="Name"
        placeholder="Item name"
        type="text"
        required
        :rules="[(v: any) => !!v || 'Name is required']"
      />
      <!-- amount -->
      <VaInput
        v-model="form.amount"
        label="Amount"
        placeholder="Item amount"
        type="number"
        required
        :rules="[(v: any) => !!v || 'Amount is required']"
      />
      <VaSelect
        v-model="form.currency_id"
        :options="currencies"
        label="Entity"
        placeholder="Select Entity"
        type="text"
        required
        :rules="[(v: any) => !!v || 'Entity is required']"
      />

      <!-- season -->

      <!-- description -->
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <VaSelect
        v-model="form.season_id"
        :options="seasons"
        label="Season"
        placeholder="Select Season"
        type="text"
        required
        :rules="[(v: any) => !!v || 'Season is required']"
      />
      <VaTextarea
        v-model="form.description"
        label="Description"
        placeholder="Item description"
        type="text"
        required
        :rules="[(v: any) => !!v || 'Description is required']"
      />
    </div>
  </VaForm>

  <VaButton
    type="submit"
    icon="save"
    :loading="saving"
    :disabled="!isValidForm || saving"
    @click="validateForm() && submit()"
    >Save</VaButton
  >
</template>
<script lang="ts">
import { mapActions, mapState, mapWritableState } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useSettingsStore } from '../../../stores/settings-store'
import handleErrors from '../../../utils/errorHandler'

export default defineComponent({
  components: {},

  setup() {
    const { init } = useToast()

    const formRef = ref()

    const form = reactive({
      name: '',
      amount: null as any,
      currency_id: null as any,
      season_id: null as any,
      description: '',
    })

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    return {
      formRef,
      isValidForm,
      validateForm,
      resetValidationForm,

      init,
      resetForm,
      form,
    }
  },
  data() {},
  computed: {
    ...mapState(useSettingsStore, ['salesChartersPriceList', 'salesInquiryEntities', 'seasons', 'currencies']),

    ...mapWritableState(useSettingsStore, {
      saving: 'savingSalesChartersPriceList',
    }),
  },

  mounted() {
    this.getSeasons(true)
    this.getCurrencies()
  },

  methods: {
    ...mapActions(useSettingsStore, [
      'getSalesChartersPriceList',
      'getSalesInquiryEntities',
      'createSalesChartersPriceList',
      'getSeasons',
      'getCurrencies',
    ]),

    async submit() {
      const payload = {
        name: this.form.name,
        amount: this.form.amount,
        currency_id: this.form.currency_id.value,
        season_id: this.form.season_id.value,
        description: this.form.description,
      }

      try {
        const response = await this.createSalesChartersPriceList(payload)
        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
          this.resetForm()
        } else {
          this.init({ message: 'Something went wrong', color: 'danger' })
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
  },
})
</script>

<style scoped>
/* Add any relevant styles here */
.bordered-items-form {
  border-color: rgb(65, 217, 225) !important;
  border-width: 2px !important;
  border-style: solid !important;
  border-radius: 10px !important;
  padding: 10px !important;
  /* shadow
         */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
}
</style>
