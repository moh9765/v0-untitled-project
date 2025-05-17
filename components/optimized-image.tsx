"use client"

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  lowQualitySrc?: string
  loadingColor?: string
}

export function OptimizedImage({
  src,
  alt,
  lowQualitySrc,
  loadingColor = '#f3f4f6',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false)
    setError(false)
  }, [src])

  // Default placeholder if no lowQualitySrc is provided
  const placeholderSrc = lowQualitySrc || '/placeholder.svg'

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: loadingColor }}>
      {/* Main image */}
      <Image
        src={error ? placeholderSrc : src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoadingComplete={() => setIsLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />

      {/* Placeholder/low quality image shown while loading */}
      {!isLoaded && !error && lowQualitySrc && (
        <Image
          src={lowQualitySrc}
          alt={alt}
          className={`absolute inset-0 transition-opacity duration-300 blur-sm scale-105 ${className}`}
          {...props}
        />
      )}
    </div>
  )
}
