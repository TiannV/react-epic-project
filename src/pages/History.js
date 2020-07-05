import React from 'react'
import List from '../components/List'
import './History.css'

let style = {
   height: '80vh',
   padding: '20px',
   border: '1px #fff dashed',
   width: '100%',

}

let wrapperStyle ={
  width: '100% +18px',
  border: '1px solid black',
  backgroundColor: '#fff',
  height: '74vh',
  overflow: 'scroll',
  padding: '0 30px'
}


function History() {
  return (
    <div style={style} >
      <div style={wrapperStyle}>
        <List />
      </div>

    </div>
  )
}

export default History