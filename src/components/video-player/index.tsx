import React, { useRef, useState, useEffect } from 'react'
import { Button, Col, Row } from 'antd'
import leftVideo from '../../assets/demo/map/arc-left.mp4'
import rightVideo from '../../assets/demo/map/arc-right.mp4'
import {
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
} from '@ant-design/icons'

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideo, setCurrentVideo] = useState(rightVideo)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.currentTime = elapsedTime
  }, [elapsedTime])

  const updateTime = (time: number) => {
    if (!videoRef.current) {
      return
    }
    setElapsedTime(Math.min(time, videoRef.current.duration))
  }

  // 向左
  const turnLeft = () => {
    if (!videoRef.current) {
      return
    }
    if (currentVideo === rightVideo) {
      // 如果当前视频无法再向左，则切换到向左的视频
      if (elapsedTime < 1) {
        setCurrentVideo(leftVideo)
        updateTime(1)
      } else {
        updateTime(elapsedTime - 1)
      }
    } else {
      updateTime(elapsedTime + 1)
    }
  }

  // 向右
  const turnRight = () => {
    if (!videoRef.current) {
      return
    }
    if (currentVideo === leftVideo) {
      // 如果当前视频无法再向左，则切换到向左的视频
      if (elapsedTime < 1) {
        setCurrentVideo(rightVideo)
        updateTime(1)
      } else {
        updateTime(elapsedTime - 1)
      }
    } else {
      updateTime(elapsedTime + 1)
    }
  }

  return (
    <>
      <Button
        style={{ width: '100%', color: 'white' }}
        onClick={turnLeft}
        type="text"
        icon={<UpOutlined />}
      />
      <Row justify="space-between" align="middle">
        <Col span={2}>
          <Button
            onClick={turnLeft}
            type="text"
            icon={<LeftOutlined />}
            style={{ color: 'white' }}
          />
        </Col>
        <Col span={20}>
          <video
            key={currentVideo}
            ref={videoRef}
            width={341}
            height={223}
            controls={false}
          >
            <source src={currentVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Col>
        <Col span={2}>
          <Button
            onClick={turnRight}
            type="text"
            icon={<RightOutlined />}
            style={{ color: 'white' }}
          />
        </Col>
      </Row>
      <Button
        style={{ width: '100%', color: 'white' }}
        onClick={turnLeft}
        type="text"
        icon={<DownOutlined />}
      />
    </>
  )
}

export default VideoPlayer
