const { exec } = require('child_process')
const path = require('path');
const fs = require('fs');

function wait(ms) {
    return new Promise(resolve => setTimeout( () => resolve(), ms));
};

const foo = async function() {
    const res = await wait(2000)
    console.log('2000 done')
    let i = 1
    while (i < 10) {
        const res = await wait(2000)
        console.log(i)
        fs.writeFile('./test.txt', `${i}\n`, { flag: 'a+' }, err => {
            if (err) {
              console.error(err)
              return
            }
        })
        i++
    }
}

foo()

// exec('C:\\Users\\Admin\\Desktop\\v2rayN-Core\\v2rayN.exe', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.error(`stderr: ${stderr}`);
//   })
// console.log(exec)