'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { initChaosFromRequest, getChaosState, setChaosState } from '@/lib/chaos'
import { ChaosControls } from '@/components/ChaosControls'
import { ToastContainer } from '@/components/traps/Toast'
import { PopupOverlay } from '@/components/traps/PopupOverlay'

const exercises = [
  {
    id: 'auth',
    title: 'Authentification',
    description: 'Login/logout avec délais réseau variables et erreurs simulées',
    href: '/auth',
  },
  {
    id: 'catalog',
    title: 'Catalogue Produits',
    description: 'Filtres multi-critères, tri, pagination, skeleton loading',
    href: '/catalog',
  },
  {
    id: 'cart',
    title: 'Panier & Checkout',
    description: 'Validations, calculs, frais, codes promo, erreurs serveur',
    href: '/cart',
  },
  {
    id: 'forms',
    title: 'Formulaires Avancés',
    description: 'Multi-étapes, champs conditionnels, upload de fichiers',
    href: '/forms',
  },
  {
    id: 'admin',
    title: 'Table Admin',
    description: 'Virtualisation, colonnes redimensionnables, inline edit, bulk actions',
    href: '/admin',
  },
  {
    id: 'dragdrop',
    title: 'Drag & Drop',
    description: 'Listes réordonnables et drop zones',
    href: '/dragdrop',
  },
  {
    id: 'iframes',
    title: 'iFrames & Nouvelles Fenêtres',
    description: 'Gestion des contextes multiples',
    href: '/iframes',
  },
  {
    id: 'downloads',
    title: 'Téléchargements',
    description: 'Export CSV et génération de fichiers',
    href: '/downloads',
  },
  {
    id: 'api',
    title: 'API Playground',
    description: 'Endpoints mockés et documentation',
    href: '/api-playground',
  },
]

export function HomePage() {
  const searchParams = useSearchParams()
  const [chaosState, setChaosStateLocal] = useState(getChaosState())
  const [trainingAuthorized, setTrainingAuthorized] = useState(false)

  const isProd = process.env.NODE_ENV === 'production'
  const defaultChaosEnabled = process.env.NEXT_PUBLIC_DEFAULT_CHAOS === '1'
  const canShowInternals = !isProd || trainingAuthorized

  useEffect(() => {
    // En prod sans autorisation: on ignore explicitement chaos/seed/debug côté UI.
    const config = canShowInternals
      ? initChaosFromRequest(searchParams)
      : initChaosFromRequest(new URLSearchParams(defaultChaosEnabled ? 'chaos=1' : ''))
    setChaosState(config)
    setChaosStateLocal(config)
  }, [searchParams, canShowInternals, defaultChaosEnabled])

  useEffect(() => {
    if (!isProd) return

    let cancelled = false
    fetch('/api/training/whoami', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setTrainingAuthorized(Boolean(data?.authorized))
      })
      .catch(() => {
        // Silencieux: en public on veut juste que ce soit caché.
      })

    return () => {
      cancelled = true
    }
  }, [isProd])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="app-title">
            Training Sandbox
          </h1>
          <p className="text-gray-600 mt-1" data-testid="app-subtitle">
            Apprendre et pratiquer Cypress, Playwright et Selenium
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu des exercices */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="exercises-title">
              Exercices disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercises.map((exercise) => (
                <Link
                  key={exercise.id}
                  href={exercise.href}
                  className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
                  data-testid={`exercise-link-${exercise.id}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`exercise-title-${exercise.id}`}>
                    {exercise.title}
                  </h3>
                  <p className="text-sm text-gray-600" data-testid={`exercise-description-${exercise.id}`}>
                    {exercise.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Panneau Chaos Controls */}
          {canShowInternals && (
            <div className="lg:col-span-1">
              <ChaosControls chaosState={chaosState} />
            </div>
          )}
        </div>
      </main>
      <ToastContainer seed={chaosState.seed} />
      {canShowInternals && chaosState.enabled && <PopupOverlay seed={chaosState.seed} index={1} />}
    </div>
  )
}
