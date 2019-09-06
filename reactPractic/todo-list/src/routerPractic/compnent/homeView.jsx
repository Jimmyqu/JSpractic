import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom'

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div>
                <h2>HomeView</h2>
                <ul>
                    <li><Link to='home1'>home1</Link></li>
                    <li><Link to='home2'>home2</Link></li>
                </ul>
                <Switch>
                    <Route path='/home1'>1111111111111</Route>
                    <Route path='/home2'>2222222</Route>
                </Switch>
            </div>
        );
    }
}

export default HomeView;