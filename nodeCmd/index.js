const program = require('commander');

program
    .description('a test cli program')
    .option('-v, --version [version]') //[]可选 <>必选
    .parse(process.argv)

// https://juejin.cn/post/6844903797907521544
console.log(program);