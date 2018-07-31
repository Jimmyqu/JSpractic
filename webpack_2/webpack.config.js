const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry :'./src/index.js', //单页面入口文件
    // entry :{   //多页面
    //     index:'./src/index.js',
    //     user:'./src/user.js'
    // },
    output:{  //输出文件
        filename:'index.bundle.js', //单页面
       // filename:'js/[name].js', //多页 可以加[hash]避免缓存
        path:path.join(__dirname,'dist')
    },
    module:{  //处理其他格式文件
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']  //loader从右向左执行
            }
        ]
    },
    plugins:[
        new HtmlPlugin({
            title:'webpack app',  //生成title
            filename:'HtmlPlugin.html',  //生成的html,
            template:'src/user.html'  //要使用的模板文件
        })  //html 插件 自动生成了index.html 并引入output的输出文件
    ],
    mode:'development' //开发模式 不压缩输出文件
};