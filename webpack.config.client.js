// const webpack = require('webpack');
// const path = require('path');
// const MinifyPlugin = require("babel-minify-webpack-plugin");
//
// module.exports = {
//   devtool: 'inline-source-map',
//   entry: [
//     'react-hot-loader/patch',
//     'webpack-dev-server/client?http://localhost:5000',
//     'webpack/hot/only-dev-server',
//     './client/index',
//   ],
//   target: 'web',
//   module: {
//     rules: [{
//       test: /\.js?$/,
//       use: 'babel-loader',
//       include: [
//         path.join(__dirname, 'client')
//       ],
//     }],
//   },
//   plugins: [
//     new webpack.NamedModulesPlugin(),
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NoEmitOnErrorsPlugin(),
//     new MinifyPlugin()
//   ],
//   devServer: {
//     host: 'localhost',
//     port: 5000,
//     historyApiFallback: true,
//     hot: true,
//   },
//   output: {
//     path: path.join(__dirname, '.build.client'),
//     publicPath: 'http://localhost:5000/',
//     filename: 'build.client.js',
//   },
// };
