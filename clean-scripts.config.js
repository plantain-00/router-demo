module.exports = {
  build: [
    `rimraf **/index.min-*.js`,
    `rimraf dist`,
    `tsc`,
    `webpack --display-modules --config webpack.config.js`,
    `rev-static --config rev-static.config.js`
  ],
  lint: [
    `tslint "*.ts" "vue/*.ts" "react/*.ts"`,
    `standard "**/*.config.js"`
  ],
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js'
  ],
  fix: [
    `standard --fix "**/*.config.js"`
  ]
}
