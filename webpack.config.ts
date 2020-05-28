import * as webpack from 'webpack'

export default {
  mode: process.env.NODE_ENV,
  entry: {
    vue: './vue/index',
    react: './react/index',
    'rxjs-react': './rxjs-react/index'
  },
  output: {
    path: __dirname,
    filename: '[name]/index.min.js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
} as webpack.Configuration
