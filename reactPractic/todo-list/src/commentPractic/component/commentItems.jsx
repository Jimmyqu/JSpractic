import React, { Component } from 'react';
import 'antd/dist/antd.css'
import { Card,Button } from 'antd'

class CommentItmes extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
               <Card  size="small" title="Small size card" extra={<Button onClick={()=>this.props.handleDel()}>删除</Button>}>
                   <h4>
                       {this.props.item.userNmae}说:
                   </h4>
                   <p>
                       {this.props.item.comment}
                   </p>
               </Card>
            </div>
         );
    }
}
 
export default CommentItmes;