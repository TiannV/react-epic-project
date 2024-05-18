import React, {Suspense, lazy} from 'react';
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Loading from './components/Loading'
import {supabase} from './models'
import {
  Switch,
  Route
} from 'react-router-dom'
import md5 from 'js-md5'

const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs')
// import Home from './pages/Homes'
// import History from './pages/History'
// import About from './pages/About'

//懒加载模块
const Home = lazy(()=> import('./pages/Homes'))
const History = lazy(()=> import('./pages/History'))
const About = lazy(()=> import('./pages/About'))
const Login = lazy(()=> import('./pages/Login'))
const Register = lazy(()=> import('./pages/Register'))

   const CLIENT_ID = process.env.LINUXDO_CLIENT_ID
   const CLIENT_SECRET = process.env.LINUXDO_CLIENT_SECRET
   const REDIRECT_URI = process.env.LINUXDO_REDIRECT_URI
   const USER_ENDPOINT = process.env.LINUXDO_USER_ENDPOINT
   const url = new URL(window.location.href); // �~N��~O~V�~S�~I~M URL
   const params = new URLSearchParams(url.search); // �~H~[建 URLSearchParams 对象
   axios.defaults.timeout = 3000000;
   const code = params.get('code'); // �~N��~O~V�~O~B�~U� 'name'
   if (url.href.search('linuxdo') != -1) {
      window.location.href = "https://connect.linux.do/oauth2/authorize?response_type=code&state=ttt1&client_id="+CLIENT_ID
   }

async function handleAuthentication(email, password) {
    try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) {
                const { data:res, error:error1 } = await supabase.auth.signUp({
                    email: email,
                    password: password,
               })
            }
    } catch (error) {
                console.error('Error', error.message);
            }
        window.location.href ='/'
}  

   if (code) {
    var getlinuxdo = false
    var linuxdo_user = null
    try {
        let data = JSON.stringify({
            "code": code,
            "state": "ttt1"
        });
        axios.post(USER_ENDPOINT, data, {
            auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {
            linuxdo_user = response.data
            var email = response.data + "@linux.do"
            var password =  md5(response.data + process.env.SALT)
            if (linuxdo_user && linuxdo_user.search("ETIMEDOUT") == -1) {
                handleAuthentication(email, password).then(() => {
                    console.log("用户登录成功");
                }).catch((error) => {
                    console.error("登录失败", error);
                })
           }
        }).catch((error) => {
           alert(error.response.data)
           console.log(error);
        });
    } catch (error) {
        console.error('Error during token fetch or user info retrieval:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error', error.message);
        }
        window.location.href ='/'
    }

  }


function App() {
  return (
    <>
      <Header/>
      <main>
        <Suspense fallback={<Loading />}> {/*完整组件写法*/}
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/history' component={History} />
          <Route path='/about' component={About} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
        </Switch>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
