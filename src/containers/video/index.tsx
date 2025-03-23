import { Col, Row } from 'antd'
import styles from './index.module.less'
import Form from './form'
import Video from '../../components/video-editor'
import videoMoveLeftSrc from '../../assets/demo/output-video/move-left.mp4'
import videoMoveUpSrc from '../../assets/demo/output-video/move-up.mp4'
import videoCompressSrc from '../../assets/demo/output-video/compress.mp4'
import { useState } from 'react'

enum Result {
  moveLeft = 'moveLeft',
  moveUp = 'moveUp',
  compress = 'compress',
}

const outputVideoAssets = {
  [Result.moveLeft]: videoMoveLeftSrc,
  [Result.moveUp]: videoMoveUpSrc,
  [Result.compress]: videoCompressSrc,
}

const VideoContainer = () => {
  const [videoSrc, setVideoSrc] = useState(outputVideoAssets.moveLeft)
  const onChange = (value: Result) => {
    setVideoSrc(outputVideoAssets[value])
  }
  return (
    <Row style={{ height: '100%' }}>
      <Col flex="436px" className={styles.formPanel}>
        <Form onChange={onChange} />
      </Col>
      <Col flex="auto" className={styles.videoWrapper}>
        <Video src={videoSrc} />
      </Col>
    </Row>
  )
}

export default VideoContainer
