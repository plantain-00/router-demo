import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import * as common from '../common'

import { Main, methods } from './core'

methods.fetchBlogs = () => fetch('/router-demo/blogs.json').then(response => response.json())

const initialState = common.getInitialState()
console.log({ initialState })
const appState = initialState || {
  blogs: [],
  maxPostId: 0
}

ReactDOM.render(
  <BrowserRouter>
    <Main appState={appState} />
  </BrowserRouter>,
  document.getElementById('container'))
