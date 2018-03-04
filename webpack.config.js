module.exports = {
  entry: {
    vue: './vue/index',
    react: './react/index'
  },
  output: {
    filename: '[name]/index.min.js'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
