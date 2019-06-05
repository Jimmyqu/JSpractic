import React from 'react';
import PropTypes from 'prop-types'

class Header extends React.Component {
    render () {
      return (
      <div>
        <h2>This is header</h2>
        <Title/>
      </div>
      )
    }
  }

  class Title extends React.Component {
  //子组件要获取 context 里面的内容，必须写contextTypes来声明和验证需要获取的状态的类型
    static contextTypes = {  
      themeColor: PropTypes.string
    }

    render () {
      return (
        <h1 style={{ color: this.context.themeColor }}>React.js 小书标题</h1>
      )
    }
  }

class Root extends React.Component{
    static childContextTypes = { //验证 getChildContext 返回的对象
        themeColor: PropTypes.string,
        // changeColor:PropTypes.func
      }

    constructor(props){
        super()
        this.state = { themeColor: 'red' }
    }

    getChildContext(){   //这个方法就是设置 context 的过程 
        return {
            themeColor:this.state.themeColor,
            // changeColor:this.setState({themeColor:'blue'})
        }
    }

    render () {
      return (
        <div>
          <Header/>
        </div>
      )
    }
}

export default Root