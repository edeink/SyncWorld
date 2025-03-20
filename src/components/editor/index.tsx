import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Model from './model'
import LightIndicator from './light'
import { Vector3 } from 'three'

const ThreeEditor: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
      <color attach="background" args={['#25272c']} />
      <ambientLight intensity={2} />
      <LightIndicator position={new Vector3(2, 2, -0)} />
      {/* <LightIndicator position={new Vector3(2, -2, -0)} /> */}
      {/* <LightIndicator position={new Vector3(-2, 2, -0)} /> */}
      {/* <LightIndicator position={new Vector3(-2, -2, -0)} /> */}
      <LightIndicator position={new Vector3(0, 0, 2)} intensity={4} />
      {/* <LightIndicator position={new Vector3(0, 0, -2)}  intensity={4}/> */}
      <Model />
      <OrbitControls />
    </Canvas>
  )
}

export default ThreeEditor
