import { useToast } from './useToast'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export function useNotification() {
  const toast = useToast()

  const showAlert = (type: AlertType, message: string) => {
    // Map alert types to toast colors
    const colorMap: Record<AlertType, 'success' | 'danger' | 'warning' | 'info'> = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info',
    }

    toast.init({
      message,
      color: colorMap[type] || 'info',
      duration: 3000,
    })
  }

  return {
    showAlert,
  }
}
