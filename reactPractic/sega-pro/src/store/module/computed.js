const numState = 0

const numReducer = (state=numState,action)=>{
    switch (action.type){
        case 'add':
            return numState+1;
        default:
            return numState;
    }
}


export default numReducer;