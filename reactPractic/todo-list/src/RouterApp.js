import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import HomeView from './views/home'
import ListView from './views/list'



function RouterApp() {
  return (
    <Router>
        <ul>
            <li> <Link to="/">首页</Link> </li>
            <li><Link to="/list/">列表</Link> </li>
        </ul>
        <Route path="/" exact component={HomeView} />
        <Route path="/list/" component={ListView} />
    </Router>
  );
}
export default RouterApp;