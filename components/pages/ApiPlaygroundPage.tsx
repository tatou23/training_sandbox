'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { getChaosState, simulateNetworkDelay, shouldTriggerError } from '@/lib/chaos'
import { Spinner } from '@/components/traps/Spinner'

const ENDPOINTS = [
  { method: 'GET', path: '/api/products', description: 'Récupérer la liste des produits' },
  { method: 'GET', path: '/api/products/1', description: 'Récupérer un produit spécifique' },
  { method: 'POST', path: '/api/cart', description: 'Ajouter un produit au panier' },
  { method: 'GET', path: '/api/health', description: 'Vérifier l\'état de santé' },
]

export function ApiPlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0])
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRequest = async () => {
    setIsLoading(true)
    setResponse('')
    const chaosState = getChaosState()

    try {
      await simulateNetworkDelay(chaosState.seed, chaosState, 1)

      if (chaosState.enabled && shouldTriggerError(chaosState.seed, chaosState.errorRate, 2)) {
        throw new Error('500: Erreur serveur simulée')
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      if (selectedEndpoint.method === 'POST' && requestBody) {
        options.body = requestBody
      }

      const res = await fetch(selectedEndpoint.path, options)
      const data = await res.json()

      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(
        JSON.stringify(
          { error: error instanceof Error ? error.message : 'Une erreur est survenue' },
          null,
          2
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="api-playground-title">
          API Playground
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requête */}
          <div className="bg-white rounded-lg shadow p-6" data-testid="api-request-panel">
            <h2 className="text-xl font-semibold mb-4" data-testid="request-title">
              Requête
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="endpoint-label">
                  Endpoint
                </label>
                <select
                  value={selectedEndpoint.path}
                  onChange={(e) =>
                    setSelectedEndpoint(ENDPOINTS.find((ep) => ep.path === e.target.value) || ENDPOINTS[0])
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="endpoint-select"
                >
                  {ENDPOINTS.map((ep) => (
                    <option key={ep.path} value={ep.path} data-testid={`endpoint-option-${ep.path}`}>
                      {ep.method} {ep.path}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500" data-testid="endpoint-description">
                  {selectedEndpoint.description}
                </p>
              </div>

              {selectedEndpoint.method === 'POST' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="body-label">
                    Body (JSON)
                  </label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    rows={6}
                    placeholder='{"productId": "1", "quantity": 2}'
                    data-testid="request-body"
                  />
                </div>
              )}

              <button
                onClick={handleRequest}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                data-testid="send-request-button"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" seed={getChaosState().seed} index={1} />
                    <span className="ml-2">Envoi...</span>
                  </>
                ) : (
                  'Envoyer la requête'
                )}
              </button>
            </div>
          </div>

          {/* Réponse */}
          <div className="bg-white rounded-lg shadow p-6" data-testid="api-response-panel">
            <h2 className="text-xl font-semibold mb-4" data-testid="response-title">
              Réponse
            </h2>
            <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-auto max-h-96 text-sm" data-testid="response-content">
              {response || 'Aucune réponse...'}
            </pre>
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-white rounded-lg shadow p-6" data-testid="api-documentation">
          <h2 className="text-xl font-semibold mb-4" data-testid="documentation-title">
            Documentation des endpoints
          </h2>
          <div className="space-y-4">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} className="border-l-4 border-blue-500 pl-4" data-testid={`doc-endpoint-${ep.path}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono" data-testid={`doc-method-${ep.path}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm" data-testid={`doc-path-${ep.path}`}>
                    {ep.path}
                  </span>
                </div>
                <p className="text-sm text-gray-600" data-testid={`doc-description-${ep.path}`}>
                  {ep.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
