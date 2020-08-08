import { InputNumber } from 'antd'
import React from 'react'
import "antd/dist/antd.css";
import styles from './index.module.less'

console.log(styles)
export default function NumInput(props){
    const {
     width
    } = props
    return <div className={styles.customNumInput}>
            <InputNumber style={{width:width}}/>
        </div>
}