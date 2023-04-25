/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/lib/index.ts',
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.js', '.json'] },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })]
  },
  output: {
    clean: true,
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
    library: {
      name: 'NewFeatureLibrary',
      type: 'umd',
    }
  },
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      }
    ]
  }
};
