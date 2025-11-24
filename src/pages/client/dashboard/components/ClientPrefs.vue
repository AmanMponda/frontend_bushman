<template>
  <VaForm ref="prefsFormRef">
    <div class="p-6">
      <!-- Client Information Group -->
      <h3 class="font-bold text-lg mb-2">Client Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <VaSelect
          v-model="prefsform.entity_id"
          :options="clientChoice"
          label="Entity ID"
          searchable
          highlight-matched-text
          placeholder="Select Client"
          type="number"
          required
        />
        <VaInput
          v-model="prefsform.payment_method_id"
          label="Payment Method ID"
          placeholder="Enter Payment Method ID"
          type="number"
          required
        />
      </div>

      <!-- Experience and Date Group -->
      <h3 class="font-bold text-lg mb-2">Experience and Dates</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <VaSelect
          v-model="prefsform.prev_experience"
          label="Previous Experience"
          :options="experienceOptions"
          placeholder="Select Previous Experience"
          required
        />
        <VaInput
          v-model="prefsform.preffered_date"
          label="Preferred Date"
          placeholder="Select Preferred Date"
          type="date"
          required
        />
      </div>

      <!-- Participants Group -->
      <h3 class="font-bold text-lg mb-2">Participants</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <VaInput
          v-model="prefsform.no_of_hunters"
          label="Number of Hunters"
          placeholder="Enter Number of Hunters"
          type="number"
          required
        />
        <VaInput
          v-model="prefsform.no_of_observers"
          label="Number of Observers"
          placeholder="Enter Number of Observers"
          type="number"
          required
        />
        <VaInput
          v-model="prefsform.no_of_days"
          label="Number of Days"
          placeholder="Enter Number of Days"
          type="number"
          required
        />
        <VaInput
          v-model="prefsform.no_of_companions"
          label="Number of Companions"
          placeholder="Enter Number of Companions"
          type="number"
          required
        />
      </div>

      <!-- Additional Requests Group -->
      <h3 class="font-bold text-lg mb-2">Additional Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <VaTextarea
          v-model="prefsform.special_requests"
          label="Special Requests"
          placeholder="Enter any special requests"
          required
        />
        <VaInput
          v-model="prefsform.budget_estimation"
          label="Budget Estimation"
          placeholder="Enter Budget Estimation"
          type="number"
          required
        />
        <VaInput
          v-model="prefsform.accommodation_type"
          label="Accommodation Type"
          placeholder="Enter Accommodation Type"
          type="number"
          required
        />
      </div>

      <VaButton
        :disabled="!prefsisValidForm"
        type="submit"
        color="primary"
        @click="prefsvalidateForm() && submitPrefsForm()"
        >Submit Inquiry</VaButton
      >
    </div>
  </VaForm>

  <!-- { label: 'Prefered Hunting Area and species' }, -->
</template>

<script setup lang="ts">
import { reactive, ref, defineProps } from 'vue'
// import { useForm } from 'vuestic-ui'
// import { useToast } from 'vuestic-ui'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'

// import { onMounted, computed } from 'vue'
// import handleErrors from '../../../utils/handleClientRegFormError'
import { useForm } from 'vuestic-ui'

const prefsFormRef = ref()
const {
  isValid: prefsisValidForm,
  validate: prefsvalidateForm,
  resetValidation: prefsresetValidationForm,
  reset: pefsresetForm,
} = useForm(prefsFormRef)

const experienceOptions = ref([
  { value: 'none', text: 'None' },
  { value: 'beginner', text: 'Beginner' },
  { value: 'intermediate', text: 'Intermediate' },
  { value: 'advanced', text: 'Advanced' },
])

const prefsform = reactive({
  entity_id: null,
  payment_method_id: null as any,
  prev_experience: '',
  preffered_date: null as any,
  no_of_hunters: 0,
  no_of_observers: 0,
  no_of_days: 0,
  no_of_companions: 0,
  special_requests: '',
  budget_estimation: 0,
  accommodation_type: null as any,
})

// Define props
defineProps({
  clientChoice: {
    type: Array as () => { value: number; text: string }[],
    required: true,
  },
})
// const { title, description } = defineProps(['title', 'description'])

const submitPrefsForm = () => {
  // Handle form submission
  console.log(prefsform)
  prefsresetValidationForm()
  pefsresetForm()
  // Add API call or other submission logic here
}
</script>
