<template>
  <div class="btn-group" :class="groupClass">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  groupClass?: string
}

withDefaults(defineProps<Props>(), {})
</script>
