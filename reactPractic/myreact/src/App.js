import React from 'react';
import { Component, Fragment } from 'react'
import './static/css/App.css';
import { CSSTransition } from 'react-transition-group'


class App extends Component {
  constructor(props) {
    super()
    this.state = {
      isShow:true,
      inputValue:'' , // input中的值
      list:[
        '111',
        '222'
      ]    //服务列表
    }
  }

  componentDidMount() {
    console.log(this)
  }

  handleToggle(){
    this.setState({
      isShow:!this.state.isShow
    })
  }

  handleInputChange(e){
     console.log(e)
    this.setState({
      inputValue:e.target.value
    })
    
  }
  handleAddList(){
    this.setState({
      list:this.state.list.concat(this.state.inputValue),
      inputValue:''
    })
    console.log(this)
  }
  handleDelItem(index){
    console.log(index)
    let list = this.state.list
    list.splice(index,1)
    this.setState({
      list:list
    })
  }
  render() {
    return (
      <Fragment>
        <div>
          <input className="input" value={this.state.inputValue} onChange={(e)=>this.handleInputChange(e)} /> 
          <button onClick={()=>{this.handleAddList()}}> 增加服务 </button>
        </div>
        <ul>
          {this.state.list.map((item,index)=>{
            return <li onClick={()=>this.handleDelItem(index)} key={index}>{item}</li>
          })}
        </ul>
        <button onClick={()=>{this.handleToggle()}}> show </button>
         <CSSTransition 
                in={this.state.isShow}   //用于判断是否出现的状态
                timeout={2000}           //动画持续时间
                classNames="boss-text"   //className值，再到CSS文件写效果
                unmountOnExit //退场时删除Dom
            >
                <div>BOSS级人物-孙悟空</div>
         </CSSTransition>   
      </Fragment>
    );
  }
}



export default App;
