import React, { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3, PerspectiveCamera } from 'three'
import modelUrl from '../../assets/demo/model.glb'
import { useThree } from '@react-three/fiber'

const Model: React.FC = () => {
  const { scene } = useGLTF(modelUrl)
  const { camera } = useThree()

  useEffect(() => {
    if (scene && camera instanceof PerspectiveCamera) {
      // 计算模型的包围盒并居中
      const box = new Box3().setFromObject(scene)
      const center = box.getCenter(new Vector3())
      scene.position.sub(center)

      // 调整相机位置以适应模型
      const size = box.getSize(new Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180) // 将角度转换为弧度
      const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
      camera.position.set(0, 0, cameraZ * 2)
      camera.lookAt(0, 0, 0)

      // 绕 Y 轴旋转相机 180 / 5 度
      const angle = Math.PI / 5
      const x =
        camera.position.x * Math.cos(angle) -
        camera.position.z * Math.sin(angle)
      const z =
        camera.position.x * Math.sin(angle) +
        camera.position.z * Math.cos(angle)
      camera.position.set(x, camera.position.y, z)
      camera.lookAt(0, 0, 0)
    }
  }, [scene, camera])

  return scene ? <primitive object={scene} /> : null
}

export default Model
