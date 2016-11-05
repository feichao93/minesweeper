const path = require('path')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: __dirname + "/app/main.jsx",
  output: {
    path: __dirname + "/build",
    filename: "/[name]-[hash].js"
  },

  module: {
    loaders: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
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
      template: __dirname + "/app/index.tmpl.html"
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
}
