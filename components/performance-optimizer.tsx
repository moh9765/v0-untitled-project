"use client"

import { useEffect } from 'react'
import { setupLazyLoading, prefetchResources } from '@/lib/performance'

interface PerformanceOptimizerProps {
  prefetchUrls?: string[]
  lazyLoadImages?: boolean
  imageSelector?: string
  rootMargin?: string
}

/**
 * Component that applies various performance optimizations
 * Include this component once in your app layout or on specific pages
 */
export function PerformanceOptimizer({
  prefetchUrls = [],
  lazyLoadImages = true,
  imageSelector = 'img.lazy',
  rootMargin = '200px'
}: PerformanceOptimizerProps) {
  useEffect(() => {
    // Setup lazy loading for images
    if (lazyLoadImages) {
      setupLazyLoading(imageSelector, rootMargin)
    }

    // Prefetch critical resources
    if (prefetchUrls.length > 0) {
      prefetchResources(prefetchUrls)
    }

    // Optimize resource loading priority
    if (typeof document !== 'undefined') {
      // Find all non-critical scripts and mark them as async or defer
      document.querySelectorAll('script').forEach(script => {
        if (!script.hasAttribute('critical')) {
          script.setAttribute('loading', 'lazy')
        }
      })

      // Find all non-critical stylesheets and mark them for async loading
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (!link.hasAttribute('critical')) {
          link.setAttribute('media', 'print')
          link.setAttribute('onload', "this.media='all'")
        }
      })
    }
  }, [prefetchUrls, lazyLoadImages, imageSelector, rootMargin])

  // This component doesn't render anything
  return null
}
