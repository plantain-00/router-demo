const childProcess = require('child_process')

module.exports = {
  build: [
    `tsc`,
    `webpack --display-modules --config webpack.config.js`,
    `rimraf **/index.min-*.js`,
    `rev-static --config rev-static.config.js`
  ],
  lint: {
    ts: `tslint "*.ts" "vue/*.ts" "react/*.tsx"`,
    js: `standard "**/*.config.js"`,
    export: `no-unused-export "*.ts" "vue/*.ts" "react/*.tsx"`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => new Promise((resolve, reject) => {
      childProcess.exec('git status -s', (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          if (stdout) {
            reject(new Error(`generated files doesn't match.`))
          } else {
            resolve()
          }
        }
      }).stdout.pipe(process.stdout)
    })
  ],
  fix: {
    ts: `tslint --fix "*.ts" "vue/*.ts" "react/*.tsx"`,
    js: `standard --fix "**/*.config.js"`
  },
  watch: {
    src: `tsc --watch`,
    webpack: `webpack --watch`,
    rev: `rev-static --watch`
  }
}
