module.exports = {
  build: [
    {
      js: [
        `tsc`,
        `webpack --display-modules --config webpack.config.js`
      ],
      clean: `rimraf **/index.min-*.js`
    },
    `rev-static --config rev-static.config.js`
  ],
  lint: {
    ts: `tslint "*.ts" "vue/*.ts" "react/*.ts"`,
    js: `standard "**/*.config.js"`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js'
  ],
  fix: `standard --fix "**/*.config.js"`
}
