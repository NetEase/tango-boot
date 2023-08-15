const webpack = require('webpack');
const getWebpackConfig = require('./get-webpack-config');

const args = process.argv.slice(2);
const minimize = args.indexOf('minimize') > -1;

const config = getWebpackConfig(
  {},
  {
    minimize,
  },
);

webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log(err);
    // handle error
    throw err;
  }

  console.info(
    stats.toString({
      colors: true,
      chunks: false,
      modules: false,
      hash: false,
      usedExports: false,
      version: false,
    }),
  );
});
