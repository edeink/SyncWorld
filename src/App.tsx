import React from 'react'
import {
  OpenAIOutlined,
  VideoCameraOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Row, Col } from 'antd'
import styles from './App.module.less'
import colorStyles from './color.module.less'
import VideoUI from './components/video'
import Form from './components/form'
import cs from 'classnames'

const { Header, Content, Sider } = Layout

const items = [
  {
    key: '1',
    icon: <VideoCameraOutlined />,
    label: '视频生成',
  },
  {
    key: '2',
    icon: React.createElement(UserOutlined),
    label: '用户中心',
  },
]

const App = () => {
  return (
    <Layout>
      <Header
        className={styles.navBar}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <OpenAIOutlined style={{ color: 'white' }} />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{ borderTop: '1px' }}
          className={styles.sideBar}
        >
          <Menu
            className={styles.sideMenu}
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            items={items}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Row style={{ height: '100%' }}>
              <Col flex="436px" className={styles.formPanel}>
                <Form />
              </Col>
              <Col flex="auto" className={styles.videoWrapper}>
                <VideoUI />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App
