import context from './context'
import React, { useContext } from 'react';
export default ()=>{
    const [state,dispatch] =useContext(context)
    return <div>
        <input type="text" onChange={(e) => { e.persist(); dispatch({ type: 'inputName', payload: e.target.value }) }} />
        <br />
        <input type="text" onChange={(e) => { e.persist(); dispatch({ type: 'inputPwd', payload: e.target.value }) }} />
    </div>
}