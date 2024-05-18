# A Useful Tool for Image 
## 介绍
纯前端[React](https://react.dev)配合[BaaS](https://cloud.memfiredb.com/auth/login?from=1HdvKv)能力0成本搭建的一个简易图床。
## 功能
核心功能包括：注册、登录、上传图片、图片删除、图床展示等。。

游客也可以直接上传图片，但有大小限制，且游客图床共享。

登录用户图床隔离。
## 技术栈
```css
react-create-app、styled-components、React-Router、Mobx、Antd、MemFire
```

## 链接
[网站预览链接](http://img.itrunner.cn)

## 使用到的BaaS能力
* 云数据库： 存储上传的图片信息
* 对象存储： 存储图片
* 用户认证：用户注册、登陆、登出
* API：提供API 供前端react调用
* 静态托管：托管此项目

## 部署
### BaaS准备
1. 登录[MemFire](https://cloud.memfiredb.com/auth/login?from=1HdvKv)创建应用
   ![创建应用](https://cokr41i5g6hc2l9v8i60.baseapi.memfiredb.com/storage/v1/object/public/images/public/%E5%88%9B%E5%BB%BA%E5%BA%94%E7%94%A8.png}

2. 创建数据库表 images
   ![创建数据库表](https://cokr41i5g6hc2l9v8i60.baseapi.memfiredb.com/storage/v1/object/public/images/public/%E5%88%9B%E5%BB%BA%E5%BA%93%E8%A1%A8.png)

3. 创建bucket images
   ![bukect](https://cokr41i5g6hc2l9v8i60.baseapi.memfiredb.com/storage/v1/object/public/images/public/bucket.png)

4. 配置bucket 访问策略，图简单可以直接设置允许所有用户可访问
   ![policy](https://cokr41i5g6hc2l9v8i60.baseapi.memfiredb.com/storage/v1/object/public/images/public/policy.png)

### 开发
1. 配置环境 `vim .env` 
```
SUPABASE_URL="https://cokr4***********baseapi.memfiredb.com"
SUPABASE_KEY="eyJhbGciOiJIUz***************************************************************************c"
```

![key](https://cokr41i5g6hc2l9v8i60.baseapi.memfiredb.com/storage/v1/object/public/images/public/key.png)

2. 安装依赖
   `yarn install`
3. 本地启动
   `yarn start`

### 部署
1. 打包
   ```
   yarn build
   cd build/
   zip -rq -y index.zip ./ 
   ```
2. 将包上传至静态托管
![deploy](https://cokr41i5g6hc2l9v8i60.baseapi.memfiredb.com/storage/v1/object/public/images/public/deploy.png)

3. 自定义域名
![domain](https://cokr41i5g6hc2l9v8i60.baseapi.memfiredb.com/storage/v1/object/public/images/public/domain.png)



