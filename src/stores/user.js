import {observable, action} from 'mobx'
import {Auth} from '../models'

class UserStore {
  //状态
  @observable currentUser = null

  @action pullUser() {
    this.currentUser = Auth.getCurrentUser()
  }

  @action resetUser() {
    this.currentUser = null
  }

}

export default new UserStore()  //直接导出一个对象