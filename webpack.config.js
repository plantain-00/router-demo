module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    vue: './vue/index',
    react: './react/index'
  },
  output: {
    path: __dirname,
    filename: '[name]/index.min.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
