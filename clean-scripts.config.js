const { Service, checkGitStatus } = require('clean-scripts')

const tsFiles = `"*.ts" "vue/**/*.ts" "react/**/*.tsx" "spec/**/*.ts" "screenshots/**/*.ts"`
const jsFiles = `"*.config.js" "spec/**/*.config.js"`

const tscCommand = `tsc`
const webpackCommand = `webpack`
const revStaticCommand = `rev-static`
const tscServerCommand = `tsc -p tsconfig.server.json`

module.exports = {
  build: [
    tscCommand,
    webpackCommand,
    `rimraf **/index.min-*.js`,
    revStaticCommand,
    tscServerCommand
  ],
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    export: `no-unused-export ${tsFiles}`,
    commit: `commitlint --from=HEAD~1`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => checkGitStatus()
  ],
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`
  },
  watch: {
    src: `${tscCommand} --watch`,
    server: `${tscServerCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    rev: `${revStaticCommand} --watch`
  },
  screenshot: [
    new Service(`http-server '..' -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
