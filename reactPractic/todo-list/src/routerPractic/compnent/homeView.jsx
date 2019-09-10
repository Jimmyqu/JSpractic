import React, { Component } from 'react';
import { Route, Link,Redirect } from 'react-router-dom'

function Topic({ match }) {
    return (
        <div>
            home1
            <p>Param: {match.params.id}</p>
        </div>
    )
}


function HomeView({ match }) {
    return (
        <div>
            <h2>HomeView</h2>
            <ul>
                <li>
                    <Link to={`${match.url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
                </li>
            </ul>
            <div>
                <Route path={`${match.path}/:id`} component={Topic} />
                <Route
                    exact
                    path={match.path}
                    render={() => <h3>Please select a topic.</h3>}
                />
               
            </div>

        </div>
    );
}
export default HomeView;