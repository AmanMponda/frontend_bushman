<template>
  <form :class="['bootstrap-form', formClass]" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
interface Props {
  formClass?: string
}

defineProps<Props>()

const emit = defineEmits<{
  submit: []
}>()

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped>
.bootstrap-form {
  width: 100%;
}
</style>
