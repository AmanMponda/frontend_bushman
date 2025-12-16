<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { AUTH_API_URL } from '@/config/config'
import { useAuthStore } from '@/stores/auth'
import { useAppOptionStore } from '@/stores/app-option'
import { useNotification } from '@/composables/notification'
const { showAlert } = useNotification()
const axiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
const router = useRouter()
const authStore = useAuthStore()
const appOption = useAppOptionStore()

// Form state
const togglePassword = (event) => {
  const button = event.currentTarget
  const input = button.closest('.input-group').querySelector('input')
  const icon = button.querySelector('i')
  if (input.type === 'password') {
    input.type = 'text'
    icon.classList.replace('bi-eye-fill', 'bi-eye-slash-fill')
  } else {
    input.type = 'password'
    icon.classList.replace('bi-eye-slash-fill', 'bi-eye-fill')
  }
}

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading_spinner = ref(false)
const deviceId = ref('web-browser')

// UI config on mount/unmount
onMounted(() => {
  appOption.appSidebarHide = true
  appOption.appHeaderHide = true
  appOption.appContentClass = 'p-0'
  appOption.appFooter = false
  appOption.appFooterFixed = false
})

onBeforeUnmount(() => {
  appOption.appFooter = true
  appOption.appFooterFixed = true
  appOption.appSidebarHide = false
  appOption.appHeaderHide = false
  appOption.appContentClass = ''
})

// Submit logic
const submitForm = async () => {
  error.value = ''
  success.value = ''
  loading_spinner.value = true
  if (!email.value || !password.value) {
    loading_spinner.value = false
    showAlert('error', 'Please enter both email and password.')
    return
  }
  try {
    const param = {
      login: email.value,
      password: password.value,
      device_id: deviceId.value,
    }
    const response = await axiosInstance.post(`login`, param)

    loading_spinner.value = false
    if (response.data.success === true) {
      authStore.setUser(response.data.user)
      authStore.setToken(response.data.access_token, response.data.expires_in)
      authStore.setServices(
        response.data.services.filter((d) => {
          if (response.data.user.id == 6 || response.data.user.id == 4) {
            return [1, 2, 3].includes(d.service_id)
          } else {
            return [1, 2].includes(d.service_id)
          }
        }),
      )
      authStore.setCompanies(response.data.companies_ids)
      showAlert('success', 'Login Successfully')

      // Navigate to service selection page
      setTimeout(() => {
        router.push({ name: 'service-selection' }).catch((err) => {
          console.error('Navigation error:', err)
        })
      }, 500)

      const last = localStorage.getItem('lastRoute')

      if (last) {
        authStore.afterLogin()
      }
    } else {
      loading_spinner.value = false
      showAlert('error', 'Invalid response from server.')
    }
  } catch (err) {
    loading_spinner.value = false
    console.error(err)
    showAlert('error', err.response?.data.message)
  } finally {
    loading_spinner.value = false
  }
}
</script>

<template>
  <div
    class="login-container d-flex align-items-center justify-content-center p-3"
    style="background: linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%); min-height: 100vh"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-3 col-md-5 col-sm-6">
          <form
            class="auth-form rounded-3 shadow-sm p-3 position-relative overflow-hidden"
            @submit.prevent="submitForm"
          >
            <!-- Top accent bar -->
            <div
              class="position-absolute top-0 start-0 w-100"
              style="height: 4px; background: linear-gradient(90deg, #8b4513, #6b3410)"
            ></div>

            <!-- Form header -->
            <div class="auth-header text-center mb-0">
              <div class="logo-container mb-2 d-flex justify-content-center align-items-center">
                <img
                  src="/logo.png"
                  class="invert-dark"
                  alt="Logo"
                  style="width: 10em; height: auto; display: block; margin: 0 auto; background: transparent"
                />
              </div>

              <p class="auth-subtitle text-muted mb-2" style="font-size: 0.9rem">
                For your protection, please verify your identity.
              </p>
            </div>

            <!-- Alerts -->
            <div v-if="error" class="alert alert-danger alert-dismissible fade show rounded-2 mb-3 py-2" role="alert">
              {{ error }}
              <button type="button" class="btn-close" aria-label="Close" @click="error = ''"></button>
            </div>

            <div
              v-if="success"
              class="alert alert-success alert-dismissible fade show rounded-2 mb-3 py-2"
              role="alert"
            >
              {{ success }}
              <button type="button" class="btn-close" aria-label="Close" @click="success = ''"></button>
            </div>

            <!-- Email Input -->
            <div class="mb-3 input-container">
              <label class="form-label fw-medium text-dark mb-1">UserName</label>
              <div class="input-group border rounded-2 hover-effect">
                <span class="input-group-text bg-transparent border-0 text-muted pe-1">
                  <i class="bi bi-envelope-fill"></i>
                </span>
                <input
                  v-model="email"
                  type="text"
                  class="form-control border-0 ps-1"
                  placeholder="Enter your Username"
                  autocomplete="username"
                  style="background: transparent; height: 3em"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-3 input-container">
              <label class="form-label fw-medium text-dark mb-1">Password</label>
              <div class="input-group border rounded-2 hover-effect">
                <span class="input-group-text bg-transparent border-0 text-muted pe-1">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  v-model="password"
                  type="password"
                  class="form-control border-0 ps-1"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  style="background: transparent; height: 3.5em"
                />
                <button
                  class="btn btn-outline-secondary border-0 toggle-password"
                  type="button"
                  @click="togglePassword"
                >
                  <i class="bi bi-eye-fill"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary w-100 py-2 fw-semibold mt-2"
              :disabled="loading_spinner"
              style="background-color: #8b4513; border-color: #8b4513"
            >
              <span v-if="loading_spinner" class="spinner-border spinner-border-sm me-2"></span>
              <span v-else><i class="bi bi-box-arrow-in-right me-2"></i></span>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo-container img {
  transition: transform 0.3s ease;
  display: block;
  margin: 0 auto;
  background: transparent !important;
}

.logo-container:hover img {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-form {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>

<style scoped>
/* Existing styles */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.logo-container img {
  transition: transform 0.3s ease;
  display: block;
  margin: 0 auto;
  background: transparent !important;
}

.logo-container:hover img {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-form {
  animation: fadeIn 0.4s ease-out forwards;
}

/* New hover effects */
.hover-effect {
  transition: all 0.3s ease;
  border-color: #ced4da !important;
}

.hover-effect:hover,
.hover-effect:focus-within {
  border-color: #8b4513 !important;
  box-shadow: 0 0 0 0.2rem rgba(139, 69, 19, 0.25);
}

.input-container:hover .form-label {
  color: #8b4513;
}

.input-group-text {
  transition: color 0.3s ease;
}

.hover-effect:hover .input-group-text,
.hover-effect:focus-within .input-group-text {
  color: #8b4513 !important;
}

/* Focus styles */
.form-control:focus {
  box-shadow: none !important;
}
</style>
