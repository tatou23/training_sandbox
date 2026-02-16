'use client'

import { getChaosState } from '@/lib/chaos'
import { seededRandomRange } from '@/lib/chaos'

interface SpinnerProps {
  seed?: string
  index?: number
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ seed = 'default', index = 0, size = 'md' }: SpinnerProps) {
  const chaosState = getChaosState()
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  // Durée de rotation variable mais reproductible
  const duration = chaosState.enabled
    ? seededRandomRange(seed, 0.5, 2, index)
    : 1

  return (
    <div
      className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
      data-testid="spinner"
      style={{
        animationDuration: `${duration}s`,
      }}
    />
  )
}
