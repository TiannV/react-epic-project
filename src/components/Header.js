import React, {useState} from 'react'
import LogoURL from './flower.png'
import {NavLink, useHistory} from 'react-router-dom'
import styled from 'styled-components'
import {Button} from 'antd'
import {useStores} from '../stores'
import {observer} from 'mobx-react'

const Header = styled.header`
  background-color: #02101f;
  display:flex;
  align-items:center;
  padding: 10px 100px;
`
const Logo = styled.img`
  height:30px;
`
const StyledLink = styled(NavLink)`
  color:#fff;
  margin-left: 40px;
  font-size:15px;
  &.active {
    border-bottom:1px solid #fff;
  }
 
`
const StyledALink = styled.a`
  color:#fff;
  margin-left: 40px;
  font-size:15px;
  &.active {
    border-bottom:1px solid #fff;
  }
`

const Login = styled.div`
  margin-left: auto;
  color: #fff
`

const StyledButton = styled(Button)`
  margin-left: 20px
`

const Component = observer(() => {
  const {UserStore, AuthStore} = useStores()
  const history = useHistory()

  const handleLogout = () => {
    AuthStore.logout()
  }

  const handleLogin = () => {
    console.log('跳转到登录页面')
    history.push('./login')
  }

  const handleRegister = () => {
    console.log('跳转到注册页面')
    history.push('/register')
  }

  return (
    <Header>
      <Logo src={LogoURL}/>
      <nav>
        <StyledLink to='/' activeClassName='active' exact>首页</StyledLink>
        <StyledLink to='/history' activeClassName='active'>上传历史</StyledLink>
        <StyledALink target="_blank" href='https://github.com/Paulahu' activeClassName='active'>Github</StyledALink>
        <StyledALink target="_blank" href='https://juejin.im/user/5e609571f265da57337d0ebe/posts' activeClassName='active'>Blog</StyledALink>
      </nav>
      <Login>
        {
          UserStore.currentUser ? <>
            {UserStore.currentUser.attributes.username} <StyledButton type="primary"
                                                                      onClick={handleLogout}>注销</StyledButton>
          </> : <>
            <StyledButton type="primary" onClick={handleLogin}>登录</StyledButton>
            <StyledButton type="primary" onClick={handleRegister}>注册</StyledButton>
          </>
        }
      </Login>
    </Header>
  )
})

export default Component