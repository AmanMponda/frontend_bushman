<template>
  <div
    v-if="modelValue"
    class="modal fade show"
    :class="{ 'd-block': modelValue }"
    tabindex="-1"
    role="dialog"
    @click.self="handleBackdropClick"
  >
    <div
      class="modal-dialog"
      :class="{
        'modal-sm': size === 'small',
        'modal-lg': size === 'large',
        'modal-xl': size === 'xlarge',
        'modal-fullscreen': size === 'fullscreen',
      }"
      @click.stop
    >
      <div class="modal-content">
        <div v-if="title || $slots.header" class="modal-header">
          <h5 v-if="title" class="modal-title">{{ title }}</h5>
          <slot name="header"></slot>
          <button v-if="closeButton" type="button" class="btn-close" aria-label="Close" @click="close"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div v-if="!hideDefaultActions || $slots.footer" class="modal-footer">
          <slot name="footer">
            <button v-if="!hideDefaultActions" type="button" class="btn btn-secondary" @click="close">
              {{ cancelText || 'Cancel' }}
            </button>
            <button v-if="!hideDefaultActions" type="button" class="btn btn-primary" @click="handleOk">
              {{ okText || 'OK' }}
            </button>
          </slot>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" @click="handleBackdropClick"></div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen'
  closeButton?: boolean
  hideDefaultActions?: boolean
  okText?: string
  cancelText?: string
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: 'medium',
  closeButton: true,
  hideDefaultActions: false,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  ok: []
  cancel: []
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('cancel')
}

const handleOk = () => {
  emit('ok')
  if (props.hideDefaultActions) {
    close()
  }
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

// Prevent body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<style scoped>
.modal.show {
  display: block;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: 0.5;
}
.modal {
  z-index: 1050;
}
</style>
