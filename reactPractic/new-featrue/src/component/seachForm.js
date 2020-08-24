import React, { useState,useRef,useEffect,useImperativeHandle } from 'react';
import { Form, Input, Button, Radio, Select } from 'antd';
import 'antd/dist/antd.min.css';

const { Option } = Select;

const SearchForm = (props) =>{
    const { getFieldDecorator } = props.form; 
    useEffect(()=>{
        props.setArr(props.form.getFieldsValue())
    },[props.form.getFieldsValue()[1],props.form.getFieldsValue()[2],props.form.getFieldsValue()[3]])

    return (
      <div >
        <Form
          layout='inline'
        >
          <Form.Item label="Form Layout" name="">
          {
              getFieldDecorator('1',{ initialValue: 1 })(<Select style={{ width: 120 }} >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
          </Select>)
          }
          </Form.Item>
          <Form.Item label="Field A">
              {getFieldDecorator('2',{ initialValue: 4 })(<Select  style={{ width: 120 }} >
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
           </Select>)}
            
          </Form.Item>
          <Form.Item label="Field B">
              {
                  getFieldDecorator('3',{ initialValue: 7 })(<Select  style={{ width: 120 }} >
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
           </Select>)
              }
            
          </Form.Item>
        </Form>
      </div>
    );
  }

  export default Form.create({ name: 'SearchForm' })(SearchForm)
// export default OtherChild