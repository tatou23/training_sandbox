"use client"
export const dynamic = "force-dynamic"

export default function IframeContent() {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4" data-testid="iframe-content-title">
        Contenu dans l&apos;iFrame
      </h1>
      <p className="text-gray-600" data-testid="iframe-content-text">
        Ce contenu est affiché dans un iFrame. Utilisez cette page pour tester la gestion des contextes multiples.
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        data-testid="iframe-button"
        onClick={() => alert('Bouton dans iframe cliqué!')}
      >
        Bouton dans iFrame
      </button>
    </div>
  )
}
