import {observable, action} from 'mobx'
import {Auth} from '../models'

class UserStore {
  //状态
  @observable currentUser = Auth.getCurrentUser()

  @action pullUser(user) {
    console.log(user)
    this.currentUser = user
  }

  @action resetUser() {
    this.currentUser = null
  }

}

export default new UserStore()  //直接导出一个对象
