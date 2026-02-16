'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Layout } from '@/components/Layout'
import { getChaosState, simulateNetworkDelay, shouldTriggerError } from '@/lib/chaos'
import { Spinner } from '@/components/traps/Spinner'
import { ToastContainer } from '@/components/traps/Toast'

const DEMO_USERS = [
  { email: 'demo@example.com', password: 'demo123', name: 'Utilisateur Démo' },
  { email: 'admin@example.com', password: 'admin123', name: 'Administrateur' },
]

export function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (depuis sessionStorage)
    const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null
    if (storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const chaosState = getChaosState()
    let requestIndex = 0

    try {
      // Simuler la latence réseau
      await simulateNetworkDelay(chaosState.seed, chaosState, requestIndex++)

      // Simuler une erreur 401 si le chaos est activé
      if (chaosState.enabled && shouldTriggerError(chaosState.seed, chaosState.errorRate, requestIndex++)) {
        throw new Error('401: Identifiants invalides')
      }

      // Vérifier les identifiants
      const foundUser = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      )

      if (!foundUser) {
        throw new Error('Email ou mot de passe incorrect')
      }

      // Simuler un délai supplémentaire pour la réponse
      await simulateNetworkDelay(chaosState.seed, chaosState, requestIndex++)

      // Simuler une expiration de session si le chaos est activé
      if (chaosState.enabled && shouldTriggerError(chaosState.seed, chaosState.errorRate * 0.5, requestIndex++)) {
        setTimeout(() => {
          setIsAuthenticated(false)
          setUser(null)
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('user')
          }
        }, 5000)
      }

      // Connexion réussie
      const userData = { email: foundUser.email, name: foundUser.name }
      setIsAuthenticated(true)
      setUser(userData)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const chaosState = getChaosState()
    await simulateNetworkDelay(chaosState.seed, chaosState, 100)
    
    setIsAuthenticated(false)
    setUser(null)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user')
    }
  }

  if (isAuthenticated && user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow p-8" data-testid="auth-success">
            <h1 className="text-2xl font-bold mb-4" data-testid="welcome-message">
              Bienvenue, {user.name} !
            </h1>
            <p className="text-gray-600 mb-6" data-testid="user-email">
              Connecté en tant que : {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              data-testid="logout-button"
            >
              Se déconnecter
            </button>
          </div>
        </div>
        <ToastContainer seed={getChaosState().seed} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8" data-testid="auth-form">
          <h1 className="text-2xl font-bold mb-6" data-testid="auth-title">
            Connexion
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1" data-testid="email-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="demo@example.com"
                data-testid="email-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1" data-testid="password-label">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="demo123"
                data-testid="password-input"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" data-testid="auth-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              data-testid="login-button"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" seed={getChaosState().seed} index={1} />
                  <span className="ml-2">Connexion...</span>
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2" data-testid="demo-users-title">
              Comptes de démonstration :
            </p>
            <ul className="text-xs text-gray-500 space-y-1" data-testid="demo-users-list">
              {DEMO_USERS.map((user) => (
                <li key={user.email} data-testid={`demo-user-${user.email}`}>
                  {user.email} / {user.password}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer seed={getChaosState().seed} />
    </Layout>
  )
}
