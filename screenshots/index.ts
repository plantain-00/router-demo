import puppeteer from 'puppeteer'
import { sleep } from 'clean-scripts'

(async() => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.emulate({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' })

  for (const type of ['vue', 'react']) {
    await page.goto(`http://localhost:8000/router-demo/${type}/`)
    await sleep(500)
    await page.screenshot({ path: `screenshots/${type}-initial.png` })

    await page.click('li a')
    await sleep(500)
    await page.screenshot({ path: `screenshots/${type}-blog.png` })

    await page.click('li a')
    await sleep(500)
    await page.screenshot({ path: `screenshots/${type}-blog-post.png` })
  }

  await browser.close()
})()
