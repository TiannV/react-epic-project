import React from 'react'
import styled from 'styled-components'

const Footer = styled.footer`
  padding: 10px 100px;
  text-align: center;

`
const Title = styled.div`
  font-size: 15px;
  color: #e8eaed;
`

function Component() {
  return (
    <Footer>
      <Title>Copyright © 2020 Paula Hu</Title>
    </Footer>
  )
}

export default Component