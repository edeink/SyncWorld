import { Avatar, Row, Col } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const UserProfile = () => {
  return (
    <div className={styles.userContainer}>
      <Row>
        <Avatar
          size={100}
          icon={<UserOutlined />}
          style={{ margin: '0 auto' }}
        />
      </Row>
      <Row>
        <Col span={24}>
          <p>用户名: 张三</p>
          <p>用户简介: 一个热爱编程的开发者</p>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <p>粉丝: 1200</p>
        </Col>
        <Col span={12}>
          <p>关注: 800</p>
        </Col>
        <Col span={12}>
          <p>作品被使用: 50 次</p>
        </Col>
        <Col span={12}>
          <p>作品获赞: 500 次</p>
        </Col>
      </Row>
    </div>
  )
}

export default UserProfile
