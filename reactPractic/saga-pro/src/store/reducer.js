const defaultState={
    num:0,
    todoList:[]
}

const count = 0
export default function reducer(state=defaultState,action){
    
    switch(action.type){
        case 'add':
            return {
                ...state,
                num:state.num+1
            } 
        case 'dec':
            return {
                ...state,
                num:state.num-1
            }
         case 'addTodo':
            return {
                ...state,
                todoList:[...state.todoList,action.payload.inputVal]
            }
        default:
            return defaultState        
    }

}