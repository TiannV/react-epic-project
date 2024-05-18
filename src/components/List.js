import React, {useState,  useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import InfiniteScroll from 'react-infinite-scroller';
import { List, Spin, Button, message } from 'antd';
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
                <Img src={item.url} alt={item.filename} width={200} height={200} style={{ objectFit: 'cover', borderRadius: '5px' }} />
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
    </div>


  );
});

export default Component;
