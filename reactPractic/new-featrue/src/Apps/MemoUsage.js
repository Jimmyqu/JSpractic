import React, { useMemo, useState, memo, useCallback,useRef } from 'react';
const Counter  = memo(({value, children,onClick})=>{
    console.log('Render: ', children)
    const ref = useRef(value)
    console.log(ref)
    return (
        <div>
            <button onClick={onClick}>propsCick</button>
            {children}: {value}
        </div>
    )
})
export default function (){
    const [count1, setCount1] = React.useState(0)
    const [count2, setCount2] = React.useState(0)
    const increaseCounter1 = () => {setCount1(count1 => count1 + 1)}
    const increaseCounter2 = () => {setCount2(count2 => count2 + 1)}
    console.log('app render')
    return (
        <>
            <button onClick={increaseCounter1}>Increase counter 1</button>
            <Counter value={count1} onClick={increaseCounter1}>Counter 1</Counter>
             {/* 当传递引用类型的props给子组件这里是函数
                memo包裹的组件依然重新渲染，因为每次传递都会重新创建函数
                用usememo返回 并指定依赖 可以避免
             */}
            <Counter value={count2} onClick={useMemo(()=>increaseCounter2,[])}>Coutner 2</Counter>
            <Counter value={count2} onClick={useCallback(()=>increaseCounter2(),[])}>Coutner 2</Counter>
        </>
    )
}