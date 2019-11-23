const { Service } = require('clean-scripts')

const tsFiles = `"*.ts" "*.tsx" "vue/**/*.ts" "react/**/*.tsx" "spec/**/*.ts" "screenshots/**/*.ts"`
const jsFiles = `"*.config.js" "spec/**/*.config.js"`
const lessFiles = `"*.less"`

const tscCommand = `tsc`
const webpackCommand = `webpack`
const revStaticCommand = `rev-static`

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  build: [
    `rimraf "**/@(index.min-*.js|index.min-*.css)"`,
    {
      js: [
        tscCommand,
        webpackCommand
      ],
      css: isDev ? undefined : [
        `lessc index.less > index.css`,
        `postcss index.css -o index.css`,
        `cleancss index.css -o index.min.css`
      ]
    },
    revStaticCommand
  ],
  lint: {
    ts: `eslint --ext .js,.ts,.tsx ${tsFiles} ${jsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles}`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p .'
  },
  test: [
    'tsc -p spec',
    'karma start spec/karma.config.js'
  ],
  fix: {
    ts: `eslint --ext .js,.ts,.tsx ${tsFiles} ${jsFiles} --fix`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    webpack: `${webpackCommand} --watch`,
    rev: `${revStaticCommand} --watch`
  },
  screenshot: [
    new Service(`http-server '..' -p 8000`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
