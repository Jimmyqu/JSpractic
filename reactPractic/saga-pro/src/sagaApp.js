import React , {useEffect,useState} from 'react';
import {connect} from 'react-redux'

import './App.css';

function App({count,list,dispatch}) {

  useEffect(()=>{
  })

  let [inputVal,setInpuVal ] = useState('')
  
  let handleAdd=function(){
    dispatch({type:'add'})
  }
  return (
    <div className="App">
        {count}
       
        <button type="button" onClick={handleAdd}>add</button>
        <button type="button" onClick={()=>dispatch({type:'dec'})} >dec</button>
        <div>
         <input onChange={(e)=>setInpuVal(e.target.value)}></input>
         <ul>
         {list.map(item=>{
           return <li>{item}</li>
         })}
         </ul>
         <button onClick={()=>dispatch({type:'addTodo',payload:{inputVal}})}> 添加todo</button>
        </div>
    </div>
  );
}

export default connect((state)=>{
  console.log(state.todoList)
  return {
    count:state.num,
    list:state.todoList
  }
})(App);
