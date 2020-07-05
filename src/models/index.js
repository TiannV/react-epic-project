import AV, {Query, User} from 'leancloud-storage'

AV.init({
  appId: 'mKBoPo3JbzfS3F25F87Qi78q-gzGzoHsz',
  appKey: 'tik25FdYrwTKjktccMJlShuT',
  serverURL: 'https://mkbopo3j.lc-cn-n1-shared.com'
})

const Auth = {
  register(username, password) {
    let user = new User()
    user.setUsername(username)
    user.setPassword(password)
    return new Promise((resolve, reject) => {
      user.signUp().then(loginedUser => {
        resolve(loginedUser)
      }, error => {
        reject(error)
      })
    })
  },

  login(username, password) {
    return new Promise((resolve, reject) => {
      User.logIn(username, password).then(loginedUser => {
          resolve(loginedUser)
        }, error => {
          reject(error)
        }
      )
    })
  },

  logout() {
    User.logOut()
  },

  getCurrentUser() {
    return User.current()
  }
}

const Uploader = {
  add(file, filename) {
    const item = new AV.Object('Image')
    const avFile = new AV.File(filename,file)
    item.set('filename',filename)
    item.set('owner',AV.User.current())
    item.set('url',avFile)
    return new Promise((resolve, reject) => {
      item.save().then((serverFile) => {
        resolve(serverFile)
      }, error => {
        reject(error)
      })
    })
  },
  find({page=0, limit=10}) {
    const query = new AV.Query('Image')
    query.include('owner')
    query.limit(limit)
    query.skip(page*limit)
    query.equalTo('owner', AV.User.current())
    query.descending('createdAt')
    return new Promise((resolve, reject) => {
      query.find()
        .then(results => resolve(results))
        .catch(error => reject(error))
    })
  },
  deleteItem(id) {
    const todo = AV.Object.createWithoutData('Image', id)
    todo.destroy()
    return new Promise((resolve, reject) => {
      todo.destroy()
        .then(results=> resolve(results,console.log('删除对象')))
        .catch( error => reject(error))
    })
  }
}

window.Uploader = Uploader


export {
  Auth,
  Uploader
}