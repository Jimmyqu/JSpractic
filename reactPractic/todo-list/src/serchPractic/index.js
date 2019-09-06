import React, { Component } from 'react';
import SerchHeader from './compnent/serchHeader'
import SerchRes from './compnent/serchRes'

class SearchApp extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
              <SerchHeader></SerchHeader>
              <SerchRes></SerchRes>
            </div>
         );
    }
}
 
export default SearchApp;