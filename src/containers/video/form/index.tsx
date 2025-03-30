import {
  Row,
  Col,
  Image as AntdImage,
  Button,
  Space,
  Modal,
  Input,
  Tag,
  Switch,
  Radio,
  Progress,
} from 'antd'
import cs from 'classnames'
import styles from './index.module.less'
import { useEffect, useState } from 'react'
import eventBus, { EVENTS } from '../../../helper/event'
import UploadImage from '../../../components/upload'
import ThreeEditor from '../../../components/editor'
import cutoutPng from '../../../assets/demo/cutout.png'
import maskPng from '../../../assets/demo/mask.png'
import envWebp01 from '../../../assets/demo/env/env1.webp'
import envWebp02 from '../../../assets/demo/env/env2.webp'
import envWebp03 from '../../../assets/demo/env/env3.webp'
import envWebp04 from '../../../assets/demo/env/env4.webp'
import envWebp05 from '../../../assets/demo/env/env5.webp'
import envWebp06 from '../../../assets/demo/env/env6.webp'
import envWebp07 from '../../../assets/demo/env/env7.webp'
import envWebp08 from '../../../assets/demo/env/env8.webp'
import outputPng01 from '../../../assets/demo/output-image/output1.png'
import outputPng02 from '../../../assets/demo/output-image/output2.png'
import outputPng03 from '../../../assets/demo/output-image/output3.png'
import outputPng04 from '../../../assets/demo/output-image/output4.png'
import outputPng05 from '../../../assets/demo/output-image/output5.png'
import outputPng06 from '../../../assets/demo/output-image/output6.png'
import outputPng07 from '../../../assets/demo/output-image/output7.png'
import outputPng08 from '../../../assets/demo/output-image/output8.png'
import ImageSelector from '../../../components/image-selector'
import VideoPlayer from '../../../components/video-player'

const sceneAssets = [
  { src: envWebp01, alt: '场景1' },
  { src: envWebp02, alt: '场景2' },
  { src: envWebp03, alt: '场景3' },
  { src: envWebp04, alt: '场景4' },
  { src: envWebp05, alt: '场景5' },
  { src: envWebp06, alt: '场景6' },
  { src: envWebp07, alt: '场景7' },
  { src: envWebp08, alt: '场景8' },
]

const outputAssets = [
  { src: outputPng01, alt: '场景1' },
  { src: outputPng02, alt: '场景2' },
  { src: outputPng03, alt: '场景3' },
  { src: outputPng04, alt: '场景4' },
  { src: outputPng05, alt: '场景5' },
  { src: outputPng06, alt: '场景6' },
  { src: outputPng07, alt: '场景7' },
  { src: outputPng08, alt: '场景8' },
]

const { TextArea } = Input

const fallbackData =
  'data:image/png;base64,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'

interface FormProps {
  onChange: (value: any) => void
}

enum ProgressStep {
  BeforeStart = 0,
  AfterUpload = 1,
  AfterAnalyze = 2,
}

const Form = (props: FormProps) => {
  const { onChange } = props
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<ProgressStep>(ProgressStep.BeforeStart)
  const [outputSrc, setOutputSrc] = useState('')
  const [outputLoading, setOutputLoading] = useState(false)
  const [cameraControl, setCameraControl] = useState(true)
  const [cameraControlValue, setCameraControlValue] = useState()
  const [percent, setPercent] = useState(0)

  const afterUpload = () => {
    setStep(ProgressStep.AfterUpload)
  }

  const handleSelectScene = (url: string, index: number) => {
    if (outputLoading) {
      return
    }
    setOutputSrc(url)
    setOutputLoading(true)
    const image = new Image()
    const realSrc = outputAssets[index].src
    const time = Date.now()
    image.onload = () => {
      const duration = Date.now() - time
      // 假装需要500毫秒生成
      if (duration) {
        setTimeout(() => {
          setOutputSrc(realSrc)
          setOutputLoading(false)
        }, 500 - duration)
      } else {
        setOutputSrc(realSrc)
        setOutputLoading(false)
      }
    }
    image.src = realSrc
  }

  const toggleCameraControl = () => {
    setCameraControl(!cameraControl)
  }

  const handleCameraControlChange = (value: any) => {
    setCameraControlValue(value)
    onChange(value)
  }

  // Mock 分析数据
  useEffect(() => {
    if (percent === 100) {
      setTimeout(() => {
        setStep(ProgressStep.AfterAnalyze)
      }, 300)
      return
    }
    if (step === ProgressStep.AfterUpload) {
      setTimeout(() => {
        if (percent < 100) {
          setPercent(percent + 4)
        }
      }, 16)
    }
  }, [step, percent])

  return (
    <>
      <div className={styles.formContent}>
        <Row gutter={[0, 12]}>
          <UploadImage onChange={afterUpload} />
          {step === ProgressStep.AfterUpload && (
            <>
              <div>数据分析中...</div>
              <Progress percent={percent} />
            </>
          )}
          {step >= ProgressStep.AfterAnalyze && (
            <>
              <Col span={8}>
                <Tag color="#2b2c3a">抠图</Tag>
              </Col>
              <Col span={8}>
                <Tag color="#2b2c3a">Mask</Tag>
              </Col>
              <Col span={8}>
                <Tag color="#2b2c3a">3D模型</Tag>
              </Col>
              <Row gutter={4} justify="space-around" align="middle">
                <Col span={8}>
                  <AntdImage
                    src={cutoutPng}
                    fallback={fallbackData}
                    className={styles.imageSelect}
                    width={'100%'}
                  />
                </Col>
                <Col span={8}>
                  <AntdImage
                    src={maskPng}
                    fallback={fallbackData}
                    className={styles.imageSelect}
                    width={'100%'}
                  />
                </Col>
                <Col span={8}>
                  <ThreeEditor />
                </Col>
              </Row>
            </>
          )}
          {step >= ProgressStep.AfterAnalyze && (
            <>
              <label>场景</label>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <ImageSelector
                    images={sceneAssets}
                    onSelect={handleSelectScene}
                  />
                </Col>
                <Col span={24}>
                  <Button
                    size="large"
                    color="default"
                    variant="solid"
                    className={styles.customButton}
                    onClick={() => setOpen(true)}
                  >
                    Custom
                  </Button>
                  <Modal
                    title="动作录入"
                    centered
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                    width={1000}
                  >
                    <iframe
                      width="950"
                      height="600"
                      src="https://threejs.org/editor/"
                    />
                  </Modal>
                </Col>
                {outputSrc && (
                  <Col>
                    <AntdImage
                      style={outputLoading ? { filter: 'blur(10px)' } : {}}
                      src={outputSrc}
                      fallback={fallbackData}
                      className={styles.imageSelect}
                      width={'100%'}
                    />
                  </Col>
                )}
              </Row>
            </>
          )}
          {step >= ProgressStep.AfterAnalyze && (
            <>
              <Col span={20}>
                <label>视角</label>
              </Col>
              <Col span={4}>
                <Switch
                  disabled={!outputSrc}
                  defaultChecked={true}
                  onChange={toggleCameraControl}
                />
              </Col>
              {cameraControl && (
                <>
                  <VideoPlayer />
                  <Space>
                    <label>预置视角</label>
                    <Radio.Group
                      value={cameraControlValue}
                      className={styles.radioGroup}
                      onChange={(e) =>
                        handleCameraControlChange(e.target.value)
                      }
                    >
                      <Radio.Button value="moveLeft">Move Left</Radio.Button>
                      <Radio.Button value="moveUp">Move Up</Radio.Button>
                      <Radio.Button value="compress">Compress</Radio.Button>
                    </Radio.Group>
                  </Space>
                </>
              )}
            </>
          )}
          {step >= ProgressStep.AfterAnalyze && (
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <label>其它说明</label>
              </Col>
              <Col span={24}>
                <TextArea
                  className={styles.textarea}
                  rows={4}
                  placeholder="Positive Prompt"
                  maxLength={6}
                />
              </Col>
              <Col span={24}>
                <TextArea
                  className={styles.textarea}
                  rows={4}
                  placeholder="Negative Prompt"
                  maxLength={6}
                />
              </Col>
            </Row>
          )}
        </Row>
      </div>
      <div className={styles.formFooter}>
        <Button
          className={cs(styles.linearGradientButton, styles.footerButton)}
          type="primary"
          size="large"
          onClick={() => eventBus.emit(EVENTS.ADD_FAKE_VIDEO)}
        >
          Create
        </Button>
      </div>
    </>
  )
}

export default Form
