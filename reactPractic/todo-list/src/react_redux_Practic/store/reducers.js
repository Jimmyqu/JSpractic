const initState = {
    num: 0
}

let newState=null;

export default (state = initState, action) => {
    console.log(initState, action)
    switch (action.type) {
        case 'add':
            newState = JSON.parse(JSON.stringify(state))
            newState.num = newState.num + action.data
            return newState;
        case 'de':
            newState = JSON.parse(JSON.stringify(state))
            newState.num = newState.num - action.data
            return newState;
        default:
            return state
    }

}