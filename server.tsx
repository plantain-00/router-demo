import { Main, AppState as ReactAppState, methods as reactMethods, routes, isServerSide } from './react/core'
import { createApp, methods as vueMethods, AppState as VueAppState } from './vue/core'

import express from 'express'
import * as fs from 'fs'
import * as util from 'util'

import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { Provider } from 'mobx-react'

import * as vueServerRenderer from 'vue-server-renderer'

import * as common from './common'

const readFileAsync = util.promisify(fs.readFile)

const server = express()

isServerSide()

const renderer = vueServerRenderer.createRenderer()

const reactTemplate = fs.readFileSync('./react/index.html').toString()

const vueTemplate = fs.readFileSync('./vue/index.html').toString()

const blogs: common.Blog[] = JSON.parse(fs.readFileSync('./blogs.json').toString())

server.get('/router-demo/blogs.json', async (req, res) => {
  res.json(blogs).end()
})

server.get('/router-demo/:name.css', async (req, res) => {
  const buffer = await readFileAsync(`./${req.params.name}.css`)
  res.end(buffer.toString())
})

server.get('/router-demo/:type/:name.js', async (req, res) => {
  const buffer = await readFileAsync(`./${req.params.type}/${req.params.name}.js`)
  res.end(buffer.toString())
})

reactMethods.fetchBlogs = () => Promise.resolve(JSON.parse(JSON.stringify(blogs)))

vueMethods.fetchBlogs = () => Promise.resolve(JSON.parse(JSON.stringify(blogs)))

server.get('/router-demo/react/*', async (req, res) => {
  const appState = new ReactAppState()

  try {
    const matchedRouters = routes.filter(r => matchPath(req.url, r))
    if (matchedRouters.length === 0) {
      res.status(404).end()
      return
    }
    await Promise.all(matchedRouters.map(router => {
      if ((router.component as any).fetchData) {
        return (router.component as any).fetchData(appState)
      }
    }))
    const html = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={{}}>
                <Provider appState={appState}>
                    <Main />
                </Provider>
            </StaticRouter>)
    const result = reactTemplate.replace(`<!--react-ssr-outlet-->`, html)
            .replace(`<!--react-ssr-state-->`, `<script>window.__INITIAL_STATE__=${JSON.stringify(appState)}</script>`)
    res.end(result)
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
})

server.get('/router-demo/vue/*', (req, res) => {
  const appState = new VueAppState()
  const app = createApp(appState)
  app.$router.push(req.url)
  app.$router.onReady(async () => {
    try {
      const matchedComponents = app.$router.getMatchedComponents()
      if (matchedComponents.length === 0) {
        res.status(404).end()
        return
      }
      await Promise.all(matchedComponents.map(Component => {
        if ((Component as any).fetchData) {
          return (Component as any).fetchData(appState)
        }
      }))
      const html = await renderer.renderToString(app)
      const result = vueTemplate.replace(`<!--vue-ssr-outlet-->`, html)
                .replace(`<!--vue-ssr-state-->`, `<script>window.__INITIAL_STATE__=${JSON.stringify(appState.$data)}</script>`)
      res.end(result)
    } catch (error) {
      console.log(error)
      res.status(500).end()
    }
  })
})

server.listen(9000)
