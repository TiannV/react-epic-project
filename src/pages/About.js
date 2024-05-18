import React from 'react'
import './About.css';

function About() {
  return (
    <div className="about-container">
      <p>
        纯前端<a href="https://react.dev/" target="_blank">React</a>配合<a href="https://cloud.memfiredb.com/auth/login?from=1HdvKv" target="_blank">BaaS</a>能力0成本搭建的一个简易图床。
      </p>
      <p>
        核心功能包括：注册、登录、上传图片、图片删除、图床展示等。。
      </p>
      <p>
        游客也可以直接上传图片，但有大小限制，且游客图床共享。登录用户图床隔离。
      </p>
      <div className="team-section">
        <h2>欢迎使用</h2>
      </div>
    </div>
  );

}

export default About
