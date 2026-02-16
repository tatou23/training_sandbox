'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'

export function IframesPage() {
  const [newWindowUrl, setNewWindowUrl] = useState('')

  const handleOpenWindow = () => {
    if (newWindowUrl) {
      window.open(newWindowUrl, '_blank', 'width=800,height=600')
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="iframes-title">
          iFrames & Nouvelles Fenêtres
        </h1>

        <div className="space-y-8">
          {/* iFrame */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4" data-testid="iframe-section-title">
              Contenu dans un iFrame
            </h2>
            <iframe
              src="/iframe-content"
              className="w-full h-96 border border-gray-300 rounded"
              data-testid="main-iframe"
            />
          </div>

          {/* Nouvelle fenêtre */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4" data-testid="new-window-section-title">
              Ouvrir une nouvelle fenêtre
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newWindowUrl}
                onChange={(e) => setNewWindowUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                data-testid="new-window-input"
              />
              <button
                onClick={handleOpenWindow}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                data-testid="open-window-button"
              >
                Ouvrir
              </button>
            </div>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => window.open('/', '_blank')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                data-testid="open-home-window"
              >
                Ouvrir la page d&apos;accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
