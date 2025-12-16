<template>
  <div class="mb-3" :class="wrapperClass">
    <label v-if="label" :for="dateInputId" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <input
      :id="dateInputId"
      type="date"
      :value="formattedValue"
      :class="['form-control', { 'is-invalid': error || validationError }]"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      @input="handleInput"
      @blur="handleBlur"
      @focus="$emit('focus', $event)"
    />
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
  modelValue: string | number | Date | null
  label?: string
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
  disabled: false,
  readonly: false,
  required: false,
  rules: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const dateInputId = computed(() => `date-input-${Math.random().toString(36).substr(2, 9)}`)
const validationError = ref<string>('')

const formattedValue = computed(() => {
  if (!props.modelValue) return ''

  if (props.modelValue instanceof Date) {
    return props.modelValue.toISOString().split('T')[0]
  }

  if (typeof props.modelValue === 'string') {
    const date = new Date(props.modelValue)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(props.modelValue)) {
      return props.modelValue
    }
  }

  return String(props.modelValue)
})

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)

  if (props.rules && props.rules.length > 0) {
    validate(value)
  }
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)

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

defineExpose({
  validate: () => validate(props.modelValue),
})
</script>
