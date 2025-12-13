<template>
  <div class="form-check" :class="wrapperClass">
    <input
      :id="checkboxId"
      v-model="checked"
      class="form-check-input"
      type="checkbox"
      :disabled="disabled"
      @change="$emit('update:modelValue', checked)"
    />
    <label v-if="label" :for="checkboxId" class="form-check-label">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
  wrapperClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxId = computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`)

const checked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
