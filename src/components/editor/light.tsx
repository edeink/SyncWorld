import { useEffect, useRef } from 'react'
import { DirectionalLight, Vector3 } from 'three'

interface LightProps {
  position: Vector3
  showPointLight?: boolean
  intensity?: number
}

const LightIndicator: React.FC<LightProps> = (props: LightProps) => {
  const { position, intensity = 1, showPointLight = false } = props
  const lightPosition = new Vector3(position.x, position.y, position.z)
  const lightRef = useRef<DirectionalLight>(null)

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.copy(lightPosition)
    }
  }, [])

  return (
    <>
      {/* 创建一个小球来表示光源位置 */}
      {showPointLight && (
        <mesh position={lightPosition}>
          <sphereGeometry args={[1]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
      {/* 创建方向光源 */}
      <directionalLight ref={lightRef} intensity={intensity} />
    </>
  )
}

export default LightIndicator
