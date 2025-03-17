import {
  OpenAIOutlined,
  VideoCameraOutlined,
  UserOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import styles from './App.module.less'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import VideoContainer from './containers/video'
import PreviewContainer from './containers/preview'
import UserProfile from './containers/user'
import Logo from './assets/logo.webp'

const { Header, Content, Sider } = Layout

const items = [
  {
    key: '/preview',
    icon: <BulbOutlined />,
    label: '灵感广场',
  },
  {
    key: '/video',
    icon: <VideoCameraOutlined />,
    label: '视频生成',
  },
  {
    key: '/user',
    icon: <UserOutlined />,
    label: '用户中心',
  },
]

const Sidebar = () => {
  const location = useLocation() // 获取当前路径
  const navigate = useNavigate()

  return (
    <Menu
      className={styles.sideMenu}
      mode="inline"
      selectedKeys={[location.pathname]} // 让菜单选中当前路由
      onClick={(e) => navigate(e.key)} // 点击菜单跳转
      items={items}
    />
  )
}

const App = () => {
  return (
    <Router>
      <Header
        className={styles.navBar}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <img src={Logo} alt="logo" style={{ width: '40px', height: '40px' }} />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{ borderTop: '1px' }}
          className={styles.sideBar}
        >
          <Sidebar />
        </Sider>
        <Content
          className={styles.content}
          style={{
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Routes>
            <Route path="/preview" element={<PreviewContainer />} />
            <Route path="/video" element={<VideoContainer />} />
            <Route path="/user" element={<UserProfile />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  )
}

export default App
