import React, {useState,  useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import InfiniteScroll from 'react-infinite-scroller';
import { List, Spin, Button, message, Modal } from 'antd';
import styled from 'styled-components';
import {supabase} from '../models'

const Img = styled.img`
  width: 100px;
  height: 120px;
  object-fit: contain;
  border: 1px solid #eee;
`;

const Component = observer((attr, item) => {
    const [session, setSession] = useState(null)
  const [visible, setVisible] = useState(false); // 控制模态框显示状态
  const [currentImage, setCurrentImage] = useState(null); 
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

  const { HistoryStore } = useStores();

  const loadMore = () => {
    HistoryStore.find();
  };

  const deleteItem = (id) => {
    HistoryStore.delete(id)
    let dom = document.getElementById(`${id}`)
    console.log(dom)
    dom.remove(attr, item)
  }

  const deleteDom = (id) => {

  }

  const copyToClipboard = (url) => {
    copy(url).then(() => {
      message.success('链接已复制');
    }).catch(err => {
      message.error('复制失败');
    });
  };

  function copy(textToCopy) {
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(textToCopy);
    } else {
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "absolute";
      textArea.style.opacity = 0;
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
             document.execCommand('copy') ? res() : rej();
                    textArea.remove();
                });
            }
        }

  useEffect(() => {
    console.log('进入组件')
    return () => {
      console.log('卸载')
      HistoryStore.reset();
    }
  }, []);

  const handleImageClick = (url) => {
    setCurrentImage(url); // 设置当前选中的图片
    setVisible(true); // 显示模态框
  };

  const handleCancel = () => {
    setVisible(false); // 隐藏模态框
  };

  return (
<div style={{ margin: '20px' }}>
      <InfiniteScroll
        initialLoad={true}
        pageStart={0}
        loadMore={loadMore}
        hasMore={!HistoryStore.isLoading && HistoryStore.hasMore}
        useWindow={true}
      >
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={HistoryStore.list}
          renderItem={item => (
            <List.Item key={item.id} id={`${item.id}`} style={{ padding: '10px', border: '1px solid rgb(18 16 16)', borderRadius: '5px' }}>
              <div style={{ textAlign: 'center' }}>
                <Img src={item.url} alt={item.filename} width={200} height={200} style={{ objectFit: 'cover', borderRadius: '5px' }} 
                   onClick={() => handleImageClick(item.url)}
                />
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <h5>{item.filename}</h5>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <Button type="link" onClick={() => copyToClipboard(item.url)}>复制链接</Button>
              </div>
        {
          session ? <>
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <Button type="primary" danger onClick={() =>  deleteItem(item.id) && deleteDom(item.id)} >
                  删除记录
                </Button>
              </div>
          </> : <>
          </>
        }
            </List.Item>
          )}
        >
          {HistoryStore.isLoading && HistoryStore.hasMore && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Spin tip="加载中" />
            </div>
          )}
        </List>
      </InfiniteScroll>
      <Modal
        visible={visible}
        onCancel={handleCancel}
        footer={null} // 不显示底部操作按钮
        width="80%"
          bodyStyle={{ // 设置内容区域的样式
    height: '80vh', // 设置内容区域高度为视口高度的80%
    overflow: 'auto', // 如果内容超出，则显示滚动条
    padding: '20px', // 根据需要调整内边距
  }}
        style={{ top: 30 }} // 模态框距离顶部的距离
      >
        {currentImage && (
          <img
            src={currentImage}
            alt="Enlarged Image"
      style={{
        objectFit: 'contain', // 保持图片比例
        margin: '0 auto', // 居中显示
        display: 'block', // 移除图片的默认边框和间距
        maxHeight: '80%', // 最大高度不超过模态框的80%
        maxWidth: '100%', // 最大宽度不超过模态框的80%
      }}
          />
        )}
      </Modal>

    </div>
  );
});

export default Component;
