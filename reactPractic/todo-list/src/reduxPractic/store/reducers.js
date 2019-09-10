/*
reducer函数 两个参数
参数一 要管理的state
参数二 分发的dispach对象
*/ 

const defaultState = 0  //默认数据

export default (state = defaultState,action)=>{  //就是一个方法函数
   console.log('reducer函数',state,action)
   switch(action.type){
     case 'num_increment':
        state=state+action.data  
        return state
    case 'num_decrement':
        return state=state-action.data      
    default:
        return defaultState
   }
    
}