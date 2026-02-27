"use client"

import { useEffect, useRef, useState, useCallback } from "react"

/**
 * Optimized scroll hook using requestAnimationFrame to prevent forced reflows
 */
export function useOptimizedScroll<T extends HTMLElement = HTMLDivElement>(
  callback: (scrollData: { scrollTop: number; scrollLeft: number }) => void
) {
  const ref = useRef<T>(null)
  const tickingRef = useRef(false)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          if (element) {
            callbackRef.current({
              scrollTop: element.scrollTop,
              scrollLeft: element.scrollLeft,
            })
          }
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => element.removeEventListener('scroll', handleScroll)
  }, [])

  return ref
}

/**
 * Optimized window scroll hook using requestAnimationFrame
 */
export function useOptimizedWindowScroll(
  callback: (scrollY: number) => void
) {
  const tickingRef = useRef(false)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          callbackRef.current(window.scrollY)
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Call once on mount
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
