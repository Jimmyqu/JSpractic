import React from 'react';
function Chi1({data}){
    return <p>{data}</p>
}
function Chi2({data}){
    return <p>{data}</p>
}
function Hoc(WarraperedCom,reqFuc){
    return ()=>{
        const data =  reqFuc()
        return <WarraperedCom data={data}></WarraperedCom>
    }
}
export default function App(){
    const Warrapered1 = Hoc(Chi1,()=>1)
    const Warrapered2 = Hoc(Chi2,()=>2)
    return <div>
       <Warrapered1></Warrapered1> 
       <Warrapered2></Warrapered2> 
    </div>
};