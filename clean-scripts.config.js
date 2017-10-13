const childProcess = require('child_process')
const util = require('util')
const { Service } = require('clean-scripts')

const execAsync = util.promisify(childProcess.exec)

const tsFiles = `"*.ts" "spec/**/*.ts" "screenshots/**/*.ts" "prerender/**/*.ts"`
const jsFiles = `"*.config.js" "spec/**/*.config.js"`

module.exports = {
  build: [
    `tsc`,
    `webpack --display-modules`,
    `rimraf **/index.min-*.js`,
    `rev-static`
  ],
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    export: `no-unused-export ${tsFiles}`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(`generated files doesn't match.`)
      }
    }
  ],
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`
  },
  watch: {
    src: `tsc --watch`,
    webpack: `webpack --watch`,
    rev: `rev-static --watch`
  },
  screenshot: [
    new Service(`http-server '..' -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
