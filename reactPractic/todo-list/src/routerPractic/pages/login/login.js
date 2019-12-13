import React, { useState } from 'react';
import style from './index.module.css'
import { Card } from 'antd';
import { Form, Icon, Input, Button } from 'antd';


function Login(props) {
   const [username, setName] = useState('');
   const [password, setPass] = useState('');
   function handleClick() {
      console.log(username)
      console.log(password)
      window.localStorage.setItem('isLogin', 'true')
      window.location.href = '/home';
      window.localStorage.setItem('lastUrl','/home')

   }
   const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form;
   const usernameError = isFieldTouched('username') && getFieldError('username');
   const passwordError = isFieldTouched('password') && getFieldError('password');

   return (
      <div className={style.loginContainer}>
         <Card title="Default size card" style={{ width: 300 }}>
            <Form >
               <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                  {getFieldDecorator('username', {
                     rules: [{ required: true, message: '请输入用户名' }],
                  })(
                     <Input
                        onChange={(e)=>setName(e.target.value)}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                     />,
                  )}
               </Form.Item>
               <Form.Item >
                  <Input
                     onChange={(e) => setPass(e.target.value)}
                     prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                     type="password"
                     placeholder="Password"
                  />
               </Form.Item>
               <Form.Item>
                  <Button type="primary" htmlType="submit" onClick={handleClick}>
                     Log in
                  </Button>
               </Form.Item>
            </Form>
         </Card>
      </div>
   )
}

export default Form.create({ name: 'horizontal_login' })(Login);