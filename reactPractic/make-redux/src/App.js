import React from 'react';
// import logo from './logo.svg';
import { Component } from 'react'
import './App.css';

class App extends Component{
  constructor(props){
    super()
    this.state={
    }
  }

  componentDidMount(){
    console.log(this)
  }

  handleClick(event){
    console.log(event)
    console.log(this.state)
  } 
 
  render() {
   
    return (
        <div className="App">
          <header className="App-header" onClick={(e)=>this.handleClick(e)}>
            <div>
            </div>
          </header>
        </div>
    );
  }
}



export default App;
