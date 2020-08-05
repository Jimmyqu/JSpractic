const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    vendor: [
      "axios",
      "echarts",
      "jquery-slim",
      "js-cookie",
      "nprogress",
      "v-charts",
      "vue",
      "vue-cropper",
      "vue-quill-editor",
      "vuedraggable",
      "vue-router",
      "vuex"
    ]
  },
  output: {
    path: path.join(__dirname,'./public/static/js'),
    filename: "[name].dll.js",
    library: "[name]_[hash]" // vendor.dll.js中暴露出的全局变量名
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "./public/static/js", "[name]-manifest.json"),
      name: "[name]_[hash]",
      context: process.cwd()
    }),
  ]
};