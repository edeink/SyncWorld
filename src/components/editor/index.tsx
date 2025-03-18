import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import * as THREE from 'three'

const ThreeEditor: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {/* 可移动的立方体 */}
      <TransformControls>
        <mesh ref={meshRef} scale={[1, 1, 1]}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </TransformControls>

      <OrbitControls />
    </Canvas>
  )
}

export default ThreeEditor
