<template>
  <VaCard class="mb-5 pr-4 flex justify-between">
    <div>
      <VaCardContent>
        <h2 class="va-h5">Got questions?</h2>
        <p class="text-base leading-5">Request a free demo to have all your questions answered by an expert.</p>
      </VaCardContent>
      <VaCardActions align="left">
        <VaButton @click="showModal = !showModal">Request a demo</VaButton>
      </VaCardActions>
    </div>
    <img alt="Send a message" src="../request-demo.svg" />
  </VaCard>
  <VaModal v-model="showModal" :before-ok="submit" close-button ok-text="Request demo" size="small">
    <VaForm ref="form" @submit.prevent="submit">
      <h3 class="va-h3">Request free demo</h3>
      <p class="text-base mb-4 leading-5">
        Claim your spot now and ignite innovation with our exceptional software solution! 🔥
      </p>
      <VaInput
        v-model="email"
        :rules="[
          (v: any) => !!v || 'Email field is required',
          (v: any) => /.+@.+\..+/.test(v as any) || 'Email should be valid',
        ]"
        class="mb-4"
        label="Email"
        type="email"
      />
    </VaForm>
  </VaModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useForm, useToast } from 'vuestic-ui'

const showModal = ref(false)
const email = ref('')
const { validate } = useForm('form')
const { init } = useToast()

const submit = async () => {
  if (!validate()) {
    return
  }
  init({
    title: 'Demo Request Submitted!',
    message: 'An expert will get in touch soon',
    color: 'success',
  })
  showModal.value = false
}
</script>
