import React , {useEffect,useState} from 'react';
import store from './store/idnex'

import './App.css';

function App() {

  useEffect(()=>{
    console.log(store)
  },[])

  let [num ,setNum] =useState(store.getState())

  let handleAdd=function(){
    store.subscribe(()=>{
      setNum(store.getState())
    })
    store.dispatch({type:'add'}) 
  }

  return (
    <div className="App">
      {num}
        <button type="button" onClick={handleAdd}>add</button>
        {/* <button type="button" onClick={handleDec} >dec</button> */}
    </div>
  );
}

export default App;
