import React from 'react';
import {useRequest} from './hooks/index'

export default function App(){
    const [loading,data] = useRequest('http://api.mtnhao.com/banner')
    
    return <div>
        {loading?<div>isloading</div>:<div>{data.code}</div>}
    </div>
}