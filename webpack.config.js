/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/lib/index.ts',
  output: {
    filename: 'new-features-service.min.js',
    path: path.resolve(__dirname, 'build'),
    library: 'NewFeatureLibrary',
    libraryTarget: 'umd',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })]
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
  resolve: { extensions: ['.ts', '.js', '.json'] }
};
