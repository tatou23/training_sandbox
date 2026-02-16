import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Training Sandbox",
  description: "Sandbox pour apprendre l’automatisation des tests",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
