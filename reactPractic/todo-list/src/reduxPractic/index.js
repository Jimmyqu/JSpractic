import React, { Component } from 'react';
import * as Actions from './store/actions'

class ReduxApp extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    componentDidMount(){
    }
    handleAdd = ()=>{
        //分发事件后 要订阅更新
        this.props.store.dispatch(Actions.num_increment(+this.refs.select.value))
        //最佳实践 写道store actions中 统一创建
        //this.props.store.dispatch({type:'num_increment',data:+this.refs.select.value})
    }
    handleDe = ()=>{
        this.props.store.dispatch(Actions.num_decrement(+this.refs.select.value))
        // this.props.store.dispatch({type:'num_decrement',data:+this.refs.select.value})
    }
    render() { 
        const num =  this.props.store.getState()
        return ( 
            <div>
              <p>num现在是{num}</p>
              <select ref='select'>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
              </select>
              <button onClick={this.handleAdd}>+</button>
              <button onClick={this.handleDe}>-</button>
            </div>
         );
    }
}
 
export default ReduxApp;