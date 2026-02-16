'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { PRODUCTS } from '@/lib/data'
import { getChaosState, simulateNetworkDelay } from '@/lib/chaos'
import { Spinner } from '@/components/traps/Spinner'

export function DownloadsPage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadCSV = async () => {
    setIsGenerating(true)
    const chaosState = getChaosState()
    
    try {
      await simulateNetworkDelay(chaosState.seed, chaosState, 1)
      
      // Générer CSV
      const headers = ['ID', 'Nom', 'Prix', 'Catégorie', 'Marque']
      const rows = PRODUCTS.map((p) => [
        p.id,
        p.name,
        p.price.toString(),
        p.category,
        p.brand,
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `products-${Date.now()}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadJSON = async () => {
    setIsGenerating(true)
    const chaosState = getChaosState()
    
    try {
      await simulateNetworkDelay(chaosState.seed, chaosState, 2)
      
      const jsonContent = JSON.stringify(PRODUCTS, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `products-${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="downloads-title">
          Téléchargements
        </h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4" data-testid="export-section-title">
              Exporter les données
            </h2>
            <p className="text-gray-600 mb-6" data-testid="export-description">
              Téléchargez la liste des produits au format CSV ou JSON.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={handleDownloadCSV}
                disabled={isGenerating}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                data-testid="download-csv-button"
              >
                {isGenerating ? (
                  <>
                    <Spinner size="sm" seed={getChaosState().seed} index={1} />
                    <span className="ml-2">Génération...</span>
                  </>
                ) : (
                  'Télécharger CSV'
                )}
              </button>

              <button
                onClick={handleDownloadJSON}
                disabled={isGenerating}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                data-testid="download-json-button"
              >
                {isGenerating ? (
                  <>
                    <Spinner size="sm" seed={getChaosState().seed} index={2} />
                    <span className="ml-2">Génération...</span>
                  </>
                ) : (
                  'Télécharger JSON'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
