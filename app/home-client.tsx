"use client"

import { useSearchParams } from "next/navigation"

export default function HomeClient() {
  const searchParams = useSearchParams()

  const chaos = searchParams.get("chaos") === "1"
  const seed = searchParams.get("seed") ?? null

  return (
    <div>
      {/* Colle ici le JSX actuel de ta home (contenu de app/page.tsx) */}
      {/* Remplace les usages directs de searchParams si tu en avais */}
      {/* Utilise chaos et seed si ta home en a besoin */}
    </div>
  )
}