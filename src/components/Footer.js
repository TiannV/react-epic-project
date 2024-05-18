import React from 'react'
import styled from 'styled-components'

const Footer = styled.footer`
  padding: 10px 100px;
  text-align: center;

`
const Title = styled.div`
  font-size: 15px;
  color: #e8eaed8c;
`

function Component() {
  return (
    <Footer>
      <Title>MIT Licensed | Copyright © 2024 tw</Title>
    </Footer>
  )
}

export default Component
