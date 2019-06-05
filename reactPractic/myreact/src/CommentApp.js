import React from 'react';


let Inputs= (props)=>{
    return (
        <div >
            <p>用户名：<input type='text' onChange={props.change} value={props.name}></input></p>
            <p>评论：<textarea onChange={props.textChange} value={props.comment}></textarea></p>
            <button onClick={props.click}>发表</button>
        </div>
    )
}

let ListItem=(props)=>{
    return (
        <p> <span>{props.item.name}:</span> {props.item.comment}</p>
    )
}
let CommmentContainer=(props)=>{
    return (
        <div>
            CommmentContainer
            {props.list.map((item,index)=>{
                return <ListItem item={item} key={index}></ListItem>
            })}
        </div>
    )
}


class Comment extends React.Component{
    constructor(){
        super()
        this.state = { 
            name:'',
            comment:'',
            commentList:[]
        }
    }

    handleClick=()=>{
        if( this.state.name&&this.state.comment){
            this.state.commentList.push({name:this.state.name,comment:this.state.comment})
             this.setState({
                commentList:this.state.commentList,
                name:'',
                comment:''
               })
               console.log(this.state)
        }else{
          alert('nonono')
        }
       
    }
    handleChange=(e)=>{
        this.setState({name: e.target.value});
    }
    handleTextChange=(e)=>{
        this.setState({comment: e.target.value});
    }
    render() {
        return (
            <div>
               <div style={styles.box}>
                    
                     <Inputs textChange={this.handleTextChange} change={this.handleChange} click={this.handleClick} name={this.state.name} comment={this.state.comment}></Inputs>
                     <CommmentContainer list={this.state.commentList}>
                     </CommmentContainer>
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