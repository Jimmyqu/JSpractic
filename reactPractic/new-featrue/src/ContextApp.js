import React , { useContext, useReducer } from 'react';

const state = {count:0,title:'this is context title'}  // 创建state
function reducer(state, action) {
    switch (action.type) {
      case 'increment':
        return {count: state.count + 1};
      case 'decrement':
        return {count: state.count - 1};
      default:
        throw new Error();
    }
}
const context = React.createContext(state)  // 用createContext创建上下文
function Home(){
    const [homeState,dispatch] =useReducer(reducer, useContext(context)) 
    return <>
{/* //通过context.Provider的 value属性 传递对象给子组件 这里是通过useReducer又创建了能更改 state的dispatch 一起给子组件*/}
        <context.Provider value={{homeState,dispatch}}>
            <div>
                {homeState.count}
                <Child></Child>  
            </div>
        </context.Provider>  
    </>
}

function Child(){
    const state = useContext(context);  {/* 子组件通过useContext能 取到传递过来的值（这里包括了homeState 和 dispatch）*/}
    console.log(state)
    return <div>
            Child count <span>{state.homeState.count}</span>
            <button onClick={()=>state.dispatch({type:'increment'})}>+</button>
        </div>
}

export default Home