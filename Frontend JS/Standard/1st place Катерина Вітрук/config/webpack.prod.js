const path = require('path');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const Webpack = require('webpack');

const WebpackMd5Hash = require('webpack-md5-hash');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = webpackMerge(commonConfig, {
  debug: false,
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js'
  },
  plugins: [
    new WebpackMd5Hash(),
    new Webpack.optimize.OccurenceOrderPlugin(),
    new DedupePlugin(),
    new UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      mangle: {
        except: ['exports', 'require']
      }
    })
  ]
});
