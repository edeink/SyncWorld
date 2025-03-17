import { Image, Spin, Skeleton } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import Masonry from 'react-masonry-css'

import styles from './index.module.less'

const getRandomImage = () => {
  const height = Math.floor(Math.random() * 300 + 200)
  return {
    width: 300,
    height,
    src: `https://picsum.photos/300/${height}`,
    loaded: false,
  }
}

const PreviewContainer = () => {
  const [images, setImages] = useState(
    Array.from({ length: 10 }, getRandomImage)
  )
  const [loading, setLoading] = useState(false)
  const observerRef = useRef(null)

  // 加载更多图片
  const loadMoreImages = useCallback(() => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      setImages((prev) => [
        ...prev,
        ...Array.from({ length: 10 }, getRandomImage),
      ])
      setLoading(false)
    }, 1500)
  }, [loading])

  // 监听滚动，触发懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreImages()
        }
      },
      { rootMargin: '100px' }
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loadMoreImages])

  // 处理图片加载完成
  const handleImageLoad = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, loaded: true } : img))
    )
  }

  return (
    <div className={styles.waterfallContainer}>
      {/* Masonry 瀑布流布局 */}
      <Masonry
        breakpointCols={{ default: 4, 1100: 3, 768: 2, 500: 1 }}
        className={styles.masonryGrid}
        columnClassName={styles.masonryColumn}
      >
        {images.map((img, index) => (
          <div key={index} className={styles.masonryItem}>
            {!img.loaded && <Skeleton.Image className={styles.skeleton} />}
            <Image
              src={img.src}
              width="100%"
              style={{ display: img.loaded ? 'block' : 'none' }}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </Masonry>
      {/* 触底加载 */}
      <div ref={observerRef} className={styles.loadingTrigger}>
        {loading && <Spin size="large" />}
      </div>
    </div>
  )
}

export default PreviewContainer
