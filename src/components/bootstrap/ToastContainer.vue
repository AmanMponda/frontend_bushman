<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 11">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast show', `bg-${toast.color || 'info'}`, 'text-white']"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header">
        <strong class="me-auto">{{ toast.color || 'Info' }}</strong>
        <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="close(toast.id)"></button>
      </div>
      <div class="toast-body">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, close } = useToast()
</script>

<style scoped>
.toast-container {
  min-width: 300px;
}
.toast {
  margin-bottom: 0.5rem;
}
</style>
