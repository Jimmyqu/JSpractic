
const defaultState={
    num:0
}

const count = 0

let reducer = (state=count,action)=>{  //reducer 2个参数 一是State对象 二是一个Action对象

    switch (action.type){
        case 'add':
            console.log(defaultState)
            return state+1
        case 'dec':
            console.log(defaultState)
            return state-1
        default:
            return state
    }
}


export default reducer