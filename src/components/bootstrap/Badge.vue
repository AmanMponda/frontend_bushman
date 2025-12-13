<template>
  <span :class="['badge', `bg-${color || 'primary'}`, { 'rounded-pill': rounded }, badgeClass]">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  rounded?: boolean
  badgeClass?: string
}

withDefaults(defineProps<Props>(), {
  rounded: false,
})
</script>
