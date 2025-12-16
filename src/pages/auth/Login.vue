<script setup>
<<<<<<< HEAD
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { AUTH_API_URL } from "@/config/config";
import { useAuthStore } from "@/stores/auth";
import { useAppOptionStore } from "@/stores/app-option";
import { useNotification } from "@/composables/notification";
const { showAlert } = useNotification();
const axiosInstance = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
const router = useRouter();
const authStore = useAuthStore();
const appOption = useAppOptionStore();

// Form state
const togglePassword = (event) => {
  const button = event.currentTarget;
  const input = button.closest(".input-group").querySelector("input");
  const icon = button.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
  } else {
    input.type = "password";
    icon.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
  }
};

const email = ref("");
const password = ref("");
const error = ref("");
const success = ref("");
const loading_spinner = ref(false);
const deviceId = ref("web-browser");

// UI config on mount/unmount
onMounted(() => {
  appOption.appSidebarHide = true;
  appOption.appHeaderHide = true;
  appOption.appContentClass = "p-0";
  appOption.appFooter = false;
  appOption.appFooterFixed = false;
});

onBeforeUnmount(() => {
  appOption.appFooter = true;
  appOption.appFooterFixed = true;
  appOption.appSidebarHide = false;
  appOption.appHeaderHide = false;
  appOption.appContentClass = "";
});

// Submit logic
const submitForm = async () => {
  error.value = "";
  success.value = "";
  loading_spinner.value = true;
  if (!email.value || !password.value) {
    loading_spinner.value = false;
    showAlert("error", "Please enter both email and password.");
    return;
  }
  try {
    let param = {
      login: email.value,
      password: password.value,
      device_id: deviceId.value,
    };
    const response = await axiosInstance.post(`login`, param);


    loading_spinner.value = false;
    if (response.data.success === true) {
      authStore.setUser(response.data.user);
      authStore.setToken(response.data.access_token, response.data.expires_in);
      authStore.setServices(response.data.services.filter((d) => {
        if (response.data.user.id == 6 || response.data.user.id == 4) {
          return [1, 2, 3].includes(d.service_id);
        } else {
          return [1, 2].includes(d.service_id);
        }
      }));
      authStore.setCompanies(response.data.companies_ids);
      showAlert("success", "Login Successfully");
      
      // Navigate to service selection page
      setTimeout(() => {
        router.push({ name: "service-selection" }).catch((err) => {
          console.error("Navigation error:", err);
        });
      }, 500);

      const last = localStorage.getItem("lastRoute");

      if (last) {
        authStore.afterLogin();
      }

    } else {
      loading_spinner.value = false;
      showAlert("error", "Invalid response from server.");
    }
  } catch (err) {
    loading_spinner.value = false;
    console.error(err);
    showAlert("error", err.response?.data.message);
  } finally {
    loading_spinner.value = false;
  }
};
</script>

<template>
  <div class="login-container d-flex align-items-center justify-content-center p-3" style="
      background: linear-gradient(135deg, #f6f9fc 0%, #eef2f6 100%);
      min-height: 100vh;
    ">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <form @submit.prevent="submitForm"
            class="auth-form rounded-3 shadow-sm p-4 position-relative overflow-hidden">
            <!-- Top accent bar -->
            <div class="position-absolute top-0 start-0 w-100" style="
                height: 4px;
                background: linear-gradient(90deg, #8B4513, #6B3410);
              "></div>

            <!-- Form header -->
            <div class="auth-header text-center mb-0">
              <div class="logo-container mb-2 d-flex justify-content-center align-items-center">
                <img src="/logo.png" class="invert-dark" alt="Logo" style="width: 12em; height: 4em; display: block; margin: 0 auto;" />
              </div>

              <p class="auth-subtitle text-muted mb-2" style="font-size: 0.9rem">
                For your protection, please verify your identity.
              </p>
            </div>

            <!-- Alerts -->
            <div v-if="error" class="alert alert-danger alert-dismissible fade show rounded-2 mb-3 py-2" role="alert">
              {{ error }}
              <button type="button" class="btn-close" @click="error = ''" aria-label="Close"></button>
            </div>

            <div v-if="success" class="alert alert-success alert-dismissible fade show rounded-2 mb-3 py-2"
              role="alert">
              {{ success }}
              <button type="button" class="btn-close" @click="success = ''" aria-label="Close"></button>
            </div>

            <!-- Email Input -->
            <div class="mb-3 input-container">
              <label class="form-label fw-medium text-dark mb-1">UserName</label>
              <div class="input-group border rounded-2 hover-effect">
                <span class="input-group-text bg-transparent border-0 text-muted pe-1">
                  <i class="bi bi-envelope-fill"></i>
                </span>
                <input type="text" class="form-control border-0 ps-1" v-model="email" placeholder="Enter your Username"
                  autocomplete="username" style="background: transparent; height: 3em" />
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-3 input-container">
              <label class="form-label fw-medium text-dark mb-1">Password</label>
              <div class="input-group border rounded-2 hover-effect">
                <span class="input-group-text bg-transparent border-0 text-muted pe-1">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input type="password" class="form-control border-0 ps-1" v-model="password"
                  placeholder="Enter your password" autocomplete="current-password"
                  style="background: transparent; height: 3.5em" />
                <button @click="togglePassword" class="btn btn-outline-secondary border-0 toggle-password"
                  type="button">
                  <i class="bi bi-eye-fill"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mt-2" :disabled="loading_spinner" style="background-color: #8B4513; border-color: #8B4513;">
              <span v-if="loading_spinner" class="spinner-border spinner-border-sm me-2"></span>
              <span v-else><i class="bi bi-box-arrow-in-right me-2"></i></span>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
=======
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import MD5 from 'crypto-js/md5'
import { useAuthStore } from '@/stores/auth'
import { useAppOptionStore } from '@/stores/app-option'
import { useNotification } from '@/composables/notification'

const { showAlert } = useNotification()
const axiosInstance = axios.create({
  baseURL: 'https://auth-gateway.iosuite.org/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
})

const router = useRouter()
const authStore = useAuthStore()
const appOption = useAppOptionStore()

// Form state
const deviceId = ref('web-asdasd-3434534534534')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading_spinner = ref(false)
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// UI config on mount/unmount
onMounted(() => {
  appOption.appSidebarHide = true
  appOption.appHeaderHide = true
  appOption.appContentClass = 'p-0'
  appOption.appFooter = false
  appOption.appFooterFixed = false

  // Generate device ID from browser fingerprint
  const fingerprint = `${navigator.userAgent}-${navigator.language}-${new Date().getTimezoneOffset()}`
  deviceId.value = MD5(fingerprint).toString()
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
    const response = await axiosInstance.post('login', param)

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
      setTimeout(() => {
        router.push('/dashboard')
      }, 360)

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
    showAlert('error', err.response?.data?.message || 'Login failed')
  } finally {
    loading_spinner.value = false
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-sidebar">
      <div class="sidebar-logo-container">
        <img src="/logo.png" alt="Logo" />
      </div>
    </div>

    <div class="login-container">
      <form class="auth-form" @submit.prevent="submitForm">
        <div class="accent-bar"></div>

        <div class="auth-header">
          <h2 class="auth-title">BUSHMAN</h2>
          <p class="auth-subtitle">Please enter details to login</p>
        </div>

        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" aria-label="Close" @click="error = ''"></button>
        </div>

        <div v-if="success" class="alert alert-success" role="alert">
          <i class="bi bi-check-circle me-2"></i>
          {{ success }}
          <button type="button" class="btn-close" aria-label="Close" @click="success = ''"></button>
        </div>

        <div class="form-group">
          <label class="form-label">Username</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <i class="bi bi-person-fill"></i>
            </span>
            <input
              v-model="email"
              type="text"
              placeholder="Enter your username"
              autocomplete="username"
              class="form-control"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-wrapper">
            <span class="input-icon">
              <i class="bi bi-lock-fill"></i>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              autocomplete="current-password"
              class="form-control"
            />
            <button class="btn-toggle-password" type="button" @click="togglePassword">
              <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading_spinner">
          <span v-if="loading_spinner" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-box-arrow-in-right me-2"></i>
          Sign In
        </button>
      </form>
    </div>
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
  </div>
</template>

<style>
<<<<<<< HEAD
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
=======
body,
html {
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden !important;
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
}
</style>

<style scoped>
<<<<<<< HEAD
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
}

.logo-container:hover img {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

=======
* {
  box-sizing: border-box;
}

.login-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.login-sidebar {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8b5a2b 0%, #6b4423 100%);
  padding: 40px;
  min-height: 100vh;
}

.sidebar-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-logo-container img {
  max-width: 350px;
  width: 100%;
  height: auto;
  border-radius: 12px;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
}

.sidebar-logo-container:hover img {
  transform: scale(1.05);
}

.login-container {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 40px 20px;
  position: relative;
  min-height: 100vh;
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.auth-form {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

<<<<<<< HEAD
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
  border-color: #8B4513 !important;
  box-shadow: 0 0 0 0.2rem rgba(139, 69, 19, 0.25);
}

.input-container:hover .form-label {
  color: #8B4513;
}

.input-group-text {
  transition: color 0.3s ease;
}

.hover-effect:hover .input-group-text,
.hover-effect:focus-within .input-group-text {
  color: #8B4513 !important;
}

/* Focus styles */
.form-control:focus {
  box-shadow: none !important;
=======
.accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #8b5a2b 0%, #a0826d 100%);
}

.auth-header {
  text-align: center;
  margin-bottom: 8px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 2px;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}

.auth-subtitle {
  font-size: 14px;
  color: #666;
  margin: 12px 0 0 0;
  line-height: 1.5;
  text-transform: capitalize;
}

.alert {
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 13px;
  border: none;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-danger {
  background-color: #fee;
  color: #c33;
  border-left: 4px solid #c33;
}

.alert-success {
  background-color: #efe;
  color: #2d7a2d;
  border-left: 4px solid #3c3;
}

.alert .btn-close {
  margin-left: auto;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.alert .btn-close:hover {
  opacity: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0 14px;
  background-color: #fafafa;
  transition: all 0.3s ease;
  height: 48px;
}

.input-wrapper:hover {
  border-color: #c0c0c0;
  background-color: #fff;
}

.input-wrapper:focus-within {
  border-color: #e0e0e0;
  background-color: #fafafa;
  box-shadow: none;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #999;
  margin-right: 10px;
  flex-shrink: 0;
  font-size: 17px;
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: #999;
}

.form-control {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 15px;
  outline: none;
  height: 100%;
  color: #1a1a1a;
}

.form-control::placeholder {
  color: #aaa;
}

.form-control:focus::placeholder {
  color: #ccc;
}

.btn-toggle-password {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  font-size: 17px;
  border-radius: 4px;
}

.btn-toggle-password:hover {
  color: #8b5a2b;
  background: rgba(139, 90, 43, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5a2b 0%, #9d6934 100%);
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(139, 90, 43, 0.2);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #9d6934 0%, #8b5a2b 100%);
  box-shadow: 0 6px 16px rgba(139, 90, 43, 0.3);
  transform: translateY(-2px);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(139, 90, 43, 0.2);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner-border {
  width: 18px;
  height: 18px;
  border-width: 2px;
}

@media (max-width: 1024px) {
  .login-sidebar {
    display: none;
  }

  .login-wrapper {
    background: white;
    justify-content: center;
  }

  .login-container {
    flex: none;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }

  .auth-form {
    padding: 30px 24px;
  }
}

@media (max-width: 640px) {
  .login-container {
    padding: 20px 16px;
  }

  .auth-form {
    padding: 30px 20px;
    gap: 20px;
  }

  .auth-title {
    font-size: 24px;
    letter-spacing: 1.5px;
  }

  .auth-subtitle {
    font-size: 13px;
  }

  .input-wrapper,
  .btn-submit {
    height: 46px;
  }

  .form-label {
    font-size: 12px;
  }

  .form-control {
    font-size: 16px;
  }

  .sidebar-logo-container img {
    max-width: 250px;
  }
}

@media (max-width: 400px) {
  .auth-form {
    padding: 24px 16px;
  }

  .auth-title {
    font-size: 22px;
  }
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
}
</style>
