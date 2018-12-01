import Vue from 'vue'
import Component from 'vue-class-component'
import VueRouter from 'vue-router'
import * as common from '../common'

Vue.use(VueRouter)

export const methods: { fetchBlogs?: () => Promise<common.Blog[]> } = {}

@Component
export class AppState extends Vue {
  blogs: common.Blog[] = []
  private maxPostId = 0

  static create(data?: any) {
    const appState = new AppState()
    if (data) {
      appState.blogs = data.blogs
      appState.maxPostId = data.maxPostId
    }
    return appState
  }

  async fetchBlogs() {
    if (this.blogs.length > 0) {
      return
    }
    if (methods.fetchBlogs) {
      const blogs = await methods.fetchBlogs()
      this.blogs = blogs
      this.maxPostId = Math.max(...blogs.map(b => Math.max(...b.posts.map(p => p.id))))
    }
    return
  }
  addPost(blogId: number, postContent: string) {
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
}

export function createApp(appState: AppState) {
  const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/router-demo/vue/', component: Home, props: { appState } },
      { path: '/router-demo/vue/blogs/:blog_id', component: Blog, props: { appState } },
      { path: '/router-demo/vue/blogs/:blog_id/posts/:post_id', component: Post, props: { appState } }
    ]
  })

  return new App({ router })
}

@Component({
  template: `
    <div>
        <div class="router">
            <a href="javascript:void(0)" @click="jumpTo('/router-demo/react/')">to react app</a>
        </div>
        <div class="blogs-title">blogs</div>
        <ul>
            <li v-for="blog in blogs" :key="blog.id">
                <router-link :to="'/router-demo/vue/blogs/' + blog.id">{{blog.content}}</router-link>
            </li>
        </ul>
    </div>
    `,
  props: ['appState']
})
class Home extends Vue {
  appState!: AppState
  get blogs() {
    return this.appState.blogs
  }
  jumpTo(url: string) {
    common.jumpTo(url, this.appState.$data)
  }
  beforeMount() {
    if (!common.isFirstPage) {
      this.appState.fetchBlogs()
    }
  }
}

@Component({
  template: `
    <div>
        <div class="router">
            <a href="javascript:void(0)" @click="jumpTo('/router-demo/react/')">to react app</a>
            <router-link to="/router-demo/vue/">back to app</router-link>
        </div>
        <div class="blog-title">blog {{blog.id}}</div>
        <div class="blog-content">{{blog.content}}</div>
        <div>posts</div>
        <ul>
            <li v-for="post in blog.posts" :key="post.id">
                <router-link :to="'/router-demo/vue/blogs/' + blog.id + '/posts/' + post.id">{{post.content}}</router-link>
            </li>
        </ul>
        <input v-model="newPostContent" />
        <button v-if="newPostContent" @click="addNewPost()">add new post</button>
    </div>
    `,
  props: ['appState']
})
class Blog extends Vue {
  appState!: AppState
  newPostContent = ''

  get blog() {
    const blogId = +this.$route.params.blog_id
    const blogs: common.Blog[] = this.appState.blogs
    for (const blog of blogs) {
      if (blog.id === blogId) {
        return blog
      }
    }
    return null
  }

  addNewPost() {
    if (this.blog) {
      this.appState.addPost(this.blog.id, this.newPostContent)
    }
  }
  jumpTo(url: string) {
    common.jumpTo(url, this.appState.$data)
  }
  // tslint:disable-next-line:no-identical-functions
  beforeMount() {
    if (!common.isFirstPage) {
      this.appState.fetchBlogs()
    }
  }
}

@Component({
  template: `
    <div>
        <div class="router">
            <a href="javascript:void(0)" @click="jumpTo('/router-demo/react/')">to react app</a>
            <router-link to="/router-demo/vue/">back to app</router-link>
            <router-link :to="'/router-demo/vue/blogs/' + blog.id">back to blog</router-link>
        </div>
        <div class="post-title">post {{post.id}}</div>
        <div class="post-content">{{post.content}}</div>
    </div>
    `,
  props: ['appState']
})
class Post extends Vue {
  appState!: AppState

  // tslint:disable-next-line:no-identical-functions
  get blog() {
    const blogId = +this.$route.params.blog_id
    const blogs: common.Blog[] = this.appState.blogs
    for (const blog of blogs) {
      if (blog.id === blogId) {
        return blog
      }
    }
    return null
  }
  get post() {
    const postId = +this.$route.params.post_id
    if (this.blog) {
      for (const post of this.blog.posts) {
        if (post.id === postId) {
          return post
        }
      }
    }
    return null
  }
  jumpTo(url: string) {
    common.jumpTo(url, this.appState.$data)
  }
  // tslint:disable-next-line:no-identical-functions
  beforeMount() {
    if (!common.isFirstPage) {
      this.appState.fetchBlogs()
    }
  }
}

@Component({
  template: `
    <div>
        <a href="https://github.com/plantain-00/router-demo/tree/master/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <router-view></router-view>
    </div>
    `
})
class App extends Vue {
}
