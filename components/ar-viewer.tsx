"use client"

import { useEffect, useRef } from 'react'
import { ARCanvas, ARMarker } from '@artcom/react-three-arjs'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, OrbitControls, Box } from '@react-three/drei'
import * as THREE from 'three'

const ARScene = () => {
  const boxRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (boxRef.current) {
      boxRef.current.rotation.y = clock.getElapsedTime()
    }
  })

  return (
    <ARCanvas
      camera={{ position: [0, 0, 0] }}
      onCreated={({ gl }) => {
        gl.setSize(window.innerWidth, window.innerHeight)
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <ARMarker
        type="pattern"
        patternUrl="/data/patterns/pattern-1.patt"
      >
        <Box ref={boxRef} args={[1, 1, 1]}>
          <meshStandardMaterial color="#6C63FF" metalness={0.8} roughness={0.2} />
        </Box>
      </ARMarker>

      <OrbitControls enableZoom={false} />
    </ARCanvas>
  )
}

export const ARViewer = () => {
  const [arSupported, setArSupported] = useState(false)

  useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-ar').then(setArSupported)
    }
  }, [])

  if (!arSupported) {
    return (
      <div className="ar-fallback">
        <h3>AR not supported on this device</h3>
        <p>Please try on a compatible mobile device</p>
      </div>
    )
  }

  return (
    <div className="ar-container">
      <Canvas>
        <ARScene />
      </Canvas>
      
      <button 
        className="ar-close-button"
        onClick={() => setShowAR(false)}
      >
        Close AR
      </button>
    </div>
  )
}