import React ,{useEffect, useState, useMemo} from 'react';
import {
    BrowserRouter as Router, // router 类型
    Switch,               //路由包装
    Route,                //单个路由
    Link,                    //跳转链接
    useParams,          //设置动态值，获取路由
    useRouteMatch,        //
    Prompt,           //阻止路由转场 在单个路由内引入次组件，
    Redirect          // 放在单个路由内 重定向
  } from "react-router-dom";


function Child(props) {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    let { id } = useParams();

    //path 是相对父路由的路径 一般多层路由中使用
    //url 是获取相对父路由的链接
    let { path, url } = useRouteMatch() 

    console.log(props)
    return (
        <div>
        <h3>ID: {id}</h3>
        </div>
    );
}

function App(props) {
  return (
    < >
        <header>
            头部不变
        </header>
        
        <Router>
            <ul>
                <li>
                    <Link to='/'>home</Link>
                </li>
                <li>
                    <Link  to='/about'>about</Link>
                </li>
                <li>
                    <Link  to='/dashboard'>dashboard</Link>
                </li>
            </ul>
            <Switch>    
                <Route exact path="/" component={()=><div>home</div>}>
                </Route>
                <Route path="/about" component={()=><div>about</div>}>
                    <Redirect to="/dashboard" />
                </Route>
                <Route path="/dashboard" component={()=><div>dashboard</div>}>
                </Route>              
            </Switch>
        </Router>
       
    </>
   
  );
}

export default App;
