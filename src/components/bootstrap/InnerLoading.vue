<template>
  <div class="position-relative">
    <div
      v-if="loading"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style="z-index: 10; background: rgba(255, 255, 255, 0.8)"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
}

defineProps<Props>()
</script>
