import React from 'react';
import { BrowserRouter as BRouter, Route, Link } from "react-router-dom";
import HomeView from '../views/home'
import ListView from '../views/list'



function RouterApp() {
  return (
    <BRouter>
        <ul>
            <li> <Link to="/">首页</Link> </li>
            <li><Link to="/list/">列表</Link> </li>
        </ul>
        <Route path="/" exact component={HomeView} />
        <Route path="/list/" component={ListView} />
    </BRouter>
  );
}
export default RouterApp;