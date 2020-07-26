import React, { Component } from 'react';
import store from './reduxStore/index'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num:store.getState()
    }
  }

  componentDidMount(){
    console.log(store.getState()) //组件里可以直接用getState()获得state对象
  }

  handleAdd(){
    store.dispatch({type:'add'})  //store.dispatch（action对象） Actions 的格式非常自由。只要它是个带有type属性的对象
  }

  handleDec(){
    store.dispatch({type:'dec'}) 
  }

  componentDidMount(){
    store.subscribe(()=>{
      console.log(store.getState())
      
    })
  }

  componentDidUpdate(){
    console.log('updated')
  }

  componentWillUnmount(){
    console.log('componentWillUnmount')
  }


  render() {
    return (
      <div>
        <header className="App-header">
          <p>
            {this.state.num}
          </p>
          <div>
            <button onClick={()=>this.handleAdd()}>+</button>
            <button onClick={()=>this.handleDec()}>-</button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
