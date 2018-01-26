import * as React from 'react'
import { Route, Link, RouteComponentProps, RouteProps } from 'react-router-dom'
import { observable, useStrict, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as common from '../common'

useStrict(true)

export const methods: { fetchBlogs?: () => Promise<common.Blog[]> } = {}
let isClientSide = true
export function isServerSide () {
  isClientSide = false
}

export class AppState {
  @observable
  blogs: common.Blog[] = []
  @observable
  private maxPostId = 0

  constructor (appState?: AppState) {
    if (appState) {
      this.blogs = appState.blogs
      this.maxPostId = appState.maxPostId
    }
  }

  @action
  fetchBlogs () {
    if (this.blogs.length > 0) {
      return Promise.resolve()
    }
    if (methods.fetchBlogs) {
      return methods.fetchBlogs().then(blogs => {
        this.initBlogs(blogs)
      })
    }
    return Promise.resolve()
  }
  @action
  addPost (blogId: number, postContent: string) {
    for (const blog of this.blogs) {
      if (blog.id === blogId) {
        this.maxPostId++
        blog.posts.push({
          id: this.maxPostId,
          content: postContent
        })
        return
      }
    }
  }
  @action
  private initBlogs (blogs: common.Blog[]) {
    this.blogs = blogs
    this.maxPostId = Math.max(...blogs.map(b => Math.max(...b.posts.map(p => p.id))))
  }
}

@inject('appState')
@observer
class Home extends React.Component<RouteComponentProps<{}> & { appState: AppState }, {}> {
  public static fetchData (appState: AppState) {
    return appState.fetchBlogs()
  }
  componentWillMount () {
    if (isClientSide && !common.isFirstPage) {
      this.props.appState.fetchBlogs()
    }
  }
  render () {
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState)}>to vue app</a>
        </div>
        <div className='blogs-title'>blogs</div>
        <ul>
          {this.props.appState.blogs.map(blog => <li key={blog.id}><Link to={'/router-demo/react/blogs/' + blog.id}>{blog.content}</Link></li>)}
        </ul>
      </div>
    )
  }
}

@inject('appState')
@observer
class Blog extends React.Component<RouteComponentProps<{ blog_id: string }> & { appState: AppState }, {}> {
  private newPostContent = ''
  public static fetchData (appState: AppState) {
    return appState.fetchBlogs()
  }

  private get blog () {
    const blogId = +this.props.match.params.blog_id
    for (const blog of this.props.appState.blogs) {
      if (blog.id === blogId) {
        return blog
      }
    }
    return null
  }

  componentWillMount () {
    if (isClientSide && !common.isFirstPage) {
      this.props.appState.fetchBlogs()
    }
  }

  render () {
    if (!this.blog) {
      return null
    }
    const newPostContentButton = this.newPostContent ? <button v-if='newPostContent' onClick={() => this.addNewPost()}>add new post</button> : null
    const posts = this.blog.posts.map(post => {
      return (
        <li key={post.id}>
          <Link to={'/router-demo/react/blogs/' + this.blog!.id + '/posts/' + post.id}>{post.content}</Link>
        </li>
      )
    })
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState)}>to vue app</a>
          <Link to='/router-demo/react/'>back to app</Link>
        </div>
        <div className='blog-title'>blog {this.blog.id}</div>
        <div className='blog-content'>{this.blog.content}</div>
        <div>posts</div>
        <ul>
          {posts}
        </ul>
        <input defaultValue={this.newPostContent} onChange={e => this.setNewPostContent(e.target.value)} />
        {newPostContentButton}
      </div >
    )
  }

  private addNewPost () {
    if (this.blog) {
      this.props.appState.addPost(this.blog.id, this.newPostContent)
    }
  }

  private setNewPostContent (content: string) {
    this.newPostContent = content
    this.setState({ newPostContent: this.newPostContent })
  }
}

@inject('appState')
@observer
class Post extends React.Component<RouteComponentProps<{ blog_id: string, post_id: string }> & { appState: AppState }, {}> {
  public static fetchData (appState: AppState) {
    return appState.fetchBlogs()
  }

  private get blog () {
    const blogId = +this.props.match.params.blog_id
    for (const blog of this.props.appState.blogs) {
      if (blog.id === blogId) {
        return blog
      }
    }
    return null
  }
  private get post () {
    const postId = +this.props.match.params.post_id
    if (this.blog) {
      for (const post of this.blog.posts) {
        if (post.id === postId) {
          return post
        }
      }
    }
    return null
  }

  componentWillMount () {
    if (isClientSide && !common.isFirstPage) {
      this.props.appState.fetchBlogs()
    }
  }

  render () {
    if (!this.blog || !this.post) {
      return null
    }
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState)}>to vue app</a>
          <Link to='/router-demo/react/'>back to app</Link>
          <Link to={'/router-demo/react/blogs/' + this.blog.id}>back to blog</Link>
        </div>
        <div className='post-title'>post {this.post.id}</div>
        <div className='post-content'>{this.post.content}</div>
      </div >
    )
  }
}

export const routes: RouteProps[] = [
  {
    path: '/router-demo/react/',
    component: Home,
    exact: true
  },
  {
    path: '/router-demo/react/blogs/:blog_id',
    component: Blog,
    exact: true
  },
  {
    path: '/router-demo/react/blogs/:blog_id/posts/:post_id',
    component: Post,
    exact: true
  }
]

export class Main extends React.Component<{}, {}> {
  render () {
    return (
      <div>
        <a href='https://github.com/plantain-00/router-demo/tree/master/react/index.ts' target='_blank'>the source code of the demo</a>
        <br />
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </div>
    )
  }
}
