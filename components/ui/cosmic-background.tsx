"use client"

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface CosmicBackgroundProps {
  children: React.ReactNode
}

export function CosmicBackground({ children }: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize the cosmic background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create stars
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number; pulse: number; pulseSpeed: number }[] = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.05,
        pulse: 0,
        pulseSpeed: Math.random() * 0.05 + 0.01
      })
    }

    // Create glow points
    const glowPoints: { x: number; y: number; radius: number; color: string; pulse: number; pulseSpeed: number }[] = []
    const colors = ['rgba(255, 130, 255, 0.8)', 'rgba(130, 130, 255, 0.8)', 'rgba(255, 200, 100, 0.8)']

    for (let i = 0; i < 5; i++) {
      glowPoints.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 80 + 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01
      })
    }

    // Animation loop
    let animationFrameId: number
    let time = 0

    const render = () => {
      time += 0.01

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#1a0b2e')
      gradient.addColorStop(0.5, '#2a1052')
      gradient.addColorStop(1, '#3b1a75')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw glow points first (behind stars)
      glowPoints.forEach(point => {
        point.pulse += point.pulseSpeed

        // Calculate pulsing radius
        const currentRadius = point.radius * (0.8 + Math.sin(point.pulse) * 0.2)

        // Create radial gradient for glow
        const glow = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, currentRadius
        )

        // Extract base color and create transparent version
        const baseColor = point.color
        const transparentColor = baseColor.replace(/[\d.]+\)$/, '0)')

        glow.addColorStop(0, baseColor)
        glow.addColorStop(1, transparentColor)

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(point.x, point.y, currentRadius, 0, Math.PI * 2)
        ctx.fill()

        // Slowly move the glow points
        point.x += Math.sin(time * 0.5) * 0.5
        point.y += Math.cos(time * 0.3) * 0.5

        // Keep within bounds
        if (point.x < -point.radius) point.x = canvas.width + point.radius
        if (point.x > canvas.width + point.radius) point.x = -point.radius
        if (point.y < -point.radius) point.y = canvas.height + point.radius
        if (point.y > canvas.height + point.radius) point.y = -point.radius
      })

      // Draw stars
      stars.forEach(star => {
        star.pulse += star.pulseSpeed
        const pulseFactor = 0.7 + Math.sin(star.pulse) * 0.3

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius * pulseFactor, 0, Math.PI * 2)

        // Add glow to stars
        const starGlow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * 3 * pulseFactor
        )

        starGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        starGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = starGlow
        ctx.fill()

        // Draw the star core
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Move stars with a slight wave
        star.y += star.speed
        star.x += Math.sin(time + star.y * 0.1) * 0.2

        // Reset stars that go off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
      })

      // Add a central glow effect
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.6

      const centralGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )

      // Pulsing central glow
      const pulseIntensity = 0.2 + Math.sin(time) * 0.1

      centralGlow.addColorStop(0, `rgba(180, 120, 255, ${pulseIntensity})`)
      centralGlow.addColorStop(0.5, `rgba(180, 120, 255, ${pulseIntensity * 0.5})`)
      centralGlow.addColorStop(1, 'rgba(180, 120, 255, 0)')

      ctx.fillStyle = centralGlow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export function FloatingIcon({
  icon,
  color = "#ff80ff",
  size = 40,
  delay = 0,
  position
}: {
  icon: React.ReactNode;
  color?: string;
  size?: number;
  delay?: number;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
}) {
  // Generate random position if not provided
  const positionStyle = position || {
    top: `${Math.random() * 70 + 15}%`,
    left: `${Math.random() * 70 + 15}%`,
  };

  return (
    <motion.div
      className="absolute"
      style={{
        ...positionStyle,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}80, 0 0 60px ${color}40`,
        zIndex: 5,
        backdropFilter: 'blur(8px)',
      }}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.8 }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, 30, 15, 0],
        opacity: [0.7, 0.95, 0.7],
        scale: [1, 1.1, 1, 0.95, 1],
        rotate: [0, 5, 0, -5, 0]
      }}
      transition={{
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
        times: [0, 0.25, 0.5, 0.75, 1]
      }}
    >
      {/* Add inner glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}80 0%, ${color}00 70%)`,
          opacity: 0.6,
        }}
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          delay: delay + 0.5,
        }}
      />

      {/* Icon container */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          delay: delay + 1,
        }}
      >
        {icon}
      </motion.div>
    </motion.div>
  )
}
