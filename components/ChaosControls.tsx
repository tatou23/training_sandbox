'use client'

import { ChaosConfig } from '@/lib/chaos'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface ChaosControlsProps {
  chaosState: ChaosConfig
}

export function ChaosControls({ chaosState }: ChaosControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [seed, setSeed] = useState(chaosState.seed)
  const [chaosEnabled, setChaosEnabled] = useState(chaosState.enabled)

  const updateChaos = (enabled: boolean, newSeed?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (enabled) {
      params.set('chaos', '1')
      if (newSeed) {
        params.set('seed', newSeed)
      }
    } else {
      params.delete('chaos')
    }
    
    router.push(`/?${params.toString()}`)
  }

  const handleToggleChaos = () => {
    const newEnabled = !chaosEnabled
    setChaosEnabled(newEnabled)
    updateChaos(newEnabled, seed)
  }

  const handleSeedChange = (newSeed: string) => {
    setSeed(newSeed)
    if (chaosEnabled) {
      updateChaos(true, newSeed)
    }
  }

  const generateRandomSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 15)
    handleSeedChange(randomSeed)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200" data-testid="chaos-controls">
      <h2 className="text-xl font-semibold text-gray-900 mb-4" data-testid="chaos-controls-title">
        Contrôles Chaos
      </h2>

      <div className="space-y-4">
        {/* Toggle Chaos */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={chaosEnabled}
              onChange={handleToggleChaos}
              className="w-4 h-4 text-blue-600 rounded"
              data-testid="chaos-toggle"
            />
            <span className="text-sm font-medium text-gray-700" data-testid="chaos-toggle-label">
              Activer le mode chaos
            </span>
          </label>
        </div>

        {/* Seed Input */}
        {chaosEnabled && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" data-testid="chaos-seed-label">
              Seed (pour reproductibilité)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={seed}
                onChange={(e) => handleSeedChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="default"
                data-testid="chaos-seed-input"
              />
              <button
                onClick={generateRandomSeed}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
                data-testid="chaos-seed-random"
              >
                Aléatoire
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500" data-testid="chaos-seed-help">
              Utilisez le même seed pour reproduire le même comportement
            </p>
          </div>
        )}

        {/* État actuel */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2" data-testid="chaos-state-title">
            État actuel
          </h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div data-testid="chaos-state-enabled">
              <span className="font-medium">Chaos:</span>{' '}
              <span className={chaosState.enabled ? 'text-red-600' : 'text-green-600'}>
                {chaosState.enabled ? 'Activé' : 'Désactivé'}
              </span>
            </div>
            <div data-testid="chaos-state-seed">
              <span className="font-medium">Seed:</span> {chaosState.seed}
            </div>
            {chaosState.enabled && (
              <>
                <div data-testid="chaos-state-latency">
                  <span className="font-medium">Latence réseau:</span>{' '}
                  {chaosState.networkLatency.min}-{chaosState.networkLatency.max}ms
                </div>
                <div data-testid="chaos-state-error-rate">
                  <span className="font-medium">Taux d&apos;erreur:</span>{' '}
                  {(chaosState.errorRate * 100).toFixed(0)}%
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
