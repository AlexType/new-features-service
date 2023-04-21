/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/dev/index.ts',
  output: { filename: 'index.js' },
  optimization: { minimize: false, },
  devServer: {
    open: true,
    hot: true,
    host: 'localhost',
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()],
  resolve: { extensions: ['.ts', '.js', '.json'] }
};
