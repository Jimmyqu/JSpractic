import React, { Component, Fragment } from 'react';
import 'antd/dist/antd.css'
import { Input, Button, List } from 'antd'
import store from './store/index'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(()=>{
      this.setState(store.getState())
       console.log(this.state)
    })
   
  }

  changeInputValue(e) {
    const action = {
      type: 'changeInput',
      value: e.target.value
    }
    store.dispatch(action)
  }
  
  handleAddItem(){
    const action = {
      type: 'addItem'
    }
    store.dispatch(action)
  }

  handleDel(index){
    const action = {
      type: 'delItem',
      index
    }
    console.log(index)
    store.dispatch(action)
  }

  render() {

    return (
      <Fragment>
        <div style={{ textAlign: "center", paddingTop: '30vh' }}>
          <Input onChange={(e) => this.changeInputValue(e)} placeholder='输入listItem' style={{ width: '250px', marginRight: "10px" }} />
          <Button onClick={()=>this.handleAddItem()} type="primary">添加</Button>
        </div>
        <div style={{ margin: '10px', textAlign: "center" }}>
          <div style={{ width: '300px', display: 'inline-block' }}>
            <List
              bordered
              dataSource={this.state.list}
              renderItem={(item ,index)=> (<List.Item onClick={()=>this.handleDel(index)}>{item}</List.Item>)}
            />
          </div>
        </div>
      </Fragment>

    );
  }
}

export default App;