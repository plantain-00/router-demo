const childProcess = require('child_process')

module.exports = {
  build: [
    `tsc`,
    `webpack --display-modules`,
    `rimraf **/index.min-*.js`,
    `rev-static`,
    async () => {
      const { createServer } = require('http-server')
      const puppeteer = require('puppeteer')
      const server = createServer()
      server.listen(8000)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto(`http://localhost:8000/vue`)
      await page.screenshot({ path: `vue/screenshot.png`, fullPage: true })
      await page.goto(`http://localhost:8000/react`)
      await page.screenshot({ path: `react/screenshot.png`, fullPage: true })
      server.close()
      browser.close()
    }
  ],
  lint: {
    ts: `tslint "*.ts" "vue/*.ts" "react/*.tsx"`,
    js: `standard "**/*.config.js"`,
    export: `no-unused-export "*.ts" "vue/*.ts" "react/*.tsx"`
  },
  test: [
    'tsc -p spec',
    process.env.APPVEYOR ? 'echo "skip karma test"' : 'karma start spec/karma.config.js',
    'git checkout vue/screenshot.png',
    'git checkout react/screenshot.png',
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
