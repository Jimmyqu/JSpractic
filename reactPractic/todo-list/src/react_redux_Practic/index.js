import React, { Component } from 'react';
import { actionAdd, actionDe, asyncGet } from './store/actions'
import { connect } from 'react-redux'

class ReactReduxApp extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
    }

    handleAdd = () => {
        this.props.actionAdd(1)
    }
    handleDe = () => {
        this.props.actionDe(1)
    }
    handleAsyncGet = () => {
        this.props.asyncGet()
    }
    render() {
        const { num } = this.props.state
        const customerInfo = this.props.state.info
        return (
            <div>
                <p>
                    num现在是{num}
                </p>
                {
                    customerInfo ? customerInfo.map(item => {
                     return Object.keys(item).map(i=>{
                            return(<p key={i}>{i}-{item[i]}</p>) 
                        })
                    }) : ''
                }
                <div>
                    <button onClick={this.handleAdd}>+</button>
                    <button onClick={this.handleDe}>-</button>
                    <button onClick={this.handleAsyncGet}>异步获取数据</button>
                </div>
            </div>
        );
    }
}

export default connect(  //绑定store state actions到组件
    state => ({ state: state }),
    {
        actionAdd,
        actionDe,
        asyncGet
    }
)(ReactReduxApp);