const fs = require('fs');

module.exports = require('./webpack.init.config')({
  buildMode: 'development',
  devtool: 'source-map',
  debug: true,
  watch: true,
  isNeedSourceMap: true,
  devServer: {
    contentBase: fs.realpathSync(process.cwd()),
    host: '127.0.0.1',
    port: 3000,
    compress: true,
    clientLogLevel: 'silent',
    open: true,
    hot: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    stats: {
      all: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      timings: true,
    },
    historyApiFallback: true,
    disableHostCheck: true,
  },
});
