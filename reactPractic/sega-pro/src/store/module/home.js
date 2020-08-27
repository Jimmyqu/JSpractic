const homeState = {
    title:'this is homeState title'
}

const homeReducer = (state=homeState,action)=>{
    // console.log(homeState)
    switch(action.type){
        
        case 'modifyTitle':
            return {...homeState,title:action.payload};
        default :
            return  homeState
    }
}

export default homeReducer;