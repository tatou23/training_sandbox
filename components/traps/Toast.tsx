'use client'

import { useEffect, useState } from 'react'
import { getChaosState } from '@/lib/chaos'
import { seededRandomRange } from '@/lib/chaos'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContainerProps {
  seed?: string
}

export function ToastContainer({ seed = 'default' }: ToastContainerProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const chaosState = getChaosState()

  useEffect(() => {
    if (!chaosState.enabled) return

    // Génère des toasts de manière reproductible
    const shouldShowToast = seededRandomRange(seed, 0, 1, 10) > 0.5
    if (shouldShowToast) {
      const delay = seededRandomRange(
        seed,
        chaosState.toastDelay,
        chaosState.toastDelay + 500,
        11
      )
      
      const timer = setTimeout(() => {
        const types: Toast['type'][] = ['success', 'error', 'info', 'warning']
        const typeIndex = Math.floor(seededRandomRange(seed, 0, types.length, 12))
        
        setToasts((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            message: 'Notification système',
            type: types[typeIndex],
          },
        ])
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [chaosState.enabled, seed])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 space-y-2"
      data-testid="toast-container"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg min-w-[300px] flex items-center justify-between ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-500 text-white'
              : toast.type === 'warning'
              ? 'bg-yellow-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
          data-testid={`toast-${toast.type}`}
        >
          <span data-testid={`toast-message-${toast.id}`}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:text-gray-200"
            data-testid={`toast-close-${toast.id}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

// Helper pour afficher un toast programmatiquement
export function showToast(
  message: string,
  type: Toast['type'] = 'info',
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>
) {
  setToasts((prev) => [
    ...prev,
    {
      id: Date.now().toString(),
      message,
      type,
    },
  ])
}
