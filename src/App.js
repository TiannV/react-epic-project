import React, {Suspense, lazy} from 'react';
import './App.css';
import Header from './components/Header'
import Footer from './components/Footer'
import Loading from './components/Loading'

import {
  Switch,
  Route
} from 'react-router-dom'

// import Home from './pages/Homes'
// import History from './pages/History'
// import About from './pages/About'

//懒加载模块
const Home = lazy(()=> import('./pages/Homes'))
const History = lazy(()=> import('./pages/History'))
const About = lazy(()=> import('./pages/About'))
const Login = lazy(()=> import('./pages/Login'))
const Register = lazy(()=> import('./pages/Register'))

function App() {
  return (
    <>
      <Header/>
      <main>
        <Suspense fallback={<Loading />}> {/*完整组件写法*/}
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/history' component={History} />
          {/*<Route path='/about' component={About} />*/}
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
