// Bootstrap-compatible modal system
import { ref } from 'vue'

export interface ModalOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const activeModal = ref<ModalOptions | null>(null)
const modalId = ref<string | null>(null)

export function useModal() {
  const open = (options: ModalOptions) => {
    activeModal.value = {
      title: options.title || 'Confirm',
      message: options.message || '',
      confirmText: options.confirmText || 'OK',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    }

    // Generate a unique modal ID
    modalId.value = `modal-${Date.now()}`

    // Use Bootstrap's modal API if available
    if (typeof window !== 'undefined' && (window as any).bootstrap) {
      const modalElement = document.getElementById(modalId.value)
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement)
        modal.show()
      }
    }
  }

  const close = () => {
    if (modalId.value) {
      const modalElement = document.getElementById(modalId.value)
      if (modalElement && (window as any).bootstrap) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement)
        if (modal) {
          modal.hide()
        }
      }
    }
    activeModal.value = null
    modalId.value = null
  }

  const confirm = (options: Omit<ModalOptions, 'onConfirm' | 'onCancel'>): Promise<boolean> => {
    return new Promise((resolve) => {
      open({
        ...options,
        onConfirm: () => {
          close()
          resolve(true)
        },
        onCancel: () => {
          close()
          resolve(false)
        },
      })
    })
  }

  return {
    open,
    close,
    confirm,
    activeModal,
    modalId,
  }
}
