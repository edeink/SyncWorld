import {
  Timeline,
  TimelineAction,
  TimelineRow,
  TimelineState,
} from '@xzdarcy/react-timeline-editor'
import { useState } from 'react'
import {
  ZoomOutOutlined,
  ZoomInOutlined,
  DeleteOutlined,
  SplitCellsOutlined,
} from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import styles from './index.module.less'
import { TLActionWithName } from '.'

export const TimelineEditor = ({
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
          const actionComp = action.thumbnails
            ? action.thumbnails.map((item) => {
                return <img src={URL.createObjectURL(item.img)} key={item.ts} />
              })
            : action.name

          if (action.id === activeAction?.id) {
            return <div className="active-action">{actionComp}</div>
          }
          return actionComp
        }}
        autoScroll
      />
    </>
  )
}
