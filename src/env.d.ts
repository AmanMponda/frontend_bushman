/// <reference types="vite/client" />

import type { ToastOptions } from './composables/useToast'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $vaToast: {
      init: (options: ToastOptions) => { close: () => void }
      success: (message: string, options?: Omit<ToastOptions, 'message' | 'color'>) => { close: () => void }
      error: (message: string, options?: Omit<ToastOptions, 'message' | 'color'>) => { close: () => void }
      warning: (message: string, options?: Omit<ToastOptions, 'message' | 'color'>) => { close: () => void }
      info: (message: string, options?: Omit<ToastOptions, 'message' | 'color'>) => { close: () => void }
      close: (id: number) => void
      closeAll: () => void
    }
    $vaModal: {
      open: (options: { title?: string; message?: string; confirmText?: string; cancelText?: string; onConfirm?: () => void; onCancel?: () => void }) => void
      close: () => void
      confirm: (message: string) => Promise<boolean>
    }
  }
}
