import { AVCanvas } from '@webav/av-canvas'
import { ImgClip, MP4Clip, VisibleSprite } from '@webav/av-cliper'
import {
  Timeline,
  TimelineAction,
  TimelineRow,
  TimelineState,
} from '@xzdarcy/react-timeline-editor'
import { useEffect, useRef, useState } from 'react'
import {
  ZoomOutOutlined,
  ZoomInOutlined,
  DeleteOutlined,
  SplitCellsOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ExportOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import Fake01VidoeSrc from '../../assets/01.mp4'
import Fake02VideoSrc from '../../assets/02.mp4'
import Fake03VideoSrc from '../../assets/03.mp4'
import { Button, Tooltip } from 'antd'
import eventBus, { EVENTS } from '../../helper/event'
import styles from './index.module.less'

export async function createFileWriter(
  extName = 'mp4'
): Promise<FileSystemWritableFileStream> {
  const fileHandle = await (window as any).showSaveFilePicker({
    suggestedName: `WebAV-export-${Date.now()}.${extName}`,
  })
  return fileHandle.createWritable()
}

type TLActionWithName = TimelineAction & { name: string }

const uhaParam = new URLSearchParams(location.search).get('UHA') as string
const __unsafe_hardwareAcceleration__ = [
  'no-preference',
  'prefer-hardware',
  'prefer-software',
].includes(uhaParam)
  ? uhaParam
  : undefined

const TimelineEditor = ({
  timelineData: tlData,
  onPreviewTime,
  onOffsetChange,
  onDurationChange,
  onDeleteAction,
  timelineState,
  onSplitAction,
}: {
  timelineData: TimelineRow[]
  timelineState: React.MutableRefObject<TimelineState | undefined>
  onPreviewTime: (time: number) => void
  onOffsetChange: (action: TimelineAction) => void
  onDurationChange: (args: {
    action: TimelineAction
    start: number
    end: number
  }) => void
  onDeleteAction: (action: TimelineAction) => void
  onSplitAction: (action: TLActionWithName) => void
}) => {
  const [scale, setScale] = useState(10)
  const [activeAction, setActiveAction] = useState<TLActionWithName | null>(
    null
  )
  return (
    <>
      <Tooltip title="缩放">
        <Button
          type="text"
          icon={<ZoomOutOutlined className={styles.videoIcon} />}
          onClick={() => setScale(scale + 1)}
        />
      </Tooltip>
      <Tooltip title="缩放">
        <Button
          type="text"
          icon={<ZoomInOutlined className={styles.videoIcon} />}
          onClick={() => setScale(scale - 1 > 1 ? scale - 1 : 1)}
        />
      </Tooltip>
      <Tooltip title="删除">
        <Button
          type="text"
          icon={<DeleteOutlined className={styles.videoIcon} />}
          disabled={activeAction == null}
          onClick={() => {
            if (activeAction == null) return
            onDeleteAction(activeAction)
          }}
        />
      </Tooltip>
      <Tooltip title="分割">
        <Button
          type="text"
          icon={<SplitCellsOutlined className={styles.videoIcon} />}
          disabled={activeAction == null}
          onClick={() => {
            if (activeAction == null) return
            onSplitAction(activeAction)
          }}
        />
      </Tooltip>
      <Timeline
        ref={(v) => {
          if (v == null) return
          timelineState.current = v
        }}
        onChange={() => {}}
        style={{ width: '100%', height: '200px' }}
        scale={scale}
        editorData={tlData}
        effects={{}}
        scaleSplitCount={5}
        onClickTimeArea={(time) => {
          onPreviewTime(time)
          return true
        }}
        onCursorDragEnd={(time) => {
          onPreviewTime(time)
        }}
        onActionResizing={({ dir, action, start, end }) => {
          if (dir === 'left') return false
          return onDurationChange({ action, start, end })
        }}
        onActionMoveEnd={({ action }) => {
          onOffsetChange(action)
        }}
        onClickAction={(_, { action }) => {
          // @ts-expect-error
          setActiveAction(action)
        }}
        // @ts-expect-error
        getActionRender={(action: TLActionWithName) => {
          const baseStyle = 'h-full justify-center items-center flex text-white'
          if (action.id === activeAction?.id) {
            return (
              <div
                className={`${baseStyle} border border-red-300 border-solid box-border`}
              >
                {action.name}
              </div>
            )
          }
          return <div className={baseStyle}>{action.name}</div>
        }}
        autoScroll
      />
    </>
  )
}

const actionSpriteMap = new WeakMap<TimelineAction, VisibleSprite>()

let index = 0

const videoAssets = [Fake01VidoeSrc, Fake02VideoSrc, Fake03VideoSrc]

export default function App() {
  const [avCvs, setAVCvs] = useState<AVCanvas | null>(null)
  const tlState = useRef<TimelineState | undefined>(undefined)

  const [playing, setPlaying] = useState(false)

  const [refContainer, setRefContainer] = useState<HTMLDivElement | null>(null)
  const [cvsWrapEl, setCvsWrapEl] = useState<HTMLDivElement | null>(null)
  const [tlData, setTLData] = useState<TimelineRow[]>([
    { id: '1-video', actions: [] },
    { id: '2-audio', actions: [] },
    { id: '3-img', actions: [] },
    { id: '4-text', actions: [] },
  ])

  const init = () => {
    if (cvsWrapEl == null) return
    avCvs?.destroy()
    const dom = refContainer?.parentElement
    if (!dom) {
      return
    }
    const { width, height } = dom.getBoundingClientRect()

    const cvs = new AVCanvas(cvsWrapEl, {
      bgColor: '#1A1B1E',
      width: width - 24,
      height: height - 270,
    })
    setAVCvs(cvs)
    cvs.on('timeupdate', (time) => {
      if (tlState.current == null) return
      tlState.current.setTime(time / 1e6)
    })
    cvs.on('playing', () => {
      setPlaying(true)
    })
    cvs.on('paused', () => {
      setPlaying(false)
    })
  }

  // 初始化编辑器
  useEffect(() => {
    init()
    window.addEventListener('resize', init)
    return () => {
      window.removeEventListener('resize', init)
    }
  }, [cvsWrapEl])

  // 注册相关事件
  useEffect(() => {
    if (!avCvs) {
      return
    }
    const addFakeVideo = async () => {
      const stream = (await fetch(videoAssets[index % videoAssets.length]))
        .body!
      index++
      const spr = new VisibleSprite(
        new MP4Clip(stream, {
          __unsafe_hardwareAcceleration__,
        })
      )
      await avCvs?.addSprite(spr)
      addSprite2Track('1-video', spr, '视频')
    }

    window.addEventListener('resize', init)
    eventBus.on(EVENTS.ADD_FAKE_VIDEO, addFakeVideo)
    return () => {
      eventBus.off(EVENTS.ADD_FAKE_VIDEO, addFakeVideo)
    }
  }, [avCvs])

  // 添加新的轨道
  function addSprite2Track(trackId: string, spr: VisibleSprite, name = '') {
    const track = tlData.find(({ id }) => id === trackId)
    if (track == null) return null

    const start =
      spr.time.offset === 0
        ? Math.max(...track.actions.map((a) => a.end), 0) * 1e6
        : spr.time.offset

    spr.time.offset = start
    // image
    if (spr.time.duration === Infinity) {
      spr.time.duration = 10e6
    }

    const action = {
      id: Math.random().toString(),
      start: start / 1e6,
      end: (spr.time.offset + spr.time.duration) / 1e6,
      effectId: '',
      name,
    }

    actionSpriteMap.set(action, spr)

    track.actions.push(action)
    setTLData(
      tlData
        .filter((it) => it !== track)
        .concat({ ...track })
        .sort((a, b) => a.id.charCodeAt(0) - b.id.charCodeAt(0))
    )
    return action
  }

  return (
    <div className={styles.canvasWrap} ref={(el) => setRefContainer(el)}>
      <div ref={(el) => setCvsWrapEl(el)}></div>
      <Tooltip title="本地导入">
        <Button
          type="text"
          icon={<UploadOutlined className={styles.videoIcon} />}
          onClick={async () => {
            const stream = (
              await loadFile({ 'video/*': ['.mp4', '.mov'] })
            ).stream()
            const spr = new VisibleSprite(
              new MP4Clip(stream, {
                __unsafe_hardwareAcceleration__,
              })
            )
            await avCvs?.addSprite(spr)
            addSprite2Track('1-video', spr, '视频')
          }}
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
          onClick={async () => {
            if (avCvs == null || tlState.current == null) return
            if (playing) {
              avCvs.pause()
            } else {
              avCvs.play({ start: tlState.current.getTime() * 1e6 })
            }
          }}
        />
      </Tooltip>
      <Tooltip title="导出">
        <Button
          type="text"
          icon={<ExportOutlined className={styles.videoIcon} />}
          onClick={async () => {
            if (avCvs == null) return
            ;(await avCvs.createCombinator({ __unsafe_hardwareAcceleration__ }))
              .output()
              .pipeTo(await createFileWriter())
          }}
        />
      </Tooltip>
      <TimelineEditor
        timelineData={tlData}
        timelineState={tlState}
        onPreviewTime={(time) => {
          avCvs?.previewFrame(time * 1e6)
        }}
        onOffsetChange={(action) => {
          const spr = actionSpriteMap.get(action)
          if (spr == null) return
          spr.time.offset = action.start * 1e6
        }}
        onDurationChange={({ action, start, end }) => {
          const spr = actionSpriteMap.get(action)
          if (spr == null) return false
          const duration = (end - start) * 1e6
          if (duration > spr.getClip().meta.duration) return false
          spr.time.duration = duration
          return true
        }}
        onDeleteAction={(action) => {
          const spr = actionSpriteMap.get(action)
          if (spr == null) return
          avCvs?.removeSprite(spr)
          actionSpriteMap.delete(action)
          const track = tlData
            .map((t) => t.actions)
            .find((actions) => actions.includes(action))
          if (track == null) return
          track.splice(track.indexOf(action), 1)
          setTLData([...tlData])
        }}
        onSplitAction={async (action: TLActionWithName) => {
          const spr = actionSpriteMap.get(action)
          if (avCvs == null || spr == null || tlState.current == null) return
          const newClips = await (spr as any)
            .getClip()
            .split(tlState.current.getTime() * 1e6 - spr.time.offset)
          // 移除原有对象
          avCvs.removeSprite(spr)
          actionSpriteMap.delete(action)
          const track = tlData.find((t) => t.actions.includes(action))
          if (track == null) return
          track.actions.splice(track.actions.indexOf(action), 1)
          setTLData([...tlData])
          // 添加分割后生成的两个新对象
          const sprsDuration = [
            tlState.current.getTime() * 1e6 - spr.time.offset,
            spr.time.duration -
              (tlState.current.getTime() * 1e6 - spr.time.offset),
          ]
          const sprsOffset = [
            spr.time.offset,
            spr.time.offset + sprsDuration[0],
          ]
          for (let i = 0; i < newClips.length; i++) {
            const clip = newClips[i]
            const newSpr = new VisibleSprite(clip)
            if (clip instanceof ImgClip) {
              newSpr.time.duration = sprsDuration[i]
            }
            newSpr.time.offset = sprsOffset[i]
            await avCvs.addSprite(newSpr)
            addSprite2Track(track.id, newSpr, action.name)
          }
        }}
      ></TimelineEditor>
    </div>
  )
}

async function loadFile(accept: Record<string, string[]>) {
  const [fileHandle] = await (window as any).showOpenFilePicker({
    types: [{ accept }],
  })
  return (await fileHandle.getFile()) as File
}
