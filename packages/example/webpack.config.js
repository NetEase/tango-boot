const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    // 微前端支持
    // library: `example-[name]`,
    // libraryTarget: 'umd',
    // jsonpFunction: `webpackJsonp_example`,
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    moment: 'moment',
    'styled-components': 'styled',
    '@music/tango-boot': 'TangoBoot',
    '@music/tango-cms': 'TangoCMS',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack example',
      template: 'index.html',
      inject: 'body',
    }),
  ],
};
