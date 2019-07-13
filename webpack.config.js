const isDev = process.env.NODE_ENV === 'development'

module.exports = {
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
    extensions: isDev ? ['.ts', '.tsx', '.js'] : undefined
  },
  module: isDev ? {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  } : undefined
}
