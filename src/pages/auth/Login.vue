<template>
  <VaForm ref="form" @keydown.enter="validateForm() && submit()">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5">
      Bushman
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton :loading="loading" :disabled="!isValidForm" class="w-full" @click="validateForm() && submit()">
        Login</VaButton
      >
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import axios from 'axios' // Import Axios

const {
  isValid: isValidForm,
  validate: validateForm,
  resetValidation: resetValidationForm,
  reset: resetForm,
} = useForm('form')
const { push } = useRouter()
const { init } = useToast()
const loading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
})

const submit = async () => {
  loading.value = true

  try {
    const loginUrl = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_LOGIN_URL
    const data = JSON.stringify({
      username: formData.email,
      password: formData.password,
    })

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: loginUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    const response = await axios.request(config)
    if (response.status === 200) {
      sessionStorage.setItem('access', JSON.stringify(response.data.access))
      sessionStorage.setItem('refresh', JSON.stringify(response.data.refresh))
      resetForm()
      resetValidationForm()
      loading.value = false
      init({ message: "You've successfully logged in", color: 'success' })
      push({ name: 'dashboard' })
    }
  } catch (error: any) {
    loading.value = false

    init({ message: error.response.data.detail, color: 'danger' })
  }
}
</script>
