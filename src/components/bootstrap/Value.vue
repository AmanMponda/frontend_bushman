<template>
  <slot :value="value" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  defaultValue?: any
}

const props = defineProps<Props>()

const value = ref(props.defaultValue)
</script>
