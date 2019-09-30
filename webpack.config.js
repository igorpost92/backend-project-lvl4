// import path from 'path';
// import webpack from 'webpack';
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [
    path.join(__dirname, 'src', 'index.js'),
  ],
  // entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, 'public', 'assets'),
    filename: 'main.js',
    publicPath: '/public/assets/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery',
    //   Popper: ['popper.js', 'default'],
    // }),
  ],
};
