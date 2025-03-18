import React, { useState } from 'react'
import { Upload, Modal, message } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.module.less'

interface UploadImageProps {
  multiple?: boolean
}

const UploadImage: React.FC<UploadImageProps> = ({ multiple = false }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewTitle, setPreviewTitle] = useState<string>('')

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file.originFileObj as File)
      })
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewTitle(file.name || '预览')
    setPreviewVisible(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList)
  }

  const beforeUpload = (file: File) => {
    const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(
      file.type
    )
    if (!isValidType) {
      message.error('只支持 JPEG, PNG, WEBP 格式的图片')
      return Upload.LIST_IGNORE
    }
    return false
  }

  return (
    <>
      <Upload
        className={styles.imageUpload}
        accept="image/jpeg,image/png,image/webp"
        listType={multiple ? 'picture' : 'picture-card'}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        multiple={multiple}
        showUploadList
      >
        {!multiple && fileList.length > 0 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
              上传或拖入图片，支持JPEG，PNG，WEBP
            </div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        title={previewTitle}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default UploadImage
