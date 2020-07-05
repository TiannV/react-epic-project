import React from 'react'
import { useStores } from '../stores'
import { observer } from 'mobx-react'
import styled from 'styled-components'

const Tips = styled.div`
  background: orange;
  opacity: 0.8;
  padding: 10px;
  margin: -20px 0 30px 0;
  color: #fff;
  border-radius: 5px;
`

const Component = observer(
  ({children}) => {
    const { UserStore } = useStores()
    return (
      <>
        {
          UserStore.currentUser ? null :
            <Tips>{children}</Tips>
        }
      </>
    )
  }
)

export default Component