var path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './index.js',
  output: {
    filename: 'pwd.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
  ]
};
