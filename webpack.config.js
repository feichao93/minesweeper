const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    __dirname + "/app/main.jsx"
  ],
  // devtool: "source-map",
  devtool: "eval",
  module: {
    loaders: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        loaders: ['react-hot-loader/webpack', 'babel']
      }
    ],
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'eslint',
        exclude: /node_modules/,
      }
    ]
  },

  resolve: {
    root: [
      path.resolve('./app'),
    ],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.tmpl.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    host: '0.0.0.0',
    port: '8080',
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true,
  }
}
