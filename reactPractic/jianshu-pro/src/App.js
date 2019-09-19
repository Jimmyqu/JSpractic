import React, { Component } from 'react';
import { connect } from 'react-redux'
import { actionAdd, actionDe,asyncGet } from './store/actions'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  handleAdd = () => {
    this.props.actionAdd(1)
  }

  handleDe = () => {
    this.props.actionDe(1)
  }
  componentDidMount(){
    this.props.asyncGet()
  }
  render() {
    const { num } = this.props.state
    return (
      <div>
        <header className="App-header">
          <p>
            num现在是{num}
          </p>
          <div>
            <button onClick={this.handleAdd}>+</button>
            <button onClick={this.handleDe}>-</button>
          </div>
        </header>
      </div>
    );
  }
}

export default connect(
  state => ({ state: state }),
  {
    actionAdd,
    actionDe,
    asyncGet
  }
)(App);
