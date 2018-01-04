const { Service, checkGitStatus } = require('clean-scripts')

const tsFiles = `"*.ts" "vue/**/*.ts" "react/**/*.tsx" "spec/**/*.ts" "screenshots/**/*.ts"`
const jsFiles = `"*.config.js" "spec/**/*.config.js"`
const lessFiles = `"*.less"`

const tscCommand = `tsc`
const webpackCommand = `webpack`
const revStaticCommand = `rev-static`

module.exports = {
  build: [
    `rimraf "**/@(index.min-*.js|index.min-*.css)"`,
    {
      js: [
        tscCommand,
        webpackCommand
      ],
      css: [
        `lessc index.less > index.css`,
        `postcss index.css -o index.css`,
        `cleancss index.css -o index.min.css`
      ]
    },
    revStaticCommand
  ],
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles}`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js',
    () => checkGitStatus()
  ],
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    src: `${tscCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    rev: `${revStaticCommand} --watch`
  },
  screenshot: [
    new Service(`http-server '..' -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
