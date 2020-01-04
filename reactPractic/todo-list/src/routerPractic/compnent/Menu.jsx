import React, { useState } from 'react';
import { Menu, Icon } from 'antd';
import menuList from '../config'
import {NavLink} from 'react-router-dom';

const { SubMenu } = Menu;

function initMenu(menu) {
    return menu.map(item => {
        if (item.children) {
            return <SubMenu title={item.title} key={item.key}>
                {
                    item.children.map(citem => {
                        return <Menu.Item key={citem.key}><NavLink to={citem.key}>{citem.title}</NavLink></Menu.Item>
                    })
                }
            </SubMenu>
        } else {
            return <Menu.Item key={item.key}><NavLink to={item.key}>{item.title}</NavLink></Menu.Item>
        }
    })    
}

export default function MyMenu(props) {
    let [openKeys, setOnpenKey] = useState(undefined);

    return (
        <Menu
            openKeys={openKeys}
            onClick={(val)=>{
                window.localStorage.setItem('lastUrl', val.key)
            }}
            defaultSelectedKeys={[window.localStorage.getItem('lastUrl')]}
            mode="inline"
            onOpenChange={(openArr)=>{
                openArr=[openArr[openArr.length-1]||undefined]
                openKeys=setOnpenKey(openArr)
            }}
        >
            {initMenu(menuList)}
        </Menu>
    )
}
