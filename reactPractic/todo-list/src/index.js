import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// redux练习start
// import App from './App';
// ReactDOM.render(<App />, document.getElementById('root'));
// redux练习end

// 路由练习start
// import RouterApp from './router/RouterApp'
// ReactDOM.render(<RouterApp />, document.getElementById('root'));
// 路由练习end

// 每个xxxPractic 是个独立练习模块
//评论发表start
// import CommentApp from './commentPractic/index'
// ReactDOM.render(<CommentApp />, document.getElementById('root'));
//评论发表end

// //搜索start
// import SearchApp from './serchPractic/index'
// ReactDOM.render(<SearchApp />, document.getElementById('root'));
//搜索end

//第二个路由start
import RouterApp from './routerPractic/index'
ReactDOM.render(<RouterApp />, document.getElementById('root'));
//第二个路由end







// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
