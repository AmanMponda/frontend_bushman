<template>
  <div class="mb-3" :class="wrapperClass">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <div class="input-group">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :class="['form-control', { 'is-invalid': error || validationError }]"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @input="handleInput"
        @blur="handleBlur"
        @focus="$emit('focus', $event)"
      />
      <slot name="appendInner"></slot>
    </div>
    <div v-if="error || validationError" class="invalid-feedback d-block">
      {{ error || validationError }}
    </div>
    <small v-if="hint && !error && !validationError" class="form-text text-muted">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface ValidationRule {
  (value: any): boolean | string
}

interface Props {
  modelValue: string | number
  label?: string
  type?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  wrapperClass?: string
  rules?: ValidationRule[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  rules: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const validationError = ref<string>('')

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)

  // Validate on input if rules exist
  if (props.rules && props.rules.length > 0) {
    validate(value)
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)

  // Validate on blur
  if (props.rules && props.rules.length > 0) {
    validate(props.modelValue)
  }
}

const validate = (value: any) => {
  if (props.rules && props.rules.length > 0) {
    for (const rule of props.rules) {
      const result = rule(value)
      if (result !== true) {
        validationError.value = typeof result === 'string' ? result : 'Invalid value'
        return false
      }
    }
  }
  validationError.value = ''
  return true
}

// Expose validate method for parent form
defineExpose({
  validate: () => validate(props.modelValue),
})
</script>
