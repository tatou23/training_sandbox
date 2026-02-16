'use client'

import { useEffect, useRef } from 'react'
import { getChaosState } from '@/lib/chaos'
import { seededRandomRange } from '@/lib/chaos'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  seed?: string
  index?: number
}

export function Modal({ isOpen, onClose, title, children, seed = 'default', index = 0 }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const chaosState = getChaosState()

  useEffect(() => {
    if (!isOpen) return

    // Focus trap
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    // Scroll lock
    document.body.style.overflow = 'hidden'

    // Délai d'animation variable mais reproductible
    const delay = chaosState.enabled 
      ? seededRandomRange(seed, chaosState.modalDelay, chaosState.modalDelay + 200, index)
      : 0

    const timer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.classList.add('opacity-100')
        modalRef.current.classList.remove('opacity-0')
      }
    }, delay)

    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      clearTimeout(timer)
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, seed, index, chaosState])

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      data-testid="modal-overlay"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto opacity-0 transition-opacity duration-300"
        data-testid="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold" data-testid="modal-title">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="modal-close"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6" data-testid="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
