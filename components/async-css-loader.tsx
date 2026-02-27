"use client"

import { useEffect } from 'react'

/**
 * Load non-critical CSS asynchronously after page load
 * This prevents CSS from blocking the initial render
 */
export function AsyncCSSLoader() {
  useEffect(() => {
    // Load non-critical CSS after initial render
    const loadNonCriticalCSS = () => {
      // Check if CSS is already loaded
      const existingLinks = document.querySelectorAll('link[data-async-css]')
      if (existingLinks.length > 0) return

      // Add non-critical stylesheets here if needed
      // Example:
      // const link = document.createElement('link')
      // link.rel = 'stylesheet'
      // link.href = '/path/to/non-critical.css'
      // link.setAttribute('data-async-css', 'true')
      // document.head.appendChild(link)
    }

    // Load after page is interactive
    if (document.readyState === 'complete') {
      loadNonCriticalCSS()
    } else {
      window.addEventListener('load', loadNonCriticalCSS)
      return () => window.removeEventListener('load', loadNonCriticalCSS)
    }
  }, [])

  return null
}
