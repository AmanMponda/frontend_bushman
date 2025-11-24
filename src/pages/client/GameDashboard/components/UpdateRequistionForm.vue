<template>
  <div>
    <VaForm ref="formRef">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <VaSelect
          v-model="form.level_id"
          label="What is your Roles?"
          :options="approvalChainLevels"
          placeholder="Select you role"
          type="text"
          required
          :rules="[(v: any) => !!v || 'Role is required']"
        />
        <VaSelect v-model="form.status" label="Status" :options="statusOptions" type="text" required />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <VaTextarea
          v-model="form.remarks"
          label="Remarks"
          type="textarea"
          :rows="3"
          placeholder="Remarks"
          required
          :rules="[(v: any) => !!v || 'Remarks is required']"
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
  </div>
</template>
<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useRequisitionStore } from '../../../../stores/requistions-store'
import { useApprovalChainStore } from '../../../../stores/approval-store'
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

    const form = reactive({
      remarks: '',
      level_id: null as any,
      status: null as any,
    })
    const statusOptions = [
      {
        value: 'APPROVED',
        text: 'Approved',
      },
      {
        value: 'REJECTED',
        text: 'Rejected',
      },
      {
        value: 'IN_PROGRESS',
        text: 'Viewed',
      },
    ]

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    return {
      form,
      formRef,
      isValidForm,
      validateForm,
      resetForm,
      resetValidationForm,
      init,
      statusOptions,
    }
  },
  data() {
    return {
      saving: false,
    }
  },
  computed: {
    ...mapState(useApprovalChainStore, ['approvalChainLevels']),
  },
  mounted() {
    this.getApprovalChainLevels(this.item.approval_chain_module)
  },

  methods: {
    ...mapActions(useRequisitionStore, ['updateRequisitionStatus', 'getRequisitions']),
    ...mapActions(useApprovalChainStore, ['getApprovalChainLevels']),

    async submit() {
      console.log(this.form)
      const payload = {
        requisition_id: this.item.id,
        level_id: this.form.level_id.value,
        status: this.form.status.value,
        remarks: this.form.remarks,
      }
      this.saving = true
      try {
        const response = await this.updateRequisitionStatus(payload)
        if (response.status === 200) {
          this.saving = false
          this.init({ message: 'Requisition status updated successfully', color: 'success' })
          this.resetForm()
        } else {
          this.saving = false
          this.init({ message: 'Something went wrong', color: 'danger' })
          this.getRequisitions()
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
