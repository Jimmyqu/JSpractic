import React, {useState, useEffect} from 'react';
import RichText from '../component/richText';


export default ()=>{
    const [val,setVal] = useState()
    const [state,setState] = useState()

    const handleChange= (val)=>{
        setVal(val)
    }

    useEffect(()=>{
        setTimeout(()=>{
            setVal('3333333333333333')
        },3000)
    },[])
    return <div>
      <RichText value={val} onChange={e=>handleChange(e)}></RichText>
      <p>{state}</p>
    </div>
}