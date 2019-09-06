import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch,Redirect } from 'react-router-dom'
import HomeView from './compnent/homeView'
import ListView from './compnent/listView'

class RouterApp extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <BrowserRouter>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: '1' }}>
                        <ul>
                            <li> <Link to="/">首页</Link> </li>
                            <li><Link to="/list/">列表</Link> </li>
                        </ul>
                    </div>
                    <div style={{ flex: '4' }}>
                        <Switch>
                            <Route path="/" exact component={HomeView} />
                            <Route path="/list/" component={ListView} />
                            <Redirect to='/'></Redirect>  
                        </Switch>

                    </div>

                </div>

            </BrowserRouter>
        );
    }
}

export default RouterApp;