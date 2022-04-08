import {resolve} from "uri-js";

export default  function mii(x, y) {
    console.log(x - y);
    return x - y;
}


export  const add = (x, y) => {
    console.log(x + y);
    return x + y;
}

export const asy = function *(){
    console.log('yield');
    yield 1
}

export const p = function () {
    console.log('ppppppp')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('3s')
            resolve('3s done')
        }, 3000)
    })
}