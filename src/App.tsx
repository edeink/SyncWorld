import React from 'react'
import {
  OpenAIOutlined,
  VideoCameraOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme, Row, Col, ConfigProvider } from 'antd'
import styles from './App.module.less'
import VideoUI from './components/video'
import Form from './components/form'

const { Header, Content, Sider } = Layout

const items = [
  {
    key: '2',
    icon: <VideoCameraOutlined />,
    label: '视频生成',
  },
  {
    key: '1',
    icon: React.createElement(UserOutlined),
    label: '用户中心',
  },
]

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <ConfigProvider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <OpenAIOutlined style={{ color: 'white' }} />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Layout>
          <Sider width={200} style={{ background: colorBgContainer }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              items={items}
            />
          </Sider>
          <Layout>
            <Content
              style={{
                margin: '24px',
                minHeight: 'calc(100vh - 112px)',
              }}
            >
              <Row gutter={24} style={{ height: '100%' }}>
                <Col flex="436px" className={styles.formPanel}>
                  <Form />
                </Col>
                <Col flex="auto" className="video-wrapper">
                  <VideoUI />
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App
