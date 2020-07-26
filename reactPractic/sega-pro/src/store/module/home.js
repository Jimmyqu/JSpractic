const homeState = {
    title:'this is homeState title'
}

const homeReducer = (state=homeState,action)=>{
    // console.log(homeState)
    switch(action.type){
        
        case 'modifyTitle':
            console.log(action.payload)
            setTimeout(()=>{
                return {...homeState,title:action.payload};
            },1000)
            // console.log(action.payload)
            // return {...homeState,title:action.payload};
        default :
            return  homeState
    }
}

export default homeReducer;