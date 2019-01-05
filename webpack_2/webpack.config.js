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
            filename:'index.html',  //生成的html,
            template:'src/user.html'  //要使用的模板文件
        })  //html 插件 自动生成了index.html 并引入output的输出文件
    ],
    mode:'development', //开发模式 不压缩输出文件
    devServer:{  //安装webpack-server-dev 后可配置
        contentBase: './dist/index.html',  //配置 DevServer HTTP 服务器的文件根目录
        port:9000,  //端口
        open:true,  //自动打开浏览器
        proxy:{  //设置代理 这个URI会跳转到指定target
            '/api':{
                target:'http://localhost:9999/admin/'
            }
        },
        hot:true  //热更新
    }
};