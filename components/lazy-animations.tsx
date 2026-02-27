"use client"

import { useEffect, useState } from "react"

/**
 * Lazy load animations after LCP to improve initial render performance
 */
export function useLazyAnimation(delay: number = 100) {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    // Wait for LCP before enabling animations
    const timer = setTimeout(() => {
      setShouldAnimate(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return shouldAnimate
}

/**
 * Wrapper component to defer heavy animations
 */
export function LazyAnimation({
  children,
  delay = 100,
  fallback = null,
}: {
  children: React.ReactNode
  delay?: number
  fallback?: React.ReactNode
}) {
  const shouldRender = useLazyAnimation(delay)

  if (!shouldRender) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
