import React, { Component } from 'react';
import 'antd/dist/antd.css'
import { Input, Button } from 'antd'
import { Row, Col } from 'antd';
import CommentItems from './component/commentItems'

const { TextArea } = Input;
class CommentApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            commentList: []
        }
    }

    handleAddComment() {
        if(this.refs.input.input.value&&this.refs.textarea.textAreaRef.value){
            this.setState({
                commentList:this.state.commentList.concat([{
                    userNmae:this.refs.input.input.value,
                    comment:this.refs.textarea.textAreaRef.value
                }])
            },()=>{
                this.refs.input.input.value=''
                this.refs.textarea.textAreaRef.value=''
            })
        }
    }

    handleDelComment(index){
        let list = this.state.commentList
        list.splice(index,1)
        this.setState({
            commentList:list
        },()=>{
            this.refs.input.input.value=''
            this.refs.textarea.textAreaRef.value=''
        })
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={8} offset={8}>
                        <Row>
                            用户名
                    <Input ref='input' />
                            评论
                   <TextArea ref='textarea' rows={4} />

                            <Button onClick={()=>this.handleAddComment()} style={{ float: "right", marginTop: '20px' }}>提交</Button>
                        </Row>

                        <Row>
                            {
                                this.state.commentList.map((item,index )=> {
                                    return <CommentItems 
                                        item={item} 
                                        key={index}
                                        handleDel={()=>this.handleDelComment(index)}
                                    ></CommentItems>
                                })
                            }
                        </Row>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default CommentApp;