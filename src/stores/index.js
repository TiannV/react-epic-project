import React, {createContext, useContext} from 'react'
import AuthStore from './auth'
import UserStore from './user'
import ImageStore from './image'
import HistoryStore from './history'

const context = createContext({
  AuthStore,
  UserStore,
  ImageStore,
  HistoryStore
})

window.stores = {
  AuthStore,
  UserStore,
  ImageStore,
  HistoryStore
}   //测试Header中，这个对象的结构

export const useStores = () => useContext(context) //导出一个函数，当别人import时得到useStores，就相当于调用这个函数，就会得到AuthStore