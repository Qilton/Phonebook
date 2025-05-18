// Simplified version of useToast from shadcn-ui
import { ReactNode } from "react"

type ToastProps = {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  variant?: "default" | "destructive"
}

type Toast = ToastProps

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const toasts: Toast[] = []

export const useToast = () => {
  const toast = (props: Omit<ToastProps, "id">) => {
    const id = genId()

    const newToast = {
      id,
      ...props,
    }

    toasts.push(newToast)

    toastTimeouts.set(
      id,
      setTimeout(() => {
        toasts.splice(toasts.indexOf(newToast), 1)
      }, TOAST_REMOVE_DELAY)
    )

    return id
  }

  return {
    toast,
    toasts: [...toasts],
    dismiss: (toastId?: string) => {
      if (toastId) {
        toasts.splice(
          toasts.findIndex((toast) => toast.id === toastId),
          1
        )
      } else {
        toasts.splice(0, toasts.length)
      }
    },
  }
}