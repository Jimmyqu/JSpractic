const express = require('express');
const logger = require('morgan');
const wiki = require('./wiki')
const MongoClient = require('mongodb').MongoClient;

const app = express();
// app.use(logger('dev'));

// 示例中间件函数
const a_middleware_function = (req, res, next) => {
    // ... 进行一些操作
    console.log('a_middleware_function')
    next(); // 调用 next() ，Express 将调用处理链中下一个中间件函数。中间件有顺序
  };

// 用 use() 为所有的路由和动词添加该函数
app.use(a_middleware_function); 

app.use(express.static('public'));  //express.static 中间件来托管静态文件  Express 提供的原生中间件函数之一

MongoClient.connect('mongodb://localhost:27017/animals', (err, client) => {
  if(err) {
    throw err;
  } 
  
  let db = client.db('动物');
//   db.collection('哺乳动物').insertOne({'name':'大象'},(e,res)=>{
//     console.log(res)
//   })
  db.collection('哺乳动物').find().toArray((err, result) => {
    if(err) throw err;
    console.log(result)
    client.close();
  });
});

app.use('/wiki', wiki , a_middleware_function);

//错误处理中间件  必须在所有其它 app.use() 和路由调用后才能调用
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('出错了！');
});

app.listen(3000, () => {
    console.log('示例应用正在监听 3000 端口!');
});