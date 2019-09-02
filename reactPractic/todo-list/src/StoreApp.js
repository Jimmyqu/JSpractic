import React from 'react';
import Header from './component/header'
import Content from './component/content'

class Comment extends React.Component{
    constructor(){
        super()
        this.state = { 
         
        }
    }
 
    render() {
        return (
            <div>
               <div style={styles.box}>
                 <Header/>
                 <Content />
               </div>
            </div>
        ); 
    }
}

const styles = {
    box: {
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}
export default Comment