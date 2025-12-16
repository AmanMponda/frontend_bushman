<template>
  <div class="mb-3" :class="wrapperClass">
    <label v-if="label" :for="selectId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :class="['form-select', { 'is-invalid': error }]"
      :disabled="disabled"
      :required="required"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="getOptionValue(option)" :value="getOptionValue(option)">
        {{ getOptionLabel(option) }}
      </option>
    </select>
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
    <small v-if="hint && !error" class="form-text text-muted">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number | null
  label?: string
  placeholder?: string
  options: Array<{ value: any; text?: string; label?: string } | string>
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  wrapperClass?: string
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const getOptionValue = (option: any) => {
  if (typeof option === 'string') return option
  return option.value
}

const getOptionLabel = (option: any) => {
  if (typeof option === 'string') return option
  return option.text || option.label || option.value
}
</script>
