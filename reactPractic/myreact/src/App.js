import React from 'react';
import logo from './logo.svg';
import { Component } from 'react'
import './App.css';


const ThemeContext = React.createContext({
  background: 'red',
  color: 'white'
});


function Text(props,context){
  let handleClick=(context)=>{
    context.background='red'
    console.log(context)
  }
  return (
    <div>
       <ThemeContext.Consumer>
        {context => (
         <div>
          <button onClick={()=>handleClick(context)}>11{context.color}</button>
          <p>{context.background}</p>
         </div>
        )}
      </ThemeContext.Consumer>
    </div>
  )
}

class App extends Component{
  constructor(props){
    super()
    this.state={
      passVal:{
        background: 'green', color: 'white'
      },
      isLike:false
    }
  }

  componentDidMount(){
    console.log(this)
  }

  handleClick(event){
    console.log(event)
    console.log(this.state)
  } 
  hanldeToggle(event){
    event.stopPropagation()
    this.setState({isLike:!this.state.isLike})
  }
  render() {
    const users = [
      { username: 'Jerry', age: 21, gender: 'male' },
      { username: 'Tomy', age: 22, gender: 'male' },
      { username: 'Lily', age: 19, gender: 'female' },
      { username: 'Lucy', age: 20, gender: 'female' }
    ]

   
    return (
        <div className="App">
          <header className="App-header" onClick={(e)=>this.handleClick(e,'1')}>
            <span onClick={(e)=>this.hanldeToggle(e)}>{this.state.isLike?'like':'hate'}</span>
            <ThemeContext.Provider value={this.state.passVal}>
             <p>{this.state.passVal.background}</p>
              <Text/>
            </ThemeContext.Provider>
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <div>
              {
                users.map((user,i)=>{
                  return <p key={i}>{user.username}</p>
                })
              }
            </div>
          </header>
        </div>
    );
  }
}



export default App;
