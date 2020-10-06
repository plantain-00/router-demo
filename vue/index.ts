import { createAppWithRoutes, methods, AppState } from './core'
import * as common from '../common'

methods.fetchBlogs = () => fetch('/router-demo/blogs.json').then(response => response.json())

const initialState = common.getInitialState()
console.log({ initialState })
const appState = AppState
if (initialState) {
  appState.blogs = initialState.blogs
  appState.maxPostId = initialState.maxPostId
}
const { app } = createAppWithRoutes(appState, false)

app.mount('#container')
