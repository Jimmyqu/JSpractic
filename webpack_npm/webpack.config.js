const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 使用 WEBPACK_SERVE 环境变量检测当前是否是在 webpack-server 启动的开发环境中
const dev = Boolean(process.env.WEBPACK_SERVE)

module.exports = {
    /*
    webpack 执行模式
    development：开发环境，它会在配置文件中插入调试相关的选项，比如 moduleId 使用文件路径方便调试
    production：生产环境，webpack 会将代码做压缩等优化
    */
    mode: dev ? 'development' : 'production',

    /*
    配置 source map
    开发模式下使用 cheap-module-eval-source-map, 生成的 source map 能和源码每行对应，方便打断点调试
    生产模式下使用 hidden-source-map, 生成独立的 source map 文件，并且不在 js 文件中插入 source map 路径，用于在 error report 工具中查看 （比如 Sentry)
    */
    devtool: dev ? 'cheap-module-eval-source-map' : 'hidden-source-map',

    // 配置页面入口 js 文件
    entry: {
        index: './public/app.js',
        static: './public2/app.js'
    },

    // 配置打包输出相关
    output: {
        // 打包输出目录
        path: resolve(__dirname, 'dist'),
        // 入口 js 的打包输出文件名 多个入口可用[entry.props]输出多个
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                //  实际是从后向前执行  css-loader 把commonjs转 css  -》style-loader插入html
                'style-loader',
                'css-loader'
            ]
        },
        {
            test: /\.scss$/,
            use: [
                //  实际是从后向前执行  css-loader 把commonjs转 css  -》style-loader插入html
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }
        ]
    },
    plugins: [new HtmlWebpackPlugin()]
}


