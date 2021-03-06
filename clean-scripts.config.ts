const tsFiles = `"*.ts" "*.tsx" "vue/**/*.ts" "react/**/*.tsx"`
const lessFiles = `"*.less"`

const webpackCommand = `webpack --config webpack.config.ts`
const revStaticCommand = `rev-static`

const isDev = process.env.NODE_ENV === 'development'

export default {
  build: [
    `rimraf "**/@(index.min-*.js|index.min-*.css)"`,
    {
      js: [
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
    ts: `eslint --ext .js,.ts,.tsx ${tsFiles}`,
    less: `stylelint ${lessFiles}`,
    export: `no-unused-export ${tsFiles} ${lessFiles}`,
    markdown: `markdownlint README.md`,
    typeCoverage: 'type-coverage -p .'
  },
  test: [],
  fix: {
    ts: `eslint --ext .js,.ts,.tsx ${tsFiles} --fix`,
    less: `stylelint --fix ${lessFiles}`
  },
  watch: {
    webpack: `${webpackCommand} --watch`,
    rev: `${revStaticCommand} --watch`
  }
}
