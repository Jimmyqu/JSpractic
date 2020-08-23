import React, { useState,useEffect } from 'react';

class App extends React.Component{
    state={
        isChi1:false,
        text:'btn'
    }

    handleToggle(type){
        this.setState({
            isChi1: type
        });
    }

    render(){
        const { isChi1 } = this.state
        
        return <div>
            {
                isChi1? <Chi1 toggle={()=>this.handleToggle(false)}></Chi1>:<Chi2  toggle={()=>this.handleToggle(true)}></Chi2>
            }        
        </div>
    }
    
}
const Chi1 =(props)=>{ 
    return <div>
        <p>Chi1</p>
        <button onClick={()=>props.toggle()}>toggle</button>
    </div>
}

const Chi2 =(props)=>{ 

    return <div>
         <p>Chi2</p>
         <button onClick={()=>props.toggle()}>toggle</button>
    </div>
}

export default App