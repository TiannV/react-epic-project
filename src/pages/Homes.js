import React from 'react'
import {observer} from 'mobx-react'
import {useStores} from '../stores'
import Uploader from '../components/Uploader'
import Tips from '../components/Tips'
import titleUrl from '../components/1.png'
import styled from 'styled-components'

const Title = styled.img`
  margin: 70px auto;
  display: block;
`

const Home = observer(
  () => {
    const {UserStore} = useStores()
    return (
      <>
        <Tips>请先登录再上传文件!</Tips>
        <Title src={titleUrl} />
        <Uploader />
      </>
    )
  }
)

export default Home