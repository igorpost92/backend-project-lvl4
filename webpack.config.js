// import webpack from 'webpack';
const path = require('path');
const autoprefixer = require('autoprefixer');

console.log('webp', process.env.NODE_ENV);

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: [
    path.join(__dirname, 'src', 'index.js'),
  ],
  output: {
    path: `${__dirname}/dist/assets`,
    publicPath: '/dist/assets/',
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
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer,
              ],
            },
          },
        ],
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
