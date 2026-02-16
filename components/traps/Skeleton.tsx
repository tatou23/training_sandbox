'use client'

import { useEffect, useState } from 'react'
import { getChaosState } from '@/lib/chaos'
import { seededRandomRange } from '@/lib/chaos'

interface SkeletonProps {
  seed?: string
  index?: number
  children: React.ReactNode
  className?: string
}

export function Skeleton({ seed = 'default', index = 0, children, className = '' }: SkeletonProps) {
  const [show, setShow] = useState(false)
  const chaosState = getChaosState()

  useEffect(() => {
    if (!chaosState.enabled) {
      setShow(true)
      return
    }

    // Délai variable mais reproductible
    const delay = seededRandomRange(
      seed,
      chaosState.skeletonDelay,
      chaosState.skeletonDelay + 500,
      index
    )

    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [chaosState.enabled, seed, index])

  if (show) {
    return <>{children}</>
  }

  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      data-testid={`skeleton-${index}`}
    >
      <div className="h-full w-full bg-gray-300 rounded" />
    </div>
  )
}
