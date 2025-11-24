<template>
  <VaForm ref="form" @submit.prevent="submit">
    <VaInput
      v-model="localBillingAddress.name"
      :rules="[(v: any) => !!v || 'Name field is required']"
      class="mb-4"
      label="Name"
    />
    <VaCheckbox v-model="localBillingAddress.isPrimary" class="mb-4" label="Primary Address" />
    <VaInput
      v-model="localBillingAddress.street"
      :rules="[(v: any) => !!v || 'Street field is required']"
      class="mb-4"
      label="Street"
    />
    <VaInput
      v-model="localBillingAddress.city"
      :rules="[(v: any) => !!v || 'City field is required']"
      class="mb-4"
      label="City"
    />
    <VaInput
      v-model="localBillingAddress.state"
      :rules="[(v: any) => !!v || 'State field is required']"
      class="mb-4"
      label="State"
    />
    <VaInput
      v-model="localBillingAddress.postalCode"
      :rules="[(v: any) => !!v || 'Postal Code field is required']"
      class="mb-4"
      label="Postal Code"
    />
    <VaInput
      v-model="localBillingAddress.country"
      :rules="[(v: any) => !!v || 'Country field is required']"
      class="mb-4"
      label="Country"
    />
    <div class="flex justify-end gap-3">
      <VaButton color="secondary" preset="secondary" @click="emits('cancel')">Cancel</VaButton>
      <VaButton @click="submit">{{ submitText }}</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { useForm } from 'vuestic-ui'
import { BillingAddress } from '../../types'
import { watch, ref } from 'vue'

const { validate } = useForm('form')
const emits = defineEmits(['save', 'cancel'])

const props = defineProps<{
  billingAddress: BillingAddress
  submitText: string
}>()

const localBillingAddress = ref<BillingAddress>({ ...props.billingAddress })

watch(
  () => props.billingAddress,
  (value: any) => {
    localBillingAddress.value = { ...value }
  },
  { deep: true },
)

const submit = () => {
  if (validate()) {
    emits('save', localBillingAddress.value)
  }
}
</script>
