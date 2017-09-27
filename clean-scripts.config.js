const childProcess = require('child_process')
const util = require('util')
const { sleep } = require('clean-scripts')

const execAsync = util.promisify(childProcess.exec)

module.exports = {
  build: [
    `tsc`,
    `webpack --display-modules`,
    `rimraf **/index.min-*.js`,
    `rev-static`,
    async () => {
      const { createServer } = require('http-server')
      const puppeteer = require('puppeteer')
      const fs = require('fs')
      const beautify = require('js-beautify').html
      const server = createServer({ root: '..' })
      server.listen(8000)
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' })

      for (const type of ['vue', 'react']) {
        await page.goto(`http://localhost:8000/router-demo/${type}/`)
        await sleep(500)
        await page.screenshot({ path: `${type}/screenshot.png`, fullPage: true })
        fs.writeFileSync(`${type}/screenshot-src.html`, beautify(await page.content()))

        await page.click('li a')
        await sleep(500)
        await page.screenshot({ path: `${type}/screenshot-blog.png`, fullPage: true })
        fs.writeFileSync(`${type}/screenshot-blog-src.html`, beautify(await page.content()))

        await page.click('li a')
        await sleep(500)
        await page.screenshot({ path: `${type}/screenshot-blog-post.png`, fullPage: true })
        fs.writeFileSync(`${type}/screenshot-blog-post-src.html`, beautify(await page.content()))
      }
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
    'karma start spec/karma.config.js',
    'git checkout vue/screenshot.png',
    'git checkout react/screenshot.png',
    async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(`generated files doesn't match.`)
      }
    }
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
