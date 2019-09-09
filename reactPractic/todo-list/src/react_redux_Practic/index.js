import React, { Component } from 'react';
import {actionAdd,actionDe} from './store/actions'
import {connect} from 'react-redux'

class ReactReduxApp extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
    }

    handleAdd=()=>{
        this.props.actionAdd(1)
    }
    handleDe=()=>{
        this.props.actionDe(1)
    }
    render() { 
        const {num} = this.props.state
        return ( 
            <div>
                <p>
                    num现在是{num}
                </p>
                <button onClick={this.handleAdd}>+</button>
                <button onClick={this.handleDe}>-</button>
            </div>
         );
    }
}
 
export default connect(  //绑定store state actions到组件
    state=>({state:state}), 
    {
        actionAdd,
        actionDe
    }
)(ReactReduxApp);