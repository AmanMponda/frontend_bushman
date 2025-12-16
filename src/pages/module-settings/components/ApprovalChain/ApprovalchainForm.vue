<template>
  <div>
    <VaForm ref="formRef">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <VaInput
          v-model="moduleForm.name"
          label="Approval Chain Name"
          placeholder="Approval Chain Name"
          type="text"
          required
          :rules="[(v: any) => !!v || 'Approval Chain Name is required']"
        />
        <VaCheckbox
          v-model="moduleForm.active"
          class="pt-5"
          :rules="[(v: any) => !!v || 'Active is required']"
          :label="'Active'"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
        <VaTextarea
          v-model="moduleForm.description"
          label="Description"
          type="textarea"
          :rows="3"
          placeholder="Description"
          :rules="[(v: any) => !!v || 'Description is required']"
        />
      </div>
    </VaForm>
    <VaForm ref="iformRef">
      <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4 bordered-items-form">
        <!-- item items -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <VaSelect
            v-model="levelForm.level_number"
            label="Level Number"
            :options="levelNumbers"
            placeholder="Level Number"
            required
            :rules="[(v: any) => !!v || 'Level Number is required']"
          />

          <VaSelect
            v-model="levelForm.user_id"
            :options="users"
            label="User"
            placeholder="User"
            required
            :rules="[(v: any) => !!v || 'User is required']"
          />
          <VaSelect
            v-model="levelForm.approval_chain_role_id"
            label="Approval Chain Role"
            :options="approvalChainRoles"
            placeholder="Approval Chain Role"
            required
            :rules="[(v: any) => !!v || 'Approval Chain Role is required']"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <VaCheckbox
            v-model="levelForm.can_change_source"
            label="Can Change Source"
            :rules="[(v: any) => !!v || 'Can Change Source is required']"
          />
        </div>

        <VaButton border-color="primary" round preset="secondary" @click="addTempSubItemList()">Add Item</VaButton>

        <VaDataTable :items="addingitems" :columns="columns">
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

import { useApprovalChainStore } from '../../../../stores/approval-store'
import { useUserStore } from '../../../../stores/user-store'
import handleErrors from '../../../../utils/errorHandler'

export default defineComponent({
  components: {},
  props: {},
  setup() {
    const { init } = useToast()

    const formRef = ref()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const iformRef = ref() // Used in template as ref="iformRef"

    const moduleForm = reactive({
      name: null as any,
      active: null as any,
      description: '',
    })

    const levelForm = reactive({
      can_change_source: null as any,
      approval_chain_role_id: null as any,
      level_number: null as any,
      user_id: null as any,
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

    return {
      moduleForm,
      formRef,
      isValidForm,
      validateForm,
      resetValidationForm,

      init,
      resetForm,
      levelForm,

      isValidIform,
      validateIform,
      resetValidationIform,
      resetIform,
    }
  },
  data() {
    const columns = [
      {
        label: 'Level Number',
        key: 'level_number',
        sortable: true,
      },
      {
        label: 'User',
        key: 'user_text',
        sortable: true,
      },
      {
        label: 'Approval Chain Role',
        key: 'role_text',
        sortable: true,
      },
      {
        label: 'Can Change Source',
        key: 'can_change_source',
        sortable: true,
      },
      {
        label: 'Actions',
        key: 'actions',
        sortable: false,
      },
    ]
    const levelNumbers = [
      {
        value: 1,
        text: 'First level of approval',
      },
      {
        value: 2,
        text: 'Second level of approval',
      },
      {
        value: 3,
        text: 'Third level of approval',
      },

      {
        value: 4,
        text: 'Fourth level of approval',
      },
      {
        value: 5,
        text: 'Fifth level of approval',
      },
      {
        value: 6,
        text: 'Sixth level of approval',
      },
      {
        value: 7,
        text: 'Seventh level of approval',
      },
      {
        value: 8,
        text: 'Eighth level of approval',
      },
      {
        value: 9,
        text: 'Ninth level of approval',
      },
      {
        value: 10,
        text: 'Tenth level of approval',
      },
      {
        value: 11,
        text: 'Eleventh level of approval',
      },
      {
        value: 12,
        text: 'Twelfth level of approval',
      },
      {
        value: 13,
        text: 'Thirteenth level of approval',
      },
      {
        value: 14,
        text: 'Fourteenth level of approval',
      },
      {
        value: 15,
        text: 'Fifteenth level of approval',
      },
      {
        value: 16,
        text: 'Sixteenth level of approval',
      },
      {
        value: 17,
        text: 'Seventeenth level of approval',
      },
      {
        value: 18,
        text: 'Eighteenth level of approval',
      },
      {
        value: 19,
        text: 'Nineteenth level of approval',
      },
      {
        value: 20,
        text: 'Twentieth level of approval',
      },
    ]

    return {
      addingitems: [] as any,
      columns,
      saving: false,
      currencyOptions: [],
      levelNumbers,
    }
  },
  computed: {
    ...mapState(useApprovalChainStore, ['approvalChainRoles']),
    ...mapState(useUserStore, ['users']),
  },
  mounted() {
    this.getUsers()
    this.getApprovalChainRoles()
  },

  methods: {
    ...mapActions(useApprovalChainStore, ['getApprovalChainRoles', 'createApprovalChain']),
    ...mapActions(useUserStore, ['getUsers']),
    async submit() {
      const payload = {
        name: this.moduleForm.name,
        description: this.moduleForm.description,
        active: this.moduleForm.active,
        approval_chain_levels: this.addingitems,
      }

      this.saving = true
      try {
        const response = await this.createApprovalChain(payload)
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
        level_number: this.levelForm.level_number.value,
        level_text: this.levelForm.level_number.text,
        user_id: this.levelForm.user_id.value,
        user_text: this.levelForm.user_id.text,
        can_change_source: this.levelForm.can_change_source,
        approval_chain_role_id: this.levelForm.approval_chain_role_id.value,
        role_text: this.levelForm.approval_chain_role_id.text,
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
