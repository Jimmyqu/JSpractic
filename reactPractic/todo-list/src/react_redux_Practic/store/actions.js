/**
 统一管理action
*/

//加
export const actionAdd = (data)=>({type:'add',data})
//减
export const actionDe = (data)=>({type:'de',data})

const asyncSet = (data)=>({type:'asyncGet',data}) 
//异步加 
//异步action 返回是函数 同步action返回对象
// https://www.joyousoa.com/pst-salary-api/v1/service_info/44/customer
// export const asyncGet=(data)=>({type:'asyncGet',data})
export const asyncGet =()=>{
    return async (dispatch)=>{
        // fetch('https://www.joyousoa.com/pst-salary-api/v1/service_info/44/customer')
        // .then(res=>res.json())
        // .then(data=>dispatch(asyncSet(data.data)))
       let res = await fetch('https://www.joyousoa.com/pst-salary-api/v1/service_info/44/customer').then(res=>res.json())
       dispatch(asyncSet(res.data))
    }
}