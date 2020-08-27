import React, { useEffect, useState, useMemo } from 'react';

export default function App(){
    let [val,setVal] = useState(0)
    let [obj,setObj] = useState({a:1})
    let [arr,setArr] = useState([1])
    useEffect(()=>{
       console.log('update')
        //依赖项新旧比较是 ‘=== ’（原始类型同复杂类型表现不同）
    },[val,obj,arr]) //none update update 
    return <div>
        <p>{val}</p>
        <p>{JSON.stringify(obj)}</p>
        <p>{JSON.stringify(arr)}</p>
        <button onClick={()=>setVal(1)}>+val</button>
        <button onClick={()=>setObj({a:1})}>changeObj</button>
        <button onClick={()=>setArr([1])}>changeArr</button>
        app
    </div>
}