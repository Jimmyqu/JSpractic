const express = require('express');
const multer = require('multer')
const bodyParser = require('body-parser')

const app = express()

const port = 9999;

const upload = multer({
    dest: './static/upload'
})



app.use(express.static('./static/'))

app.use(upload.any()) //提交from-data格式数据  和文件上传


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({  // 不同的 'Content-Type'用不同的方法处理 json urlencoded
    extended: false
}))


app.post('/login', (req, res, next) => {
    console.log(req.body)
    res.send({
        error: 0,
        data: req.body,
        msg: '登陆成功'
      })
})

// 表单formdata 接收文件上传结果
app.post('/upload', (req, res, next) => {
    console.log(req.body)
    console.log(req.files)
    res.send({
      error: 0,
      data: req.body,
      msg: '上传成功'
    })
})


// fetch form-data
app.post('/upload2', (req, res, next) => {
    console.log(req.body.selectFile)
    res.send({
      error: 0,
      data: req.body,
      msg: '上传成功'
    })
})

app.listen(port, (e, d) => {
    console.log(`Example app listening at http://localhost:${port}`)
})