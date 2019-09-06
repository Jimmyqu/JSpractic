import React, { Component } from 'react';

class SerachHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div style={{width:'250px',margin:'0 auto'}}>
                <input type="text"/>
                <button>查询</button>
            </div>
         );
    }
}
 
export default SerachHeader;