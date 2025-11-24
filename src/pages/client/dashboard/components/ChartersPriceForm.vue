<template>
  <VaForm ref="formRef">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <VaSelect
        v-model="form.charters_price_list_id"
        :options="salesChartersPriceList"
        label="Charters Price List"
        placeholder="Item category Name"
        type="text"
        required
        :rules="[(v: any) => !!v || 'Item Name is required']"
      >
        <template #append> <VaIcon name="add" class="ml-2" @click="_showModal()" /> </template>
      </VaSelect>
      <VaSelect
        v-model="form.entity_id"
        :options="salesInquiryEntities"
        label="Entity"
        placeholder="Select Entity"
        type="text"
        required
        :rules="[(v: any) => !!v || 'Entity is required']"
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

  <!-- ChartersPriceListForm -->
  <VaModal v-model="_shCM" :width="'50%'" :height="'80%'" :scrollable="true">
    <ChartersPriceListForm></ChartersPriceListForm>
  </VaModal>
</template>
<script lang="ts">
import { mapActions, mapState, mapWritableState } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import handleErrors from '../../../../utils/errorHandler'
import { useSettingsStore } from '../../../../stores/settings-store'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import ChartersPriceListForm from '../../../module-settings/components/ChartersPriceListForm.vue'

export default defineComponent({
  components: {
    ChartersPriceListForm,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const { init } = useToast()

    const formRef = ref()

    const form = reactive({
      charters_price_list_id: null as any,
      sales_inquiry_id: null as any,
      entity_id: null as any,
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
    ...mapState(useSettingsStore, ['salesChartersPriceList', 'salesInquiryEntities']),

    ...mapWritableState(useSalesInquiriesStore, {
      saving: 'savingCharterPrices',
    }),

    ...mapWritableState(useSettingsStore, {
      _shCM: 'showSalesChartersPriceListModal',
    }),
  },

  mounted() {
    this.getSalesChartersPriceList(true)
    this.getSalesInquiryEntities(this.item.id)
  },

  methods: {
    ...mapActions(useSettingsStore, ['getSalesChartersPriceList', 'getSalesInquiryEntities']),

    ...mapActions(useSalesInquiriesStore, ['createChartersPrice']),
    async submit() {
      const payload = {
        charters_price_list_id: this.form.charters_price_list_id.value,
        sales_inquiry_id: this.item.id,
        entity_id: this.form.entity_id.value,
      }

      try {
        const response = await this.createChartersPrice(payload)
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
    _showModal() {
      this._shCM = true
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
