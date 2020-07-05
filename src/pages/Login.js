import {Form, Input, Button, Divider} from 'antd'
import React from 'react'
import styled from 'styled-components'
import { useStores } from '../stores'
import { useHistory } from 'react-router-dom'

const Wrapper = styled.div`
  max-width: 600px;
  margin: 30px auto;
  box-shadow: 2px 2px 4px 0 rgba(0,0,0,0.2);
  border-radius: 4px;
  padding: 20px;
  background: #fff;
  opacity: 0.8;
`

const Title = styled.h1`
  text-align: left;
  margin: 0 0 10px 10px;
  font-size: 20px
`

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 20,
  },
}

const Component = () => {
  const { AuthStore } = useStores()
  const history = useHistory()

  const onFinish = values => {
    console.log('Success:', values)
    AuthStore.setUsername(values.username)
    AuthStore.setPassword(values.password)
    AuthStore.login()
      .then(() => {
        console.log('登录成功，跳转到首页')
        history.push('/')
      })
      .catch(() => {
        console.log('登录失败，什么都不做')
      })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  const validateUsername = (rule, value) => {
    if(/\W/.test(value)) return Promise.reject('只能是字母、数字或下划线')       //\w是指出来字母、数字、下划线外的其他字符
    if(value.length < 4 || value.length > 10) return Promise.reject('长度为4~10个字符')
    return Promise.resolve()
  }

  return (
    <Wrapper>
      <Title>登录</Title>
      <Divider style={{marginTop: '0'}} />
      <Form style={{marginTop: '50px'}}
        {...layout}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入您的用户名!',
            },
            {
              validator: validateUsername   //validateUsername函数
            }
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入您的密码!',
            },
            {
              min: 4,
              message: '最少4个字符'
            },
            {
              max: 10,
              message: '最多10个字符'
            }
          ]}
        >
          <Input.Password/>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Wrapper>
  )
}

export default Component