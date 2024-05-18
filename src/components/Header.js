import React, {useState, useEffect} from 'react'
import LogoURL from './flower.png'
import {NavLink, useHistory} from 'react-router-dom'
import styled from 'styled-components'
import {Button} from 'antd'
import {useStores} from '../stores'
import {observer} from 'mobx-react'
import {supabase} from '../models'
const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs')

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
    const [session, setSession] = useState(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log(session)
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }, [])


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
        <StyledLink to='/history' activeClassName='active'>图床</StyledLink>
        <StyledALink target="_blank" href='https://github.com/TiannV/react-epic-project.git' activeClassName='active'>Github</StyledALink>
        <StyledALink target="_blank" href='https://cloud.memfiredb.com/auth/login?from=1HdvKv' activeClassName='active'>BaaS</StyledALink>
        <StyledLink to='/about' activeClassName='active'>关于</StyledLink>
      </nav>
      <Login>
        {
          session ? <>
              {session.user.email} <StyledButton type="primary"
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
