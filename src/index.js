import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'antd/dist/antd.css';
import Model from './models'
import * as serviceWorker from './serviceWorker'
import {
  HashRouter
} from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>  {/*用router监控所有的组件*/}
      <App/>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
