<template>
  <span :class="['badge', `bg-${color || 'secondary'}`, 'rounded-pill', 'px-3', 'py-1', chipClass]">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  chipClass?: string
}

defineProps<Props>()
</script>
