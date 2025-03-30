import { AVCanvas } from '@webav/av-canvas'
import { MP4Clip, VisibleSprite } from '@webav/av-cliper'
import {
  TimelineAction,
  TimelineRow,
  TimelineState,
} from '@xzdarcy/react-timeline-editor'
import { useEffect, useRef, useState } from 'react'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ExportOutlined,
  UploadOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Button, Spin, Tooltip } from 'antd'
import { TimelineEditor } from './timeline'
import eventBus, { EVENTS } from '../../helper/event'
import styles from './index.module.less'

export async function createFileWriter(extName = 'mp4') {
  const fileHandle = await (window as any).showSaveFilePicker({
    suggestedName: `WebAV-export-${Date.now()}.${extName}`,
  })
  return fileHandle.createWritable()
}

export type TLActionWithName = TimelineAction & {
  name: string
  thumbnails: string[]
}

export type Tthumbnail = {
  ts: number
  img: Blob
}

const uhaParam = new URLSearchParams(location.search).get('UHA') as string
const __unsafe_hardwareAcceleration__ = [
  'no-preference',
  'prefer-hardware',
  'prefer-software',
].includes(uhaParam)
  ? uhaParam
  : undefined

const actionSpriteMap = new WeakMap<TimelineAction, VisibleSprite>()

interface VideoProps {
  src: string
}

const defaultScale = 10

export default function Video({ src }: VideoProps) {
  const avCvs = useRef<AVCanvas | null>(null)
  const tlState = useRef<TimelineState | undefined>(undefined)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refContainer, setRefContainer] = useState<HTMLDivElement | null>(null)
  const [cvsWrapEl, setCvsWrapEl] = useState<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(defaultScale)
  const [tlData, setTLData] = useState<TimelineRow[]>([
    { id: '1-video', actions: [] },
    { id: '2-audio', actions: [] },
    { id: '3-img', actions: [] },
    { id: '4-text', actions: [] },
  ])

  // 初始化 Canvas
  const initCanvas = () => {
    if (!cvsWrapEl) return
    avCvs.current?.destroy()
    const dom = refContainer?.parentElement
    if (!dom) return
    const { width, height } = dom.getBoundingClientRect()
    const cvs = new AVCanvas(cvsWrapEl, {
      bgColor: '#1A1B1E',
      width: width - 24,
      height: height - 270,
    })
    cvs.on('timeupdate', (time) => tlState.current?.setTime(time / 1e6))
    cvs.on('playing', () => setPlaying(true))
    cvs.on('paused', () => setPlaying(false))
    avCvs.current = cvs
  }

  // 监听窗口大小变化
  useEffect(() => {
    initCanvas()
    window.addEventListener('resize', initCanvas)
    return () => window.removeEventListener('resize', initCanvas)
  }, [cvsWrapEl])

  // 监听视频加载
  useEffect(() => {
    const addFakeVideo = async () => {
      setLoading(true)
      setTimeout(async () => {
        const stream = (await fetch(src)).body!
        const spr = new VisibleSprite(
          new MP4Clip(stream, { __unsafe_hardwareAcceleration__ })
        )
        await avCvs.current?.addSprite(spr)
        addSpriteToTrack('1-video', spr, '视频')
        setLoading(false)
      }, 500)
    }
    eventBus.on(EVENTS.ADD_FAKE_VIDEO, addFakeVideo)
    return () => {
      eventBus.off(EVENTS.ADD_FAKE_VIDEO, addFakeVideo)
    }
  }, [avCvs, src])

  // 本地导入
  const handleLocalUpload = async () => {
    const stream = (await loadFile({ 'video/*': ['.mp4', '.mov'] })).stream()
    const spr = new VisibleSprite(
      new MP4Clip(stream, { __unsafe_hardwareAcceleration__ })
    )
    await avCvs.current?.addSprite(spr)
    addSpriteToTrack('1-video', spr, '视频')
  }

  // 公共方法：生成缩略图
  const generateThumbnails = async (spr: VisibleSprite, scale: number) => {
    const clip = spr.getClip()
    if (clip instanceof MP4Clip) {
      // 根据 scale 动态调整 step
      const res = await clip.thumbnails(100, {
        step: (3.2e6 /** 四秒 */ * scale) / defaultScale,
      })
      return res.map((item) => URL.createObjectURL(item.img))
    }
    return []
  }

  // 更新添加 Sprite 到轨道的方法，使用最新的 scale 更新 thumbnails
  const addSpriteToTrack = async (
    trackId: string,
    spr: VisibleSprite,
    name = ''
  ) => {
    const track = tlData.find(({ id }) => id === trackId)
    if (!track) return null

    spr.time.offset =
      spr.time.offset || Math.max(...track.actions.map((a) => a.end), 0) * 1e6
    if (spr.time.duration === Infinity) spr.time.duration = 10e6

    // 获取图像集合（例如从视频帧中提取图像）
    const thumbnails = await generateThumbnails(spr, scale)

    const action = {
      id: Math.random().toString(),
      start: spr.time.offset / 1e6,
      end: (spr.time.offset + spr.time.duration) / 1e6,
      effectId: '',
      name,
      thumbnails, // 存储图像集合作为关键帧
    }

    actionSpriteMap.set(action, spr)
    setTLData([
      ...tlData.filter((it) => it !== track),
      { ...track, actions: [...track.actions, action] },
    ])

    return action
  }

  // 当 scale 发生变化时，遍历 tlData，重新生成缩略图
  useEffect(() => {
    Promise.all(
      tlData.map(async (track) => {
        const updatedActions = await Promise.all(
          track.actions.map(async (action) => {
            const spr = actionSpriteMap.get(action)
            if (spr) {
              ;(action as TLActionWithName).thumbnails =
                await generateThumbnails(spr, scale)
            }
            return action
          })
        )
        return { ...track, actions: updatedActions }
      })
    ).then((updatedData) => {
      setTLData(updatedData)
    })
  }, [scale]) // 依赖 scale 和 tlData，确保每次 scale 变化时更新

  // 播放暂停
  const handlePlayPause = () => {
    if (!avCvs.current || !tlState.current) return
    playing
      ? avCvs.current?.pause()
      : avCvs.current?.play({ start: tlState.current.getTime() * 1e6 })
  }

  // 导出
  const handleExport = async () => {
    if (!avCvs.current) return
    ;(await avCvs.current.createCombinator({ __unsafe_hardwareAcceleration__ }))
      .output()
      .pipeTo(await createFileWriter())
  }

  return (
    <div className={styles.canvasWrap} ref={setRefContainer}>
      <div ref={setCvsWrapEl}></div>
      <Tooltip title="本地导入">
        <Button
          type="text"
          icon={<UploadOutlined className={styles.videoIcon} />}
          onClick={handleLocalUpload}
        />
      </Tooltip>
      <Tooltip title="播放">
        <Button
          type="text"
          icon={
            playing ? (
              <PauseCircleOutlined className={styles.videoIcon} />
            ) : (
              <PlayCircleOutlined className={styles.videoIcon} />
            )
          }
          onClick={handlePlayPause}
        />
      </Tooltip>
      <Tooltip title="导出">
        <Button
          type="text"
          icon={<ExportOutlined className={styles.videoIcon} />}
          onClick={handleExport}
        />
      </Tooltip>
      <TimelineEditor
        scale={scale}
        onScale={setScale}
        onSplitAction={(action) => {
          const spr = actionSpriteMap.get(action)
          if (spr) {
            // Create a new sprite with the same clip
            const newSprite = new VisibleSprite(spr.getClip())
            avCvs.current?.addSprite(newSprite)
            return addSpriteToTrack('1-video', newSprite, action.name)
          }
          return null
        }}
        timelineData={tlData}
        timelineState={tlState}
        onPreviewTime={(time) => {
          avCvs.current?.previewFrame(time * 1e6)
          return true
        }}
        onOffsetChange={(action) => {
          const spr = actionSpriteMap.get(action)
          if (spr) spr.time.offset = action.start * 1e6
        }}
        onDurationChange={({ action, start, end }) => {
          const spr = actionSpriteMap.get(action)
          if (spr && (end - start) * 1e6 <= spr.getClip().meta.duration) {
            spr.time.duration = (end - start) * 1e6
            return true
          }
          return false
        }}
        onDeleteAction={(action) => {
          const spr = actionSpriteMap.get(action)
          if (spr) avCvs.current?.removeSprite(spr)
          actionSpriteMap.delete(action)
          setTLData([...tlData])
        }}
      />
      {loading && (
        <div className={styles.loadingVideo}>
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      )}
    </div>
  )
}

// 加载文件
async function loadFile(accept: Record<string, string[]>) {
  const [fileHandle] = await (window as any).showOpenFilePicker({
    types: [{ accept }],
  })
  return await fileHandle.getFile()
}
