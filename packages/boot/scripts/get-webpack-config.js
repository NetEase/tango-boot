const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = (configs = {}, options = {}) => {
  const baseConfig = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { modules: false }],
                '@babel/preset-typescript',
                '@babel/preset-react',
              ],
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [new ProgressBarPlugin()],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    output: {
      filename: 'boot.js',
      path: path.resolve(__dirname, '../dist/'),
      publicPath: '', // relative to HTML page (same directory)
      library: 'TangoBoot',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
  };

  if (options.minimize) {
    baseConfig.mode = 'production';
    baseConfig.devtool = false;
    baseConfig.output.filename = 'boot.min.js';
  }

  return {
    ...baseConfig,
    ...configs,
  };
};
