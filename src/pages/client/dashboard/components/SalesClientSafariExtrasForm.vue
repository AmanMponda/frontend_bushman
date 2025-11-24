<template>
  <VaForm ref="formRef">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaSelect
        v-model="form.extra_id"
        type="text"
        placeholder="Extra service"
        :rules="[(v: any) => !!v || 'This field is required']"
        :options="safariExtras"
        label="Service"
      >
        <template #append>
          <VaIcon name="add" class="ml-2" @click="_showModal()" />
        </template>
      </VaSelect>
      <VaSelect
        v-model="form.account_id"
        :rules="[(v: any) => !!v || 'This field is required']"
        :options="companyAccounts"
        label="Account"
      />
      <VaButton
        type="submit"
        preset="plain"
        icon="add"
        rounded
        :disabled="!isValidForm"
        @click="addExtraServiceInTempTable"
      >
        Add
      </VaButton>
    </div>
  </VaForm>
  <!-- Table -->
  <VaDataTable :disabled="!selectedItems.length || _savingSafariExtras" :items="selectedItems" :columns="columns">
    <template #cell(actions)="{ rowData }">
      <VaButton
        :disabled="_savingSafariExtras"
        preset="plain"
        icon="delete"
        @click="deleteTempSubItemList(rowData.index)"
      ></VaButton>
    </template>
  </VaDataTable>
  <VaButton :loading="_savingSafariExtras" icon="save" :disabled="!selectedItems.length" @click="submitSelectedItems()">
    Save
  </VaButton>
  <VaModal
    v-model="_showCreateSafariExtraModal"
    size="small"
    :title="'Add Extra Service'"
    :close-on-click-outside="false"
  >
    <SafariExtrasForm> </SafariExtrasForm>
  </VaModal>
</template>

<script lang="ts">
import { useSettingsStore } from '../../../../stores/settings-store'
import { defineComponent, ref, reactive } from 'vue'
import { mapState, mapActions, mapWritableState } from 'pinia'
import { useForm, useToast } from 'vuestic-ui'
import { useAccountsStore } from '../../../../stores/account-store'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import handleErrors from '../../../../utils/errorHandler'
import SafariExtrasForm from '../../../module-settings/components/SafariExtrasForm.vue'

export default defineComponent({
  name: 'SalesClientSafariExtrasForm',
  components: {
    SafariExtrasForm,
  },
  props: {
    // showModalSizeLarge: Boolean,
    tableSelectable: {
      type: Boolean,
      required: false,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  emits: ['submitSelectedItemsEvent'],

  setup() {
    const { init } = useToast()

    const formRef = ref(null as any)
    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const form = reactive({
      extra_id: null as any,
      account_id: null as any,
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
        key: 'safari_text',
        label: 'Service',
        sortable: true,
      },
      {
        key: 'account_name',
        label: 'Account',
        sortable: true,
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
      },
    ]
    return {
      selectedItems: [] as any,
      columns,
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['safariExtras']),
    ...mapState(useAccountsStore, ['companyAccounts']),
    ...mapWritableState(useSalesInquiriesStore, { _savingSafariExtras: 'savingSafariExtras' }),
    ...mapWritableState(useSettingsStore, { _showCreateSafariExtraModal: 'showCreateSafariExtraModal' }),
  },
  mounted() {
    this.getSafariExtras(true)
    this.getCompanyAccounts()
  },

  methods: {
    ...mapActions(useSettingsStore, ['getSafariExtras']),
    ...mapActions(useAccountsStore, ['getCompanyAccounts']),
    ...mapActions(useSalesInquiriesStore, ['createsafariExtras', 'getClienSafariExtras']),

    _showModal() {
      this._showCreateSafariExtraModal = true
    },
    addExtraServiceInTempTable() {
      if (!this.form.extra_id.value) {
        this.init({ message: 'Please select extra service ', color: 'warning' })
        return
      }

      if (!this.form.account_id.value) {
        this.init({ message: 'Please select account ', color: 'warning' })
        return
      }
      const data = {
        safari_extras_id: this.form.extra_id.value,
        safari_text: this.form.extra_id.text,
        sales_inquiry_id: this.item.id,
        account_id: this.form.account_id.value,
        account_name: this.form.account_id.text,
      }
      // add if not exsits
      const index = this.selectedItems.findIndex((item: any) => item.safari_extras_id === data.safari_extras_id)
      if (index === -1) {
        this.selectedItems.push(data)
      } else {
        this.init({ message: 'This service already added', color: 'warning' })
      }

      this.resetForm()
    },
    deleteTempSubItemList(index: number) {
      this.selectedItems.splice(index, 1)
    },

    async submitSelectedItems() {
      console.log('submitSelectedItems')
      console.log(this.item.id)

      const payload = this.selectedItems.map((item: any) => {
        return {
          safari_extras_id: item.safari_extras_id,
          account_id: item.account_id,
          sales_inquiry_id: this.item.id,
        }
      })

      try {
        const response: any = await this.createsafariExtras(payload)
        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
          this.getClienSafariExtras(this.item.id)
        }
      } catch (error: any) {
        console.error(error)
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
        this._savingSafariExtras = false
      }
      // },
      // this.$emit('submitSelectedItemsEvent', payload)
    },
  },
})
</script>
