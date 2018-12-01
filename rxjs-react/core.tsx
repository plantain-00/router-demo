import * as React from 'react'
import { Route, Link, RouteComponentProps } from 'react-router-dom'
import { Subject, Subscription } from 'rxjs'
import produce from 'immer'

import * as common from '../common'

// tslint:disable:no-duplicate-string

export const methods: { fetchBlogs?: () => Promise<common.Blog[]> } = {}
let isClientSide = true
export function isServerSide() {
  isClientSide = false
}

type Command =
  | {
    type: 'fetch blogs'
  }
  | {
    type: 'add post',
    postId: number,
    postContent: string
  }

class Home extends React.Component<RouteComponentProps<{}> & { appState: common.AppState, subject: Subject<Command> }, {}> {
  componentWillMount() {
    if (isClientSide && !common.isFirstPage) {
      this.props.subject.next({ type: 'fetch blogs' })
    }
  }
  render() {
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState)}>to vue app</a>
        </div>
        <div className='blogs-title'>blogs</div>
        <ul>
          {this.props.appState.blogs.map(blog => <li key={blog.id}><Link to={'/router-demo/rxjs-react/blogs/' + blog.id}>{blog.content}</Link></li>)}
        </ul>
      </div>
    )
  }
}

class Blog extends React.Component<RouteComponentProps<{ blog_id: string }> & { appState: common.AppState, subject: Subject<Command> },
  { appState: common.AppState, newPostContent: string }> {

  constructor(props: any) {
    super(props)

    this.state = {
      appState: this.props.appState,
      newPostContent: ''
    }
  }

  private get blog() {
    const blogId = +this.props.match.params.blog_id
    for (const blog of this.props.appState.blogs) {
      if (blog.id === blogId) {
        return blog
      }
    }
    return null
  }

  // tslint:disable-next-line:no-identical-functions
  componentWillMount() {
    if (isClientSide && !common.isFirstPage) {
      this.props.subject.next({ type: 'fetch blogs' })
    }
  }

  render() {
    if (!this.blog) {
      return null
    }
    const newPostContentButton = this.state.newPostContent ? <button onClick={() => this.addNewPost()}>add new post</button> : null
    const posts = this.blog.posts.map(post => {
      return (
        <li key={post.id}>
          <Link to={'/router-demo/rxjs-react/blogs/' + this.blog!.id + '/posts/' + post.id}>{post.content}</Link>
        </li>
      )
    })
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.state.appState)}>to vue app</a>
          <Link to='/router-demo/rxjs-react/'>back to app</Link>
        </div>
        <div className='blog-title'>blog {this.blog.id}</div>
        <div className='blog-content'>{this.blog.content}</div>
        <div>posts</div>
        <ul>
          {posts}
        </ul>
        <input defaultValue={this.state.newPostContent} onChange={e => this.setNewPostContent(e.target.value)} />
        {newPostContentButton}
      </div >
    )
  }

  private addNewPost() {
    if (this.blog) {
      this.props.subject.next({ type: 'add post', postId: this.blog.id, postContent: this.state.newPostContent })
    }
  }

  private setNewPostContent(content: string) {
    this.setState({ newPostContent: content })
  }
}

class Post extends React.Component<RouteComponentProps<{ blog_id: string, post_id: string }> & { appState: common.AppState, subject: Subject<Command> }, {}> {
  // tslint:disable-next-line:no-identical-functions
  private get blog() {
    const blogId = +this.props.match.params.blog_id
    for (const blog of this.props.appState.blogs) {
      if (blog.id === blogId) {
        return blog
      }
    }
    return null
  }
  private get post() {
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

  // tslint:disable-next-line:no-identical-functions
  componentWillMount() {
    if (isClientSide && !common.isFirstPage) {
      this.props.subject.next({ type: 'fetch blogs' })
    }
  }

  render() {
    if (!this.blog || !this.post) {
      return null
    }
    return (
      <div>
        <div className='router'>
          <a href='javascript:void(0)' onClick={() => common.jumpTo('/router-demo/vue/', this.props.appState)}>to vue app</a>
          <Link to='/router-demo/rxjs-react/'>back to app</Link>
          <Link to={'/router-demo/rxjs-react/blogs/' + this.blog.id}>back to blog</Link>
        </div>
        <div className='post-title'>post {this.post.id}</div>
        <div className='post-content'>{this.post.content}</div>
      </div >
    )
  }
}

export class Main extends React.Component<{ appState: common.AppState }, { appState: common.AppState }> {
  constructor(props: any) {
    super(props)
    this.state = {
      appState: this.props.appState
    }
  }

  subject = new Subject<Command>()
  subscription!: Subscription

  componentWillMount() {
    this.subscription = this.subject.subscribe((command) => {
      if (command.type === 'fetch blogs') {
        this.fetchBlogs()
      } else if (command.type === 'add post') {
        this.addPost(command.postId, command.postContent)
      }
    })
  }

  componentWillUnmount() {
    this.subject.unsubscribe()
    this.subscription.unsubscribe()
  }

  fetchBlogs() {
    if (this.state.appState.blogs.length > 0) {
      return
    }
    if (methods.fetchBlogs) {
      methods.fetchBlogs().then(blogs => {
        const nextState = produce(this.state.appState, (draftState) => {
          draftState.blogs = blogs
          draftState.maxPostId = Math.max(...blogs.map(b => Math.max(...b.posts.map(p => p.id))))
        })
        this.setState({
          appState: nextState
        })
      })
    }
  }

  addPost(blogId: number, postContent: string) {
    const index = this.state.appState.blogs.findIndex((blog) => blog.id === blogId)
    if (index >= 0) {
      const nextState = produce(this.state.appState, (draftState) => {
        draftState.maxPostId++
        draftState.blogs[index].posts.push({
          id: draftState.maxPostId,
          content: postContent
        })
      })
      this.setState({ appState: nextState })
    }
  }

  render() {
    return (
      <div>
        <a href='https://github.com/plantain-00/router-demo/tree/master/rxjs-react/index.ts' target='_blank'>the source code of the demo</a>
        <br />
        <Route key='home'
          path='/router-demo/rxjs-react/'
          render={(props) => <Home appState={this.state.appState} subject={this.subject} {...props} />}
          exact />
        <Route key='blog'
          path='/router-demo/rxjs-react/blogs/:blog_id'
          render={(props) => <Blog appState={this.state.appState} subject={this.subject} {...props} />}
          exact />
        <Route key='post'
          path='/router-demo/rxjs-react/blogs/:blog_id/posts/:post_id'
          render={(props) => <Post appState={this.state.appState} subject={this.subject} {...props} />}
          exact />
      </div>
    )
  }
}
