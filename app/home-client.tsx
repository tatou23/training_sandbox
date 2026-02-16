"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

type NavItem = {
  href: string
  title: string
  description: string
  testId: string
}

const NAV: NavItem[] = [
  { href: "/auth", title: "Auth", description: "Login, erreurs 401, session expirée", testId: "nav-auth" },
  { href: "/catalog", title: "Catalogue", description: "Filtres, tri, pagination, skeletons", testId: "nav-catalog" },
  { href: "/cart", title: "Panier", description: "Quantités, promos, checkout, modales", testId: "nav-cart" },
  { href: "/forms", title: "Formulaires", description: "Multi étapes, validations, upload", testId: "nav-forms" },
  { href: "/admin", title: "Admin", description: "Table, inline edit, bulk actions", testId: "nav-admin" },
  { href: "/dragdrop", title: "Drag & Drop", description: "Réorganisation, drop zones", testId: "nav-dragdrop" },
  { href: "/iframes", title: "iFrames", description: "Contextes, iframe, nouvelles fenêtres", testId: "nav-iframes" },
  { href: "/downloads", title: "Downloads", description: "Exports CSV et JSON", testId: "nav-downloads" },
  { href: "/api-playground", title: "API Playground", description: "GET POST, latences, erreurs simulées", testId: "nav-api-playground" },
]

export default function HomeClient() {
  const searchParams = useSearchParams()
  const chaos = searchParams.get("chaos") === "1"
  const seed = searchParams.get("seed") ?? "default"

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Training Sandbox</h1>
            <p className="max-w-2xl text-zinc-300">
              Plateforme d’entraînement pour Cypress, Playwright et Selenium, avec un mode stable et un mode chaos
              reproductible.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              data-testid="mode-badge"
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                chaos ? "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30" : "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30"
              }`}
            >
              Mode {chaos ? "chaos" : "stable"}
            </span>

            <span
              data-testid="seed-badge"
              className="inline-flex items-center rounded-full bg-zinc-800/60 px-3 py-1 text-sm text-zinc-200 ring-1 ring-zinc-700"
              title="Seed de reproductibilité"
            >
              Seed: {seed}
            </span>
          </div>
        </header>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Parcours</h2>
          <p className="mt-1 text-sm text-zinc-300">
            Chaque page contient des data-testid stables et des pièges contrôlés pour entraîner tes stratégies anti flakiness.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testId}
                className="group rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-zinc-800 transition hover:bg-zinc-900 hover:ring-zinc-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-zinc-300">{item.description}</div>
                  </div>
                  <span className="text-zinc-400 transition group-hover:text-zinc-200">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-14 border-t border-zinc-800 pt-6 text-sm text-zinc-400">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <span>Mode public: stable par défaut. Accès training interne requis pour debug et chaos en production.</span>
            <span data-testid="home-footer">v1</span>
          </div>
        </footer>
      </div>
    </main>
  )
}