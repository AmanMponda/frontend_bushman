<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary">Login</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[
        (v: any) => !!v || 'Email field is required',
        (v: any) => /.+@.+\..+/.test(v as string) || 'Email should be valid',
      ]"
      class="mb-4"
      label="Email"
      type="email"
    />

    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        messages="Password should be 8+ characters: letters, numbers, and special characters."
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
      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          (v: any) => !!v || 'Repeat Password field is required',
          (v: any) => v === formData.password || 'Passwords don\'t match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Repeat Password"
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

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Create account</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import axios from 'axios' // Import Axios
// import { text } from 'stream/consumers'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  email: '',
  username: '',
  password: '',
  repeatPassword: '',
  first_name: '',
  last_name: '',
})

const submit = async () => {
  if (!validate()) {
    init({
      message: 'Please fill all required fields',
      color: 'danger',
    })
    return
  }
  try {
    const registerUrl = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REGISTER_URL

    const data = JSON.stringify({
      username: formData.email,
      password: formData.password,
      password2: formData.repeatPassword,
      email: formData.email,
      first_name: 'John',
      last_name: 'Doe',
    })
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: registerUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    const response = await axios.request(config)

    if (response.status === 201) {
      sessionStorage.setItem('access', JSON.stringify(response.data.access))
      sessionStorage.setItem('refresh', JSON.stringify(response.data.refresh))

      init({
        message: "You've successfully signed up",
        color: 'success',
      })
      push({ name: 'login' })
    }
  } catch (error) {
    init({
      message: 'Something went wrong, while Creating an account',
      color: 'danger',
    })
  }
}

const passwordRules: ((v: string) => boolean | string)[] = [
  (v: any) => !!v || 'Password field is required',
  (v: any) => (v && v.length >= 8) || 'Password must be at least 8 characters long',
  (v: any) => (v && /[A-Za-z]/.test(v as any)) || 'Password must contain at least one letter',
  (v: any) => (v && /\d/.test(v as any)) || 'Password must contain at least one number',
  (v: any) => (v && /[!@#$%^&*(),.?":{}|<>]/.test(v as any)) || 'Password must contain at least one special character',
]
</script>
