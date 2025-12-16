<template>
  <VaForm ref="formRef">
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
      <VaInput
        v-model="form.name"
        label="Accommodation Type Name"
        placeholder="Enter Accommodation Type Name"
        type="text"
        required
        :rules="[(v: any) => !!v || 'This field is required']"
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
import { mapActions, mapWritableState } from 'pinia'
import { defineComponent, reactive, ref } from 'vue'
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { useSettingsStore } from '../../../stores/settings-store'
import handleErrors from '../../../utils/errorHandler'

export default defineComponent({
  components: {},

  setup() {
    const { init } = useToast()

    const formRef = ref()

    const form = reactive({
      name: '',
    })

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

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
    ...mapWritableState(useSettingsStore, {
      saving: 'savingAccommodationType',
    }),
  },

  methods: {
    ...mapActions(useSettingsStore, ['createAccommodationType']),
    async submit() {
      const payload = {
        name: this.form.name,
      }

      try {
        const response = await this.createAccommodationType(payload)
        if (response.status === 201) {
          this.init({ message: 'Accommodation Type Created Successfully', color: 'success' })
          this.resetForm()
        } else {
          this.init({ message: 'Error Creating Accommodation Type', color: 'danger' })
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
