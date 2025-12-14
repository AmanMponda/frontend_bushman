<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid">
      <!-- Left side -->
      <div class="d-flex align-items-center">
        <button
          v-if="isMobile"
          class="btn btn-link text-dark d-lg-none mr-2"
          type="button"
          @click="$emit('toggle-sidebar')"
        >
          <i class="material-icons">menu</i>
        </button>
        <RouterLink to="/" class="navbar-brand d-flex align-items-center" aria-label="Visit home page">
          <span class="fw-bold">BUSHMAN</span>
        </RouterLink>
      </div>

      <!-- Right side -->
      <div class="d-flex align-items-center">
        <AppNavbarActions :is-mobile="isMobile" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import AppNavbarActions from './components/AppNavbarActions.vue'

defineProps({
  isMobile: { type: Boolean, default: false },
})

defineEmits(['toggle-sidebar'])
</script>

<style lang="scss" scoped>
.navbar {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e9ecef;
  z-index: 1000;
  position: sticky;
  top: 0;
  width: 100% !important;
  font-size: 16px !important;
  /* Prevent shrinking */
  -webkit-text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;

  .navbar-brand {
    margin-right: 1rem;
    text-decoration: none;
    font-size: 1rem !important;

    span {
      font-size: 1rem !important;
      font-weight: 700 !important;
    }
  }

  .btn-link {
    padding: 0.5rem;
    text-decoration: none;
    border: none;
    background: none;

    &:hover {
      background-color: #f8f9fa;
      border-radius: 4px;
    }
  }
}
</style>
