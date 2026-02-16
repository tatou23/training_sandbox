'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Layout } from '@/components/Layout'
import { initChaosFromRequest, type ChaosConfig } from '@/lib/chaos'

function buildReproLink(opts: { origin: string; path: string; seed: string; chaos: boolean }): string {
  const url = new URL(opts.path, opts.origin)
  if (opts.chaos) url.searchParams.set('chaos', '1')
  url.searchParams.set('seed', opts.seed || 'default')
  return url.toString()
}

export function TrainingAdminPage() {
  const searchParams = useSearchParams()
  const [chaosConfig, setChaosConfig] = useState<ChaosConfig>(() =>
    initChaosFromRequest(new URLSearchParams(''))
  )
  const [resetState, setResetState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    // Zone interne: on accepte chaos/seed depuis l’URL (le middleware a déjà validé l’accès).
    const cfg = initChaosFromRequest(searchParams)
    setChaosConfig(cfg)
  }, [searchParams])

  const reproLink = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return buildReproLink({
      origin: window.location.origin,
      path: '/',
      seed: chaosConfig.seed,
      chaos: chaosConfig.enabled,
    })
  }, [chaosConfig.enabled, chaosConfig.seed])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reproLink)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 1500)
    } catch {
      setCopyState('error')
      setTimeout(() => setCopyState('idle'), 1500)
    }
  }

  const handleReset = async () => {
    setResetState('loading')
    try {
      const res = await fetch('/api/reset', { method: 'POST' })
      if (!res.ok) throw new Error('reset_failed')
      setResetState('success')
      setTimeout(() => setResetState('idle'), 1500)
    } catch {
      setResetState('error')
      setTimeout(() => setResetState('idle'), 1500)
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" data-testid="training-title">
              Admin Training (interne)
            </h1>
            <p className="text-gray-600 mt-2" data-testid="training-subtitle">
              Panneau interne pour debug/chaos. Accessible uniquement avec token valide.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded border"
              data-testid="copy-repro-link"
            >
              {copyState === 'copied' ? 'Copié' : copyState === 'error' ? 'Erreur' : 'Copy reproduction link'}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
              data-testid="reset-state-button"
              disabled={resetState === 'loading'}
            >
              {resetState === 'loading'
                ? 'Reset...'
                : resetState === 'success'
                  ? 'Reset OK'
                  : resetState === 'error'
                    ? 'Reset KO'
                    : 'Reset state'}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-lg shadow p-6 border" data-testid="training-chaos-state">
            <h2 className="text-xl font-semibold mb-4" data-testid="training-chaos-title">
              État chaos courant
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between" data-testid="training-chaos-enabled">
                <dt className="font-medium">Chaos</dt>
                <dd className={chaosConfig.enabled ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                  {chaosConfig.enabled ? 'Activé' : 'Désactivé'}
                </dd>
              </div>
              <div className="flex justify-between" data-testid="training-chaos-seed">
                <dt className="font-medium">Seed</dt>
                <dd className="font-mono">{chaosConfig.seed}</dd>
              </div>
              <div className="flex justify-between" data-testid="training-chaos-latency">
                <dt className="font-medium">Latence</dt>
                <dd className="font-mono">
                  {chaosConfig.networkLatency.min}-{chaosConfig.networkLatency.max}ms (±{chaosConfig.networkLatency.jitter})
                </dd>
              </div>
              <div className="flex justify-between" data-testid="training-chaos-error-rate">
                <dt className="font-medium">Taux d&apos;erreur</dt>
                <dd className="font-mono">{Math.round(chaosConfig.errorRate * 100)}%</dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-lg shadow p-6 border" data-testid="training-injections">
            <h2 className="text-xl font-semibold mb-4" data-testid="training-injections-title">
              Perturbations injectées
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between" data-testid="training-injection-popup">
                <span className="font-medium">Popup overlay</span>
                <span className="font-mono">{chaosConfig.popupOverlay ? 'on' : 'off'}</span>
              </li>
              <li className="flex justify-between" data-testid="training-injection-modal-delay">
                <span className="font-medium">Modal delay</span>
                <span className="font-mono">{Math.round(chaosConfig.modalDelay)}ms</span>
              </li>
              <li className="flex justify-between" data-testid="training-injection-toast-delay">
                <span className="font-medium">Toast delay</span>
                <span className="font-mono">{Math.round(chaosConfig.toastDelay)}ms</span>
              </li>
              <li className="flex justify-between" data-testid="training-injection-skeleton-delay">
                <span className="font-medium">Skeleton delay</span>
                <span className="font-mono">{Math.round(chaosConfig.skeletonDelay)}ms</span>
              </li>
            </ul>
          </section>
        </div>

        <section className="mt-6 bg-white rounded-lg shadow p-6 border" data-testid="training-repro-link">
          <h2 className="text-xl font-semibold mb-2" data-testid="training-repro-title">
            Lien de reproduction (sans token)
          </h2>
          <p className="text-sm text-gray-600 mb-4" data-testid="training-repro-help">
            Ce lien reproduit le chaos/seed mais n&apos;accorde aucun accès interne.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={reproLink}
              className="flex-1 px-3 py-2 border rounded font-mono text-sm"
              data-testid="training-repro-input"
            />
          </div>
        </section>
      </div>
    </Layout>
  )
}

