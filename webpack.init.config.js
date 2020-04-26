const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = options => {
  return {
    devServer: options.devServer,

    entry: {
      bundle: ['./src/main.js']
    },

    output: {
      path: `${__dirname}/dist`,
      filename:
        options.buildMode !== 'production' ? '[name].[hash:8].js' : '[name].[contenthash].js',
      chunkFilename: '[name].[id].js'
    },

    externals: {},

    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: true
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            options.buildMode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        }
      ]
    },

    watch: options.watch,
    watchOptions: {
      aggregateTimeout: 300,
    },

    devtool: options.devtool,

    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    mode: options.buildMode,
    plugins: [
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new MiniCssExtractPlugin({
        filename:
          process.env.NODE_ENV !== 'production'
            ? '[name].[hash:8].css'
            : '[name].[contenthash].css',
        chunkFilename:
          process.env.NODE_ENV !== 'production'
            ? '[name].[hash:8].css'
            : '[name].[contenthash].css',
      }),
      new HtmlPlugin({
        title: 'Four Photo One Word Helper',
        template: path.resolve(process.cwd(), 'index.html'),
        filename: 'index.html',
      }),
    ],

    stats: {
      children: false,
      modules: false,
    },
  };
};
