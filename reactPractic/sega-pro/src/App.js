import React ,{useEffect, useState, useMemo} from 'react';
import './App.css';
import {connect} from 'react-redux'

function App(props) {

  useEffect(()=>{

  })
  
  return (
    < >
     <div className="App"> 
        <p>num:{props.num}</p>
        <p>title:{props.title}</p>
        <button onClick={()=>props.dispatch({type:'modifyTitle',payload:'11111111111111'})}>modify title</button>
      </div>
      <button onClick={()=>props.dispatch({type:'add'})}>to 1</button>
    </>
   
  );
}

export default connect((state)=>{
  return {
    num:state.computedReducer,
    title:state.homeReducer.title
  }
})(App);
