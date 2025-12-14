<template>
  <VaForm ref="formRef">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaSelect
        v-model="form.approval_chain_module_id"
        :options="approvalChainModules"
        label="Approval Chain"
        :rules="[(v: any) => !!v || 'Approval Chain Module is required']"
        @update:modelValue="onApprovalChainModuleChange"
      />
      <VaSelect
        v-model="form.level_id"
        :options="approvalChainLevels"
        placeholder="Select Level"
        label="Set an initial approval(Optional)"
        type="number"
        :disabled="!form.approval_chain_module_id"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <VaSelect v-model="form.type" :options="TYPE" placeholder="Select Type" label="Type" />
      <VaDateInput v-model="form.date" label="Date" :rules="[(v: any) => !!v || 'Date is required']" />
      <VaDateInput
        v-model="form.required_date"
        label="Required Date"
        :rules="[(v: any) => !!v || 'Required Date is required']"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
      <VaTextarea
        v-model="form.remarks"
        label="Remarks"
        type="textarea"
        :rules="[(v: any) => !!v || 'Remarks is required']"
      />
    </div>

    <div class="mt-4 flex p-2">
      <VaButton
        :loading="saving"
        icon="save"
        class="mr-3 mb-2"
        :disabled="!isValidForm"
        @click="validateForm() && submitForm()"
      >
        Save
      </VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
// Va* components are globally registered Bootstrap components - no import needed
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { useApprovalChainStore } from '../../../../stores/approval-store'
import { useRequisitionStore } from '../../../../stores/requistions-store'
import handleErrors from '../../../../utils/errorHandler'

export default defineComponent({
  name: 'RequistionsForm',
  components: {
    // Va* components are globally registered
  },
  setup() {
    const { init } = useToast()

    const formRef = ref()
    const form = reactive({
      requested_by: null,
      approval_chain_module_id: null as any,
      level_id: null as any,
      type: null as any,
      date: null as any,
      required_date: null as any,
      remarks: '',
      chainModuleSelected: false,
    })

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    // Separate the submit logic into a function

    return {
      formRef,
      form,
      isValidForm,
      resetValidationForm,
      resetForm,
      init,
      validateForm,
    }
  },
  data() {
    return {
      saving: false,
      TYPE: [
        { value: 'GAME_REQ', text: 'Game Requisition' },
        { value: 'GENERAL', text: 'General Requisition' },
      ],
    }
  },
  computed: {
    ...mapState(useApprovalChainStore, ['approvalChainModules', 'approvalChainLevels']),
  },
  mounted() {
    this.getRequisitionsApprovalChain(true)
  },

  methods: {
    ...mapActions(useApprovalChainStore, ['getRequisitionsApprovalChain', 'getApprovalChainLevels']),
    ...mapActions(useRequisitionStore, ['createRequisition']),
    onApprovalChainModuleChange(value: any) {
      if (value.value !== undefined) {
        this.getApprovalChainLevels(value.value)
      }
    },

    async submitForm() {
      const payload = {
        approval_chain_module_id: this.form.approval_chain_module_id.value,
        type: this.form.type.value,
        date: this.form.date,
        level_id: this.form.level_id?.value,
        required_date: this.form.required_date,
        remarks: this.form.remarks,
      }
      try {
        this.saving = true
        const response = await this.createRequisition(payload)
        if (response.status === 201) {
          this.resetForm()
          this.saving = false
          this.init({ message: 'Requisition created successfully', color: 'success' })
        } else {
          this.saving = false
          this.init({ message: 'Something went wrong', color: 'warning' })
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
/* Add your custom styles here */
</style>
