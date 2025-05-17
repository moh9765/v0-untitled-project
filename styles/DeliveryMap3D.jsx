//npm install three @react-three/fiber @react-three/drei
//npm install framer-motion
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'

const DeliveryPath = () => {
  const points = [
    [0, 0, 0],
    [5, 2, 0],
    [10, 0, 0],
  ]

  return (
    <Line
      points={points}
      color="#00FFE4"
      lineWidth={2}
      dashed={true}
    />
  )
}

const DeliveryMap3D = () => (
  <Canvas camera={{ position: [0, 15, 15], fov: 45 }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    
    {/* مسار التوصيل */}
    <DeliveryPath />
    
    {/* المبنى */}
    <mesh position={[5, 1, 0]}>
      <boxGeometry args={[3, 2, 3]} />
      <meshStandardMaterial color="#2D2B5C" />
    </mesh>
    
    {/* الشحنة */}
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6C63FF" />
    </mesh>
    
    <OrbitControls enableZoom={false} />
  </Canvas>
)