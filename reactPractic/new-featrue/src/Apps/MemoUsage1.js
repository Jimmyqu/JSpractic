import React, { useMemo, useState, memo, useCallback,useRef,useEffect } from 'react';

const Counter  = memo((props) => {
    console.log('render',props.children)
    return <div>
        <p>{props.children}</p>
        <p>props count{props.count}</p>
        <p>props data{JSON.stringify(props.data)}</p>
        <button onClick={()=>props.data()}>{props.children}</button>
    </div>
})

export default function (){
    const [num,setNum] = useState(0)
    const [data,setData] = useState({})

    useEffect(()=>{
        setTimeout(()=>{
            setData({a:1,b:2})
        },1000)
    },[])

    const memoState = useMemo(()=>{
       return {
            num:num,
            a:data.a,
            b:data.b
        }
    },[num])

    const memoFunc = useCallback(()=>{
        console.log(num)
    },[num])


 return <div>
     <p>father num{num}</p>
     <Counter data={memoFunc} >
         count1
     </Counter>
     <Counter>
         count2
     </Counter>
     <button onClick={()=>setNum(num+1)}> father num</button>
 </div>
}