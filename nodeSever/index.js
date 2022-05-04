const express = require('express');
const multer = require('multer')
var cors = require('cors')
const path = require('path')
var fs = require('fs-extra')
const formidable  = require('formidable')

const app = express()
// app.use(cors())

const port = 9999;
let imgNum = 1;
const fileList = []
const upload = multer({
    storage: multer.diskStorage({   // multer直接处理了上传的文件
        destination: function (req, file, cb) {
            cb(null, './static/upload');
          },
        filename: (req, file, cb) => {
            const name = path.extname(file.originalname)
            cb(null, imgNum+name);
        }
    })
})

app.use(upload.any()) //提交from-data格式数据  和文件上传

app.use(express.static('./static/')) // 这里默认处理了/路径 返回参数目录下index.html

app.post('/login', (req, res, next) => {
    console.log('req', req, res)
    res.send({
        error: 0,
        data: req.body,
        msg: '登陆成功'
    })
})

// 表单formdata 接收文件上传结果
app.post('/upload', (req, res, next) => {
    // const form = new formidable.IncomingForm();    // 被multer 处理了 不需要
    // form.parse(req, function(err, fields, files) {  
    //     console.log(err),
    //     console.log('fields',fields);//表单传递的input数据  
    //     console.log('files',files);//上传文件数据  
    //     //do somthing......  
    // });

    const name = path.extname(req.files[0].originalname)

    res.send({
        error: 0,
        data: {...req.body, url: `http://localhost:${port}/upload/${imgNum + name}`},
        msg: '上传成功'
    })
    imgNum ++
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

// 表单formdata 接收文件上传结果
app.post('/chunkUpload', (req, res, next) => {
    console.log(req.body)
    res.send({
        error: 0,
        data: {...req.body},
        msg: '上传成功'
    })
})

app.listen(port, (e, d) => {
    console.log(`Example app listening at http://localhost:${port}`)
})