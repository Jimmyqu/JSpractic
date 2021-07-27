const express = require('express');
const multer = require('multer')
const path = require('path')
var fs = require('fs-extra')
const formidable  = require('formidable')

const app = express()

const port = 9999;

const fileList = []
const upload = multer({
    storage: multer.diskStorage({   // multer直接处理了上传的文件
        destination: function (req, file, cb) {
            cb(null, './static/upload');
          },
        filename: (req, file, cb) => {
            // fs.ensureDir('./static/target', function (err) {
            //     const fileBuffer =  fs.readFileSync('./static/upload')
            //     console.log(fileBuffer)
            //     fileList.push(fileBuffer)
            //     if(fileList.length === 6) {
            //         fs.writeFile('./static/target/text.txt', Buffer.concat(fileList));
            //     }
            // })
            cb(null, file.fieldname);
        }
    })
})

app.use(upload.any()) //提交from-data格式数据  和文件上传

app.use(express.static('./static/')) // 这里默认处理了/路径 返回参数目录下index.html

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
    // const form = new formidable.IncomingForm();    // 被multer 处理了 不需要
    // form.parse(req, function(err, fields, files) {  
    //     console.log(err),
    //     console.log('fields',fields);//表单传递的input数据  
    //     console.log('files',files);//上传文件数据  
    //     //do somthing......  
    // });  
    console.log(req.files[0])
    res.send({
        error: 0,
        data: {...req.body, url: `http://localhost:${port}/upload/${req.files[0].filename}`},
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