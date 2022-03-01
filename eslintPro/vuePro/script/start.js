/* eslint-disable unicorn/prefer-module */
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');

const compiler = Webpack(webpackConfig);

const port = 9999;
const options = {
  static: {
    directory: '../public'
    // watchOptions: {
    //   ignored: /node_modules/,
    // },
  },
  hot: true,
  // webpack-dev-server@4 后如果想从其他电脑通过ip访问打开, 有点问题, 可以临时修改为 host: '0.0.0.0' 来支持
  // 但本机则需要手动修改为 localhost 或者 127.0.0.1 来访问
  // https://github.com/webpack/webpack-dev-server/issues/3729
  host: 'localhost',
  port,
  allowedHosts: 'all',
  historyApiFallback: {
    disableDotRule: true
  },
  client: {
    logging: 'none',
    overlay: {
      errors: true,
      warnings: false
    }
  },
  headers: {
    'access-control-allow-origin': '*'
  },
  devMiddleware: {
    publicPath: '/'
  },
  proxy: {
    '/v3': {
      target: 'http://localhost:8080/',
      changeOrigin: true
    }
  }
};

const developmentServerOptions = { ...options, open: true };
const server = new WebpackDevServer(developmentServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server...');
  await server.start();
};

runServer();
