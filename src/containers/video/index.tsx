import { Col, Row } from 'antd'
import styles from './index.module.less'
import Form from './form'
import Video from '../../components/video'

const VideoContainer = () => (
  <Row style={{ height: '100%' }}>
    <Col flex="436px" className={styles.formPanel}>
      <Form />
    </Col>
    <Col flex="auto" className={styles.videoWrapper}>
      <Video />
    </Col>
  </Row>
)

export default VideoContainer
