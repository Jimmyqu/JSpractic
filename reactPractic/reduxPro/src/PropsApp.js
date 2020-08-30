import React , { useContext, useReducer } from 'react';
function App(){
    return <div>
        home
        <Child a={1} b={2} c={3}  >
            <p>121243234</p>
        </Child>
    </div>
}
function Child(props){
    const{
        a,
        children:els, // 解构别名
        ...res
    } = props
    return <div {...res}>
        {/* {b: 2, c: 3} */}
        {console.log({...res})}  
        Child
        {/* 需要显示的调用children 否则父组件的插入无用 */}
        {els} 
    </div>
}
export default App