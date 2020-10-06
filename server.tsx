import { Main, AppState as ReactAppState, methods as reactMethods, routes, isServerSide } from './react/core'
import { createAppWithRoutes, methods as vueMethods, AppState as VueAppState } from './vue/core'

import express from 'express'
import * as fs from 'fs'
import * as util from 'util'

import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'

import { renderToString } from '@vue/server-renderer'

import * as common from './common'

useStaticRendering(true)

const readFileAsync = util.promisify(fs.readFile)

const server = express()

isServerSide()

const reactTemplate = fs.readFileSync('./react/index.html').toString()

const vueTemplate = fs.readFileSync('./vue/index.html').toString()

const blogs: common.Blog[] = JSON.parse(fs.readFileSync('./blogs.json').toString())

server.get('/router-demo/blogs.json', async (req, res) => {
  res.json(blogs).end()
})

server.get('/router-demo/:name.css', async (req, res) => {
  const buffer = await readFileAsync(`./${(req.params as { [key: string]: string }).name}.css`)
  res.end(buffer.toString())
})

server.get('/router-demo/:type/:name.js', async (req, res) => {
  const buffer = await readFileAsync(`./${(req.params as { [key: string]: string }).type}/${(req.params as { [key: string]: string }).name}.js`)
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
    await Promise.all(matchedRouters.map(() => appState.fetchBlogs()))
    const html = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={{}}>
        <Provider appState={appState}>
          <Main />
        </Provider>
      </StaticRouter>)
    const result = reactTemplate.replace(`<!--react-ssr-outlet-->`, html)
      .replace(`<!--react-ssr-state-->`, `<script>window.__INITIAL_STATE__=${JSON.stringify(appState)}</script>`)
    res.end(result)
  } catch (error: unknown) {
    console.log(error)
    res.status(500).end()
  }
})

server.get('/router-demo/vue/*', async (req, res) => {
  const appState = VueAppState
  const { app, router } = createAppWithRoutes(appState, true)
  await router.push(req.url)
  await router.isReady()
  try {
    const matchedComponents = router.currentRoute.value.matched
    if (matchedComponents.length === 0) {
      res.status(404).end()
      return
    }
    await Promise.all(matchedComponents.map(() => appState.fetchBlogs()))
    const html = await renderToString(app)
    const result = vueTemplate.replace(`<!--vue-ssr-outlet-->`, html)
      .replace(`<!--vue-ssr-state-->`, `<script>window.__INITIAL_STATE__=${JSON.stringify(appState)}</script>`)
    res.end(result)
  } catch (error: unknown) {
    console.log(error)
    res.status(500).end()
  }
})

server.listen(9000)
