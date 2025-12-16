<template>
  <button
    :type="type"
    :class="[
      'btn',
      `btn-${color || 'primary'}`,
      {
        'btn-sm': size === 'small',
        'btn-lg': size === 'large',
        disabled: disabled,
        'btn-outline': preset === 'secondary' || preset === 'outline',
      },
      buttonClass,
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
    <i v-if="icon && !loading" :class="['material-icons', { 'me-1': label }]" style="font-size: 18px">
      {{ icon }}
    </i>
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  preset?: 'primary' | 'secondary' | 'plain' | 'outline'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  buttonClass?: string
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  disabled: false,
  loading: false,
  preset: 'primary',
  size: 'medium',
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
