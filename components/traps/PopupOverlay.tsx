'use client'

import { useEffect, useState } from 'react'
import { getChaosState, seededRandom } from '@/lib/chaos'

interface PopupOverlayProps {
  seed: string
  index?: number
}

export function PopupOverlay({ seed, index = 0 }: PopupOverlayProps) {
  const [show, setShow] = useState(false)
  const chaosState = getChaosState()

  useEffect(() => {
    if (!chaosState.enabled) return

    // Détermine si le popup doit s'afficher basé sur le seed
    const shouldShow = chaosState.popupOverlay && seededRandom(seed, index) > 0.3
    if (shouldShow) {
      // Délai variable mais reproductible
      const delay = seededRandom(seed, index + 1) * 2000 + 500
      const timer = setTimeout(() => setShow(true), delay)
      return () => clearTimeout(timer)
    }
  }, [chaosState.enabled, chaosState.popupOverlay, seed, index])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      data-testid="popup-overlay"
      onClick={() => setShow(false)}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl"
        data-testid="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2" data-testid="popup-title">
          Offre spéciale !
        </h3>
        <p className="text-gray-600 mb-4" data-testid="popup-message">
          Ne manquez pas notre promotion exclusive !
        </p>
        <button
          onClick={() => setShow(false)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          data-testid="popup-close"
        >
          Fermer
        </button>
      </div>
    </div>
  )
}
