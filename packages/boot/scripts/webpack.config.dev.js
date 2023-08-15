const path = require('path');
const getWebpackConfig = require('./get-webpack-config');

module.exports = getWebpackConfig(
  {
    devtool: 'inline-source-map',
    devServer: {
      static: path.join(__dirname, '../dist'),
      port: 9001,
    },
  },
  {}
);
