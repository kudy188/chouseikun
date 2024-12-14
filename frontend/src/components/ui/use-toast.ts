import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
  description?: string
  duration?: number
}

export const toast = {
  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, {
      duration: options?.duration || 3000,
    })
  },
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      duration: options?.duration || 3000,
    })
  },
}
