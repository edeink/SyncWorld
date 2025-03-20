import React, { useState } from 'react'
import { Row, Col, Image } from 'antd'
import styles from './index.module.less'

interface ImageItem {
  src: string
  alt: string
}

interface ImageSelectorProps {
  images: ImageItem[]
  onSelect: (src: string, index: number) => void
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ images, onSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleSelect = (src: string, index: number) => {
    setSelectedImage(src)
    onSelect(src, index)
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      {images.map((image, index) => (
        <Col key={index} xs={6} sm={6} md={6} lg={6} xl={6}>
          <div
            onClick={() => handleSelect(image.src, index)}
            className={`${styles.imageContainer} ${selectedImage === image.src ? 'selected' : ''}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width="100%"
              height="auto"
              preview={false}
              className={styles.imageItem}
            />
          </div>
        </Col>
      ))}
    </Row>
  )
}

export default ImageSelector
