import { InputNumber } from 'antd'
import React from 'react'
import styles from './index.scss'
import 'antd/dist/antd.css';

console.log(styles)
export default function NumInput(props){
    const {
     width
    } = props
    return <div>
            <InputNumber style={{width:width}}/>
        </div>
}

