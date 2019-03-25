import * as React from 'react'
import { Route, Link, RouteComponentProps, RouteProps } from 'react-router-dom'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as common from '../common'

// tslint:disable:no-duplicate-string

export const methods: { fetchBlogs?: () => Promise<common.Blog[]> } = {}
let isClientSide = true
export function isServerSide() {
  isClientSide = false
}

class Blog {
  constructor(blog: common.Blog) {
    this.id = blog.id
    this.content = blog.content
    this.posts = blog.posts.map(p => new Post(p, this))
  }
  @observable id: number
  @observable content: string
  @observable posts: Post[]

  toJS() {
    return {
      id: this.id,
      content: this.content,
      posts: this.posts.map((post) => post.toJS())
    }
  }
}

class Post {
  constructor(post: common.Post, blog: Blog) {
    this.id = post.id
    this.content = post.content
    this.blog = blog
  }
  @observable id: number
  @observable content: string
  @observable.ref public blog: Blog

  toJS() {
    return {
      id: this.id,
      content: this.content
    }
  }
}

export class AppState {
  @observable
  blogs: Blog[] = []
  @observable
  private maxPostId = 0

  constructor(appState?: AppState) {
    if (appState) {
      this.blogs = observable.array(appState.blogs.map((blog) => new Blog(blog)))
      this.maxPostId = appState.maxPostId
    }
  }

  toJS() {
    return {
      blogs: this.blogs.map((blog) => blog.toJS()),
      maxPostId: this.maxPostId
    }
  }

  @action
  async fetchBlogs() {
    if (this.blogs.length === 0 && methods.fetchBlogs) {
      const blogs = await methods.fetchBlogs()
      this.blogs = observable.array(blogs.map((blog) => new Blog(blog)))
      this.maxPostId = Math.max(...blogs.map(b => Math.max(...b.posts.map(p => p.id))))
    }
  }

  @action
  addPost(blogId: number, postContent: string) {
    const blog = this.blogs.find((blog) => blog.id === blogId)
    if (blog) {
      this.maxPostId++
      blog.posts.push(new Post({
        id: this.maxPostId,
        content: postContent
      }, blog))
    }
  }
}

@inject('appState')
@observer
class Home extends React.Component<RouteComponentProps<{}> & { appState: AppState }, {}> {
  componentWillMount() {
    if (isClientSide && !common.isFirstPage) {
      this.props.appState.fetchBlogs()
    }
  }
  render() {
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState.toJS())}>to vue app</a>
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
class BlogComponent extends React.Component<RouteComponentProps<{ blog_id: string }> & { appState: AppState }, {}> {
  private newPostContent = ''

  private get blog() {
    const blogId = +this.props.match.params.blog_id
    return this.props.appState.blogs.find((blog) => blog.id === blogId)
  }

  // tslint:disable-next-line:no-identical-functions
  componentWillMount() {
    if (isClientSide && !common.isFirstPage) {
      this.props.appState.fetchBlogs()
    }
  }

  render() {
    if (!this.blog) {
      return null
    }
    const newPostContentButton = this.newPostContent ? <button onClick={() => this.addNewPost()}>add new post</button> : null
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
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState.toJS())}>to vue app</a>
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

  private addNewPost() {
    if (this.blog) {
      this.props.appState.addPost(this.blog.id, this.newPostContent)
    }
  }

  private setNewPostContent(content: string) {
    this.newPostContent = content
    this.setState({ newPostContent: this.newPostContent })
  }
}

@inject('appState')
@observer
class PostComponent extends React.Component<RouteComponentProps<{ blog_id: string, post_id: string }> & { appState: AppState }, {}> {
  // tslint:disable-next-line:no-identical-functions
  private get blog() {
    const blogId = +this.props.match.params.blog_id
    return this.props.appState.blogs.find((blog) => blog.id === blogId)
  }
  private get post() {
    const postId = +this.props.match.params.post_id
    if (this.blog) {
      return this.blog.posts.find((post) => post.id === postId)
    }
    return null
  }

  // tslint:disable-next-line:no-identical-functions
  componentWillMount() {
    if (isClientSide && !common.isFirstPage) {
      this.props.appState.fetchBlogs()
    }
  }

  render() {
    if (!this.blog || !this.post) {
      return null
    }
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState.toJS())}>to vue app</a>
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
    component: BlogComponent,
    exact: true
  },
  {
    path: '/router-demo/react/blogs/:blog_id/posts/:post_id',
    component: PostComponent,
    exact: true
  }
]

export class Main extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <a href='https://github.com/plantain-00/router-demo/tree/master/react/index.ts' target='_blank'>the source code of the demo</a>
        <br />
        {routes.map(route => (
          <Route key={route.path as string} {...route} />
        ))}
      </div>
    )
  }
}
