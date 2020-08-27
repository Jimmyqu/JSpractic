import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom'

import MyMenu from './compnent/Menu'
// import ListView from './compnent/listView'
import { Layout,Button } from 'antd';


import Home from './pages/home'
import RichText from './pages/richText';
import ErrorPage from './pages/errorPage';
import Login from './pages/login/login';
const { Header, Footer, Sider, Content } = Layout;


class RouterApp extends Component {
    constructor(props) {

        super(props);
        this.state = {
            collapsed:false
        }
    }

    render() {
        return (
            JSON.parse(window.localStorage.getItem('isLogin')) ?
                <Layout>
                    <BrowserRouter>
                        <Sider style={{ height: '100vh' }} collapsed={this.state.collapsed} >
                            <MyMenu />
                        </Sider>
                        <Layout>
                            <Header>
                            <Button onClick={()=>{ 
                                window.localStorage.setItem('isLogin', 'false')
                                window.location.href = '/';
                             }}>退出登陆</Button>
                             <Button onClick={()=>{ 
                                 this.setState({
                                    collapsed:!this.state.collapsed
                                 })
                             }}>切换</Button>
                            </Header>
                            <Content>
                                <Switch>
                                    <Route path="/home" component={Home}></Route>
                                    <Route path="/richText" component={RichText}></Route>
                                    <Route component={ErrorPage}></Route>
                                </Switch>
                            </Content>
                            <Footer>Footer</Footer>
                        </Layout>
                    </BrowserRouter>
                </Layout> :
                <Login/>
        )
    }
}

export default RouterApp;