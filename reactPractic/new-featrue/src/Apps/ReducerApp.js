import React, { useReducer, useEffect } from 'react';
import LoginContext from './context'
import Child from './ReducerChild'
const initState = {
    name: '',
    pwd: '',
    isLoading: false,
    error: '',
    isLoggedIn: false,
}
function loginReducer(state, action) {
    switch (action.type) {
        case 'inputName':
            return {
                ...state,
                name: action.payload
            }
        case 'inputPwd':
            return {
                ...state,
                pwd: action.payload
            }
        case 'login':
            return {
                ...state,
                isLoading: true,
                error: '',
            }
        case 'success':
            return {
                ...state,
                isLoggedIn: true,
                isLoading: false,
            }
        case 'error':
            return {
                ...state,
                error: action.payload.error,
                name: '',
                pwd: '',
                isLoading: false,
            }
        default:
            return state;
    }
}

export default () => {
    const [state, dispatch] = useReducer(loginReducer, initState)
    //useReducer返回的state是响应 dispatch的
    const { name, pwd, isLoading, isLoggedIn } = state
    console.log(state)
    useEffect(() => {
        if (isLoading) {
            setTimeout(() => {
                dispatch({ type: 'success', payload: { name: '', pwd: '' } })
            }, 1000)
        }
    }, [isLoading])
    return (
    <LoginContext.Provider value={[state, dispatch]}>
        <div>
            {isLoggedIn ? <p>is home</p> : (isLoading ? <div>loading</div> : <div >
                <Child></Child>
                <br />
                <input type="submit" value="login" onClick={() => dispatch({ type: 'login', payload: { name, pwd } })} />
            </div>)}
        </div>
    </LoginContext.Provider>
    )
}