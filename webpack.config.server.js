// const webpack = require('webpack');
// const path = require('path');
// const Dotenv = require('webpack-dotenv-plugin');
// const nodeExternals = require('webpack-node-externals');
// const StartServerPlugin = require('start-server-webpack-plugin');
// const MinifyPlugin = require('babel-minify-webpack-plugin');
// const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
//
// module.exports = {
//   entry: [
//     'webpack/hot/poll?1000',
//     './server/bootstrap',
//   ],
//   watch: true,
//   target: 'node',
//   devtool: 'eval-source-map',
//   externals: [
//     nodeExternals({
//       whitelist: ['webpack/hot/poll?1000'],
//     })
//   ],
//   module: {
//     rules: [{
//       test: /\.js$/,
//       enforce: 'pre',
//       loader: 'eslint-loader',
//       options: {
//         emitWarning: true,
//       },
//     },
//     {
//       test: /\.js?$/,
//       use: 'babel-loader',
//       exclude: /node_modules/,
//     }],
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NamedModulesPlugin(),
//     new webpack.NoEmitOnErrorsPlugin(),
//     new Dotenv({
//       path: './.env',
//       safe: true,
//       allowEmptyValues: true,
//     }),
//     // new MinifyPlugin(),
//     // new webpack.optimize.UglifyJsPlugin(),
//     new StartServerPlugin('build.app.js'),
//     new WebpackBuildNotifierPlugin({
//       title: "Elm",
//       suppressSuccess: true
//     }),
//   ],
//   output: {
//     path: path.join(__dirname, '.build.app'),
//     filename: 'build.app.js',
//   },
// };
