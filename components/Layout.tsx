'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b" data-testid="main-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex items-center px-2 py-2 text-lg font-semibold text-gray-900"
                data-testid="nav-home-link"
              >
                Training Sandbox
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {pathname !== '/' && (
                <Link
                  href="/"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  data-testid="nav-back-link"
                >
                  ← Retour
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
