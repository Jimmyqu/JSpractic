import React, { useState, useMemo,useEffect, memo } from 'react';

function App() {
   let [a,setA ]= useState(0)
   let [b,setB ]= useState(1)

    const state = useMemo(()=>({a,b}) ,[a])
    return <div>
        <p>a:{a}</p>
        <p>b:{b}</p>
        <button onClick={()=>setA(a=a+1)}>count a{a}</button>  
        <button onClick={()=>setB(b=b-1)}>dein b{b}</button>
        <p>{JSON.stringify(state)}</p>
        <Chi1 info={state}></Chi1>
    </div>
}
const Chi1 =memo((props)=>{ 
    // const state = useMemo(()=>({
    //     a:props.info.a,
    //     b:props.info.b}) ,[])
    //     console.log(state)
    // let [a1]=  useState(state.a)
    // let [b1]=  useState(state.b)
    return <div>
        {console.log('rerender')}
        <p>{props.info.a}</p>
        {/* <p>ca{a1}</p>
        <p>cb{b1}</p> */}
    </div>
})

export default App