import {observable, action} from 'mobx'
import {Auth, Uploader} from '../models'
import { message } from 'antd'

class ImageStore {
  //状态
  @observable filename = ''
  @observable file = null
  @observable isUploading = false
  @observable serverFile = null

  @action setFilename(newFilename) {
    this.filename = newFilename
  }

  @action setFile(newFile) {
    this.file = newFile
  }

  @action upLoad() {
    this.isUploading = true
    this.serverFile = null
    return new Promise(((resolve, reject) => {
      Uploader.add(this.file, this.filename)
        .then(serverFile => {
          this.serverFile = serverFile
          resolve(serverFile)
        }).catch(error => {
        message.error('图片上传失败')
          reject(error)
        }).finally(()=> {
          this.isUploading = false
      })
    }))
  }

  @action reset() {
  this.isUploading = false
  this.serverFile = null
  }
}

export default new ImageStore()