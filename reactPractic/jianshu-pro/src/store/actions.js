/**
 统一管理action
*/
import fetch from '../utils/http'
//加
export const actionAdd = (data)=>({type:'add',data})
//减
export const actionDe = (data)=>({type:'de',data})

const asyncSet = (data)=>({type:'asyncGet',data}) 

// 异步action 返回是函数 同步action返回对象
// https://www.joyousoa.com/pst-salary-api/v1/service_info/44/customer
// export const asyncGet=(data)=>({type:'asyncGet',data})
export const asyncGet =()=>{
    return async (dispatch)=>{
       let res = await fetch({
           url:'/service_info/40/customer'
       })
       console.log(res)
       dispatch(asyncSet(res.data.data))
    }
}