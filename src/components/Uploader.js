import React, {useRef, useContext, useState, useEffect} from 'react'
import {useStores} from '../stores'
import {observer} from 'mobx-react'
import {Upload, Table, Input, Form, Button} from 'antd'
import {InboxOutlined} from '@ant-design/icons'
import {message, Spin} from 'antd'
import {supabase} from '../models'
import styled from 'styled-components'
import './Uploader.css'
import copy from 'copy-to-clipboard'

const {Dragger} = Upload
const Result = styled.div`
  border: 1px dashed #ccc;
  margin: 40px 80px 0;
  padding: 20px;
`

const H1 = styled.h1`
  margin: 20px 0;
  text-align: center;
`

const Image = styled.img`
  max-width: 100px;
`

const Wrapper = styled.div`
  box-sizing: content-box;
  height: 150px;
  padding: 20px;
  margin: 40px 80px;
  backgroundColor: transparent;
  border: 1px dashed #fff;
`

const Component = observer(() => {
    const [session, setSession] = useState(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log(session)
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }, [])

    const {ImageStore, UserStore} = useStores()

    const props = {
      showUploadList: false,
      beforeUpload: file => {
        ImageStore.setFile(file)
        ImageStore.setFilename(file.name)

        window.file = file
        if (!/(svg$)|(png$)|(jpg$)|(gif$)|(jpeg$)/ig.test(file.type)) {
          message.error('只能上传.png/.jpg/.svg/.gif/.jpeg格式的图片')
          return false
        }
        if (!session && file.size > 1024 * 1024) {
          message.error('游客只能上传大小在1M以内的图片')
          return false
        }
        if (session && file.size > 5 * 1024 * 1024) {
          message.error('登录用户只能上传大小在5M以内的图片')
          return false
        }

        ImageStore.upLoad()
          .then((serverFile) => {
            console.log(serverFile)
            console.log('上传成功')
            message.success('图片上传成功')
          }).catch(() => {
          console.log('上传失败')
        })
        return false
      }
    }

    const EditableContext = React.createContext()
    const EditableRow = ({index, ...props}) => {
      const [form] = Form.useForm()
      return (
        <Form form={form} component={false}>
          <EditableContext.Provider value={form}>
            <tr {...props} />
          </EditableContext.Provider>
        </Form>
      )
    }
    const EditableCell = ({
                            title,
                            editable,
                            children,
                            dataIndex,
                            record,
                            handleSave,
                            ...restProps
                          }) => {
      const [editing, setEditing] = useState(false)
      const inputRef = useRef()
      const form = useContext(EditableContext)
      useEffect(() => {
        if (editing) {
          inputRef.current.focus()
        }
      }, [editing])

      const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({
          [dataIndex]: record[dataIndex],
        })
      }

      const save = async e => {
        try {
          const values = await form.validateFields()
          toggleEdit()
          handleSave({...record, ...values})
        } catch (errInfo) {
          console.log('Save failed:', errInfo)
        }
      }

      let childNode = children

      if (editable) {
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        )
      }
      return <td {...restProps}>{childNode}</td>
    }


    class EditableTable extends React.Component {
      constructor(props) {
        super(props)
        this.columns = [
          {
            title: '文件名',
            dataIndex: 'name',
            width: '15%',
            render: text => <a>{ImageStore.filename}</a>,
          },
          {
            title: '图片预览',
            dataIndex: 'age',
            render: image => <Image src={ImageStore.serverFile.attributes.url.attributes.url}/>,
          },
          {
            title: '最大宽度（可选）',
            dataIndex: 'width',
            editable: true,
            width: '25%',
            render: text => text ?
              <div>{text}</div> : 0
          },
          {
            title: '最大高度（可选）',
            dataIndex: 'height',
            editable: true,
            width: '25%',
            render: text => text ?
              <div>{text}</div> : 0

          },
          {
            title: '操作',
            dataIndex: 'operation',
            width: '15%',
            render: text => <Button type={'primary'} onClick={() => copy(`${ImageStore.serverFile.attributes.url.attributes.url + '?imageView2/0' + '/w/' + this.state.dataSource[0].width + '/h/' + this.state.dataSource[0].height}`) && message.success('成功复制到剪贴板！')}>复制链接</ Button>,
          },
        ]


        this.state = {
          dataSource: [
            {
              key: '0',
              width: 0,
              height: 0,
            }
          ],
        }
      }

      handleSave = row => {
        const newData = [...this.state.dataSource]
        const index = newData.findIndex(item => row.key === item.key)
        const item = newData[index]
        newData.splice(index, 1, {...item, ...row})
        this.setState({
          dataSource: newData,
        })
      }

      render() {
        const {dataSource} = this.state
        const components = {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }
        const columns = this.columns.map(col => {
          if (!col.editable) {
            return col
          }

          return {
            ...col,
            onCell: record => ({
              record,
              editable: col.editable,
              dataIndex: col.dataIndex,
              title: col.title,
              handleSave: this.handleSave,
            }),
          }
        })

        return (
          <div>
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </div>
        )
      }
    }


    return (
      <>
        <Wrapper>
          <Spin tip="图片上传中..." spinning={ImageStore.isUploading}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined/>
              </p>
              <p className="ant-upload-text">点击或拖拽上传图片</p>
              <p className="ant-upload-hint">
                游客图床共享，登录用户图床隔离，图片最大1M(登录用户最大5M)
              </p>
            </Dragger>
          </Spin>
        </Wrapper>

        {
          ImageStore.serverFile ?
            <Result>
              <div>
                <EditableTable/>
              </div>
            </Result>
            : null
        }
      </>
    )
  }
)


export default Component
