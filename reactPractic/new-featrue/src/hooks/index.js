import React, { useState,useEffect } from 'react';
import axios from '../utils/http'

export function useRequest(url){
    const [data,setData] = useState('')
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        setLoading(true)
        axios(url).then(res=>{
            setData(res.data)
            setLoading(false)
        })
    },[])
    return [loading,data]
}