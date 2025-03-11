"use client"

// Adapted from https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/use-toast.ts
import { useState, useEffect, useCallback, type ReactNode } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Toast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ReactNode
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

type UseToastOptions = {
  toasts?: Toast[]
  setToasts?: (toasts: Toast[]) => void
}

export function useToast({ toasts, setToasts }: UseToastOptions = {}) {
  const [internalToasts, setInternalToasts] = useState<Toast[]>([])

  const actualToasts = toasts || internalToasts
  const actualSetToasts = setToasts || setInternalToasts

  const dismiss = useCallback(
    (toastId: string) => {
      actualSetToasts(actualToasts.filter((t) => t.id !== toastId))
      if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId))
        toastTimeouts.delete(toastId)
      }
    },
    [actualSetToasts, actualToasts],
  )

  const toast = useCallback(
    ({ ...props }: Omit<ToastProps, "id">) => {
      const id = genId()
      const newToast = { ...props, id }

      actualSetToasts((toasts) => [newToast, ...toasts].slice(0, TOAST_LIMIT))

      const timeout = setTimeout(() => {
        dismiss(id)
      }, TOAST_REMOVE_DELAY)

      toastTimeouts.set(id, timeout)

      return id
    },
    [actualSetToasts, dismiss],
  )

  useEffect(() => {
    return () => {
      for (const timeout of toastTimeouts.values()) {
        clearTimeout(timeout)
      }
    }
  }, [])

  return {
    toast,
    dismiss,
    toasts: actualToasts,
  }
}

