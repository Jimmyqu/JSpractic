const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

console.log(path.resolve(__dirname, 'dist'))
module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // 绝对路径
        filename: '[name].[contenthash].js', //  每次根据contenthash生成不同文件名 避免浏览器缓存
        assetModuleFilename: 'images/[contenthash][ext]' // 指定asset生成路径
    },
    mode: 'development', // || 'production'
    module: {
        // 常见例如js 图片 字体 css less scss等web资源 还可以通过不用type loader 打包csv xml yaml json json5 等等数据
        rules: [
            {
                test: /\.png$/,  //使webpack可打包png资源
                // 必填属性  asset/resource 默认打包任何(字体,png ,svg 为静态资源
                // asset/inline 打包为base64
                // asset 可根据parse.defaultCondition.maxSize属性自动切换 默认8k
                type: 'asset/resource'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] //后向前执行 css-loader 只是解析 style-loader会将解析后的样式 放入打包后header
            },
            {
                test: /\.js$/, // 使用babel将最新语法打包为低浏览器可用
                // 需要安装 @babel/core核心 @babel/preset-env 预设的一些插件  babel-loader
                exclude: /node_modules/, // 排除的文件夹
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        //plugins: [] // 支持各种新特性编译 async awiat
                    }
                }
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()],  // 可配置 https://webpack.js.org/plugins/html-webpack-plugin/
    devServer: {  // npm装了webpack-dev-server 可支持一个简单http服务器
        static: './dist'
    },
};